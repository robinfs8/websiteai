import "dotenv/config";
import { randomUUID } from "node:crypto";
import express from "express";
import cors from "cors";
import { runPipeline } from "./lib/pipeline.js";
import { buildPrompt, validateBrief, validateInputLimits } from "./lib/prompt-builder.js";
import { verifyIdToken, consumeCredit, refundCredit, adminDb } from "./lib/auth.js";
import { extractJson } from "./lib/extract.js";
import { GoogleGenAI } from "@google/genai";
import admin from "firebase-admin";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const app = express();

// Lock CORS to the frontend origin. Set ALLOWED_ORIGIN in env for production.
// Falls back to wildcard in development (no env var set).
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;
app.use(
  cors(
    ALLOWED_ORIGIN
      ? {
          origin: ALLOWED_ORIGIN,
          methods: ["GET", "POST", "OPTIONS"],
          allowedHeaders: ["Content-Type", "Authorization"],
        }
      : undefined // wildcard — dev only
  )
);

app.use(express.json({ limit: "2mb" }));

const GENERATE_TIMEOUT_MS = 240_000;

app.use((req, _res, next) => {
  req.id = req.get("x-request-id") || randomUUID();
  next();
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/generate", verifyIdToken, async (req, res) => {
  const rid = req.id;
  const log = (...args) => console.log(`[${rid}]`, ...args);
  const logErr = (...args) => console.error(`[${rid}]`, ...args);
  res.setHeader("x-request-id", rid);

  const { prompt, brief } = req.body ?? {};

  let userPrompt;
  try {
    if (brief) {
      // 1. Valid JSON structure + required fields
      validateBrief(brief);
      // 2. Per-field character limits (no token abuse)
      validateInputLimits(brief);
      // 3. Belt-and-suspenders: total brief payload size
      if (JSON.stringify(brief).length > 20_000) {
        return res.status(400).json({ error: "brief payload too large", requestId: rid });
      }
      userPrompt = buildPrompt(brief);
    } else if (typeof prompt === "string" && prompt.trim().length >= 3) {
      if (prompt.length > 5_000) {
        return res.status(400).json({ error: "prompt exceeds 5000-character limit", requestId: rid });
      }
      userPrompt = prompt;
    } else {
      return res.status(400).json({
        error: 'provide either { brief: {...} } or { prompt: "..." }',
        requestId: rid,
      });
    }
  } catch (err) {
    return res.status(400).json({ error: err.message, requestId: rid });
  }

  // Charge 1 credit before running the expensive pipeline.
  let creditState;
  try {
    creditState = await consumeCredit(req.user.uid, req.user.email);
  } catch (err) {
    return res
      .status(err.status ?? 500)
      .json({ error: err.message ?? "credit check failed", requestId: rid });
  }

  // Log as a single line so Railway's log viewer doesn't scramble it.
  log(
    "generate start; uid:", req.user.uid,
    "remaining credits:", creditState.remaining,
    "userPrompt:", JSON.stringify(userPrompt)
  );

  let clientGone = false;
  req.on("close", () => {
    if (!res.writableEnded) {
      clientGone = true;
      log("client disconnected before response");
    }
  });

  let timeoutHandle;
  const timeoutPromise = new Promise((_resolve, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(Object.assign(new Error("generation timed out"), { code: "ETIMEOUT" }));
    }, GENERATE_TIMEOUT_MS);
  });

  try {
    const sitePackage = await Promise.race([runPipeline(userPrompt), timeoutPromise]);
    clearTimeout(timeoutHandle);
    log("generate ok" + (clientGone ? " (client already gone, sending anyway)" : ""));
    if (res.writableEnded) return;
    try {
      res.json(sitePackage);
    } catch (writeErr) {
      logErr("response write failed:", writeErr.message);
    }
  } catch (err) {
    clearTimeout(timeoutHandle);
    logErr("generate failed:", err);
    // Refund the credit — the user didn't get a site.
    await refundCredit(req.user.uid);
    if (res.writableEnded) return;
    const status = err.code === "ETIMEOUT" ? 504 : 500;
    res.status(status).json({
      error: err.message ?? "pipeline failed",
      stage: err.stage ?? (err.code === "ETIMEOUT" ? "timeout" : "unknown"),
      details: err.details ?? null,
      requestId: rid,
    });
  }
});

