// Assembles the LLM prompt from a structured brief JSON.
// Uses PROMPT_DB to translate each selection into concrete design instructions.
//
// ALLOWED SCHEMA (all optional unless marked *):
// {
//   basics: {
//     name*:     string,
//     industry*: "software"|"agency"|"restaurant"|"cafe"|"yoga"|"fitness"
//                |"handwerk"|"personal"|"ecommerce"|"personaldienst"|"other",
//     tagline:   string,
//     description: string,
//     audience:  { type: "B2B"|"B2C"|"both", ageRange: string, notes: string },
//     usp:       string
//   },
//   design: {
//     colors:    { primary: hex, secondary: hex, accent: hex },
//     shape:     "round"|"angular"|"mixed",
//     level:     "super-modern"|"mid"|"basic",
//     style:     "minimal"|"brutalist"|"modern"|"classic"|"playful"|"editorial"|"glassmorphism",
//     tone:      "professional"|"casual"|"playful"|"formal"|"youthful"|"luxurious",
//     // font is NOT a user field — auto-derived from style + tone
//     imagery:   "photos"|"illustrations"|"abstract"|"minimal"|"none",
//     darkMode:  boolean,
//     animations:"none"|"subtle"|"moderate"|"heavy",
//     heroStyle: "fullscreen-image"|"split"|"video-bg"|"text-only",
//     layout:    "airy"|"balanced"|"dense"
//   },
//   sections: {   // all boolean
//     team, testimonials, about, faq, process, gallery, blog,
//     pricing, compareTable, stats, careers, locations, partnerLogos
//   },
//   offering: {
//     services:    [{ name, description, price }],
//     showPrices:  "yes"|"no"|"from"|"packages",
//     openingHours: string,
//     specials:    string
//   },
//   contact: {
//     primaryCta: "call"|"book"|"contact"|"buy"|"demo",  // default: contact
//     phone, email, address,
//     maps:    boolean,
//     social:  { instagram, linkedin, tiktok, facebook, youtube, x },
//     whatsapp: boolean
//   },
//   trust: {
//     testimonials:  [{ text, author, rating }],
//     customerLogos: boolean,
//     certificates:  [string],
//     stats:         [{ value, label }],
//     press:         [string]
//   },
//   team: {
//     members: [{ name, role, bio }]
//   },
//   industrySpecific: {
//     restaurant:     { menu:[{category, items:[{name,price,description}]}], reservationLink, deliveryLinks:[url], dietaryFilters:boolean },
//     agency:         { caseStudies:[{title,client,result}], techStack:[string], projects:[{name,description}] },
//     personaldienst: { openPositions:[{title,location}], applicationForm:boolean, benefits:[string] },
//     handwerk:       { serviceArea:string, emergencyService:boolean, beforeAfter:boolean },
//     yoga:           { schedule:[{day,time,class}], trainers:[{name,specialty}], trialClass:boolean },
//     fitness:        { schedule:[{day,time,class}], trainers:[{name,specialty}], trialClass:boolean },
//     ecommerce:      { categories:[string], bestsellers:[string], shippingInfo:string }
//   },
//   legal:    { imprint: boolean, privacy: boolean },
//   seo:      { title: string, description: string },
//   freeText: string
// }

import {
  PROMPT_DB,
  deriveFontFromStyle,
  deriveFontPair,
  FALLBACK_PALETTES,
  LANDING_PATTERNS,
  UX_CORE_RULES,
  HTML_BEST_PRACTICES,
  ICON_GUIDELINES,
  SECTION_DESIGN_PATTERNS,
} from './prompt-db.js';

const REQUIRED = ['basics.name', 'basics.industry'];

const ALLOWED_INDUSTRIES = new Set([
  'software', 'agency', 'restaurant', 'cafe', 'yoga', 'fitness',
  'handwerk', 'personal', 'ecommerce', 'personaldienst', 'other',
]);

