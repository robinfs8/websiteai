import { generateAppCode } from './generate.js';
import { extractJson } from './extract.js';

export async function runPipeline(userPrompt) {
  console.log('[pipeline] calling AI...');
  const raw = await generateAppCode(userPrompt);
  console.log('[pipeline] AI returned, length:', raw?.length ?? 0);
  console.log('[pipeline] raw AI preview:', JSON.stringify(String(raw ?? '').slice(0, 300)));

  console.log('[pipeline] extracting JSON...');
  let parsed;
  try {
    parsed = extractJson(raw);
  } catch (err) {
    console.log('[pipeline] extract failed:', err.message);
    const e = new Error(`AI returned invalid format: ${err.message}`);
    e.stage = 'extract';
    e.code = 'EBADFORMAT';
    e.details = { rawPreview: String(raw ?? '').slice(0, 500) };
    throw e;
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    console.log('[pipeline] extracted but not object');
    const e = new Error('AI returned invalid format: response is not a JSON object');
    e.stage = 'extract';
    e.code = 'EBADFORMAT';
    throw e;
  }

  console.log('[pipeline] extract ok, top-level keys:', Object.keys(parsed));
  return parsed;
}
