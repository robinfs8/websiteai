import { generateAppCode } from './generate.js';
import { parseAndValidateSitePackage } from './site-package.js';

export async function runPipeline(userPrompt) {
  const raw = await generateAppCode(userPrompt);
  if (!raw || !raw.trim()) {
    throwStaged(
      'generate',
      `empty code response from model for prompt length ${userPrompt?.length ?? 0}`,
    );
  }

  let sitePackage;
  try {
    sitePackage = parseAndValidateSitePackage(raw);
  } catch (err) {
    throwStaged('validate', err.message);
  }

  return {
    code: JSON.stringify(sitePackage, null, 2),
    sitePackage,
  };
}

function throwStaged(stage, message, details) {
  const err = new Error(message);
  err.stage = stage;
  err.details = details;
  throw err;
}