const ALLOWED_SECTIONS = new Set([
  'team', 'testimonials', 'about', 'faq', 'process', 'gallery',
  'blog', 'pricing', 'compareTable', 'stats', 'careers', 'locations', 'partnerLogos',
]);

export function validateBrief(brief) {
  if (!brief || typeof brief !== 'object') throw new Error('brief must be an object');
  for (const path of REQUIRED) {
    const val = deepGet(brief, path);
    if (!val || (typeof val === 'string' && !val.trim())) {
      throw new Error(`brief.${path} is required`);
    }
  }
  const industry = brief.basics?.industry;
  if (industry && !ALLOWED_INDUSTRIES.has(industry)) {
    throw new Error(`brief.basics.industry "${industry}" is not in the allowed list`);
  }
}

export function buildPrompt(brief) {
  validateBrief(brief);

  const blocks = [
    section('COMPANY',            companyBlock(brief)),
    section('AUDIENCE',           audienceBlock(brief)),
    section('DESIGN DIRECTIVES',  designBlock(brief)),
    section('UI/UX & TYPOGRAPHY', uiuxProBlock(brief)),
    section('SECTIONS TO BUILD',  sectionsBlock(brief)),
    section('CONTENT',            contentBlock(brief)),
    section('CONTACT & CTA',      contactBlock(brief)),
    section('TRUST / SOCIAL PROOF', trustBlock(brief)),
    section('TEAM',               teamBlock(brief)),
    section('INDUSTRY-SPECIFIC',  industryBlock(brief)),
    section('LEGAL',              legalBlock(brief)),
    section('SEO',                seoBlock(brief)),
    section('ADDITIONAL WISHES',  brief.freeText?.trim() || null),
    section('HARD RULES — FOLLOW EXACTLY', hardRulesBlock()),
  ].filter(Boolean);

  return (
    `You are building a multi-page static website package for the business below.\n` +
    `Return strictly one JSON object with top-level keys: pages, assets, slots. Follow every directive strictly.\n\n` +
    blocks.join('\n\n') +
    `\n\nReturn JSON only now in the required pages/assets/slots format.`
  );
}

// ─── UI/UX PRO BLOCK ─────────────────────────────────────────────────────────
// Injects typography (1–2 fonts), landing pattern, section design rules,
// icon usage, UX guidelines, and React performance rules into every prompt.
// Colors are derived from the brief when not explicitly provided.

function uiuxProBlock(b) {
  const d = b.design ?? {};
  const industry = b.basics?.industry ?? 'other';
  const lines = [];

  // ── Typography: pick ONE font pair based on style → industry → default ──────
  const pair = deriveFontPair(d.style, d.tone, industry);
  lines.push(`- TYPOGRAPHY — Load via Google Fonts in index.html:`);
  lines.push(`  Heading font: "${pair.heading}" | Body font: "${pair.body}"`);
  lines.push(`  <link href="https://fonts.googleapis.com/css2?family=${pair.load}&display=swap" rel="stylesheet">`);
  lines.push(`  Apply: font-family: '${pair.heading}', ${pair.headingStack} on h1–h4; '${pair.body}', ${pair.bodyStack} on body/p.`);

  // ── Color palette: only injected if the brief does NOT specify explicit colors ─
  if (!d.colors?.primary) {
    const palette = FALLBACK_PALETTES[industry] ?? FALLBACK_PALETTES.other;
    lines.push(`- COLORS (derived from industry — "${industry}"): primary=${palette.primary}, secondary=${palette.secondary}, accent=${palette.accent}, background=${palette.bg}, foreground=${palette.fg}. (${palette.note})`);
  }

  // ── Landing page pattern recommendation ─────────────────────────────────────
  const pattern = LANDING_PATTERNS[industry] ?? LANDING_PATTERNS.other;
  lines.push(`- RECOMMENDED LANDING PATTERN: ${pattern}`);

  // ── Section-level design system ──────────────────────────────────────────────
  lines.push('');
  lines.push(SECTION_DESIGN_PATTERNS);

  // ── Icon usage ───────────────────────────────────────────────────────────────
  lines.push('');
  lines.push(ICON_GUIDELINES);

  // ── UX, accessibility and performance — always on ────────────────────────────
  lines.push('');
  lines.push(UX_CORE_RULES);

  // ── HTML best practices ───────────────────────────────────────────────────────
  lines.push('');
  lines.push(HTML_BEST_PRACTICES);

  return lines.join('\n');
}

