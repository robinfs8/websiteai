// ─────────────────────────────────────────────────────────────────────────────
// prompt-db.js  —  THE ONLY FILE YOU NEED TO EDIT FOR PROMPTS
//
// STRUCTURE
// ─────────────────────────────────────────────────────────────────────────────
//
//  PROMPT_DB
//  ├── system          → preamble (role/task framing) + footer (final instruction)
//  ├── basics
//  │   ├── fields      → label templates for companyName / industry / slogan / description
//  │   └── industry    → one prompt per industry type
//  ├── design
//  │   ├── fields      → label templates for colors / typography
//  │   ├── shapeLanguage  → rounded | sharp
//  │   ├── designDirection → minimal | modern | brutalist | luxury | playful | standard
//  │   └── darkMode    → true | false
//  ├── sections
//  │   ├── meta        → structural framing labels (always-on / disabled headers)
//  │   └── [key]       → fallback snippet per section (used if SECTION_PROMPTS[key] is empty)
//  ├── cta             → one prompt per CTA type
//  ├── contact.fields  → label templates for all contact fields
//  ├── legal           → footer legal requirements
//  ├── seo.fields      → label templates for title / meta description
//  ├── uiux            → auto-derived typography / color / pattern labels
//  ├── industrySpecific → extended prompts for legacy industry types
//  └── always[]        → hard rules appended to every prompt
//
//  (exports below PROMPT_DB)
//  GLOBAL_PROMPT       → always prepended, regardless of user selections
//  SECTION_PROMPTS     → full per-section prompt, only added when section is enabled
//  deriveFontFromStyle → auto-derives font hint (logic, not prompts)
//  deriveFontPair      → picks the best Google Fonts pair (logic + data)
//  FONT_PAIRS          → Google Fonts data (used by deriveFontPair)
//  FALLBACK_PALETTES   → hex color data (used when user skips color input)
//  LANDING_PATTERNS    → page-structure hint per industry
//  UX_CORE_RULES       → always-injected UX/accessibility rules
//  HTML_BEST_PRACTICES → always-injected HTML rules
//  ICON_GUIDELINES     → always-injected icon rules
//  SECTION_DESIGN_PATTERNS → always-injected structural code reference examples
//
// HOW TO ADD A PROMPT
//   1. Find the right key below (e.g. PROMPT_DB.basics.industry.tech)
//   2. Replace the empty string "" with your instruction text
//   3. For section prompts: edit SECTION_PROMPTS[key] at the bottom of this file
//   4. For always-on rules: add to PROMPT_DB.always[]
//   5. For global context: edit GLOBAL_PROMPT
// ─────────────────────────────────────────────────────────────────────────────

