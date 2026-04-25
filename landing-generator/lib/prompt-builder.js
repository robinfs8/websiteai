// prompt-builder.js
//
// RESPONSIBILITY: Logic only — read the brief JSON, pull every prompt string
// from PROMPT_DB / SECTION_PROMPTS, and assemble the final AI prompt.
//
// DO NOT add prompt text here. All copy lives in prompt-db.js.
//
// ─── BRIEF JSON SCHEMA (frontend v2) ─────────────────────────────────────────
// {
//   basics: {
//     companyName*: string,
//     industry*:    string,   → ALLOWED_INDUSTRIES
//     slogan:       string,   → optional
//     description:  string,   → optional
//   },
//   design: {
//     colors:          string,   → free text: hex codes, color names, descriptions
//     shapeLanguage:   "rounded" | "sharp",
//     designDirection: "minimal" | "modern" | "brutalist" | "luxury" | "playful" | "standard",
//     darkMode:        boolean,
//   },
//   sections: {
//     about:        { enabled: boolean, story:       string },
//     team:         { enabled: boolean, members:     string },
//     testimonials: { enabled: boolean, reviews:     string },
//     process:      { enabled: boolean, description: string },
//     portfolio:    { enabled: boolean, projects:    string },
//     pricing:      { enabled: boolean, details:     string },
//     comparison:   { enabled: boolean, data:        string },
//     stats:        { enabled: boolean, data:        string },
//     faq:          { enabled: boolean },
//     careers:      { enabled: boolean, jobs:        string },
//     locations:    { enabled: boolean, addresses:   string },
//     partners:     { enabled: boolean, names:       string },
//   },
//   contact: {
//     primaryCta:   "call" | "book" | "contact" | "buy" | "demo",
//     phone:        string,
//     email:        string,
//     address:      string,
//     social:       { instagram, linkedin, tiktok, facebook, youtube },
//     furtherLinks: string,
//     openingHours: string,
//     specials:     string,
//   },
//   extras: string,   → free-text wishes, industry-specific requests
// }
// ─────────────────────────────────────────────────────────────────────────────

import {
  PROMPT_DB,
  SECTION_PROMPTS,
  GLOBAL_PROMPT,
  deriveFontFromStyle,
  deriveFontPair,
  FALLBACK_PALETTES,
  LANDING_PATTERNS,
  UX_CORE_RULES,
  HTML_BEST_PRACTICES,
  ICON_GUIDELINES,
  SECTION_DESIGN_PATTERNS,
  APPROVED_FONTS,
} from "./prompt-db.js";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const REQUIRED = ["basics.companyName", "basics.industry"];

const ALLOWED_INDUSTRIES = new Set([
  // Current frontend v2 industries
  "tech",
  "agency",
  "handwerk",
  "health",
  "gastro",
  "sport",
  "brand",
  "industry",
  "realestate",
  "education",
  "event",
  "nonprofit",
  "corporate",
  "portfolio",
]);

const ALLOWED_SECTIONS = new Set([
  "about",
  "team",
  "testimonials",
  "process",
  "portfolio",
  "pricing",
  "comparison",
  "stats",
  "faq",
  "careers",
  "locations",
  "partners",
]);

// Maps new shapeLanguage values → legacy PROMPT_DB.design.shape keys
const SHAPE_MAP = { rounded: "round", sharp: "angular" };

// Maps new designDirection values → legacy PROMPT_DB.design.style keys
const DIRECTION_MAP = {
  minimal: "minimal",
  modern: "modern",
  brutalist: "brutalist",
  playful: "playful",
};

// Maps new industry values → legacy PROMPT_DB.industrySpecific keys
const INDUSTRY_SPECIFIC_MAP = {
  gastro: "restaurant",
  tech: "software",
  sport: "fitness",
  brand: "personal",
};

// ─── VALIDATION ───────────────────────────────────────────────────────────────

export function validateBrief(brief) {
  if (!brief || typeof brief !== "object")
    throw new Error("brief must be an object");
  for (const path of REQUIRED) {
    const val = deepGet(brief, path);
    if (!val || (typeof val === "string" && !val.trim()))
      throw new Error(`brief.${path} is required`);
  }
  const industry = brief.basics?.industry;
  if (industry && !ALLOWED_INDUSTRIES.has(industry))
    throw new Error(
      `brief.basics.industry "${industry}" is not in the allowed list`
    );
}

// ─── MAIN BUILDER ─────────────────────────────────────────────────────────────

