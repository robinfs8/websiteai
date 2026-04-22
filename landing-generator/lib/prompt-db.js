// Predefined prompt snippets, organized by schema section → field → answer value.
// Each entry maps a user's selection to a concrete LLM instruction.
// The prompt-builder assembles these into the final prompt — the actual content/quality
// of each snippet can be refined without touching any other logic.

export const PROMPT_DB = {

  // ─── BASICS ──────────────────────────────────────────────────────────────────

  basics: {
    industry: {
      software:       'Software/SaaS company. Use a product-focused layout: feature-highlight grid, abstract mockup in hero, clean tech aesthetic. Emphasize reliability and capability.',
      agency:         'Creative or digital agency. Hero should convey ambition and craft. Portfolio/case-studies and process are key sections. Show results, not just services.',
      restaurant:     'Restaurant. Food is the hero — appetizing imagery throughout, menu section near the top, reservation CTA front and center in hero and sticky navbar.',
      cafe:           'Café or coffee shop. Warm, inviting atmosphere. Menu, opening hours, and daily specials are key. Photography should feel cozy and authentic.',
      yoga:           'Yoga or wellness studio. Calm, centered design. Class schedule and free trial class CTA are the primary conversion points.',
      fitness:        'Fitness/gym/sports facility. Energetic visuals. Schedule, membership pricing, and a trial offer are front and center.',
      handwerk:       'Trades/skilled labor business. Phone number must appear in the header AND prominently in the hero. Certifications and years of experience are key trust signals.',
      personal:       'Personal brand or freelancer. Single-person voice throughout. Portfolio or services section, with contact as the primary CTA.',
      ecommerce:      'E-Commerce shop. Product categories grid, bestseller highlights, and clear buy/shop CTAs throughout. Shipping info builds trust.',
      personaldienst: 'HR/staffing/recruitment agency. Open positions list and benefits section are dominant. Application process should feel frictionless.',
      other:          'General business. Clean, professional layout: services, trust signals, and contact CTA.',
    },
  },

  // ─── DESIGN ──────────────────────────────────────────────────────────────────

  design: {

    shape: {
      round:   'Shape language: rounded. Use rounded-2xl on all cards and containers, rounded-full on buttons and avatar images, soft box-shadow (shadow-md). No sharp corners anywhere.',
      angular: 'Shape language: sharp and angular. Use rounded-none on cards and containers, at most rounded on small interactive elements. Hard or no shadows. Borders as lines, not softness.',
      mixed:   'Shape language: mixed. Rounded corners on interactive components (buttons rounded-full, cards rounded-xl), clean straight edges on structural layout sections and dividers.',
    },

    level: {
      'super-modern': 'Sophistication level: cutting-edge. Push design boundaries — use gradient meshes, glassmorphism cards, bold asymmetric grids, staggered entrance animations, kinetic micro-interactions. Every section should feel intentional and forward-looking.',
      mid:            'Sophistication level: contemporary. Clean responsive grid, smooth hover transitions, modern type hierarchy, purposeful color accents. Professional but not over-engineered.',
      basic:          'Sophistication level: clean and functional. Standard symmetric grid, clear typography, minimal decoration. Readability and clarity over visual flair.',
    },

    style: {
      minimal:       'Design style: minimalist. Maximum whitespace, strict 1–2 color palette, sparse iconography. Typography carries all the visual weight. Every element must earn its place.',
      brutalist:     'Design style: brutalist. Raw heavy typography, stark high-contrast colors, intentional asymmetry, visible structural grid. No soft shadows, no rounded corners, no gradients. Bold and confrontational.',
      modern:        'Design style: modern. Clean lines, balanced whitespace, contemporary type pairings, subtle color accents. Polished without being sterile.',
      classic:       'Design style: classic/timeless. Symmetrical layouts, traditional type hierarchy, conservative color palette, dignified and trustworthy structure.',
      playful:       'Design style: playful. Bright accent colors, bouncy hover animations, friendly rounded shapes, warm illustrations or icons. Fun but never chaotic.',
      editorial:     'Design style: editorial. Magazine-inspired layout — large typographic moments, mixed column widths, strong photo integration. Reads like a premium publication.',
      glassmorphism: 'Design style: glassmorphism. Frosted glass cards (backdrop-blur-md, bg-white/10 or bg-black/20), glowing or neon accent colors, deep dark or rich gradient backgrounds.',
    },

    tone: {
      professional: 'Communication tone: professional and authoritative. Formal, confident language. CTAs use decisive phrasing ("Jetzt anfragen", "Termin vereinbaren"). No colloquialisms.',
      casual:       'Communication tone: relaxed and friendly. Conversational copy, approachable headlines, informal CTAs ("Komm vorbei", "Schreib uns gerne").',
      playful:      'Communication tone: fun and energetic. Witty headlines, punchy short sentences, light humor where natural. CTAs are inviting, not commanding.',
      formal:       'Communication tone: formal and respectful. Precise language, complete sentences, traditional hierarchy. Address the reader formally ("Sie"). Avoid contractions.',
      youthful:     'Communication tone: youthful and dynamic. Bold punchy statements, trending visual language, energetic copy. Short lines, high impact.',
      luxurious:    'Communication tone: luxurious and exclusive. Understated elegance, carefully chosen words. Less is more. Let quality speak quietly.',
    },

    // Font is NOT a user question — it is auto-derived by deriveFontFromStyle()
    // See the deriveFontFromStyle() export below.

    imagery: {
      photos:        'Imagery: real photography. Use https://picsum.photos/ placeholders (with specific seed numbers for consistency). Photos should feel authentic and high-quality.',
      illustrations: 'Imagery: illustrations. Use inline SVG illustrations or icon-heavy decorative sections. Avoid photographic placeholders.',
      abstract:      'Imagery: abstract graphics. Use geometric CSS shapes, gradient blobs (via Tailwind), or SVG paths rather than literal photos.',
      minimal:       'Imagery: minimal. One or two key visuals maximum — everything else is whitespace and typography.',
      none:          'Imagery: none. Pure text, typography, color blocks. Do not use any img tags or image placeholder divs.',
    },

    darkMode: {
      true:  'Color scheme: dark mode. Background colors: #0f0f0f or #111827. Text: white or zinc-100. Accent colors should glow subtly. Card backgrounds: #1f2937 or similar. High contrast throughout.',
      false: 'Color scheme: light mode. White or near-white backgrounds (white, gray-50). Dark text (gray-900, zinc-800). Clean contrast ratios meeting WCAG AA.',
    },

    animations: {
      none:     'Animations: none. Completely static — no CSS transitions, no transforms, no framer-motion usage whatsoever. Remove all animation-related code.',
      subtle:   'Animations: subtle. Use framer-motion whileInView with opacity/y fade-ins on section entry. Smooth hover color/scale transitions (duration 200–300ms). Keep it tasteful.',
      moderate: 'Animations: moderate. Scroll-triggered reveals with staggered children (staggerChildren 0.1s), hover lift effects (scale 1.02, shadow increase), smooth section transitions.',
      heavy:    'Animations: rich and expressive. Full framer-motion orchestration — parallax hero, staggered entrance choreography, kinetic typography (character-by-character), interactive hover states with spring physics.',
    },

    heroStyle: {
      'fullscreen-image': 'Hero layout: fullscreen image. Full viewport height (min-h-screen), background image fills frame with bg-cover, dark overlay gradient (from-black/70 to-black/30) for text readability. Headline and CTA centered or left-aligned over image.',
      split:              'Hero layout: split layout. Left half: headline, subline, CTA button(s). Right half: image or visual element. Use CSS grid or flexbox 50/50. On mobile, stack vertically (image below text).',
      'video-bg':         'Hero layout: video background. Use a styled div placeholder (bg-gradient-to-br from-gray-900 to-gray-700, min-h-screen) to simulate a video background. Text overlay with white text, high contrast. Add a subtle "▶ Showreel" button as decoration.',
      'text-only':        'Hero layout: text-only. Large typographic statement dominates the viewport. Optional geometric color-block accent or gradient shape in the background. No photography needed.',
    },

    layout: {
      airy:     'Layout feel: airy and spacious. Section vertical padding: py-24 to py-32. Large line heights (leading-relaxed or leading-loose). Generous gaps between elements. Let content breathe.',
      balanced: 'Layout feel: balanced. Section vertical padding: py-16 to py-20. Consistent rhythm, comfortable reading density. Standard gap-8 to gap-12 between elements.',
      dense:    'Layout feel: information-dense. Section vertical padding: py-8 to py-12. Multiple columns where possible. Compact gap-4 to gap-6. Pack value — show more per screen.',
    },
  },

  // ─── SECTIONS ─────────────────────────────────────────────────────────────────
  // Snippets for optional sections — included when brief.sections[key] === true

  sections: {
    team:         'SECTION — Team: Photo placeholder (gray rounded div or circle), name, role title, 1–2 sentence bio per member. Grid layout.',
    testimonials: 'SECTION — Testimonials/Reviews: Quote cards with star rating (★ filled/empty), testimonial text in italics, author name and optional company. Consider a horizontal scroll or 3-column grid.',
    about:        'SECTION — About Us: Company story, values, and a visual element (image or illustrated graphic placeholder). Split layout or centered text with image.',
    faq:          'SECTION — FAQ: Accordion or clearly separated Q&A pairs. Each question bold, answer in normal weight below.',
    process:      'SECTION — Process ("So läuft\'s ab"): Numbered steps (1, 2, 3, 4) with a lucide-react icon per step and a short description. Horizontal on desktop, vertical on mobile.',
    gallery:      'SECTION — Gallery/Portfolio: Image grid with uniform aspect ratio (use picsum.photos placeholders). Hover overlay with a subtle darkening effect.',
    blog:         'SECTION — Blog/News Preview: 3 article preview cards — cover image placeholder, category tag, title, short excerpt (1–2 lines), and publication date.',
    pricing:      'SECTION — Pricing: 2–3 pricing plan cards. Each card: plan name, price (prominent), feature checklist (✓), CTA button. Highlight one plan as recommended.',
    compareTable: 'SECTION — Comparison Table: Feature comparison table with plans as columns and features as rows. Use ✓/✗ or filled/empty icons. Clear header row.',
    stats:        'SECTION — Stats Banner: Full-width colored strip with 3–4 large bold numbers and descriptive labels (e.g., "10.000+ Kunden", "5 Jahre Erfahrung", "98% Zufriedenheit"). Centered, high contrast.',
    careers:      'SECTION — Careers/Jobs: List of open positions with job title, location, and employment type. Each entry links to /contact. Info only — no application form in this section.',
    locations:    'SECTION — Locations/Filialen: Multiple location cards with address, opening hours, and a map placeholder div (gray box with a map pin icon). Grid layout.',
    partnerLogos: 'SECTION — Partner/Customer Logos: Horizontal strip of grayscale logo placeholders (styled divs with company name in light gray text, or simple gray rectangles). "Unsere Partner" heading.',
  },

  // ─── CTA ─────────────────────────────────────────────────────────────────────

  cta: {
    call:    'Primary CTA: "Jetzt anrufen" — render as a tel: link styled as the main button. Must appear in hero and navbar.',
    book:    'Primary CTA: "Termin buchen" — link to /contact. Prominent hero and navbar button.',
    contact: 'Primary CTA: "Kontakt aufnehmen" — link to /contact. Default CTA for hero and all CTA positions.',
    buy:     'Primary CTA: "Jetzt kaufen" — prominent buy/shop styled button. Link to /contact or scroll to services section.',
    demo:    'Primary CTA: "Demo anfragen" — link to /contact. Hero and navbar.',
  },

  // ─── INDUSTRY-SPECIFIC ───────────────────────────────────────────────────────
  // Base snippet always added for the matching industry.
  // Conditional sub-snippets added when the relevant data is present in the brief.

  industrySpecific: {
    restaurant: {
      base:        'RESTAURANT: Menu section is placed near the top of the page (second or third section). Appetizing image placeholders. Reservation CTA is the most visible button in the hero.',
      reservation: 'Reservation link: create a prominent "Tisch reservieren" button that opens the reservation URL in a new tab.',
      delivery:    'Delivery links: show delivery platform buttons (styled as "Bestellen bei Wolt/Lieferando") near or below the menu section.',
      dietary:     'Dietary filters: add small badge labels (🌱 Vegan, 🥬 Vegetarisch) on relevant menu items.',
    },
    cafe: {
      base: 'CAFÉ: Warm, inviting feel. Coffee imagery and handwritten-style accents where fitting. Menu and opening hours are primary content blocks.',
    },
    agency: {
      base:       'AGENCY: Portfolio/work section is a key section. Hero communicates ambition and results. Use numbers to show impact.',
      caseStudies:'Case studies: display as visual project cards — project name, client, and key result metric. Grid of 2–3 cards.',
      techStack:  'Tech stack: render as a clean horizontal icon strip or a tag cloud of technology names.',
      projects:   'Reference projects: portfolio card grid with project name and short description.',
    },
    software: {
      base: 'SOFTWARE: Feature highlights in a 3-column icon grid below the hero. Hero includes an abstract product mockup (styled div or SVG). Emphasize reliability and scalability.',
    },
    personaldienst: {
      base:      'RECRUITMENT: Open positions section is dominant (styled as job listing cards). Benefits section uses icon+text cards. The overall feel is trustworthy and approachable for candidates.',
      positions: 'Open positions: list as styled job cards — title, location/type, and a "Jetzt bewerben" link to /contact per card.',
      appForm:   'Application form: include a visible "Jetzt bewerben" CTA linking to /contact or the application URL.',
      benefits:  'Benefits: display as a grid of icon+label cards (use lucide-react icons). Make this section visually distinct and appealing.',
    },
    handwerk: {
      base:        'TRADES: Phone number rendered in header (top right, large) AND in the hero (below the headline, as a tel: link button). Certifications and years of experience in a trust-signal strip.',
      serviceArea: 'Service area: include a short "Einsatzgebiet" callout in the hero or about section, listing the regions/postal codes served.',
      emergency:   'Emergency service: add a prominent "24/7 Notdienst" badge or banner — top of hero or a sticky colored strip. Use a warning/alert color (red or amber).',
      beforeAfter: 'Before/After gallery: side-by-side image placeholder cards with "Vorher" / "Nachher" labels. At least 3 pairs in a grid.',
    },
    yoga: {
      base:      'YOGA/WELLNESS: Calm, spacious layout. Muted or earth-tone palette unless overridden. Free trial class CTA is the hero\'s secondary button.',
      schedule:  'Class schedule: display as a weekly timetable (table or card grid, organized by day). Show day, time, and class name.',
      trainers:  'Trainers: profile card grid — circular photo placeholder, name, specialty. Clean and personal.',
      trialClass:'Free trial class: prominent "Probestunde buchen" CTA button — link to /contact. Place in hero and in a dedicated CTA section.',
    },
    fitness: {
      base:      'FITNESS: High-energy visuals, bold typography. Schedule and membership pricing prominent. Trial offer as a hero CTA.',
      schedule:  'Class schedule: display as a weekly timetable (table or card grid, organized by day). Show day, time, class name.',
      trainers:  'Trainers: profile card grid — circular photo placeholder, name, specialty.',
      trialClass:'Free trial: prominent "Gratis testen" CTA — link to /contact.',
    },
    ecommerce: {
      base:        'E-COMMERCE: Category grid above the fold. Bestseller row with product cards. Shipping info as trust badges.',
      categories:  'Product categories: display as a visual grid of category tiles — each with an image placeholder, category name, and "Jetzt entdecken" link.',
      bestsellers: 'Bestsellers: horizontal scroll or featured card row — product image placeholder, name, price (if available), and "Kaufen" button.',
      shipping:    'Shipping info: display as 3–4 short trust icons/badges ("Kostenloser Versand ab X€", "Schnelle Lieferung", "Einfache Rückgabe") in a horizontal strip.',
    },
  },

  // ─── ALWAYS-ON RULES ─────────────────────────────────────────────────────────
  // These are added to every prompt regardless of brief content.

  always: [
    'ROUTING: Use react-router-dom. Wrap the whole app in <BrowserRouter>. Define two routes: path="/" → <LandingPage />, path="/contact" → <ContactPage />. Both components live in the same App.jsx file.',
    'CONTACT PAGE: The ContactPage component must include: company name as a heading, the email as a clickable mailto: link, phone as a clickable tel: link (if provided), the address as plain text (if provided), and a simple contact form (fields: Name, E-Mail, Nachricht) with action="mailto:[email]" method="post" encType="text/plain". Style it consistently with the landing page.',
    'NAVBAR LINKS: The navbar must include a "Kontakt" link using react-router-dom <Link to="/contact">. All other in-page links use smooth scroll anchors (#section-id). CTAs in the hero link to /contact via <Link>.',
    'CTA DEFAULT: If no primaryCta is specified, use "Kontakt aufnehmen" as the CTA text, always linking to /contact.',
    'LEGAL FOOTER: Footer must always contain two links: "Impressum" and "Datenschutz" as anchor tags pointing to #impressum and #datenschutz respectively.',
    'ALLOWED IMPORTS: Only these imports are permitted — react (useState, useEffect, useRef etc.), react-router-dom (BrowserRouter, Routes, Route, Link, useNavigate), framer-motion (motion, AnimatePresence), lucide-react (any icons). No other external packages.',
    'OUTPUT FORMAT: Return the complete, self-contained App.jsx file. No explanatory prose, no markdown, no partial code.',
  ],
};