export const PROMPT_DB = {
  // ─── SYSTEM ────────────────────────────────────────────────────────────────
  // preamble: prepended before all blocks — role framing.
  // footer:   appended after all blocks — final instruction.

  system: {
    preamble: `You are a senior frontend engineer and UI/UX designer specialising in production-ready static websites. Your output is always a single, valid JSON object — no markdown, no prose, no code fences.`,
    footer: `Generate the complete website now. Return ONLY the JSON object described above. No markdown fences, no comments, no text outside the JSON.`,
  },

  // ─── BASICS ────────────────────────────────────────────────────────────────

  basics: {
    fields: {
      companyName: `- Company name: {{value}}`,
      industry: `- Industry: {{value}}`,
      slogan: `- Slogan (use verbatim in hero): "{{value}}"`,
      description: `- Description: {{value}}`,
    },

    industry: {
      tech: `Tech / SaaS product. Lead with a bold value proposition. Prioritise clarity of offering, feature highlights, social proof, and conversion.`,
      agency: `Creative / digital agency. Showcase craft, portfolio, and team. Bold visual identity — the website IS the portfolio.`,
      handwerk: `Skilled trades / Handwerk (construction, electrical, plumbing, etc.). Prioritise trust, local service area, quick contact, and credentials.`,
      health: `Health, wellness, or medical practice. Trustworthy, calm tone. Lead with patient benefits, credentials, and booking.`,
      gastro: `Restaurant, café, or bar. Lead with atmosphere and food photography. Prioritise menu, location, opening hours, reservations.`,
      sport: `Fitness studio, sports club, or gym. Energetic, motivational tone. Lead with transformation, membership, and schedule.`,
      brand: `Personal brand or influencer. Authentic, distinctive visual identity. Lead with personality and offer.`,
      industry: `Industrial / B2B manufacturing or supply. Professional, reliable, precise tone. Prioritise capabilities, certifications, and contact.`,
      realestate: `Real estate agency or property developer. Premium, trust-driven aesthetics. Lead with listings, services, and expertise.`,
      education: `School, training provider, or e-learning platform. Accessible, trustworthy, inspiring tone. Lead with education and courses.`,
      event: `Event, festival, or venue. High-energy, visual, date-driven. Lead with event highlights, tickets, and schedule. `,
      nonprofit: `Non-profit or charity organisation. Mission-first, emotionally resonant. Lead with impact and call to action. `,
      corporate: `Corporate or enterprise business. Executive, confident, trustworthy tone. Lead with key services and credentials.`,
      portfolio: `Individual portfolio or personal website. Distinctive, memorable, personal. Lead with work and personality. `,
    },
  },

  // ─── DESIGN ────────────────────────────────────────────────────────────────

  design: {
    fields: {
      colors: `- Color palette: {{value}}. Use the accent color for buttons and key interactive elements. Prefer white or bright backgrounds (except dark-mode builds).`,
    },

    shapeLanguage: {
      rounded: `Use rounded shapes throughout — buttons, cards, inputs, avatars. Prefer rounded-xl (or similar) or rounded-full for interactive elements. Friendly, approachable aesthetic.`,
      sharp: `No rounded corners anywhere. All elements use sharp, straight edges — rounded-none on every component (some rounded elements like buttons are okay if used consistently). Clean, angular, precise aesthetic.`,
    },

    designDirection: {
      minimal: `MINIMAL DESIGN SYSTEM — apply these rules to every section:
• Layout: extreme whitespace as a design element. Generous section padding. Never crowd elements.
• Typography: max 2 font weights. Strong size hierarchy through scale alone — no colour or decoration.
• Colour: near-white background, one dark foreground, one optional accent strictly for CTAs. Never more.
• Components: no decorative shadows or gradients. Buttons: outlined or text-only. Dividers: hairline 1px only (or avoid dividers/borders).
• Imagery: single high-impact image or none. Decorative elements banned.
• Animation (GSAP): fade-in on scroll. Nothing else.
• Hero: a single powerful typographic statement. Optionally one image. No background gradients.`,

      modern: `MODERN DESIGN SYSTEM — apply these rules to every section:
• Layout: asymmetric and dynamic. Mix full-bleed and contained sections. Break the grid intentionally at least once (e.g. an element overlapping section boundaries). Alternate light/dark section backgrounds.
• Typography: oversized display heading. Bold weight contrast between heading and body. Two complementary fonts.
• Colour: 3-colour palette — strong primary, neutral background, punchy accent for CTAs. Use colour blocks as section backgrounds.
• Components: layered cards with subtle box-shadow. Bold pill or rectangular CTAs. Glassmorphism accent elements welcome.
• Imagery: hero background gradient mesh or subtle noise texture. Floating decorated elements for depth.
• Animation (GSAP): ScrollTrigger — elements slide in from below. Parallax on hero.
• Hero: oversized bold headline + short subhead + prominent CTA. Background: gradient mesh, dark with light text, or large imagery.`,

      brutalist: `BRUTALIST DESIGN SYSTEM — apply these rules to every section:
• Layout: intentionally raw and irregular. Exposed structural borders. Diagonal or overlapping elements. Asymmetric text blocks. Dense information without softening.
• Typography: ultra-heavy or condensed display font, uppercase headings. Hierarchy purely through scale. Monospace or grotesque fonts.
• Colour: near-black and white base + ONE aggressive accent (electric yellow, neon green, blood red). Flat fills, no gradients.
• Components: no border-radius ever (rounded-none everywhere). Thick solid borders. No shadows. Buttons: flat solid with no radius.
• Imagery: high-contrast, cropped tightly. Treat images as graphic elements. Or no images — pure typography.
• Animation (GSAP): fast, abrupt — elements snap or crash into position. Short duration (0.2-0.3s), no easing or harsh ease-in.
• Hero: enormous text, possibly bleeding off-screen. Raw, confrontational.`,

      luxury: `LUXURY DESIGN SYSTEM — apply these rules to every section:
• Layout: spacious and editorial. Whitespace IS the luxury signal — never fill all space. Photography-dominant. Symmetrical compositions.
• Typography: elegant light/thin serif for display headings. Refined sans-serif body. Max 2 fonts. Never bold for headings — use thin weight instead.
• Colour: deep navy or near-black + warm cream/ivory + warm gold or bronze accent. Never bright or saturated. Muted, considered.
• Components: thin 1-2px borders or filled backgrounds. Ghost/outline buttons. Fine hairline dividers between sections. No box shadows.
• Imagery: full-viewport hero with atmospheric photography. No placeholder colours — use styled divs with aspect ratios and a descriptive caption.
• Animation (GSAP): slow, effortless. Letter-spacing reveal on hero heading. Parallax on images. Never bouncy, never abrupt.
• Hero: full-viewport image or deeply atmospheric colour with minimal text. Brand mark prominent. Less is more.`,

      playful: `PLAYFUL DESIGN SYSTEM — apply these rules to every section:
• Layout: loose and energetic. Blob or organic shapes as background accents. Tilted/rotated decorative elements. Overlapping sections with wave dividers.
• Typography: bold rounded or expressive display font for headings. Friendly, slightly oversized. Emojis as section accents are allowed.
• Colour: bright, saturated 3-4 colour palette. Gradient fills on hero and CTA sections. Unexpected combinations (coral + teal, lime + indigo).
• Components: fully rounded — pill buttons (rounded-full), circular avatars, card border-radius 1.5rem. Bold colour fills. Coloured icon backgrounds.
• Imagery: illustrations or flat artwork preferred. Photos with coloured overlays.
• Animation (GSAP): subtle bounce on entry). Hover: scale with transition.
• Hero: big bold headline with colour-highlighted keywords (e.g. a word in a different colour). Illustration or character. Energetic and inviting.`,

      standard: `STANDARD DESIGN SYSTEM — apply these rules to every section:
• Layout: clean structured grid, consistent spacing rhythm. Clear visual hierarchy.
• Typography: reliable sans-serif. Clear size scale for H1/H2/body/caption. Accessible contrast.
• Colour: one primary brand colour, neutral greys, clear CTA accent. Professional and trustworthy.
• Components: consistent border-radius. Subtle shadows. Clear hover states on interactive elements.
• Imagery: standard product/team photography. Hero background: light colour or subtle gradient.
• Animation (GSAP): simple fade-in on scroll. Nothing distracting.
• Hero: clear headline, supporting subhead, 1-2 CTA buttons.`,
    },

    darkMode: {
      true: `Dark mode: use dark backgrounds (slate-900, zinc-900, or near-black) with white/light text throughout. Tailwind CDN — apply dark variants where needed. Adjust card backgrounds to slate-800 or similar.`,
      false: `Light mode: white or very light backgrounds are primary. Avoid black as a global background. You MAY use dark-background sections sparingly for visual contrast (e.g. a dark CTA strip or footer).`,
    },
  },

  // ─── SECTIONS ──────────────────────────────────────────────────────────────

  sections: {
    meta: {
      alwaysOn: `- Always include: Navbar, Hero, Contact Page (/contact.html), Footer`,
      footerRule: `- Footer must always appear last on the landing page.`,
      enabledHeader: `- Additional sections to build:`,
      disabledHeader: `- Explicitly DO NOT include:`,
    },

    // fallback snippets (used only if SECTION_PROMPTS[key] returns "")
    about: `About/Story section — compelling company narrative with brand values`,
    team: `Team section — member cards with photo placeholder, name, role, short bio`,
    testimonials: `Testimonials section — review cards with quote, star rating, author name and role`,
    process: `Process section — numbered step-by-step workflow or timeline`,
    portfolio: `Portfolio section — project grid with title, description, image placeholder`,
    pricing: `Pricing section — tier cards with feature lists and CTA buttons`,
    comparison: `Comparison section — feature/competitor table`,
    stats: `Stats/Trust section — key numbers with animated count-up`,
    faq: `FAQ section — accordion with 5–8 questions and answers`,
    careers: `Careers section — open position listings with apply CTA`,
    locations: `Locations section — address cards with map integration`,
    partners: `Partners section — logo row / integration grid`,
  },

  // ─── CTA ───────────────────────────────────────────────────────────────────

  cta: {
    call: `Primary CTA is a phone call. Place a prominent "Call Now" button in the navbar, hero, and before the footer. Link to tel:{{phone}}. Use a phone icon (Lucide: phone).`,
    book: `Primary CTA is booking an appointment. Place a prominent "Book Now" button in the navbar, hero, and before the footer. Link to the contact page (/contact.html#booking) or an inline booking form. Use a calendar icon (Lucide: calendar).`,
    contact: `Primary CTA is a contact form. Place a "Get in Touch" button in the navbar, hero, and before the footer — all linking to /contact.html. The contact page must include a full contact form (name, email, message, submit button).`,
    buy: `Primary CTA is a purchase action. Place a prominent "Buy Now" or "Shop" button in the navbar, hero, and before the footer. Link to the relevant product or checkout page.`,
    demo: `Primary CTA is requesting a demo. Place a "Book a Demo" or "Get a Free Demo" button in the navbar, hero, and before the footer. Link to /contact.html#demo. Use a play or monitor icon (Lucide: play-circle or monitor).`,
  },

  // ─── CONTACT FIELDS ────────────────────────────────────────────────────────

  contact: {
    fields: {
      phone: `- Phone: {{value}} — display in footer and contact page; link as tel:{{value}}`,
      email: `- Email: {{value}} — display in footer and contact page; link as mailto:{{value}}`,
      address: `- Address: {{value}} — display in footer and contact page`,
      openingHours: `- Opening hours: {{value}} — display in footer and contact page`,
      furtherLinks: `- Additional link: {{value}} — include in footer nav or contact page`,
      specials: `- Specials / promotions: {{value}} — feature prominently in hero or a dedicated banner`,
      social: `- Social media links: {{value}} — add icon links in navbar (desktop) and footer using Lucide icons`,
    },
  },

  // ─── LEGAL ─────────────────────────────────────────────────────────────────

  legal: {
    footerRequired: `The footer must include text links to /imprint.html ("Imprint") and /privacy.html ("Privacy") — these are required for law compliance. Add both pages to the "pages" JSON output with minimal placeholder content.`,
    imprintConfirmed: `Imprint page confirmed — generate /imprint.html with full content based on provided company details.`,
    privacyConfirmed: `Privacy page confirmed — generate /privacy.html with full GDPR-compliant privacy policy.`,
  },

  // ─── SEO ───────────────────────────────────────────────────────────────────

  seo: {
    fields: {
      title: `- Page <title> tag: {{value}}`,
      description: `- Meta description (max 155 chars): {{value}}`,
    },
  },

  // ─── UI/UX AUTO-DERIVED LABELS ─────────────────────────────────────────────
  // {{placeholders}} are replaced with computed values — keep them exactly.
  //
  // typography.header  → section heading line
  // typography.fonts   → {{heading}}, {{body}}
  // typography.link    → {{load}}
  // typography.apply   → {{heading}}, {{headingStack}}, {{body}}, {{bodyStack}}
  // colors             → {{industry}}, {{primary}}, {{secondary}}, {{accent}}, {{bg}}, {{fg}}, {{note}}
  // pattern            → {{pattern}}

  uiux: {
    typography: {
      header: `Typography system (apply to ALL pages consistently):`,
      fonts: `- Heading font: "{{heading}}" | Body font: "{{body}}" — load both from Google Fonts`,
      link: `- Google Fonts <link> to add in <head>: https://fonts.googleapis.com/css2?family=NAME&display=swap`,
      apply: `- Apply: font-family: '{{heading}}', {{headingStack}} for all headings (h1–h4); font-family: '{{body}}', {{bodyStack}} for body text, paragraphs, and UI labels`,
    },
    colors: `User provided colours:
- Background: {{primary}} | Text: {{secondary}} | Accent: {{accent}}
- Note: {{note}}
 Use accent strictly for CTA buttons and key highlights. Background as page base.`,
    pattern: `Page structure pattern: {{pattern}}`,
  },

  // ─── INDUSTRY-SPECIFIC ──────────────────────────────────

  industrySpecific: {
    restaurant: {
      base: `Restaurant: prioritise food photography placeholders, menu section, reservation/contact form, opening hours prominently displayed, and map on contact page.`,
      reservation: `Include an inline reservation form or a "Reserve a Table" CTA.`,
      delivery: `Include a delivery/ordering CTA with link.`,
      dietary: `Display dietary information (vegan, gluten-free, etc.) on menu items.`,
    },
    cafe: {
      base: `Café: warm, welcoming aesthetic. Feature menu highlights, opening hours, and map. Emphasise the atmosphere with rich imagery placeholders.`,
    },
    agency: {
      base: `Agency: the website must itself be a demonstration of design quality. Unique layout, portfolio grid, clear services.`,
      caseStudies: `Include case study cards with project name, client, results, and image placeholder.`,
      techStack: `Display technology/tool icons or logos used.`,
      projects: `Portfolio section with project title, description, image placeholder, and optional link.`,
    },
    software: {
      base: `Software/SaaS: clear value proposition, feature list with icons, pricing table, and social proof. Include a demo or trial CTA (if provided by user, default: /contact).`,
    },
    personaldienst: {
      base: `Staffing/HR: professional and approachable. Feature open positions, application process, and company benefits.`,
      positions: `Job listings with title, type (full/part time), location, short description.`,
      appForm: `Application form with name, email, position, CV upload (input type=file), submit.`,
      benefits: `Benefits section with icon + text pairs (Lucide icons).`,
    },
    handwerk: {
      base: `Skilled trades: trust and reliability are paramount. Display service area, certifications, emergency contact, before/after gallery.`,
      serviceArea: `Display service radius or list of covered cities/districts.`,
      emergency: `Prominent emergency hotline button if applicable.`,
      beforeAfter: `Before/after image comparison cards.`,
    },
    yoga: {
      base: `Yoga studio: calm, centred aesthetic. Feature class schedule, instructors, and trial class CTA.`,
      schedule: `Weekly class schedule table or card grid.`,
      trainers: `Instructor profiles with photo placeholder, name, speciality, bio.`,
      trialClass: `Prominent "Book a Free Trial Class" CTA.`,
    },
    fitness: {
      base: `Fitness/gym: energetic and motivational. Feature classes/services, membership pricing, trainers, and schedule.`,
      schedule: `Class schedule with day, time, class name, instructor.`,
      trainers: `Trainer profiles with photo placeholder, name, speciality.`,
      trialClass: `"Try a Free Session" or "Free 7-Day Pass" CTA. ONLY IF INFO PROVIDED BY USER!!`,
    },
  },

  // ─── ALWAYS-ON RULES ───────────────────────────────────────────────────────

  always: [
    `Every page must start with <!doctype html> and end with </html>.`,
    `Load CDN scripts in <head> (or just before </body> for GSAP/Lucide): Tailwind v4 browser CDN, GSAP CDN, Lucide CDN. Never use npm imports.`,
    `Initialise Lucide icons with lucide.createIcons() at the end of every page's <body>.`,
    `All images MUST be styled placeholder <div> elements with a defined aspect ratio, background colour, and a descriptive data-slot attribute. Never use broken <img> tags without a src, and never use external image URLs (no picsum, unsplash, etc.). Real image paths use /assets/... format.`,
    `Every text node must carry data-slot="section.element". Every image placeholder must also have data-slot.`,
    `Navigation uses real file links (/index.html, /contact.html). Never hash-only links (#), never SPA routing.`,
    `All pages must be fully responsive — mobile hamburger menu, scaled typography, stacked grids. Test every layout at 375px and 1280px widths.`,
  ],
};