export function buildPrompt(brief) {
  validateBrief(brief);

  const blocks = [
    block("GLOBAL CONTEXT", globalBlock()),
    block("COMPANY", companyBlock(brief)),
    block("DESIGN DIRECTIVES", designBlock(brief)),
    block("UI/UX & TYPOGRAPHY", uiuxBlock(brief)),
    block("SECTIONS TO BUILD", sectionsBlock(brief)),
    block("CONTACT & CTA", contactBlock(brief)),
    block("INDUSTRY-SPECIFIC", industryBlock(brief)),
    block("LEGAL", legalBlock(brief)),
    block("SEO", seoBlock(brief)),
    block("ADDITIONAL WISHES", brief.extras?.trim() || null),
    block("HARD RULES", hardRulesBlock()),
  ].filter(Boolean);

  return (
    PROMPT_DB.system.preamble +
    "\n\n" +
    blocks.join("\n\n") +
    PROMPT_DB.system.footer
  );
}

// ─── BLOCKS ───────────────────────────────────────────────────────────────────
// Each function reads from PROMPT_DB and returns a plain string (or null to skip).

// ── GLOBAL CONTEXT ────────────────────────────────────────────────────────────
// Source: GLOBAL_PROMPT (exported from prompt-db.js)
function globalBlock() {
  return GLOBAL_PROMPT?.trim() || null;
}

// ── COMPANY ───────────────────────────────────────────────────────────────────
// Source: PROMPT_DB.basics.fields  +  PROMPT_DB.basics.industry[value]
function companyBlock(b) {
  const { companyName, industry, slogan, description } = b.basics;
  const f = PROMPT_DB.basics.fields;

  const lines = [
    fill(f.companyName, { value: companyName }),
    fill(f.industry, {
      value: PROMPT_DB.basics.industry[industry] || industry,
    }),
  ];
  if (slogan?.trim()) lines.push(fill(f.slogan, { value: slogan }));
  if (description?.trim())
    lines.push(fill(f.description, { value: description }));

  return lines.join("\n");
}

// ── DESIGN ────────────────────────────────────────────────────────────────────
// Source: PROMPT_DB.design.fields
//         PROMPT_DB.design.shapeLanguage  (v2)  OR  PROMPT_DB.design.shape  (legacy fallback)
//         PROMPT_DB.design.designDirection (v2)  OR  PROMPT_DB.design.style  (legacy fallback)
//         PROMPT_DB.design.darkMode
function designBlock(b) {
  const d = b.design ?? {};
  const f = PROMPT_DB.design.fields;
  const lines = [];

  if (d.colors?.trim()) lines.push(fill(f.colors, { value: d.colors }));

  if (d.shapeLanguage) {
    const prompt =
      PROMPT_DB.design.shapeLanguage?.[d.shapeLanguage] ??
      PROMPT_DB.design.shape?.[SHAPE_MAP[d.shapeLanguage]];
    if (prompt) lines.push(`- ${prompt}`);
  }

  if (d.designDirection) {
    const prompt =
      PROMPT_DB.design.designDirection?.[d.designDirection] ??
      PROMPT_DB.design.style?.[DIRECTION_MAP[d.designDirection]];
    if (prompt) lines.push(`- ${prompt}`);
  }

  lines.push(
    fill(f.typography, { value: deriveFontFromStyle(d.designDirection, null) })
  );

  if (typeof d.darkMode === "boolean")
    lines.push(`- ${PROMPT_DB.design.darkMode[String(d.darkMode)]}`);

  return lines.length ? lines.join("\n") : null;
}

// ── UI/UX & TYPOGRAPHY ────────────────────────────────────────────────────────
// Source: PROMPT_DB.uiux  (all labels/templates)
//         FALLBACK_PALETTES, LANDING_PATTERNS, deriveFontPair  (data)
//         SECTION_DESIGN_PATTERNS, ICON_GUIDELINES, UX_CORE_RULES, HTML_BEST_PRACTICES
function uiuxBlock(b) {
  const d = b.design ?? {};
  const industry = b.basics?.industry ?? "other";
  const u = PROMPT_DB.uiux;
  const lines = [];

  const pair = deriveFontPair(d.designDirection, null, industry);
  lines.push(u.typography.header);
  lines.push(fill(u.typography.fonts, pair));
  lines.push(fill(u.typography.link, pair));
  lines.push(fill(u.typography.apply, pair));

  if (!d.colors?.trim()) {
    const palette = FALLBACK_PALETTES[industry] ?? FALLBACK_PALETTES.other;
    lines.push(fill(u.colors, { industry, ...palette }));
  }

  lines.push(
    fill(u.pattern, {
      pattern: LANDING_PATTERNS[industry] ?? LANDING_PATTERNS.other,
    })
  );

  lines.push("", APPROVED_FONTS);
  lines.push("", SECTION_DESIGN_PATTERNS);
  lines.push("", ICON_GUIDELINES);
  lines.push("", UX_CORE_RULES);
  lines.push("", HTML_BEST_PRACTICES);

  return lines.join("\n");
}