// ─── FONT DERIVATION ─────────────────────────────────────────────────────────
// Auto-derives a font recommendation from the design style and tone.
// This is NOT a user question — it gets computed and injected into the prompt.

export function deriveFontFromStyle(style, tone) {
  // Style takes priority
  const byStyle = {
    brutalist:     { hint: 'monospace or heavy display typeface — use font-mono or a bold system font stack' },
    minimal:       { hint: 'clean geometric sans-serif, 1–2 weights only (e.g., Inter, system-ui)' },
    editorial:     { hint: 'pairing of a serif for headings and clean sans-serif for body text' },
    classic:       { hint: 'classic serif typeface for headings (font-serif class), readable serif or sans for body' },
    playful:       { hint: 'friendly rounded or display typeface — bold and warm' },
    glassmorphism: { hint: 'modern geometric sans-serif, medium/bold weights for legibility on dark backgrounds' },
    modern:        { hint: 'clean modern sans-serif with clear weight contrast between headings and body' },
  };
  if (byStyle[style]) return byStyle[style].hint;

  // Tone fallback
  if (tone === 'luxurious' || tone === 'formal') return 'elegant serif for headings, refined sans-serif for body';
  if (tone === 'youthful' || tone === 'playful') return 'bold display or rounded sans-serif typeface';
  if (tone === 'professional') return 'clean sans-serif with strong weight contrast';

  return 'clean modern sans-serif (Inter or system-ui)';
}

