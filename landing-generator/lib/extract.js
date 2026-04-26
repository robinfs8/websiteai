// Robust JSON extractor for model responses.
// Handles: bare JSON, ```json fenced blocks, ``` fenced blocks, prose around
// JSON, and nested braces inside string values. Throws a clear error if no
// valid JSON object can be recovered.

function stripFences(text) {
  const fenced = text.match(/```(?:json|javascript|js)?\s*\n?([\s\S]*?)```/i);
  return fenced?.[1]?.trim() ?? null;
}

// Find the first balanced { ... } object, ignoring braces inside strings.
function findBalancedObject(text) {
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

export function extractJson(raw) {
  if (raw == null) throw new Error("empty model response");
  const text = String(raw).trim();
  if (!text) throw new Error("empty model response");

  const candidates = [];
  const fenced = stripFences(text);
  if (fenced) candidates.push(fenced);
  const balanced = findBalancedObject(text);
  if (balanced) candidates.push(balanced);
  candidates.push(text);

  let lastErr;
  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === "object") return parsed;
    } catch (err) {
      lastErr = err;
    }
  }

  throw new Error(
    `could not extract valid JSON from model response${
      lastErr ? `: ${lastErr.message}` : ""
    }`
  );
}