app.post(
  "/deploy",
  // verifyIdToken runs first, then express.raw parses the body.
  verifyIdToken,
  express.raw({ type: "application/zip", limit: "50mb" }),
  async (req, res) => {
    const rid = req.id;
    const log = (...args) => console.log(`[${rid}]`, ...args);
    const logErr = (...args) => console.error(`[${rid}]`, ...args);
    res.setHeader("x-request-id", rid);

    const token = process.env.NETLIFY_TOKEN;
    if (!token) {
      return res
        .status(500)
        .json({ error: "NETLIFY_TOKEN not configured", requestId: rid });
    }
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res
        .status(400)
        .json({ error: "send a ZIP body with Content-Type: application/zip", requestId: rid });
    }

    // Charge 1 credit before calling Netlify.
    let creditState;
    try {
      creditState = await consumeCredit(req.user.uid, req.user.email);
    } catch (err) {
      return res
        .status(err.status ?? 500)
        .json({ error: err.message ?? "credit check failed", requestId: rid });
    }

    log("deploy start; uid:", req.user.uid, "remaining credits:", creditState.remaining);

    try {
      // Check if user already has a Netlify site from a previous deploy.
      const userRef = adminDb.collection("users").doc(req.user.uid);
      const userSnap = await userRef.get();
      const existingSiteId = userSnap.exists ? userSnap.data()?.netlify?.siteId : null;

      let siteId;
      let siteUrl;
      let adminUrl;

      if (existingSiteId) {
        log("deploy: reusing existing site", existingSiteId);
        siteId = existingSiteId;
        siteUrl = userSnap.data().netlify.url;
        adminUrl = userSnap.data().netlify.adminUrl;
      } else {
        log("deploy: creating new site");
        const siteRes = await fetch("https://api.netlify.com/api/v1/sites", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: "{}",
        });
        if (!siteRes.ok) {
          const text = await siteRes.text();
          throw new Error(`site create failed (${siteRes.status}): ${text}`);
        }
        const site = await siteRes.json();
        siteId = site.site_id;
        siteUrl = site.ssl_url || site.url;
        adminUrl = site.admin_url;
      }

      log("deploy: uploading zip to site", siteId);
      const deployRes = await fetch(
        `https://api.netlify.com/api/v1/sites/${siteId}/deploys`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/zip",
          },
          body: req.body,
        }
      );
      if (!deployRes.ok) {
        const text = await deployRes.text();
        throw new Error(`deploy failed (${deployRes.status}): ${text}`);
      }
      const deploy = await deployRes.json();

      // Persist the site info so future deploys reuse the same URL.
      await userRef.update({
        netlify: { siteId, url: siteUrl, adminUrl: adminUrl ?? null },
        lastDeployedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      log("deploy ok", siteUrl);
      res.json({
        url: siteUrl,
        adminUrl,
        siteId,
        deployId: deploy.id,
        state: deploy.state,
      });
    } catch (err) {
      logErr("deploy failed:", err);
      // Refund the credit — deploy didn't go through.
      await refundCredit(req.user.uid);
      res.status(500).json({ error: err.message, requestId: rid });
    }
  }
);