// ─── BLOCKS ──────────────────────────────────────────────────────────────────

function companyBlock(b) {
  const { name, industry, tagline, description, usp } = b.basics;
  const lines = [
    `- Name: ${name}`,
    `- Industry type: ${PROMPT_DB.basics.industry[industry] ?? industry}`,
  ];
  if (tagline)     lines.push(`- Tagline (use verbatim in hero): "${tagline}"`);
  if (description) lines.push(`- Description: ${description}`);
  if (usp)         lines.push(`- USP / Alleinstellungsmerkmal: ${usp}`);
  return lines.join('\n');
}

function audienceBlock(b) {
  const a = b.basics?.audience ?? {};
  const lines = [];
  if (a.type)     lines.push(`- Audience type: ${a.type}`);
  if (a.ageRange) lines.push(`- Age range: ${a.ageRange}`);
  if (a.notes)    lines.push(`- Notes: ${a.notes}`);

  // Derived audience rules
  const isB2B = a.type === 'B2B';
  const ageMin = parseAgeLower(a.ageRange);
  if (isB2B && ageMin >= 40) {
    lines.push(`- Directive: B2B + 40+ audience. Maintain a professional, trust-focused tone. Avoid playful or overly casual elements. No emoji-heavy headlines.`);
  } else if (isB2B) {
    lines.push(`- Directive: B2B. Emphasize credibility, ROI, case studies, and client logos where available.`);
  } else if (a.type === 'B2C' && ageMin < 30) {
    lines.push(`- Directive: B2C + young audience (<30). Bolder colors and more dynamic motion are appropriate.`);
  }
  return lines.length ? lines.join('\n') : null;
}

function designBlock(b) {
  const d = b.design ?? {};
  const lines = [];

  // Color data (passed through as explicit hex values)
  if (d.colors) {
    const c = d.colors;
    const parts = [];
    if (c.primary)   parts.push(`primary=${c.primary}`);
    if (c.secondary) parts.push(`secondary=${c.secondary}`);
    if (c.accent)    parts.push(`accent=${c.accent}`);
    if (parts.length) lines.push(`- Color palette: ${parts.join(', ')}`);
  }

  // DB-driven design directives
  if (d.shape)    lines.push(`- ${lookup(PROMPT_DB.design.shape, d.shape)}`);
  if (d.level)    lines.push(`- ${lookup(PROMPT_DB.design.level, d.level)}`);
  if (d.style)    lines.push(`- ${lookup(PROMPT_DB.design.style, d.style)}`);
  if (d.tone)     lines.push(`- ${lookup(PROMPT_DB.design.tone, d.tone)}`);

  // Auto-derived font (not a user question)
  const fontHint = deriveFontFromStyle(d.style, d.tone);
  lines.push(`- Typography (auto-derived): ${fontHint}`);

  if (d.imagery)                lines.push(`- ${lookup(PROMPT_DB.design.imagery, d.imagery)}`);
  if (typeof d.darkMode === 'boolean') lines.push(`- ${lookup(PROMPT_DB.design.darkMode, String(d.darkMode))}`);
  if (d.animations)             lines.push(`- ${lookup(PROMPT_DB.design.animations, d.animations)}`);
  if (d.heroStyle)              lines.push(`- ${lookup(PROMPT_DB.design.heroStyle, d.heroStyle)}`);
  if (d.layout)                 lines.push(`- ${lookup(PROMPT_DB.design.layout, d.layout)}`);

  return lines.length ? lines.join('\n') : null;
}

