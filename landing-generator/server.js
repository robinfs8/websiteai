import "dotenv/config";
import express from "express";
import cors from "cors";
import { runPipeline } from "./lib/pipeline.js";
import { buildPrompt, validateBrief } from "./lib/prompt-builder.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/generate", async (req, res) => {
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
      });
    }
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  try {
    const { code } = await runPipeline(userPrompt);
    res.json({ code });
  } catch (err) {
    console.error("[generate] failed:", err);
    res.status(500).json({
      error: err.message ?? "pipeline failed",
      stage: err.stage ?? "unknown",
      details: err.details ?? null,
    });
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

const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`landing-generator listening on :${port}`);
});