// ─── FONT PAIRS (UI/UX PRO MAX v2.5.0 — 73 pairs condensed) ─────────────────
// Maps design style and industry to a concrete Google Fonts heading+body pair.
// Only ONE pair is selected per prompt (1–2 fonts in the final AI output).

export const FONT_PAIRS = {
  byStyle: {
    brutalist:     { heading: 'Space Mono',         body: 'Space Mono',        headingStack: 'monospace', bodyStack: 'monospace', load: 'Space+Mono:wght@400;700' },
    minimal:       { heading: 'Inter',              body: 'Inter',             headingStack: 'sans-serif', bodyStack: 'sans-serif', load: 'Inter:wght@400;500;700' },
    editorial:     { heading: 'Cormorant Garamond', body: 'Libre Baskerville', headingStack: 'serif', bodyStack: 'serif', load: 'Cormorant+Garamond:wght@400;600;700&family=Libre+Baskerville:wght@400;700' },
    classic:       { heading: 'Cormorant Garamond', body: 'Libre Baskerville', headingStack: 'serif', bodyStack: 'serif', load: 'Cormorant+Garamond:wght@400;600;700&family=Libre+Baskerville:wght@400;700' },
    playful:       { heading: 'Fredoka',            body: 'Nunito',            headingStack: 'sans-serif', bodyStack: 'sans-serif', load: 'Fredoka:wght@400;600;700&family=Nunito:wght@400;600;700' },
    glassmorphism: { heading: 'Space Grotesk',      body: 'DM Sans',           headingStack: 'sans-serif', bodyStack: 'sans-serif', load: 'Space+Grotesk:wght@400;500;700&family=DM+Sans:wght@400;500;700' },
    modern:        { heading: 'Poppins',            body: 'Open Sans',         headingStack: 'sans-serif', bodyStack: 'sans-serif', load: 'Poppins:wght@400;600;700&family=Open+Sans:wght@400;600' },
  },
  byIndustry: {
    software:       { heading: 'Space Grotesk',    body: 'DM Sans',         headingStack: 'sans-serif', bodyStack: 'sans-serif', load: 'Space+Grotesk:wght@400;500;700&family=DM+Sans:wght@400;500;700' },
    agency:         { heading: 'Archivo',          body: 'Space Grotesk',   headingStack: 'sans-serif', bodyStack: 'sans-serif', load: 'Archivo:wght@400;600;700&family=Space+Grotesk:wght@400;500;700' },
    restaurant:     { heading: 'Playfair Display', body: 'Karla',           headingStack: 'serif', bodyStack: 'sans-serif', load: 'Playfair+Display:wght@400;600;700&family=Karla:wght@400;500' },
    cafe:           { heading: 'Lora',             body: 'Raleway',         headingStack: 'serif', bodyStack: 'sans-serif', load: 'Lora:wght@400;600;700&family=Raleway:wght@400;500' },
    yoga:           { heading: 'Lora',             body: 'Raleway',         headingStack: 'serif', bodyStack: 'sans-serif', load: 'Lora:wght@400;600;700&family=Raleway:wght@400;500' },
    fitness:        { heading: 'Barlow Condensed', body: 'Barlow',          headingStack: 'sans-serif', bodyStack: 'sans-serif', load: 'Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500' },
    handwerk:       { heading: 'Poppins',          body: 'Open Sans',       headingStack: 'sans-serif', bodyStack: 'sans-serif', load: 'Poppins:wght@400;600;700&family=Open+Sans:wght@400;600' },
    personal:       { heading: 'Archivo',          body: 'Space Grotesk',   headingStack: 'sans-serif', bodyStack: 'sans-serif', load: 'Archivo:wght@400;600;700&family=Space+Grotesk:wght@400;500;700' },
    ecommerce:      { heading: 'Rubik',            body: 'Nunito Sans',     headingStack: 'sans-serif', bodyStack: 'sans-serif', load: 'Rubik:wght@400;500;700&family=Nunito+Sans:wght@400;600' },
    personaldienst: { heading: 'Lexend',           body: 'Source Sans 3',   headingStack: 'sans-serif', bodyStack: 'sans-serif', load: 'Lexend:wght@400;500;700&family=Source+Sans+3:wght@400;600' },
    other:          { heading: 'Poppins',          body: 'Open Sans',       headingStack: 'sans-serif', bodyStack: 'sans-serif', load: 'Poppins:wght@400;600;700&family=Open+Sans:wght@400;600' },
  },
};