// ─── GLOBAL PROMPT ─────────────────────────────────────────────────────────────
// Added to every generation before the per-block content.

export const GLOBAL_PROMPT = `You are generating a JSON representation of a multi-page static website package.
Return ONLY JSON in THIS EXACT FORMAT — no markdown fences, no prose, no explanations:
{
  "pages": {
    "index.html": "<!doctype html>...full HTML document...</html>",
    "contact.html": "<!doctype html>...full HTML document...</html>"
  },
  "assets": {
    "hero.jpg": "placeholder"
  },
  "slots": {
    "hero.title": "Willkommen",
    "hero.subtitle": "Wir bauen Software",
    "contact.address": "Musterstraße 1"
  }
}

OUTPUT CONTRACT:
- pages  = complete HTML5 documents (<!doctype html> … </html>), one per page
- assets = expected image paths, always with value "placeholder"
- slots  = every editable text node, keyed as section.element (e.g. hero.title)

ABSOLUTE RULES — violation is not acceptable:
1. Every page starts with <!doctype html> and ends with </html>.
2. Use ONLY HTML + CSS + the following CDN libraries. NO npm, NO React/Vue/Angular, NO Bootstrap, NO framer-motion:
   Tailwind CSS v4:  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
   GSAP 3.10:        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/gsap.min.js"></script>
   Lucide icons:     <script src="https://unpkg.com/lucide@latest"></script>
   Leaflet/maps:     <script type="module" src="https://cdn.jsdelivr.net/npm/leaflet-html@0.13.11/+esm"></script>
2.1 For the Website Design: never ever copy something. ALWAYS MAKE THE WEBSITE UNIQUE for the specific business. Cards, layouts, elemts must be unique, but still well structured and aesthetically pleasing.
3. Navigation uses only real file links (/index.html, /contact.html, /imprint, /privacy,...). Never hash-only links, never SPA routing.
4. Every text node must carry data-slot="section.element". Every image placeholder must have data-slot too.
5. All images are styled placeholder <div> elements with aspect ratio and a descriptive label. Never broken <img> tags. Asset paths use /assets/...
6. Call lucide.createIcons() at the end of every page body to render Lucide icons.
7. Use as much user content as possible.
8. Always use the language of the user inputs for the whole website. 
9. Return plain JSON only — no markdown fences, no explanations, no text outside the JSON object.`;

