import { generateAppCode } from './generate.js';

export async function runPipeline(userPrompt) {
  const code = await generateAppCode(userPrompt);
  if (!code || !code.trim()) {
    throwStaged('generate', 'empty code response from model');
  }
  return { code };
}

function throwStaged(stage, message, details) {
  const err = new Error(message);
  err.stage = stage;
  err.details = details;
  throw err;
}