function sectionsBlock(b) {
  const s = b.sections ?? {};
  const alwaysOn = ['Header + Navbar', 'Hero', 'Contact Page (/contact route)'];
  const enabled = [];
  const disabled = [];

  for (const key of ALLOWED_SECTIONS) {
    if (s[key] === true) {
      const snippet = PROMPT_DB.sections[key];
      enabled.push(snippet ? `  ✓ ${snippet}` : `  ✓ ${key}`);
    } else if (s[key] === false) {
      disabled.push(`  ✗ ${key}`);
    }
  }

  const lines = [
    `- Always include: ${alwaysOn.join(', ')}, Footer`,
    `- Footer must always appear last on the landing page.`,
  ];
  if (enabled.length)  lines.push(`- Additional sections to build:\n${enabled.join('\n')}`);
  if (disabled.length) lines.push(`- Explicitly DO NOT include:\n${disabled.join('\n')}`);

  return lines.join('\n');
}

function contentBlock(b) {
  const o = b.offering ?? {};
  const lines = [];

  if (Array.isArray(o.services) && o.services.length) {
    lines.push('- Services / Products:');
    for (const svc of o.services) {
      const parts = [svc.name];
      if (svc.description) parts.push(`— ${svc.description}`);
      if (svc.price)       parts.push(`(${svc.price})`);
      lines.push(`  • ${parts.join(' ')}`);
    }
  }
  if (o.showPrices)    lines.push(`- Price display: ${priceLabel(o.showPrices)}`);
  if (o.openingHours)  lines.push(`- Opening hours: ${o.openingHours}`);
  if (o.specials)      lines.push(`- Current specials / promotions: ${o.specials}`);

  return lines.length ? lines.join('\n') : null;
}

function contactBlock(b) {
  const c = b.contact ?? {};
  const cta = c.primaryCta ?? 'contact';
  const lines = [];

  const ctaSnippet = PROMPT_DB.cta[cta] ?? PROMPT_DB.cta.contact;
  lines.push(`- ${ctaSnippet}`);

  if (c.phone)   lines.push(`- Phone: ${c.phone}`);
  if (c.email)   lines.push(`- Email: ${c.email}`);
  if (c.address) lines.push(`- Address: ${c.address}`);
  if (c.maps)    lines.push(`- Show a map embed placeholder (gray div with a map-pin icon and the address).`);
  if (c.whatsapp && c.phone)
    lines.push(`- Include a WhatsApp button: https://wa.me/${c.phone.replace(/\D/g, '')}`);

  if (c.social) {
    const entries = Object.entries(c.social).filter(([, v]) => v);
    if (entries.length) {
      lines.push(`- Social links in footer: ${entries.map(([k, v]) => `${k}: ${v}`).join(' | ')}`);
    }
  }

  return lines.join('\n');
}

function trustBlock(b) {
  const t = b.trust ?? {};
  const lines = [];

  if (Array.isArray(t.testimonials) && t.testimonials.length) {
    lines.push('- Testimonials (use these verbatim in the testimonials section):');
    for (const x of t.testimonials) {
      const stars = x.rating ? ` [${x.rating}★]` : '';
      lines.push(`  • "${x.text}" — ${x.author ?? 'Anonym'}${stars}`);
    }
  }
  if (t.customerLogos) lines.push(`- Customer/partner logo strip: show 4–6 grayscale logo placeholder divs.`);
  if (Array.isArray(t.certificates) && t.certificates.length)
    lines.push(`- Certificates / awards: ${t.certificates.join(', ')}`);
  if (Array.isArray(t.stats) && t.stats.length) {
    lines.push('- Stats (use in stats section or hero strip):');
    for (const s of t.stats) lines.push(`  • ${s.value} — ${s.label}`);
  }
  if (Array.isArray(t.press) && t.press.length)
    lines.push(`- Press mentions: ${t.press.join(', ')}`);

  return lines.length ? lines.join('\n') : null;
}