// ─── SECTION PROMPTS ───────────────────────────────────────────────────────────
// One function per optional section.
// Called ONLY when the user has enabled that section (enabled === true).
// data = the section's object from the brief, e.g. { enabled: true, story: "..." }
//
// If a function returns "" the builder falls back to PROMPT_DB.sections[key].

export const SECTION_PROMPTS = {
  // ── ABOUT / STORY ────────────────────────────────────────────────────────────
  about: (data) => {
    const story = data.story?.trim();
    return `ABOUT / STORY SECTION:
- Layout: split layout (text left, image placeholder right) or full-width editorial block depending on design style. UNIQUE ALWAYS, these are just inspirational examples.
- Content: ${
      story
        ? `use this exact story verbatim: "${story}"`
        : `AI generates a compelling 2–3 paragraph brand story based on the brief — focus on origin, mission, and what makes them unique.`
    }
- Include: company values or key differentiators as 3 icon+text bullet points (Lucide icons).
- Tone: match the overall design direction — warm for playful/health, authoritative for luxury/corporate, raw for brutalist.
- Minimal/luxury: heavy whitespace, large quote or pull-quote element.
- Modern/standard: side-by-side text and image placeholder.
- Brutalist: bold statement text, exposed raw layout.`;
  },

  // ── TEAM ─────────────────────────────────────────────────────────────────────
  team: (data) => {
    const members = data.members?.trim();
    return `TEAM SECTION:
- Layout: responsive grid (3-4 columns desktop, 2 tablet, 1 mobile). Each card: circular or rounded image placeholder, name, role/title, 1-line bio. UNIQUE and adjust ALWAYS, these are just inspirational examples.
- ${
      members
        ? `Use these exact team members verbatim (one per line): "${members}"`
        : `AI generates 3–4 realistic team members appropriate for the industry and company size.`
    }
- Card style: match design direction — ghost border cards for luxury/minimal, coloured header cards for playful, stark high-contrast for brutalist.
- Optional: LinkedIn icon link per card (Lucide: linkedin).
- Animate: stagger cards on scroll (GSAP, opacity + translateY,...).`;
  },

  // ── TESTIMONIALS / REVIEWS ───────────────────────────────────────────────────
  testimonials: (data) => {
    const reviews = data.reviews?.trim();
    return `TESTIMONIALS / REVIEWS SECTION:
- Layout: responsive grid (2-3 columns desktop, 1 mobile) of review cards. Each card: 5-star rating (5 Lucide "star" icons, fill-amber-400), quote text (italic), author name + company/role. UNIQUE and adjust ALWAYS, these are just inspirational examples.
Code example:
━━━ TESTIMONIAL CARD REFERENCE PATTERN ━━━
<div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
  <!-- Star rating using Lucide icons -->
  <div class="flex gap-1" aria-label="5 out of 5 stars">
    <i data-lucide="star" class="w-4 h-4 fill-amber-400 text-amber-400"></i>
    <i data-lucide="star" class="w-4 h-4 fill-amber-400 text-amber-400"></i>
    <i data-lucide="star" class="w-4 h-4 fill-amber-400 text-amber-400"></i>
    <i data-lucide="star" class="w-4 h-4 fill-amber-400 text-amber-400"></i>
    <i data-lucide="star" class="w-4 h-4 fill-amber-400 text-amber-400"></i>
  </div>
  <!-- Quote -->
  <blockquote class="text-slate-600 text-sm leading-relaxed italic" data-slot="testimonials.quote1">
    "The best decision we made — results exceeded expectations."
  </blockquote>
  <!-- Author -->
  <div class="flex items-center gap-3 mt-auto">
    <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-500" data-slot="testimonials.avatar1">JD</div>
    <div>
      <p class="font-semibold text-slate-900 text-sm" data-slot="testimonials.name1">Jane Doe</p>
      <p class="text-slate-400 text-xs" data-slot="testimonials.role1">CEO, Acme GmbH</p>
    </div>
  </div>
</div>
Never use the code (ANY CODE IN THIS PROMPT) exactly like it is provided here. Always adapt and make it unique for this specific business.
- ${
      reviews
        ? `Use these exact reviews verbatim: "${reviews}"`
        : `AI generates 3–4 realistic, industry-appropriate reviews with full names, roles, and companies.`
    }
- Card style: white cards with shadow for standard/modern; thin-border ghost cards for luxury/minimal; raw bordered blocks for brutalist; rounded colourful cards for playful.
- Consider a large opening quote mark (") as a decorative typographic element.
- Optional: overall rating badge (e.g. "4.8 / 5 based on 120 reviews") as a section header element.
- Animate: fade in on scroll with stagger.`;
  },

  // ── PROCESS / HOW IT WORKS ───────────────────────────────────────────────────
  process: (data) => {
    const description = data.description?.trim();
    return `PROCESS / HOW IT WORKS SECTION:
- Layout: horizontal numbered steps on desktop (connected with a line or arrow), stacked on mobile. UNIQUE and adjust ALWAYS, these are just inspirational examples.
- ${
      description
        ? `Use these exact process steps verbatim: "${description}"`
        : `AI creates 3–5 clear, action-oriented steps appropriate for the industry.`
    }
- Each step: large number or icon (Lucide), step title (bold), 1–2 sentence description.
- Connector: a thin line or arrow (CSS border or Lucide "arrow-right") between steps on desktop.
- Style: adapt to design direction — ultra-clean numbering for minimal/luxury; bold oversized numbers for brutalist/modern; icon-forward colourful steps for playful.`;
  },

  // ── PORTFOLIO / PROJECTS ─────────────────────────────────────────────────────
  portfolio: (data) => {
    const projects = data.projects?.trim();
    return `PORTFOLIO / PROJECTS SECTION:
- Layout: masonry or 2-3 column grid on desktop, single column on mobile. Each item: image placeholder (16:9 or 4:3 ratio), project title, category tag, short description. UNIQUE and adjust ALWAYS, these are just inspirational examples.
- ${
      projects
        ? `Use these exact projects verbatim: "${projects}"`
        : `AI generates 4–6 representative project placeholders appropriate for the industry.`
    }
- Hover effect: overlay with project title and a "View Project" link (Lucide: external-link icon) (only if link provided).
- Filtering: optional category filter buttons above the grid if multiple categories exist.
- Animate: grid items fade in with stagger on scroll.`;
  },

  // ── PRICING ──────────────────────────────────────────────────────────────────
  pricing: (data) => {
    const details = data.details?.trim();
    return `PRICING / SERVICES SECTION:
- Layout: 2–4 pricing tier cards in a row (desktop), stacked (mobile). Most popular tier visually elevated (larger, coloured background, or "Popular" badge). UNIQUE and adjust ALWAYS, these are just inspirational examples.
- ${
      details
        ? `Use these exact prices and inclusions verbatim: "${details}"`
        : `AI creates appropriate pricing tiers for the industry with realistic price points and feature lists.`
    }
- Each card: tier name, price (with period — /month, /project, etc.), feature list with checkmark icons (Lucide: check), CTA button.
- Style: adapt to design direction — ghost border cards for luxury; coloured highlight card for modern/playful; raw bordered tiers for brutalist.
- Include a "Questions? Contact us" link below the cards.`;
  },

  // ── COMPARISON ───────────────────────────────────────────────────────────────
  comparison: (data) => {
    const compData = data.data?.trim();
    return `COMPARISON / FEATURE TABLE SECTION:
- Layout: responsive table (columns = options, rows = features). On mobile: horizontally scrollable or card-based comparison. UNIQUE and adjust ALWAYS, these are just inspirational examples.
- ${
      compData
        ? `Use this exact comparison data verbatim: "${compData}"`
        : `AI builds a feature comparison table highlighting the company's key advantages over generic alternatives.`
    }
- Use Lucide icons: "check" (green) for supported features, "x" (red/grey) for unsupported.
- Visually highlight the company's column as the preferred option (coloured header, border accent).`;
  },

  // ── STATS / TRUST ─────────────────────────────────────────────────────────────
  stats: (data) => {
    const statsData = data.data?.trim();
    return `STATS / TRUST SECTION:
- Layout: horizontal row of 3–5 stat blocks (desktop), 2-column grid (mobile). Each block: large number/stat, label below. UNIQUE and adjust ALWAYS, these are just inspirational examples.
- ${
      statsData
        ? `Use these exact numbers and labels verbatim: "${statsData}"`
        : `AI creates impactful, industry-appropriate trust statistics (e.g. years in business, clients served, projects completed, satisfaction rate).`
    }
- Animate: GSAP counter animation — numbers count up from 0 to final value on scroll entry.
- Style: bold oversized numbers (4–6rem) in primary or accent colour. Clean label below in body font.
- Optional: thin border separators between stats.`;
  },

  // ── FAQ ───────────────────────────────────────────────────────────────────────
  // eslint-disable-next-line no-unused-vars
  faq: () => {
    return `FAQ SECTION:
- Layout: accordion list. Each item: question as a clickable row (bold text + Lucide "chevron-down" icon), answer expands below on click.
- Content: AI generates 6–8 genuinely useful questions and answers based on the industry and company brief. NEVER MADE UP CONTENT!
- Interaction: toggle open/close on click via JavaScript. Only one item open at a time.
- Style: clean dividers between questions. Match design direction — wide generous rows for luxury/minimal; tight dense rows for brutalist/standard.`;
  },

  // ── CAREERS ──────────────────────────────────────────────────────────────────
  careers: (data) => {
    const jobs = data.jobs?.trim();
    return `CAREERS / JOBS SECTION:
- Layout: list of job cards. Each card: job title, employment type (Full-time/Part-time/Remote), location, short description, "Apply Now" CTA button. FOCUS ON USER PROVIDED CONTENT!
- ${
      jobs
        ? `Use these exact job listings verbatim: "${jobs}"`
        : `AI creates 3–4 example open positions appropriate for the industry.`
    }
- CTA links to /contact.html#careers or includes an inline application form (name, email, position, message, submit).
- Optional: intro paragraph on company culture above the job listings.`;
  },

  // ── LOCATIONS ────────────────────────────────────────────────────────────────
  locations: (data) => {
    const addresses = data.addresses?.trim();
    return `LOCATIONS / BRANCHES SECTION:
- Layout: grid of location cards (2–3 columns desktop, 1 mobile) + optional custom Leaflet map below. UNIQUE and adjust ALWAYS, these are just inspirational examples.
- ${
      addresses
        ? `Use these exact addresses verbatim: "${addresses}"`
        : `AI creates a placeholder location display.`
    }
- Each card: location name, full address, (phone number), opening hours.
- If a map is included: use Leaflet/OpenStreetMap with the leaflet-html CDN module. Place a marker at each location. Do NOT place info-text as an overlay directly on the map — use the cards instead.`;
  },

  // ── PARTNERS / LOGOS ─────────────────────────────────────────────────────────
  partners: (data) => {
    const names = data.names?.trim();
    return `PARTNERS / INTEGRATIONS / LOGOS SECTION:
- Layout: horizontal scrolling row or responsive grid of logo placeholders. Each placeholder: styled div with brand name as text (since we cannot load external logos) or image placeholders. UNIQUE and adjust ALWAYS, these are just inspirational examples.
- ${
      names
        ? `Use these exact partner/integration names verbatim: "${names}"`
        : `AI creates representative partner names appropriate for the industry.`
    }
- Style: greyscale or low-opacity logos that gain full colour on hover (use CSS filter + transition).
- Optional intro text: "Trusted by / Works with / Integrates with" heading above the logo row.`;
  },
};