app.get("/site-info", verifyIdToken, async (req, res) => {
  try {
    const snap = await adminDb.collection("users").doc(req.user.uid).get();
    const netlify = snap.exists ? (snap.data()?.netlify ?? null) : null;
    res.json({ netlify });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/prompt-preview", (req, res) => {
  try {
    const { brief } = req.body ?? {};
    if (!brief) return res.status(400).json({ error: "brief required" });
    validateBrief(brief);
    res.json({ prompt: buildPrompt(brief) });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const AI_EDIT_TIMEOUT_MS = 120_000;
const AI_EDIT_MAX_PROMPT_CHARS = 2_000;
const AI_EDIT_MAX_PAGES = 10;
const AI_EDIT_MAX_SLOTS = 200;

app.post("/ai-edit", verifyIdToken, async (req, res) => {
  const rid = req.id;
  const log = (...args) => console.log(`[${rid}]`, ...args);
  const logErr = (...args) => console.error(`[${rid}]`, ...args);
  res.setHeader("x-request-id", rid);

  const { prompt, slots, pages } = req.body ?? {};

  // Input validation
  if (!prompt || typeof prompt !== "string" || prompt.trim().length < 2) {
    return res.status(400).json({ error: "prompt required", requestId: rid });
  }
  if (prompt.length > AI_EDIT_MAX_PROMPT_CHARS) {
    return res.status(400).json({ error: `prompt must be under ${AI_EDIT_MAX_PROMPT_CHARS} characters`, requestId: rid });
  }
  if (pages && typeof pages === "object" && Object.keys(pages).length > AI_EDIT_MAX_PAGES) {
    return res.status(400).json({ error: "too many pages in payload", requestId: rid });
  }
  if (slots && typeof slots === "object" && Object.keys(slots).length > AI_EDIT_MAX_SLOTS) {
    return res.status(400).json({ error: "too many slots in payload", requestId: rid });
  }

  // Charge 1 credit — ai-edit calls Gemini and costs money.
  let creditState;
  try {
    creditState = await consumeCredit(req.user.uid, req.user.email);
  } catch (err) {
    return res
      .status(err.status ?? 500)
      .json({ error: err.message ?? "credit check failed", requestId: rid });
  }

  log("ai-edit start; uid:", req.user.uid, "remaining credits:", creditState.remaining, "prompt:", JSON.stringify(prompt.slice(0, 120)));

  const systemInstruction = `You are an AI assistant that edits website content based on user instructions.
You receive the current text slots (key-value pairs controlling editable text) and the raw HTML pages of a website.
Apply the user's requested changes carefully and return the full updated slots and pages.
Return ONLY valid JSON — no markdown fences, no prose, no explanations:
{
  "slots": { "hero.title": "...", "hero.subtitle": "...", ... },
  "pages": { "index.html": "<!doctype html>...", ... }
}
RULES:
- Return ALL slots (including unchanged ones).
- Return ALL pages (including unchanged ones).
- Keep all data-slot attributes intact on every element.
- Only modify text content and inline styles — do NOT change the HTML structure or remove data-slot attributes.
- If the instruction only affects text, update the relevant slot values and ensure the matching HTML elements reflect the change.
- All pages must remain complete, valid HTML5 documents.`;

  const slotsStr = JSON.stringify(slots || {}, null, 2);
  const pagesStr = JSON.stringify(pages || {}, null, 2);
  const userMessage = `Current slots:\n${slotsStr}\n\nCurrent pages:\n${pagesStr}\n\nInstruction: ${prompt.trim()}\n\nReturn the updated JSON now.`;

  let timeoutHandle;
  const timeoutPromise = new Promise((_resolve, reject) => {
    timeoutHandle = setTimeout(
      () => reject(Object.assign(new Error("ai-edit timed out"), { code: "ETIMEOUT" })),
      AI_EDIT_TIMEOUT_MS
    );
  });

  try {
    const aiPromise = ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: userMessage,
      config: { systemInstruction },
    });

    const response = await Promise.race([aiPromise, timeoutPromise]);
    clearTimeout(timeoutHandle);

    const raw = response.text;
    log("ai-edit raw length:", raw?.length ?? 0);

    let parsed;
    try {
      parsed = extractJson(raw);
    } catch (err) {
      logErr("ai-edit extract failed:", err.message);
      await refundCredit(req.user.uid);
      return res.status(500).json({ error: "AI returned invalid format", requestId: rid });
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      await refundCredit(req.user.uid);
      return res.status(500).json({ error: "AI returned unexpected format", requestId: rid });
    }

    log("ai-edit ok");
    res.json({
      slots: parsed.slots ?? slots ?? {},
      pages: parsed.pages ?? pages ?? {},
    });
  } catch (err) {
    clearTimeout(timeoutHandle);
    logErr("ai-edit failed:", err);
    await refundCredit(req.user.uid);
    const status = err.code === "ETIMEOUT" ? 504 : 500;
    res.status(status).json({ error: err.message ?? "AI edit failed", requestId: rid });
  }
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`landing-generator listening on :${port}`);
});