function teamBlock(b) {
  const t = b.team ?? {};
  const lines = [];
  if (Array.isArray(t.members) && t.members.length) {
    lines.push('- Team members:');
    for (const m of t.members) {
      const parts = [m.name];
      if (m.role) parts.push(`(${m.role})`);
      if (m.bio)  parts.push(`— ${m.bio}`);
      lines.push(`  • ${parts.join(' ')}`);
    }
  }
  return lines.length ? lines.join('\n') : null;
}

function industryBlock(b) {
  const i = b.industrySpecific ?? {};
  const industry = b.basics.industry;
  const lines = [];

  if (industry === 'restaurant' || industry === 'cafe') {
    const key = industry === 'restaurant' ? 'restaurant' : 'cafe';
    lines.push(`- ${PROMPT_DB.industrySpecific[key].base}`);
    const r = i.restaurant ?? i.cafe ?? {};
    if (r.reservationLink) {
      lines.push(`- ${PROMPT_DB.industrySpecific.restaurant.reservation}`);
      lines.push(`  Reservation URL: ${r.reservationLink}`);
    }
    if (Array.isArray(r.deliveryLinks) && r.deliveryLinks.length) {
      lines.push(`- ${PROMPT_DB.industrySpecific.restaurant.delivery}`);
      lines.push(`  Delivery links: ${r.deliveryLinks.join(', ')}`);
    }
    if (r.dietaryFilters) lines.push(`- ${PROMPT_DB.industrySpecific.restaurant.dietary}`);
    if (Array.isArray(r.menu) && r.menu.length) {
      lines.push('- Menu (render in menu section):');
      for (const cat of r.menu) {
        lines.push(`  ${cat.category}:`);
        for (const item of cat.items ?? []) {
          const parts = [item.name];
          if (item.price)       parts.push(`— ${item.price}`);
          if (item.description) parts.push(`(${item.description})`);
          lines.push(`    • ${parts.join(' ')}`);
        }
      }
    }
  }

  if (industry === 'agency' || industry === 'software') {
    const key = industry === 'agency' ? 'agency' : 'software';
    lines.push(`- ${PROMPT_DB.industrySpecific[key].base}`);
    const a = i.agency ?? {};
    if (Array.isArray(a.caseStudies) && a.caseStudies.length) {
      lines.push(`- ${PROMPT_DB.industrySpecific.agency.caseStudies}`);
      for (const cs of a.caseStudies)
        lines.push(`  • ${cs.title}${cs.client ? ` — ${cs.client}` : ''}${cs.result ? ` (${cs.result})` : ''}`);
    }
    if (Array.isArray(a.techStack) && a.techStack.length) {
      lines.push(`- ${PROMPT_DB.industrySpecific.agency.techStack}`);
      lines.push(`  Stack: ${a.techStack.join(', ')}`);
    }
    if (Array.isArray(a.projects) && a.projects.length) {
      lines.push(`- ${PROMPT_DB.industrySpecific.agency.projects}`);
      for (const p of a.projects) lines.push(`  • ${p.name}: ${p.description ?? ''}`);
    }
  }

  if (industry === 'personaldienst') {
    lines.push(`- ${PROMPT_DB.industrySpecific.personaldienst.base}`);
    const p = i.personaldienst ?? {};
    if (Array.isArray(p.openPositions) && p.openPositions.length) {
      lines.push(`- ${PROMPT_DB.industrySpecific.personaldienst.positions}`);
      for (const pos of p.openPositions)
        lines.push(`  • ${pos.title}${pos.location ? ` — ${pos.location}` : ''}`);
    }
    if (p.applicationForm) lines.push(`- ${PROMPT_DB.industrySpecific.personaldienst.appForm}`);
    if (Array.isArray(p.benefits) && p.benefits.length) {
      lines.push(`- ${PROMPT_DB.industrySpecific.personaldienst.benefits}`);
      lines.push(`  Benefits: ${p.benefits.join(', ')}`);
    }
  }

  if (industry === 'handwerk') {
    lines.push(`- ${PROMPT_DB.industrySpecific.handwerk.base}`);
    const h = i.handwerk ?? {};
    if (h.serviceArea)      lines.push(`- ${PROMPT_DB.industrySpecific.handwerk.serviceArea}\n  Area: ${h.serviceArea}`);
    if (h.emergencyService) lines.push(`- ${PROMPT_DB.industrySpecific.handwerk.emergency}`);
    if (h.beforeAfter)      lines.push(`- ${PROMPT_DB.industrySpecific.handwerk.beforeAfter}`);
  }

  if (industry === 'yoga' || industry === 'fitness') {
    const key = industry;
    lines.push(`- ${PROMPT_DB.industrySpecific[key].base}`);
    const y = i.yoga ?? i.fitness ?? {};
    if (Array.isArray(y.schedule) && y.schedule.length) {
      lines.push(`- ${PROMPT_DB.industrySpecific[key].schedule}`);
      for (const s of y.schedule) lines.push(`  • ${s.day} ${s.time} — ${s.class}`);
    }
    if (Array.isArray(y.trainers) && y.trainers.length) {
      lines.push(`- ${PROMPT_DB.industrySpecific[key].trainers}`);
      for (const t of y.trainers) lines.push(`  • ${t.name}${t.specialty ? ` — ${t.specialty}` : ''}`);
    }
    if (y.trialClass) lines.push(`- ${PROMPT_DB.industrySpecific[key].trialClass}`);
  }

  if (industry === 'ecommerce') {
    lines.push(`- ${PROMPT_DB.industrySpecific.ecommerce.base}`);
    const e = i.ecommerce ?? {};
    if (Array.isArray(e.categories) && e.categories.length) {
      lines.push(`- ${PROMPT_DB.industrySpecific.ecommerce.categories}`);
      lines.push(`  Categories: ${e.categories.join(', ')}`);
    }
    if (Array.isArray(e.bestsellers) && e.bestsellers.length) {
      lines.push(`- ${PROMPT_DB.industrySpecific.ecommerce.bestsellers}`);
      lines.push(`  Bestsellers: ${e.bestsellers.join(', ')}`);
    }
    if (e.shippingInfo) {
      lines.push(`- ${PROMPT_DB.industrySpecific.ecommerce.shipping}`);
      lines.push(`  Info: ${e.shippingInfo}`);
    }
  }

  return lines.length ? lines.join('\n') : null;
}