// ─── FONT DERIVATION ───────────────────────────────────────────────────────────

export function deriveFontFromStyle(style, tone) {
  const byStyle = {
    brutalist: { hint: `monospace or heavy display typeface` },
    minimal: { hint: `clean geometric sans-serif, 1–2 weights only` },
    editorial: { hint: `serif heading + clean sans-serif body` },
    classic: {
      hint: `classic serif for headings, readable serif or sans for body`,
    },
    playful: { hint: `friendly rounded or display typeface — bold and warm` },
    glassmorphism: { hint: `modern sans-serif, medium/bold weights` },
    modern: { hint: `clean modern sans-serif with clear weight contrast` },
    luxury: {
      hint: `elegant thin serif for titles, refined sans-serif for texts`,
    },
    standard: { hint: `clean, legible sans-serif — neutral and universal` },
  };
  if (byStyle[style]) return byStyle[style].hint;
  if (tone === "luxurious" || tone === "formal")
    return `elegant serif for headings, refined sans-serif for body`;
  if (tone === "youthful" || tone === "playful")
    return `bold display or rounded sans-serif`;
  if (tone === "professional") return `clean sans-serif with weight contrast`;
  return `clean modern sans-serif`;
}

// ─── APPROVED FONTS LIST ──────────────────────────────────────────────────────
// Always included in every prompt so the AI picks only from these Google Fonts.

