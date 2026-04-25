import { generateAppCode } from './generate.js';

export async function runPipeline(userPrompt) {
  const raw = await generateAppCode(userPrompt);
  console.log('[pipeline] raw AI output:', raw);

  if (!raw || !raw.trim()) {
    throw new Error('empty response from model');
  }

  // Strip markdown fences if present, then parse JSON
  const text = raw.trim();
  const fence = text.match(/```(?:json)?\s*\n([\s\S]*?)```/i);
  const jsonText = fence?.[1]?.trim() ?? text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    throw new Error(`invalid JSON from model: ${err.message}`);
  }

  return parsed;
}