// Returns the single best font pair for the given style/tone/industry combination.
// Priority: style → tone → industry → safe default.
export function deriveFontPair(style, tone, industry) {
  // Style has highest priority
  if (FONT_PAIRS.byStyle[style]) return FONT_PAIRS.byStyle[style];

  // Tone-based overrides when no style match
  if (tone === 'luxurious' || tone === 'formal') return FONT_PAIRS.byStyle.classic;
  if (tone === 'playful' || tone === 'youthful') return FONT_PAIRS.byStyle.playful;

  // Fall back to industry, then modern default
  return FONT_PAIRS.byIndustry[industry] ?? FONT_PAIRS.byStyle.modern;
}

// ─── FALLBACK COLOR PALETTES (UI/UX PRO MAX v2.5.0 — 161 types distilled) ────
// Used when brief.design.colors is not explicitly specified.
// Format: primary | secondary | accent | bg | fg | note

export const FALLBACK_PALETTES = {
  software:       { primary: '#2563EB', secondary: '#3B82F6', accent: '#EA580C', bg: '#F8FAFC', fg: '#1E293B', note: 'Trust blue + orange CTA' },
  agency:         { primary: '#EC4899', secondary: '#F472B6', accent: '#0891B2', bg: '#FDF2F8', fg: '#831843', note: 'Bold pink + cyan' },
  restaurant:     { primary: '#DC2626', secondary: '#F87171', accent: '#A16207', bg: '#FEF2F2', fg: '#450A0A', note: 'Appetizing red + warm gold' },
  cafe:           { primary: '#92400E', secondary: '#B45309', accent: '#C8662B', bg: '#FEF3C7', fg: '#78350F', note: 'Warm brown + amber on cream' },
  yoga:           { primary: '#6B7280', secondary: '#78716C', accent: '#0891B2', bg: '#F5F5F0', fg: '#0F172A', note: 'Sage neutral + calm teal' },
  fitness:        { primary: '#F97316', secondary: '#FB923C', accent: '#22C55E', bg: '#1F2937', fg: '#F8FAFC', note: 'Energy orange + success green (dark)' },
  handwerk:       { primary: '#1E40AF', secondary: '#3B82F6', accent: '#EA580C', bg: '#EFF6FF', fg: '#1E3A8A', note: 'Professional blue + urgent orange' },
  personal:       { primary: '#18181B', secondary: '#3F3F46', accent: '#2563EB', bg: '#FAFAFA', fg: '#09090B', note: 'Monochrome + blue accent' },
  ecommerce:      { primary: '#059669', secondary: '#10B981', accent: '#EA580C', bg: '#ECFDF5', fg: '#064E3B', note: 'Success green + urgency orange' },
  personaldienst: { primary: '#0369A1', secondary: '#0EA5E9', accent: '#16A34A', bg: '#F0F9FF', fg: '#0C4A6E', note: 'Professional blue + success green' },
  other:          { primary: '#0F172A', secondary: '#334155', accent: '#0369A1', bg: '#F8FAFC', fg: '#020617', note: 'Professional navy + blue CTA' },
};

