export function extractCode(raw) {
  if (!raw) throw new Error('empty response');
  const text = raw.trim();

  const fenceRe = /```(?:jsx|js|javascript|tsx|ts)?\s*\n([\s\S]*?)```/;
  const m = text.match(fenceRe);
  if (m) return m[1].trim();

  if (text.includes('export default') || text.includes('function App')) {
    return text;
  }

  throw new Error('could not extract code block from model response');
}