export const APPROVED_FONTS = `APPROVED GOOGLE FONTS — only use fonts from this list:

Sans-serif / text fonts:
Inter, Roboto, Open Sans, Lato, Montserrat, Poppins, Oswald, Raleway, Ubuntu,
Nunito, Rubik, Work Sans, Quicksand, Fira Sans, PT Sans, Karla, Heebo, Arimo,
Libre Franklin, Josefin Sans, Barlow, Titillium Web, Manrope, DM Sans, Outfit,
IBM Plex Sans, Plus Jakarta Sans, Kanit, Cabin, Public Sans

Display / serif / accent / playful fonts:
Abril Fatface, Righteous, Anton, Archivo Black, Bebas Neue, Cinzel, Lobster,
Playfair Display, Merriweather, Lora, Fraunces, Cormorant Garamond, Crimson Pro,
EB Garamond, DM Serif Display, Space Grotesk, Syne, JetBrains Mono, Bungee Spice,
Michroma, Syncopate, Unbounded, Comfortaa, Fredoka, Baloo 2

Google Fonts <link> format (always load chosen fonts in <head>):
<link href="https://fonts.googleapis.com/css2?family=FONT+NAME:wght@WEIGHTS&display=swap" rel="stylesheet">
Example: <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">

Never invent or use a font not on this list.`;

// ─── LANDING PATTERNS ──────────────────────────────────────────────────────────

export const LANDING_PATTERNS = {
  tech: `Hero (bold value prop + demo CTA if USER PROVIDES SUCH INFO) → Social proof bar (logos) → Features grid → How it works (steps) → Pricing → Testimonials → Final CTA strip → Footer`,
  agency: `Hero (statement + reel/portfolio link) → Selected work grid → Services list → About/Team → Testimonials → Contact CTA → Footer`,
  handwerk: `Hero (service + local area + call CTA) → Services grid → Why Us (3 trust points) → Testimonials → Service area map → Contact CTA → Footer`,
  health: `Hero (patient benefit + booking CTA if USER PROVIDES SUCH INFO) → Services cards → Team profiles → Testimonials → FAQ → Booking CTA → Footer`,
  gastro: `Hero (atmosphere + reservation CTA) → Menu highlights → About/Story → Gallery → Hours & Location → Reservation CTA → Footer`,
  sport: `Hero (motivation + trial CTA if USER PROVIDES SUCH INFO) → Services/Classes → Benefits strip → Pricing → Trainers → Schedule → CTA → Footer`,
  brand: `Hero (personal statement) → About → Services/Offerings → Portfolio/Work → Testimonials → Contact → Footer`,
  industry: `Hero (capability + contact CTA) → Products/Services → Industries served → Capabilities → Certifications/Trust → Contact → Footer`,
  realestate: `Hero (search bar or featured property + CTA) → Featured listings grid → Services → Team → Testimonials → Contact → Footer`,
  education: `Hero (outcome promise + enrol CTA if USER PROVIDES SUCH INFO) → Courses/Programmes → Benefits → Instructors → Testimonials → FAQ → Enrol CTA → Footer`,
  event: `Hero (event name + date + tickets CTA) → About the event → Line-up/Programme → Tickets/Pricing → Venue/Location → Sponsors → FAQ → Footer`,
  nonprofit: `Hero (mission statement + donate CTA if USER PROVIDES SUCH INFO) → Impact stats → How to help (donate/volunteer/partner) → News/Stories → Partners → Donate CTA → Footer`,
  corporate: `Hero (positioning + contact CTA) → Key services → Key figures/stats → Leadership → Partners/Clients → Contact → Footer`,
  portfolio: `Hero (name + role + work CTA) → Selected projects grid → Skills/About → Testimonials → Contact → Footer`,
  other: `Hero → Services/Features → About → Testimonials → CTA → Footer`,
};

// ─── UX CORE RULES ─────────────────────────────────────────────────────────────

export const UX_CORE_RULES = `UX & VISUAL QUALITY RULES (apply to every section):

Spacing:
- Use a consistent spacing grid. Sectional vertical padding.
- Never let text or elements touch container edges.
- Spacing should feel proportional to the element size (buttons get tight padding, sections get generous padding).

Typography:
- Max 2 font families per site. Mixing 3+ fonts is banned.
- Heading hierarchy: H1 (hero, largest) → H2 (section titles) → body → caption.
- Serif fonts: headings or rare accent only. Never set body text in serif unless the design direction is editorial/luxury.
- Use italic and font-weight variation freely — they add character without adding fonts.

Colour:
- Apply the 3-colour rule: background (60%), text (30%), accent (CTAs and highlights only).
- Accent colour must not be overused — restrict to buttons, icons, and one highlight per section.
- Primary background: white or very light. Exception: dark-mode builds.
- Accessible contrast.

Animations (GSAP — CDN only, no plugins unless ScrollTrigger which is bundled in GSAP 3):
- Entrance: elements animate in on scroll.
- NEVER use "shaky", heavy bounce, or rapid jitter animations — always smooth and purposeful.
- Respect user motion preferences.

Interactive states:
- Every button and link must have a visible hover state (colour shift, opacity, or subtle scale).
- Active/pressed buttons: slight scale or background darken.
- No hover effects on touch-only devices.`;

// ─── HTML BEST PRACTICES ────────────────────────────────────────────────────────