// ─── LANDING PAGE PATTERNS (UI/UX PRO MAX v2.5.0 — 34 patterns distilled) ────
// Best-fit landing pattern per industry, with CTA placement guidance.

export const LANDING_PATTERNS = {
  software:       'Feature-Rich Showcase — Hero + 3-column feature grid + Demo or Pricing section + social proof strip + bottom CTA. Sticky nav. CTA placement: hero (sticky) + after features + bottom.',
  agency:         'Storytelling-Driven — Bold hero with ambition statement + Work/Portfolio grid (hover reveals project details) + Process steps + Client logos + CTA. Numbers show impact.',
  restaurant:     'Feature-Rich Showcase — Full-bleed food-imagery hero + Menu section (second/third section) + Reservation CTA dominant + Gallery + Testimonials. CTA: "Tisch reservieren" in hero and sticky navbar.',
  cafe:           'Minimal & Direct — Warm editorial hero + Menu highlights + Opening hours block + Specials callout + Simple contact. Cozy, inviting feel throughout.',
  yoga:           'Social Proof-Focused — Calm spacious hero + Class schedule table + Trainers grid + Testimonials + Free trial class CTA section. Earth tones, generous whitespace.',
  fitness:        'Feature-Rich Showcase — High-energy hero + Membership plans + Class schedule + Trainers + Trial offer. Bold type and energetic imagery.',
  handwerk:       'Trust & Authority — Hero with phone number prominently displayed + Services grid + Certifications/experience trust strip + Before/After gallery + Contact section with address. Primary CTA: phone call.',
  personal:       'Minimal & Direct — Clean hero with personal photo + Services or Portfolio grid + Skills or About section + Contact. Single-focus, white space dominant.',
  ecommerce:      'Feature-Rich Showcase — Category grid above fold + Bestseller row with product cards + Shipping trust badges + repeat buy CTAs. Shop/Buy buttons prominent throughout.',
  personaldienst: 'Trust & Authority — Hero + Open positions list (job cards) + Benefits icon grid + Application CTA + Testimonials. Professional and approachable for candidates.',
  other:          'Hero + Features + CTA — Clean hero + Services/USP grid + Testimonials strip + Contact CTA. CTA: sticky nav + hero + bottom.',
};

