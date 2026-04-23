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

  // Set up SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send the userPrompt to the client immediately
  res.write(`data: ${JSON.stringify({ userPrompt })}\n\n`);

  try {
    const { code, sitePackage } = await runPipeline(userPrompt);

    // Send the final result to the client
    res.write(`data: ${JSON.stringify({ code, sitePackage })}\n\n`);
    res.end(); // Close the connection
  } catch (err) {
    console.error("[generate] failed:", err);
    res.write(
      `data: ${JSON.stringify({
        error: err.message ?? "pipeline failed",
        stage: err.stage ?? "unknown",
        details: err.details ?? null,
      })}\n\n`
    );
    res.end(); // Close the connection
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