export const HTML_BEST_PRACTICES = `HTML & CODE QUALITY RULES:

Structure:
- Semantic HTML: use <header>, <nav>, <main>, <section>, <article>, <aside>, <footer> appropriately.
- Every section needs a unique id attribute for anchor linking and scroll-to.
- <title> and <meta name="description"> must be populated in every page's <head>.
- Viewport meta tag required: <meta name="viewport" content="width=device-width, initial-scale=1">.

CDN scripts (load in this order, in <head> or just before </body>):
  1. <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  2. <link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet"> (Google Fonts)
  3. <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/gsap.min.js"></script>
  4. <script src="https://unpkg.com/lucide@latest"></script>
  5. Leaflet (only on pages with maps): <script type="module" src="https://cdn.jsdelivr.net/npm/leaflet-html@0.13.11/+esm"></script>

No npm imports. No React, Vue, Angular. No Bootstrap. No external JS beyond the CDNs listed.

Lucide icons:
- Render icons with: <i data-lucide="icon-name" class="w-5 h-5"></i>
- At end of <body>, call: <script>lucide.createIcons();</script>
- Always set explicit width/height classes on icon elements.

Images:
- ALL images must be styled <div> placeholder elements — never a broken <img> tag.
- Example: <div class="w-full aspect-video bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm" data-slot="hero.image">Hero Image</div>
- Use /assets/filename.jpg format for real image paths when the user provides them.

Forms:
- Contact form fields: name="name", name="email", name="message" minimum. Add honeypot field. Always mailto function.
- All inputs need <label> elements (for accessibility).
- Contact form only in /contact page.

Responsive design:
- Mobile-first Tailwind classes. Every layout must work at mobile desktop.
- Use Tailwind responsive prefixes: sm:, md:, lg:, xl: for breakpoints.
- Mobile hamburger menu: hidden on desktop (lg:hidden), visible on mobile. Toggle with JavaScript.
- Grids: grid-cols-1 on mobile → grid-cols-2 md:grid-cols-3 on desktop (adjust per content).`;

// ─── ICON GUIDELINES ────────────────────────────────────────────────────────────

export const ICON_GUIDELINES = `ICON USAGE:
- Primary icon library: Lucide (CDN). Render with <i data-lucide="icon-name" class="w-5 h-5 text-current"></i>.
- Fallback: inline SVG (only if the required icon is not available in Lucide or you are not sure).
- Never use emoji as structural icons (only as decorative accents in playful designs).
- Common Lucide icons for reference: menu, x, chevron-down, arrow-right, check, star, phone, mail, map-pin, calendar, clock, users, building, briefcase, heart, shield, zap, instagram, linkedin, facebook, youtube, twitter, external-link, play-circle, monitor, send.`;

// ─── SECTION DESIGN PATTERNS ────────────────────────────────────────────────────
// Structural code reference examples — always included in every prompt.
// These are REFERENCE PATTERNS ONLY. Adapt them heavily to match the design direction.
// NEVER copy them verbatim — your design must be unique to the brand.