// ─── UX CORE RULES (UI/UX PRO MAX v2.5.0 — always injected) ─────────────────
// Condensed from 99-rule UX guidelines + Web accessibility + Performance rules.
// These apply to EVERY component generated.

export const UX_CORE_RULES = `UX, ACCESSIBILITY & PERFORMANCE — apply to every component:

NAVIGATION & LAYOUT:
- Smooth scroll: scroll-behavior: smooth on <html>; sticky nav adds padding-top equal to nav height.
- Active nav link highlighted (color or underline). Deep links update URL on state changes.
- z-index scale: 10 (content) / 20 (sticky) / 30 (dropdown) / 50 (modal); never arbitrary large values.
- Use min-h-dvh (not h-screen) on mobile; max-w-prose for reading columns; no horizontal scroll on mobile.
- Reserve space for async content to prevent CLS.

ANIMATION:
- Max 300ms for micro-interactions (150ms for hover). Use transform/opacity only — never animate width/height/top/left.
- Always respect prefers-reduced-motion: skip or reduce all animations if enabled.
- Max 1–2 animated elements per view. No infinite decorative animations — only loaders.
- Easing: ease-out on enter, ease-in on exit; never linear for UI transitions.

INTERACTION & FORMS:
- Every button/card/link: visible hover state + cursor:pointer. Disabled: opacity-50 + cursor-not-allowed.
- Visible focus rings: focus:ring-2 focus:ring-offset-2 (keyboard navigation must work).
- Touch targets: min 44×44px; min 8px gap between adjacent interactive elements.
- Forms: always visible label (never placeholder-only); validate on blur not keystroke; semantic input types (email, tel, number); required fields marked; errors shown inline below field.
- Confirm destructive actions with a dialog.

ACCESSIBILITY:
- Minimum 4.5:1 contrast for body text; 3:1 for large text (WCAG AA).
- Never convey information by color alone (add icon or text).
- Descriptive alt text on all meaningful images (empty alt="" for decorative).
- Sequential heading hierarchy: h1 → h2 → h3 (no skipping).
- aria-label on all icon-only buttons; semantic HTML: <nav>, <main>, <footer>, <article>, <section>.
- label[for] on all inputs. role="alert" / aria-live="polite" for dynamic status messages.

TYPOGRAPHY:
- Body line-height 1.5–1.75; min 16px body text (prevents iOS auto-zoom).
- Consistent type scale: 12 / 14 / 16 / 18 / 24 / 32 / 48px. Headings clearly differentiated by size + weight.
- Dark text on light background (slate-900 on white); white on dark (zinc-100 on #111827).

PERFORMANCE:
- font-display: swap on all web fonts.
- Lazy-load all below-fold images (loading="lazy"); always declare width + height on images.
- Code-split by route (dynamic imports); load analytics/third-party scripts async/defer.
- Use ternary (not &&) when condition can be 0 or NaN to avoid rendering "0" in JSX.
- useCallback for handlers passed as props; useMemo for expensive computations; React.memo for pure list-item components.
- Always use functional setState: setState(curr => ...) when new state depends on previous.`;

