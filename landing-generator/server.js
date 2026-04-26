import "dotenv/config";
import { randomUUID } from "node:crypto";
import express from "express";
import cors from "cors";
import { runPipeline } from "./lib/pipeline.js";
import { buildPrompt, validateBrief } from "./lib/prompt-builder.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const GENERATE_TIMEOUT_MS = 120_000;

app.use((req, _res, next) => {
  req.id = req.get("x-request-id") || randomUUID();
  next();
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/generate", async (req, res) => {
  const rid = req.id;
  const log = (...args) => console.log(`[${rid}]`, ...args);
  const logErr = (...args) => console.error(`[${rid}]`, ...args);
  res.setHeader("x-request-id", rid);

  const { prompt, brief } = req.body ?? {};

  let userPrompt;
  try {
    if (brief) {
      validateBrief(brief);
      userPrompt = buildPrompt(brief);
    } else if (typeof prompt === "string" && prompt.trim().length >= 3) {
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

  // Log the userPrompt as a SINGLE log entry. Railway's log viewer splits on
  // \n and re-orders lines that share a millisecond timestamp, which makes a
  // multi-line console.log appear scrambled. JSON-stringifying escapes the
  // newlines so the entire prompt is one line and cannot be reordered.
  log("generate start; userPrompt:", JSON.stringify(userPrompt));

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
    const sitePackage = await Promise.race([
      runPipeline(userPrompt),
      timeoutPromise,
    ]);
    clearTimeout(timeoutHandle);
    if (clientGone) return;
    log("generate ok");
    res.json(sitePackage);
  } catch (err) {
    clearTimeout(timeoutHandle);
    logErr("generate failed:", err);
    if (clientGone || res.writableEnded) return;
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

    try {
      log("deploy: creating site");
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

      log("deploy: uploading zip to site", site.site_id);
      const deployRes = await fetch(
        `https://api.netlify.com/api/v1/sites/${site.site_id}/deploys`,
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

      log("deploy ok", site.ssl_url || site.url);
      res.json({
        url: site.ssl_url || site.url,
        adminUrl: site.admin_url,
        siteId: site.site_id,
        deployId: deploy.id,
        state: deploy.state,
      });
    } catch (err) {
      logErr("deploy failed:", err);
      res.status(500).json({ error: err.message, requestId: rid });
    }
  }
);

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

const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`landing-generator listening on :${port}`);
});
