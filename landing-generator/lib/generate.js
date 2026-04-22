import { GoogleGenAI } from "@google/genai";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const SYSTEM_PROMPT = `You generate a single React component file: src/App.jsx.

STRICT RULES:
- Return ONLY the full contents of App.jsx. No prose, no explanations.
- You MAY wrap the code in a single \`\`\`jsx fenced block, but nothing else.
- Use a default export: \`export default function App() { ... }\`.
- Use React (already imported automatically by Vite via JSX runtime).
- You MAY use React hooks (useState, useEffect, useMemo, useRef).
- Tailwind CSS is available globally via CDN — use Tailwind utility classes for all styling.
- DO NOT import any external packages other than 'react'. framer-motion and lucide-react are fine, but NOTHING ELSE ALLOWED!.
- For icons, use lucide-react.
- For images, use https://picsum.photos/<w>/<h> or https://images.unsplash.com/... via <img>.
- The component must be fully self-contained in one file.
- Make it a visually polished, complete landing page: navbar, hero, sections, CTA, footer. Responsive mobile & desktop.`;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateAppCode(userPrompt) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `Build a landing page for:\n\n${userPrompt}\n\nReturn the full App.jsx now.`,
    config: { systemInstruction: SYSTEM_PROMPT },
  });
  return response.text;
}