// ─── REACT PERFORMANCE PATTERNS (UI/UX PRO MAX v2.5.0) ───────────────────────

export const REACT_PERF_RULES = `REACT COMPONENT BEST PRACTICES:
- No anonymous functions in JSX (causes unnecessary re-renders on every render).
- Wrap async-loaded sections in <Suspense fallback={<skeleton />}>.
- Import lucide-react icons directly: import { IconName } from 'lucide-react' (tree-shaken automatically).
- Hoist static JSX (non-dynamic markup) to module scope outside the component.
- Use Set/Map for O(1) membership checks instead of Array.includes in loops.
- Avoid subscribing to state in callbacks where only the callback uses it (causes extra re-renders).
- startTransition for non-urgent state updates (e.g. filter/search).`;

// ─── ICON GUIDELINES ─────────────────────────────────────────────────────────
// The project uses lucide-react (see ALLOWED IMPORTS in PROMPT_DB.always).
// Reference icon categories for selection:

export const ICON_GUIDELINES = `ICONS — use lucide-react (already in ALLOWED IMPORTS):
- Navigation/UI: Menu, X, ChevronDown, ChevronUp, ArrowLeft, ArrowRight, ExternalLink
- Action: Plus, Trash2, Pencil, Download, Upload, Copy, Share2, Search, Filter, Settings
- Status: Check, CheckCircle2, XCircle, AlertTriangle, Info, Loader2 (animate-spin), Clock
- Communication: Mail, MessageCircle, Phone, Send, Bell
- User: User, Users, UserPlus, LogIn, LogOut
- Commerce: ShoppingCart, ShoppingBag, CreditCard, Tag, Gift, Percent
- Data/Analytics: BarChart2, PieChart, TrendingUp, TrendingDown, Activity, Database
- Location: MapPin, Map, Compass, Globe
- Security: Lock, Unlock, Shield, Key, Eye, EyeOff
- Social: Heart, Star, ThumbsUp, Bookmark, Flag
Usage: import { IconName } from 'lucide-react'; render as <IconName size={20} className="..." />`;