export const SECTION_DESIGN_PATTERNS = `SECTION STRUCTURE REFERENCE PATTERNS
These are structural guides only. Adapt to the design direction — never copy literally!!!

━━━ NAVBAR REFERENCE PATTERN ━━━
<header class="fixed top-0 w-full z-50 backdrop-blur-sm bg-white/90 border-b border-slate-200">
  <nav class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    <a href="/index.html" class="font-bold text-xl tracking-tight" data-slot="nav.brand">Brand</a>
    <!-- Desktop links (hidden on mobile) -->
    <ul class="hidden lg:flex items-center gap-8 text-sm font-medium">
      <li><a href="#services" class="text-slate-600 hover:text-primary transition-colors">Services</a></li>
      <li><a href="#about" class="text-slate-600 hover:text-primary transition-colors">About</a></li>
      <li><a href="/contact.html" class="text-slate-600 hover:text-primary transition-colors">Contact</a></li>
    </ul>
    <!-- Desktop CTA -->
    <a href="/contact.html" class="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
      <i data-lucide="send" class="w-4 h-4"></i> Get in Touch
    </a>
    <!-- Mobile hamburger -->
    <button id="nav-toggle" class="lg:hidden p-2 rounded-md" aria-label="Open menu" aria-expanded="false">
      <i data-lucide="menu" class="w-6 h-6"></i>
    </button>
  </nav>
  <!-- Mobile fullscreen menu -->
  <div id="mobile-menu" class="hidden fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-10 text-xl font-medium">
    <button id="nav-close" class="absolute top-5 right-6" aria-label="Close menu">
      <i data-lucide="x" class="w-7 h-7"></i>
    </button>
    <a href="#services" class="hover:text-primary transition-colors">Services</a>
    <a href="#about" class="hover:text-primary transition-colors">About</a>
    <a href="/contact.html" class="hover:text-primary transition-colors">Contact</a>
    <a href="/contact.html" class="mt-4 px-8 py-3 rounded-full bg-primary text-white text-base">Get in Touch</a>
  </div>
</header>
<script>
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  const close = document.getElementById('nav-close');
  toggle?.addEventListener('click', () => { menu.classList.remove('hidden'); menu.classList.add('flex'); toggle.setAttribute('aria-expanded','true'); });
  close?.addEventListener('click', () => { menu.classList.add('hidden'); menu.classList.remove('flex'); toggle.setAttribute('aria-expanded','false'); });
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { menu.classList.add('hidden'); menu.classList.remove('flex'); }));
</script>
EXAMPLES for design adaptation:
- remove backdrop-blur, use thin border-b only, increase whitespace, reduce nav link weight.
- floating navbar with box-shadow, offset from top (mt-4 with rounded-xl max-w container).
- thick border-b (border-b-4 border-black), full black bg, white text, no blur.
- coloured background, rounded-2xl floating pill shape, logo with illustration.
NEVER EVER USE THE CODE ABOVE More than 60%!

- Hero:
<section class="text-gray-600 body-font">
  <div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
    <div class="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
      <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Before they sold out
        <br class="hidden lg:inline-block">readymade gluten
      </h1>
      <p class="mb-8 leading-relaxed">Copper mug try-hard pitchfork pour-over freegan heirloom neutra air plant cold-pressed tacos poke beard tote bag. Heirloom echo park mlkshk tote bag selvage hot chicken authentic tumeric truffaut hexagon try-hard chambray.</p>
      <div class="flex justify-center">
        <button class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
        <button class="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">Button</button>
      </div>
    </div>
    <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
      <img class="object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x600">
    </div>
  </div>
</section>
You can also show the picture above the text, as background (with blur), inside a mockup pr without any picture. Always show a CTA Button (dfault: link to /contact).

-- Breadcrumbs--
If the user is on a different page (like /contact), use Breadcrumbs under the navbar (or as part of the navbar) but always hide in homepage.
<nav aria-label="Breadcrumb">
  <ol class="flex items-stretch gap-2 list-none">
    <li class="items-center hidden gap-2 md:flex">
      <a href="#" class="flex max-w-[20ch] items-center gap-1 truncate whitespace-nowrap text-slate-700 transition-colors hover:text-emerald-500">Home</a>
      <svg xmlns="http://www.w3.org/2000/svg" class="flex-none w-4 h-4 transition-transform stroke-slate-700 md:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true" aria-labelledby="title-01 description-01" role="graphics-symbol">
        <title id="title-01">Arrow</title>
        <desc id="description-01">
          Arrow icon that points to the next page in big screen resolution sizes
          and previous page in small screen resolution sizes.
        </desc>
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </li>
    <li class="items-center hidden gap-2 md:flex">
      <a href="#" class="flex max-w-[20ch] items-center gap-1 truncate whitespace-nowrap text-slate-700 transition-colors hover:text-emerald-500">Projects</a>
      <svg xmlns="http://www.w3.org/2000/svg" class="flex-none w-4 h-4 transition-transform stroke-slate-700 md:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true" aria-labelledby="title-02description-02" role="graphics-symbol">
        <title id="title-02">Arrow</title>
        <desc id="description-02">
          Arrow icon that points to the next page in big screen resolution sizes
          and previous page in small screen resolution sizes.
        </desc>
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </li>
    <li class="flex items-center gap-2">
      <a href="#" class="flex max-w-[20ch] items-center gap-1 truncate whitespace-nowrap text-slate-700 transition-colors hover:text-emerald-500">UI components</a>
      <svg xmlns="http://www.w3.org/2000/svg" class="flex-none w-4 h-4 transition-transform stroke-slate-700 md:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true" aria-labelledby="title-03description-03" role="graphics-symbol">
        <title id="title-03">Arrow</title>
        <desc id="description-03">
          Arrow icon that points to the next page in big screen resolution sizes
          and previous page in small screen resolution sizes.
        </desc>
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </li>
    <li class="flex items-center flex-1 gap-2">
      <a href="#" aria-current="page" class="pointer-events-none max-w-[20ch] items-center gap-1 truncate whitespace-nowrap text-slate-400">Project</a>
    </li>
  </ol>
</nav>

━━━ FOOTER REFERENCE PATTERN ━━━
<footer class="bg-slate-900 text-slate-300 pt-16 pb-8">
  <div class="max-w-7xl mx-auto px-6">
    <!-- Main footer grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
      <!-- Brand column -->
      <div class="col-span-2 md:col-span-4 lg:col-span-2">
        <p class="font-bold text-white text-xl mb-3" data-slot="footer.brand">Brand</p>
        <p class="text-sm leading-relaxed text-slate-400 max-w-xs" data-slot="footer.tagline">Short brand tagline or description.</p>
        <!-- Social icons -->
        <div class="flex gap-4 mt-6">
          <a href="#" aria-label="Instagram" class="hover:text-white transition-colors">
            <i data-lucide="instagram" class="w-5 h-5"></i>
          </a>
          <a href="#" aria-label="LinkedIn" class="hover:text-white transition-colors">
            <i data-lucide="linkedin" class="w-5 h-5"></i>
          </a>
        </div>
      </div>
      <!-- Nav column -->
      <nav aria-label="Services">
        <h3 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Services</h3>
        <ul class="space-y-2 text-sm">
          <li><a href="#" class="hover:text-white transition-colors" data-slot="footer.service1">Service One</a></li>
          <li><a href="#" class="hover:text-white transition-colors" data-slot="footer.service2">Service Two</a></li>
        </ul>
      </nav>
      <!-- Company column -->
      <nav aria-label="Company">
        <h3 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
        <ul class="space-y-2 text-sm">
          <li><a href="#about" class="hover:text-white transition-colors">About</a></li>
          <li><a href="/contact.html" class="hover:text-white transition-colors">Contact</a></li>
        </ul>
      </nav>
      <!-- Contact column -->
      <nav aria-label="Contact info">
        <h3 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Get in touch</h3>
        <ul class="space-y-2 text-sm">
          <li class="flex items-center gap-2"><i data-lucide="mail" class="w-4 h-4 shrink-0"></i><a href="mailto:#" class="hover:text-white transition-colors" data-slot="footer.email">email@brand.de</a></li>
          <li class="flex items-center gap-2"><i data-lucide="phone" class="w-4 h-4 shrink-0"></i><a href="tel:#" class="hover:text-white transition-colors" data-slot="footer.phone">+49 000 000</a></li>
        </ul>
      </nav>
    </div>
    <!-- Sub-footer legal row -->
    <div class="pt-8 border-t border-slate-800 flex flex-wrap justify-between items-center gap-4 text-sm text-slate-400">
      <p data-slot="footer.copyright">&copy; 2024 Brand. Alle Rechte vorbehalten.</p>
      <nav class="flex gap-6">
        <a href="/impressum.html" class="hover:text-white transition-colors">Impressum</a>
        <a href="/datenschutz.html" class="hover:text-white transition-colors">Datenschutz</a>
      </nav>
    </div>
  </div>
</footer>
Examples for design adaptation:
- use near-black bg (not slate-900), cream text, thin dividers, no uppercase labels.
- white footer with dark text, very sparse — just logo, legal, and 3 links max.
- black bg, white bold text, thick top border, exposed grid lines.
- coloured bg (primary dark tint), larger social icons, rounded footer top edge.
NEVER EVER USE THE CODE ABOVE More than 60%!

━━━ ANTI-PATTERNS — NEVER DO THESE ━━━
- Abstract node/blob/network decorative elements (banned entirely)
- Generic SaaS "floating dashboard" mockup visuals
- Flat solid hero backgrounds (exception: minimalist or luxury styles only)
- Broken image <img> tags or placeholder text "Image here" without a styled div
- Large blocking modals or overlays on page load
- Info text overlaid directly on top of a map (always use separate cards)
- Low-contrast text (grey on white below WCAG AA)
- Inconsistent spacing (mixing 12px gaps and 40px gaps in the same section)
- Missing /contact.html page or missing CTA in navbar and hero
- if you think that some element or section part is broken or you are not sure if the code will be displayed corretly, do not use it. Instead, focus then on Interface Guidelines and common practises to make sure content gets displayed clean and without errors.

━━━ ALWAYS DO ━━━
- Every image slot is a styled placeholder <div> with correct aspect-ratio and data-slot
- 3-colour palette applied consistently across all sections
- Fully responsive: mobile hamburger, scaled typography, stacked grids at 375px
- Navbar CTA + Hero CTA + pre-footer CTA all link to /contact.html
- lucide.createIcons() called at bottom of every page body
- data-slot on every text node and image placeholder!
- page and link to /imprint and /privacy in footer (for imrint use user information, privacy make sure to metion that hosting operated by OceanAI but hosting service is Vercel. No data collected (except vercel probably).)
FOCUS AND DO YOUR BEST ON DESIGN!!
POLISH THE FUCKING DESIGN!! MAKE IT UNIQUE, but still CLEAN and STRUCTURED`;
