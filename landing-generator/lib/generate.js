import { GoogleGenAI } from "@google/genai";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const SYSTEM_PROMPT = `You are generating a JSON representation of a multi-page static website package.
Return ONLY JSON in this exact format — no markdown fences, no prose, no explanations:
{
  "pages": {
    "index.html": "<!Doctype html>...full HTML document...</html>",
    "contact.html": "<!Doctype html>...full HTML document...</html>",
    "team.html": "<!Doctype html>...full HTML document...</html>"
  },
  "assets": {
    "hero.jpg": "placeholder",
    "team.jpg": "placeholder"
  },
  "slots": {
    "hero.title": "Willkommen",
    "hero.subtitle": "Wir bauen Software",
    "contact.address": "Musterstraße 1"
  }
}
RULES:
- pages = complete HTML5 files (<!Doctype html> ... </html>)
- assets = expected images (always "placeholder" as value)
- slots = editable texts (stable section.element keys)

ABSOLUTE RULES — violation is not acceptable:
1. Each page must be a complete valid HTML5 document starting with <!doctype html> and ending with </html>.
2. Pages use ONLY plain HTML, CSS (in <style> blocks), and vanilla JavaScript (in <script> blocks). NO React. NO Vue. NO Angular. NO Tailwind. NO Bootstrap. NO framer-motion. NO lucide-react. NO npm packages.
3. Navigation must link only to real files: /index.html, /contact.html, /team.html — NEVER hash links, NEVER router.push(), NEVER SPA routing.
4. EVERY piece of text MUST have a data-slot attribute with a stable section.element key.
   Correct: <h1 data-slot="hero.title">Willkommen</h1>
   Correct: <p data-slot="hero.subtitle">Wir bauen Software</p>
   Correct: <img src="/assets/hero.jpg" data-slot="hero.image">
   Slot keys must follow section.element format: hero.title, hero.subtitle, team.member1.name, contact.email, footer.text. No random IDs.
5. All images must use /assets/... paths. NEVER use external URLs (no picsum, no unsplash).
6. Return JSON only — no markdown fences (\`\`\`json), no explanations, no other text.`;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateAppCode(userPrompt) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `${userPrompt}\n\nGenerate the website package now. Return ONLY valid JSON with exactly these top-level keys: "pages", "assets", "slots". No markdown fences, no prose.`,
    config: { systemInstruction: SYSTEM_PROMPT },
  });
  return response.text;
}