function legalBlock(b) {
  const l = b.legal ?? {};
  const lines = [
    `- Footer must always contain: "Impressum" link (#impressum) and "Datenschutz" link (#datenschutz).`,
  ];
  if (l.imprint) lines.push(`- Impressum link confirmed required.`);
  if (l.privacy)  lines.push(`- Datenschutz link confirmed required.`);
  return lines.join('\n');
}

function seoBlock(b) {
  const s = b.seo ?? {};
  const lines = [];
  if (s.title)       lines.push(`- Page <title>: ${s.title}`);
  if (s.description) lines.push(`- Meta description: ${s.description}`);
  return lines.length ? lines.join('\n') : null;
}

function hardRulesBlock() {
  return PROMPT_DB.always.map(r => `- ${r}`).join('\n');
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function section(title, body) {
  if (!body || (typeof body === 'string' && !body.trim())) return null;
  return `## ${title}\n${body}`;
}

function lookup(map, key) {
  return map?.[key] ?? `${key}`;
}

function deepGet(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
}

function parseAgeLower(range) {
  if (!range) return 0;
  const m = String(range).match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

function priceLabel(v) {
  return { yes: 'show full prices', no: 'do not show prices', from: 'show "ab X€" style', packages: 'show package pricing' }[v] ?? v;
}