// ─── SECTION-LEVEL DESIGN PATTERNS (UI/UX PRO MAX v2.5.0) ───────────────────

export const SECTION_DESIGN_PATTERNS = `SECTION-LEVEL DESIGN SYSTEM:
- Hero CTA buttons: primary = solid brand color, secondary = outline or ghost. Never more than 2 CTAs in the hero.
- Cards: consistent border-radius matching chosen shape language; subtle shadow (shadow-sm or shadow-md); hover: slight lift (translateY(-2px) + shadow-lg).
- Stats/numbers: use tabular-nums font-variant; large bold number + smaller label below; high contrast strip (brand bg or dark).
- Testimonial cards: blockquote with left border accent OR card with star rating on top; author name + optional company in muted text.
- Process steps: numbered circle (brand color) + icon + short text; horizontal on desktop (flex-row), vertical stack on mobile.
- Pricing cards: 3-column grid; middle "recommended" card elevated (scale-105 or border-2 accent + "Empfohlen" badge); feature list with check icons.
- FAQ: accordion pattern; question bold with ChevronDown icon; answer slides open; border-b separators.
- Gallery: CSS grid with aspect-ratio: 4/3 uniform tiles; hover: overlay with darkening + optional icon.
- Partner logos: grayscale (filter: grayscale(100%)) on default, color on hover; horizontal scrolling strip.
- Footer: dark background; 3–4 columns (links / contact / social / legal); Impressum + Datenschutz always in last column.

RESPONSIVE GRID:
- 1 column on mobile (<640px), 2 columns on tablet (≥768px), 3–4 columns on desktop (≥1024px).
- Use CSS Grid with auto-fill/auto-fit minmax for card grids (responsive without breakpoint overrides).
- Navbar: hamburger menu on mobile; full horizontal links on desktop (hidden md:flex pattern with Tailwind).`;