// ── SECTIONS TO BUILD ─────────────────────────────────────────────────────────
// Source: PROMPT_DB.sections.meta  (structure labels)
//         SECTION_PROMPTS[key](data)  (full per-section prompt — edit in prompt-db.js)
//         PROMPT_DB.sections[key]     (fallback snippet)
function sectionsBlock(b) {
  const s = b.sections ?? {};
  const m = PROMPT_DB.sections.meta;
  const enabledLines = [];
  const disabledLines = [];

  for (const key of ALLOWED_SECTIONS) {
    const sectionData = s[key];
    if (!sectionData) continue;

    if (sectionData.enabled === true) {
      const promptFn = SECTION_PROMPTS?.[key];
      const text = promptFn
        ? promptFn(sectionData)
        : PROMPT_DB.sections[key] ?? key;
      enabledLines.push(`  ✓ ${text}`);
    } else if (sectionData.enabled === false) {
      disabledLines.push(`  ✗ ${key}`);
    }
  }

  const lines = [m.alwaysOn, m.footerRule];
  if (enabledLines.length)
    lines.push(`${m.enabledHeader}\n${enabledLines.join("\n")}`);
  if (disabledLines.length)
    lines.push(`${m.disabledHeader}\n${disabledLines.join("\n")}`);

  return lines.join("\n");
}

// ── CONTACT & CTA ─────────────────────────────────────────────────────────────
// Source: PROMPT_DB.cta[value]           (CTA instruction)
//         PROMPT_DB.contact.fields[key]  (field templates)
function contactBlock(b) {
  const c = b.contact ?? {};
  const f = PROMPT_DB.contact.fields;
  const lines = [];

  lines.push(
    `- ${PROMPT_DB.cta[c.primaryCta ?? "contact"] ?? PROMPT_DB.cta.contact}`
  );

  if (c.phone?.trim()) lines.push(fill(f.phone, { value: c.phone }));
  if (c.email?.trim()) lines.push(fill(f.email, { value: c.email }));
  if (c.address?.trim()) lines.push(fill(f.address, { value: c.address }));
  if (c.openingHours?.trim())
    lines.push(fill(f.openingHours, { value: c.openingHours }));
  if (c.furtherLinks?.trim())
    lines.push(fill(f.furtherLinks, { value: c.furtherLinks }));
  if (c.specials?.trim()) lines.push(fill(f.specials, { value: c.specials }));

  if (c.social) {
    const entries = Object.entries(c.social).filter(([, v]) => v?.trim());
    if (entries.length)
      lines.push(
        fill(f.social, {
          value: entries.map(([k, v]) => `${k}: ${v}`).join(" | "),
        })
      );
  }

  return lines.join("\n");
}

// ── INDUSTRY-SPECIFIC ─────────────────────────────────────────────────────────
// Source: PROMPT_DB.industrySpecific[key].base
// Only adds a base snippet for industries that have a detailed entry.
// New v2 industries are described via companyBlock (PROMPT_DB.basics.industry).
function industryBlock(b) {
  const industry = b.basics.industry;
  const resolvedKey =
    INDUSTRY_SPECIFIC_MAP[industry] ??
    (PROMPT_DB.industrySpecific[industry] ? industry : null);
  if (!resolvedKey) return null;

  const spec = PROMPT_DB.industrySpecific[resolvedKey];
  return spec?.base ? `- ${spec.base}` : null;
}

// ── LEGAL ─────────────────────────────────────────────────────────────────────
// Source: PROMPT_DB.legal
function legalBlock(b) {
  const l = b.legal ?? {};
  const leg = PROMPT_DB.legal;
  const lines = [leg.footerRequired];
  if (l.imprint) lines.push(leg.imprintConfirmed);
  if (l.privacy) lines.push(leg.privacyConfirmed);
  return lines.join("\n");
}

// ── SEO ───────────────────────────────────────────────────────────────────────
// Source: PROMPT_DB.seo.fields
function seoBlock(b) {
  const s = b.seo ?? {};
  const f = PROMPT_DB.seo.fields;
  const lines = [];
  if (s.title?.trim()) lines.push(fill(f.title, { value: s.title }));
  if (s.description?.trim())
    lines.push(fill(f.description, { value: s.description }));
  return lines.length ? lines.join("\n") : null;
}

// ── HARD RULES ────────────────────────────────────────────────────────────────
// Source: PROMPT_DB.always[]
function hardRulesBlock() {
  return PROMPT_DB.always.map((r) => `- ${r}`).join("\n");
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

// Wraps a body string in a titled ## section. Returns null if body is empty.
function block(title, body) {
  if (!body || (typeof body === "string" && !body.trim())) return null;
  return `## ${title}\n${body}`;
}

// Replaces all {{key}} tokens in a template string with values from a map.
function fill(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

// Safe deep-get using a dot-separated path string (e.g. "basics.companyName").
function deepGet(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
}
