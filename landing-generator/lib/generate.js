import { GoogleGenAI } from "@google/genai";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const SYSTEM_PROMPT = `You are generating a multi-page static website.
Return ONLY JSON in this exact format:
{
  "pages": {
    "index.html": "...",
    "contact.html": "...",
    "team.html": "..."
  },
  "assets": {
    "filename.jpg": "placeholder"
  },
  "slots": {
    "slot.key": "default text"
  }
}
Rules:
- Each page must be a complete valid HTML5 document starting with <!doctype html> and ending with </html>.
- Navigation must link only to real files like:
  /index.html
  /contact.html
  /team.html
- Never use hash navigation.
- Never use SPA routing.
- All editable text must include a data-slot attribute.
- Slot keys must be stable and use section.element format (e.g. hero.title, contact.email, footer.text).
- Images must use local paths under /assets/... and must not use external URLs.
- Never use frameworks.
- Never use React.
- Never use Tailwind.
- Never output explanations.
- Return JSON only.`;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateAppCode(userPrompt) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents:
      `${userPrompt}\n\n` +
      `Generate the website package now and return JSON only in the required pages/assets/slots format.`,
    config: { systemInstruction: SYSTEM_PROMPT },
  });
  return response.text;
}
