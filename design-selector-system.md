# Website AI — Design Selector System

A two-part spec:
1. **Part A** — The decisions the user must make before build (the selector flow).
2. **Part B** — The prompt fragments appended to the AI build prompt for each selection.

Synthesized from: `ui-ux-pro-max` (product/style/color/typography intelligence), `emil-design-eng` (motion, polish, micro-interactions), `impeccable` (bold aesthetic direction, anti-AI-slop rules).

---

## Part A — What the user must decide (selector order)

Order matters: earlier answers should narrow later options.

| # | Selector | Type | Required | Purpose |
|---|---|---|---|---|
| 1 | Business / Industry | single-select | ✅ | Drives product-type reasoning, color families, section defaults |
| 2 | Primary Goal | single-select | ✅ | Shapes page structure + CTA strategy |
| 3 | Target Audience | single-select | ✅ | Theme, tone, density, formality |
| 4 | Brand Personality (3 words) | free text (3 tags) | ✅ | Override generic defaults, drive font search |
| 5 | Aesthetic Direction | single-select | ✅ | The bold visual commitment |
| 6 | Theme Mode | single-select | ✅ | Light, dark, or both |
| 7 | Accent / Color Strategy | single-select | ✅ | Palette construction approach |
| 8 | Brand Color (if known) | color picker | optional | Hue to tint neutrals toward |
| 9 | Corner Radius / Shape Language | single-select | ✅ | Geometry vocabulary |
| 10 | Typography Personality | single-select | ✅ | Display + body font pairing direction |
| 11 | Layout Rhythm | single-select | ✅ | Grid behavior, asymmetry, composition |
| 12 | Density | single-select | ✅ | Whitespace budget |
| 13 | Motion Intensity | single-select | ✅ | Animation budget + where motion applies |
| 14 | Imagery Style | single-select | ✅ | Photo / illustration / 3D / typographic |
| 15 | Required Sections | multi-select | ✅ | Which page modules to include |
| 16 | CTA Urgency | single-select | ✅ | Tone of call-to-action copy + styling |
| 17 | Accessibility Floor | single-select | ✅ | Contrast + motion guardrails |
| 18 | Device Priority | single-select | ✅ | Breakpoint emphasis |
| 19 | Anti-references | free text | optional | What it must NOT look like |

---

## Part B — Prompt fragments per option

Each fragment below gets **appended to the master build prompt** when the user picks that option. Fragments are written in directive form so they compose cleanly.

---

### 1. Business / Industry

> Output this as the opening context of the build prompt.

**Restaurant / Food / Cafe**
```
Product type: restaurant/food service. Structure the page around: hero food imagery, menu highlights, location/hours, reservation or order CTA, gallery, reviews. Use warm palette (amber, terracotta, olive, cream). Prefer editorial serif display for dish names. Food photography must be hero-scale and uncropped — never small thumbnails. Avoid template "three-card feature" grids; use an asymmetric menu-style layout instead.
```

**Beauty / Spa / Wellness**
```
Product type: beauty/wellness service. Structure around: calming hero, services list with pricing, treatment details, booking CTA, practitioner bios, testimonials, location. Use soft palette (blush, sage, sand, ivory, dusty rose). Typography leans refined serif display paired with airy humanist sans. Generous whitespace is non-negotiable — density feels clinical in this space. Avoid icon-card grids; prefer long-form service descriptions.
```

**Fitness / Gym / Studio**
```
Product type: fitness/studio. Structure around: bold hero with action imagery, class schedule, trainer/coach profiles, membership pricing, transformation testimonials, trial CTA. Palette runs high-contrast (black + energetic accent like electric lime, orange, or magenta). Typography wants condensed or display sans with athletic personality. Motion should feel kinetic — stagger reveals and scroll-driven text slides.
```

**Healthcare / Medical / Clinic**
```
Product type: healthcare. Structure around: clear-value hero, services/specialties, physician bios with credentials, insurance/accessibility info, appointment booking, patient resources. Theme: light mode always. Palette: calm blues/greens/neutrals, never saturated. Typography: refined humanist sans for trust. Forbidden: glowing dark-mode aesthetics, gradient text, decorative animation. Every visual decision must reinforce calm + competence.
```

**Law / Accounting / Professional Services**
```
Product type: professional services (legal/accounting/consulting). Structure around: credibility-first hero (not flashy), practice areas, team bios with credentials, case studies or results, contact/consultation CTA. Palette: deep neutral (navy, charcoal, bone) with a single restrained accent. Typography: editorial serif for headings, refined sans for body. Layout: left-aligned, asymmetric, editorial. Avoid all decorative motion — polish here means restraint.
```

**Real Estate**
```
Product type: real estate. Structure around: property search/hero, featured listings grid, agent profiles, neighborhood guides, testimonials, valuation CTA. Listing cards must prioritize photography at large scale with minimal chrome. Palette: refined neutrals with one accent for CTAs. Typography: one editorial serif for property names, one humanist sans for details. Avoid sparkline decoration and metric-card templates.
```

**SaaS / Software / Tech Tool**
```
Product type: SaaS/product marketing. Structure around: value-prop hero with product UI screenshot, feature explanations, social proof logos, pricing tiers, changelog or docs entry point, sign-up CTA. The product UI IS the hero — show it large, sharp, uncropped. Avoid: Inter, DM Sans, Space Grotesk (training-data defaults). Prefer a less-common geometric or grotesque sans. One bold accent color, used rarely. Dark mode allowed if the product is dev-oriented; otherwise light.
```

**E-commerce / Online Store**
```
Product type: e-commerce. Structure around: product-first hero, collections grid, featured products, size/material/story details, reviews, cart/checkout CTA. Product photography is the design. Layout: bento-grid or editorial-grid, not identical cards. Typography: one distinctive display face for brand voice, refined sans for product details. Palette: derived from the product line (restrained if luxury, vibrant if youth-market). Motion: subtle product-card hover lift only.
```

**Portfolio / Creative**
```
Product type: personal/creative portfolio. Structure around: statement hero with name + role, project grid or list (editorial, not identical cards), about/bio, contact. Commit to an opinionated aesthetic — portfolios are judged on taste. Typography: pair a distinctive display face with a refined body. Layout: break the grid deliberately. Dark or light based on the work shown. Motion: one signature interaction (scroll-driven reveal, cursor-following element, or hover state) — not ten.
```

**Agency / Studio**
```
Product type: agency/studio. Structure around: bold positioning statement hero, selected work (large case-study cards, not a grid of logos), capabilities, team, contact. Typography must be distinctive — agencies live by their taste. Layout: editorial, asymmetric, confident use of large type. Palette: restrained — one accent, rest neutral with brand-hue-tinted grays. Motion: one hero-moment animation, nothing elsewhere.
```

**Nonprofit / Cause**
```
Product type: nonprofit/advocacy. Structure around: emotional hero (human imagery, clear problem statement), impact metrics (real numbers, not decorative), how we help, ways to act (donate/volunteer/share), stories, transparency. Palette: warm and human, not corporate-sterile. Typography: editorial serif for headlines communicates weight. Copy is the design — make every word earn its place. Avoid hero-metric template (big number + gradient accent).
```

**Education / Course / School**
```
Product type: education. Structure around: outcome-focused hero, curriculum/courses, instructor credentials, student outcomes or testimonials, enrollment CTA. Palette: trustworthy but not sterile — warm academic tones (ink, bone, ochre) for traditional; brighter for kids/creative. Typography: editorial serif for authority pairs with humanist sans for readability. Long-form copy needs real line-length control (65–75ch).
```

**Finance / Fintech / Investing**
```
Product type: finance/fintech. Structure around: clear-value hero, how it works, security/compliance badges, pricing or fee transparency, sign-up CTA. Palette: deep neutrals with one disciplined accent — avoid the AI fintech trap of cyan-on-dark + purple-to-blue gradients. Typography: precise geometric sans, tabular numerals mandatory for any numeric display. Theme depends on product: trading tools → dark; consumer banking → light.
```

**Entertainment / Media / Music**
```
Product type: entertainment/media. Structure around: immersive hero (video or large imagery), content grid, featured pieces, subscribe/follow CTA. Palette: bold, often dark with high-saturation accents — but pick an unusual one (acid yellow, oxblood, ultramarine), not cyan/magenta/neon green. Typography: distinctive display face is mandatory, paired with refined sans. Motion: cinematic scroll-driven reveals allowed here.
```

**Local Service (plumber, electrician, cleaner, contractor)**
```
Product type: local trade service. Structure around: what we do + service area hero, service list with pricing guidance, trust signals (licenses, insurance, years in business, reviews), phone-call CTA at the top, service gallery, contact form. Phone number must be clickable and prominent on mobile. Palette: confident and grounded — navy/charcoal + bold accent, or earth tones. Avoid "tech-startup" aesthetics; this is a real-world business.
```

**Hospitality / Hotel / Rental**
```
Product type: hospitality. Structure around: immersive property hero (video or full-bleed photography), rooms/accommodations, amenities, location + experiences, booking widget, reviews. Photography is the design — full-bleed, uncropped, editorial. Palette: derived from the property itself (coastal, alpine, urban, etc.), restrained and elegant. Typography: distinctive serif display pairs with refined humanist sans. Avoid corporate-hotel-chain aesthetics.
```

---

### 2. Primary Goal

**Generate leads / Book consultations**
```
Primary goal: lead capture. Every page must have a visible CTA above the fold and repeated after major sections. Forms are short (3 fields max on initial contact). Trust signals (testimonials, credentials, client logos) appear before any asking. CTA copy: direct, outcome-focused.
```

**Sell products**
```
Primary goal: product purchase. Product imagery takes visual priority over copy. Price + buy CTA always visible on product cards. Shipping/return policy reachable in one click. Reviews appear near product detail, not buried in a footer.
```

**Showcase work / Build credibility**
```
Primary goal: portfolio/credibility. Work is the design — prioritize imagery size and craft. Case studies include problem → approach → outcome, not decorative summaries. Contact CTA appears once at the end, not aggressively repeated.
```

**Inform / Educate**
```
Primary goal: information delivery. Typography and readability are the design. Line-length 65–75ch, generous leading, clear heading hierarchy. Navigation reflects content structure. No CTA pressure — one subtle newsletter or follow prompt at the end.
```

**Drive sign-ups / Create accounts**
```
Primary goal: account creation. Value proposition must be testable in under 5 seconds of reading the hero. Sign-up CTA above the fold + after each feature block. Social proof (user count, logos, testimonials) appears within first scroll. Friction reducers visible (free tier, no credit card, etc.).
```

**Book appointments / Reservations**
```
Primary goal: booking. The booking widget or phone CTA is the hero, not buried. Business hours + location visible above the fold. Mobile tap-to-call is mandatory. Policies (cancellation, deposits) reachable without navigating away.
```

---

### 3. Target Audience

**B2B professional (decision-makers, teams)**
```
Audience: B2B professional. Tone: confident, precise, restrained. Palette: neutral-dominant with one disciplined accent. Typography: refined, readable, no decorative display. Copy density: higher — professionals read. Avoid playful motion and emoji-adjacent iconography.
```

**B2C mass-market consumer**
```
Audience: mass-market consumer. Tone: approachable, clear, warm. Palette: can be more expressive. Typography: readable at a glance, clear hierarchy. Copy density: low — short sentences, one idea per section. Motion: subtle delight allowed.
```

**Luxury / high-end consumer**
```
Audience: luxury consumer. Tone: refined, quiet, confident — never loud. Palette: restrained (often monochrome + one deep accent like oxblood, forest, gold). Typography: distinctive editorial serif is mandatory. Layout: generous whitespace, editorial asymmetry. Avoid: gradients, glows, saturated color, playful motion, exclamation marks.
```

**Young / Gen-Z**
```
Audience: Gen-Z. Tone: direct, unpolished on purpose, self-aware. Palette: unexpected combinations — acid tones, oxblood, cobalt, not pastel-and-gradient defaults. Typography: distinctive display face with personality (not geometric-sans defaults). Layout: asymmetric, grid-broken. Motion: expressive, spring-based, can be weird.
```

**Mature / established / traditional**
```
Audience: established/traditional. Tone: trustworthy, classical, grounded. Palette: deep neutrals, one classical accent (navy, oxblood, forest green). Typography: editorial serif display + humanist sans. Layout: structured, symmetric permitted. Motion: minimal — motion reads as flashy to this audience.
```

**Technical / developer**
```
Audience: developer/technical. Tone: precise, no marketing fluff, show-don't-tell. Dark mode primary. Palette: neutral with one accent. Typography: one refined sans + a monospace for code snippets (not for ambiance). Code samples must be real and syntax-highlighted. Avoid: vague "AI-powered" language, developer-stock-photography, gradient hero backgrounds.
```

---

### 4. Brand Personality (3 words)

> User writes 3 concrete words. Feed them verbatim into the prompt:

```
Brand voice (exactly 3 words, non-negotiable): [word1], [word2], [word3].
Every font, color, spacing, and motion decision must be defensible against these three words.
Reject any font/color choice that doesn't serve all three. The words are not "modern" or "elegant" — they are concrete qualities (e.g., "warm, mechanical, opinionated" / "calm, clinical, careful" / "fast, dense, unimpressed").
```

---

### 5. Aesthetic Direction

**Brutally minimal**
```
Aesthetic: brutally minimal. One distinctive typeface, one accent color, generous whitespace, zero decoration. Restraint is the point. No cards unless required. No gradients. No drop shadows. Hierarchy comes from size, weight, and space — never from color or borders. Every element must defend its existence.
```

**Editorial / Magazine**
```
Aesthetic: editorial. Asymmetric multi-column grid, large expressive display type paired with refined body serif, pull-quotes, generous margins, intentional typography-as-art moments. Images are full-bleed or framed with margin, never cropped to identical card shapes. Breaks the grid for emphasis.
```

**Luxury / Refined**
```
Aesthetic: luxury refined. Restrained palette (monochrome + one deep accent — oxblood, forest, gold, midnight). Editorial serif display. Very generous whitespace. Photography is moody and uncropped. Motion is slow and quiet (350–500ms ease-out). No gradients, no glows, no playful touches. Quiet confidence only.
```

**Playful / Expressive**
```
Aesthetic: playful expressive. Unexpected color combinations (acid yellow + oxblood, coral + forest, lilac + rust). Distinctive display typeface with character. Spring-based motion with subtle bounce (bounce 0.1–0.3). Hand-drawn or geometric decorative elements used intentionally. Break symmetry. Still professional — playful ≠ sloppy.
```

**Brutalist / Raw**
```
Aesthetic: brutalist. Raw grid system visible, heavy geometric or grotesque display type, unrendered colors (often a single accent on black/white), minimal easing on motion (or none), sharp corners, borders as structural elements not decoration. Content-first to the point of confrontation. Rejects the softened SaaS aesthetic entirely.
```

**Retro-futuristic**
```
Aesthetic: retro-futuristic. Pulls from specific eras — 1970s mainframe, 80s sci-fi, early-web — not a generic "retro" blur. Monospace or mechanical display type used functionally (not ambiently). Restrained palette pulling from period references. Motion: CRT-style flicker, terminal-style reveals, or deliberate stillness. Commit to one era, not a mashup.
```

**Organic / Natural**
```
Aesthetic: organic natural. Earth palette (moss, clay, sand, bone, ochre) — no neons, no pure blacks. Serif or humanist typography with warm tone. Imagery features natural materials, texture, light. Layout breathes — asymmetric, generous. Motion: slow, spring-physics, gentle. Rounded but not cartoonish corners (8–12px).
```

**Industrial / Utilitarian**
```
Aesthetic: industrial utilitarian. Function-first — every decorative choice must defend itself. Grotesque sans (not geometric — too corporate), mechanical spacing, grid as structure. Palette: neutral with one high-contrast accent (often safety orange, yellow, or cobalt). Hard edges. Motion: minimal, snappy (150ms ease-out max).
```

**Art Deco / Geometric**
```
Aesthetic: art deco geometric. Symmetry and strong geometric forms, gold/brass or deep jewel accents on dark neutral, distinctive display type with geometric personality, decorative rules and frames used architecturally. Typography is a structural element, not just text. Commit fully — half-measures look like generic "premium."
```

**Soft / Pastel / Calm**
```
Aesthetic: soft calm. Low-saturation palette (dusty rose, sage, sand, ivory, pale blue — all tinted toward each other). Rounded corners (12–16px). Generous whitespace. Refined humanist sans or soft serif. Motion: slow and gentle (300–400ms, ease-out). Imagery is soft-lit, natural, uncropped.
```

**Maximalist / Layered**
```
Aesthetic: maximalist. Layered compositions, multiple display faces used with intention, rich color interplay (minimum 3 distinct hues in rotation, not 1 accent), textured or patterned backgrounds, imagery collaged rather than placed. Must remain navigable — maximalism ≠ chaos. Every element still earns its place.
```

---

### 6. Theme Mode

**Light**
```
Theme: light mode only. Background is not pure white — tint toward brand hue (oklch 0.985 0.005 [hue]). Text is not pure black — deep neutral (oklch 0.15 0.02 [hue]). All borders and dividers visible in this mode specifically. Test contrast: body ≥ 4.5:1, secondary text ≥ 3:1.
```

**Dark**
```
Theme: dark mode only. Background is not pure black — tinted deep neutral (oklch 0.15 0.01 [hue]). Surfaces elevate by lightness steps, not by opacity. Text: primary ≥ 4.5:1, secondary ≥ 3:1. Reduce chroma on accent colors at low lightness — high-chroma accents on dark look garish. Never use cyan-on-dark or purple-to-blue gradients.
```

**Both (system-aware)**
```
Theme: both. Design light and dark variants together, not one inferred from the other. Use CSS light-dark() or semantic tokens. Test contrast independently for each. Borders and dividers must remain visible in both. Accent hue may shift chroma between themes to maintain perceptual balance.
```

---

### 7. Accent / Color Strategy

**Single bold accent**
```
Color strategy: 60/30/10 with one accent. 60% neutral surface, 30% secondary text/borders (neutrals tinted toward brand hue), 10% one bold accent color. The accent must be rare — appearing only on primary CTAs, one hero moment, and active states. Using the accent more kills its power.
```

**Two-color contrast**
```
Color strategy: dual accent. One primary accent for CTAs and active states, one secondary for highlights or categorical contrast. Both must appear in the same palette family (not complementary opposites — that reads as political-campaign clashing). Neutrals still dominate 60%.
```

**Monochrome + subtle tint**
```
Color strategy: monochromatic. All surfaces and text derived from a single hue with varying lightness and chroma. One breakthrough accent appears only on the primary CTA. This is the most refined option — hardest to execute, highest reward.
```

**Earth / natural**
```
Color strategy: earth palette. Moss, clay, ochre, sand, bone, terracotta, deep forest. Saturation stays low-to-medium. No pure whites or pure blacks. Accents pulled from the palette itself (e.g., clay as primary CTA, not a new color). OKLCH hues clustered in 30°–90° range.
```

**Vibrant / saturated**
```
Color strategy: vibrant. High-chroma accents used with discipline — still 10% of the surface, just more saturated. Neutrals tinted toward the brand hue to contain the saturation. Forbidden: the AI palette (cyan-on-dark, purple-to-blue gradients, neon-on-dark). Pick unexpected hues: acid yellow, ultramarine, oxblood, coral.
```

**Muted / desaturated**
```
Color strategy: muted. Chroma stays below 0.1 in OKLCH. Palette feels dusty — sage, rose, slate, bone, taupe. Accents are slightly more saturated neutrals, not breakthrough colors. Reads as quiet, intentional, editorial.
```

---

### 8. Brand Color (if provided)

```
Brand hue: [user-provided OKLCH/HEX]. This hue anchors the palette. All neutrals must be tinted toward it (chroma 0.005–0.01 minimum). The accent derives from this hue, adjusted for lightness + chroma to pass contrast. Reduce chroma as lightness approaches white or black — high chroma at extremes looks garish.
```

---

### 9. Corner Radius / Shape Language

**Sharp / square (0px)**
```
Shape language: sharp. All corners 0px — buttons, cards, inputs, images. Reads as editorial, brutalist, or luxury depending on other choices. No exceptions for "modern softness."
```

**Subtle (4–6px)**
```
Shape language: subtle radius (4–6px). Buttons and inputs 4–6px, cards 6–8px, imagery 0 (uncropped). Reads as precise and technical.
```

**Soft (8–12px)**
```
Shape language: soft radius (8–12px). Buttons 8px, inputs 8px, cards 12px, imagery 8–12px. Reads as friendly, modern, approachable. Default for consumer products.
```

**Pill / very rounded (16px+)**
```
Shape language: pill/very rounded. Buttons fully pill-shaped (radius = height/2), cards 16–20px, inputs pill-shaped. Reads as playful, soft, consumer-friendly. Commit fully — mixing pill buttons with sharp cards reads as inconsistent.
```

**Mixed / hierarchical**
```
Shape language: hierarchical radius. Buttons one radius tier (e.g., 8px), cards a larger tier (e.g., 16px), imagery a third (e.g., 4px). Every radius is a design token — no one-off values. Creates visual rhythm without feeling templated.
```

---

### 10. Typography Personality

> All options explicitly REJECT the AI reflex font list: Inter, DM Sans, DM Serif, Plus Jakarta Sans, Space Grotesk, Space Mono, Instrument Sans, Instrument Serif, IBM Plex (any), Fraunces, Newsreader, Lora, Crimson (any), Playfair Display, Cormorant (any), Syne, Outfit.

**Editorial serif display + refined sans body**
```
Typography: editorial serif display paired with a refined humanist sans for body. Display options to consider (not exhaustive): ABC Diatype Mono, Editorial New, PP Editorial Old, GT Sectra, Canela, Söhne Breit, Migra, Apoc. Body options: Söhne, ABC Diatype, Neue Haas Grotesk, Söhne Buch. Modular scale, 1.25+ ratio between steps, fluid clamp() sizing on headings.
```

**Geometric sans (non-reflex)**
```
Typography: geometric sans. Reject the reflex list. Consider instead: Neue Haas Grotesk, Söhne, ABC Diatype, GT America, Monument Grotesk, Aeonik. One face used across weights (light for body, bold for headings, black for display moments). 1.25+ scale ratio.
```

**Humanist sans pairing**
```
Typography: humanist sans. Consider: Söhne, Beatrice, ABC Whyte, Neue Haas Unica, GT Walsheim, Recoleta Alt. Warmer than geometric — better for editorial, hospitality, wellness. Pair a display weight (black/extrabold) for hero with regular for body.
```

**Grotesque / industrial**
```
Typography: grotesque. Consider: Neue Haas Grotesk, Söhne Breit, ABC Monument Grotesk, GT America Condensed, Pangram Sans. Heavy, confident, often condensed. Works for industrial, editorial, brutalist. Pair with itself (display weight + body weight) rather than adding a serif.
```

**Slab serif**
```
Typography: slab serif. Consider: Söhne Schmal Slab, GT Super Text, Roslindale, Caslon Ionic. Adds editorial weight without the preciousness of a didone. Pair with a refined humanist sans for body.
```

**Monospace accent**
```
Typography: monospace as accent (not ambient). Body remains in a refined sans. Monospace used ONLY for: numeric displays, labels, captions, metadata, code. Never used for body copy as "technical vibe" shorthand. Consider: ABC Diatype Mono, JetBrains Mono, TX-02, Söhne Mono.
```

**Hand-drawn / organic display**
```
Typography: organic display for headings. Consider: Migra, Apoc, ABC Whyte, PP Editorial Old, ABC Gaisyr. Adds warmth, personality, anti-corporate feel. Pair with a very refined sans for body so the display carries the personality alone.
```

---

### 11. Layout Rhythm

**Centered symmetric**
```
Layout: centered symmetric. All section content horizontally centered with max-width around 72ch. Works for minimal or editorial aesthetics when done with restraint. Avoid centering everything — vary with one asymmetric section for rhythm.
```

**Left-aligned asymmetric**
```
Layout: left-aligned asymmetric. Content anchors to left rail, varying widths per section. Text never exceeds 65–75ch even in wide containers. Images and pullouts break the text rail deliberately. Reads as editorial and confident.
```

**Grid-broken / editorial**
```
Layout: editorial grid. 12-column grid used as structure, with elements intentionally breaking into adjacent columns for emphasis. Pull-quotes, imagery, and sidebars can span different column counts per section. Never identical section-to-section.
```

**Bento-style cards**
```
Layout: bento grid. Varied card sizes within a consistent grid — some span 2 cols, some 1, some tall, some wide. Each card has a purpose (feature, metric, quote, image, CTA). Avoid identical cards — bento means different sizes. Container queries for internal responsiveness.
```

**Full-bleed / immersive**
```
Layout: full-bleed immersive. Hero and major sections span full viewport width with large imagery or video. Text sections pull back to a max-width 65–75ch centered within the wider container. Works for hospitality, editorial, entertainment.
```

---

### 12. Density

**Airy / generous**
```
Density: airy. Section vertical spacing 96–160px on desktop. Component internal padding generous (24–32px on cards). One idea per screen-height. Reads as premium, confident, editorial. Never cram.
```

**Balanced**
```
Density: balanced. Section spacing 64–96px. Component padding 16–24px. Default for most consumer marketing sites. Varied section spacing creates rhythm — not uniform.
```

**Compact / information-dense**
```
Density: compact. Section spacing 32–48px. Component padding 8–16px. Appropriate for SaaS dashboards, docs, directories. Compensate with stronger type hierarchy — density without hierarchy reads as cramped.
```

---

### 13. Motion Intensity

**Still (no motion)**
```
Motion: none. No entrance animations, no scroll triggers, no hover transforms beyond color/opacity shifts. Reads as confident, editorial, deliberate. prefers-reduced-motion honored by default (because default is none). Button press feedback (opacity or subtle color) only.
```

**Subtle**
```
Motion: subtle. Duration 150–250ms, custom ease-out curve (cubic-bezier(0.23, 1, 0.32, 1)). Entrances use opacity + scale 0.97→1 or translateY 8px→0, never scale(0). Buttons: transform scale(0.97) on :active, 160ms ease-out. Hover states gated behind @media (hover: hover). No scroll-driven animations. Respect prefers-reduced-motion.
```

**Expressive**
```
Motion: expressive. Staggered reveals on section entrance (30–80ms between items). Spring physics on interactive elements (duration 0.5, bounce 0.15–0.25). Custom easing curves (never default CSS easings — they lack punch). Hero has one signature motion moment. Exit animations 60–70% of enter duration. Never block input during animation. Respect prefers-reduced-motion by removing transforms but keeping opacity.
```

**Cinematic**
```
Motion: cinematic. Scroll-driven reveals with IntersectionObserver, hero-level signature animation, shared-element transitions between sections. All motion uses transform/opacity/clip-path only — never animate layout. Springs or custom cubic-bezier easings. Animations are interruptible. prefers-reduced-motion fallback keeps opacity-only transitions — never full removal that breaks comprehension.
```

---

### 14. Imagery Style

**Real photography**
```
Imagery: photography. Full-bleed or large-scale, never small thumbnails. Consistent light and color treatment across all images. Avoid stock-photo-look — generic smiling-in-office shots are an AI tell. Uncropped in hero, never boxed into identical card shapes.
```

**Illustration / vector**
```
Imagery: custom illustration. One consistent illustration style — not mixed. If using stock illustration sets, commit to a single set. Palette of illustrations must match brand palette (not their default colors). Avoid generic isometric-laptop-with-charts illustrations entirely.
```

**3D renders**
```
Imagery: 3D renders. Must be custom or thematically consistent — mixed 3D asset packs read as cheap. Consistent lighting direction and material treatment. Usually one hero 3D moment, not 3D everywhere.
```

**Abstract shapes / typographic**
```
Imagery: abstract/typographic only. Large-scale typography IS the imagery. Geometric shapes derived from the shape-language system used as composition elements. No photography, no illustration. Reads as editorial or brutalist.
```

**Mixed media**
```
Imagery: mixed media. Photography for human moments, illustration for abstract concepts, type for statement moments. A deliberate rhythm between them — never random. Each media type serves a specific narrative role.
```

---

### 15. Required Sections (multi-select)

```
Include these sections, in this order: [user-selected list].

For each section, apply:
- Hero: one clear value prop, one primary CTA, one supporting image/video. No hero-metric template.
- Features/Benefits: varied card sizes, not identical 3-up grids. Copy leads, not icons.
- Social proof: real logos at appropriate contrast, testimonials with real attribution, not stock.
- Pricing: three tiers max, one recommended, no feature-list fatigue (8 items max per tier).
- FAQ: accordion, inline-expandable, 6–10 questions max.
- CTA block: one, near the end, matching the primary CTA's language.
- Contact: form with 3 fields max, or direct methods (phone, email) if appropriate.
- Team: photos consistent in crop and treatment, bios one sentence each.
- Testimonials: quote + name + role/company + photo, not floating cards.
- Blog/articles: list or editorial grid, not identical cards. Reading time + date.
- Gallery: masonry or bento, not identical thumbnails.
```

---

### 16. CTA Urgency

**Soft**
```
CTA tone: soft. Copy: "Learn more", "See how it works", "Read more". No urgency language, no countdown, no "limited time". Button styling matches other buttons — only position and repetition distinguishes primary from secondary.
```

**Direct**
```
CTA tone: direct. Copy: "Get started", "Book a call", "Start your trial", "Start free". Primary CTA visually distinct (filled vs ghost). One primary CTA per section.
```

**Urgent**
```
CTA tone: urgent. Copy: "Book now", "Reserve today", "Claim your spot". Urgency signals permitted if truthful (seats remaining, deadline, price expiry). Never fake scarcity. Button styling commits to attention — color contrast, confident weight.
```

---

### 17. Accessibility Floor

**WCAG AA (default)**
```
Accessibility floor: WCAG AA. Contrast: body 4.5:1, large text 3:1. Visible focus rings on all interactive elements (2–4px). Icon-only buttons have aria-labels. Form fields have visible labels (not placeholder-only). Touch targets 44×44 minimum. prefers-reduced-motion honored.
```

**WCAG AAA (strict)**
```
Accessibility floor: WCAG AAA. Body contrast 7:1, large text 4.5:1. All above-AA requirements enforced. Color never sole indicator of meaning (icons + text paired). Heading hierarchy sequential, no skips. Skip-to-content link. Real devices tested.
```

**Reduced-motion-first**
```
Accessibility: reduced-motion-first. Design assumes prefers-reduced-motion: reduce by default; full-motion variant is the enhancement. No motion required to convey meaning. Opacity-only transitions as the baseline, transforms opt-in.
```

---

### 18. Device Priority

**Mobile-first**
```
Device priority: mobile-first. Design 375px first, scale up. Body 16px minimum (prevents iOS auto-zoom). No horizontal scroll ever. Touch targets 44×44 minimum with 8px spacing between. Fixed headers must account for safe areas and notch. Primary CTA reachable with thumb on mobile.
```

**Desktop-primary**
```
Device priority: desktop-primary. Optimized for 1440px viewport. Still mobile-compliant (no broken layouts below 768px) but visual richness lives on desktop. Appropriate for B2B, portfolio, editorial.
```

**Equal**
```
Device priority: equal. Design considered equivalently for 375px, 768px, 1024px, 1440px. Container queries used for component responsiveness, viewport queries for layout. Critical functionality visible on all sizes — never hide on mobile, adapt.
```

---

### 19. Anti-references (free text)

```
This product must NOT resemble: [user-provided list].
Explicitly avoid aesthetic and structural patterns from those references — palette, typography direction, layout templates, motion language.
```

---

## Part C — Global rules always appended (non-negotiable floor)

These append to every build prompt regardless of selection:

```
GLOBAL FLOOR (non-negotiable):

1. Reject the AI reflex font list entirely: Inter, DM Sans, DM Serif, Space Grotesk, Space Mono, Plus Jakarta Sans, Instrument Sans/Serif, IBM Plex (any), Fraunces, Newsreader, Lora, Crimson (any), Playfair Display, Cormorant (any), Syne, Outfit. Pick from real type foundries (Pangram Pangram, ABC Dinamo, Klim, Grilli Type, Colophon, Displaay, Velvetyne) or the less-used Google Fonts.

2. No gradient text. Ever. No background-clip: text with any gradient.

3. No side-stripe borders (border-left or border-right > 1px) on cards, list items, callouts, or alerts. This is the single most overused AI design tell.

4. No pure black (#000) or pure white (#fff). Always tint toward brand hue, even subtly.

5. No cyan-on-dark, no purple-to-blue gradients, no neon-on-dark. The AI fintech palette is banned.

6. Only animate transform and opacity (and clip-path). Never animate width, height, padding, margin.

7. No scale(0) entries. Start from scale(0.95) + opacity 0.

8. No ease-in on UI entrances. Use custom ease-out curves only.

9. No transition: all. Specify properties explicitly.

10. Buttons get transform: scale(0.97) on :active, transition 160ms ease-out.

11. Popovers use transform-origin anchored to trigger (var(--radix-popover-content-transform-origin) or equivalent). Modals stay center-origin.

12. Use OKLCH, not HSL. Reduce chroma at lightness extremes.

13. Tint neutrals toward brand hue (chroma 0.005–0.01 minimum).

14. Body line-height 1.5–1.75. Line-length 65–75ch.

15. Body text 16px minimum on mobile.

16. Touch targets 44×44 minimum.

17. Visible focus rings on all interactive elements.

18. prefers-reduced-motion respected — removes transforms, keeps opacity.

19. prefers-color-scheme respected if theme is "both".

20. No emojis used as UI icons. SVG only (Lucide, Heroicons, Phosphor, or custom).

21. No identical 3-card feature grids. Vary card sizes and content.

22. No hero-metric template (big number + gradient accent + supporting stats).

23. No card-within-card nesting.

24. No modals for primary flows.

25. The AI Slop Test: if someone could look at this site and guess "AI made it", the design has failed. Distinctiveness is the quality bar.
```

---

## How to wire this into your AI prompt

**Master prompt template:**

```
You are building a production website.

[BUSINESS TYPE fragment]

[PRIMARY GOAL fragment]

[AUDIENCE fragment]

[BRAND PERSONALITY fragment with 3 user words]

[AESTHETIC DIRECTION fragment]

[THEME MODE fragment]

[COLOR STRATEGY fragment]
[BRAND COLOR fragment if provided]

[SHAPE LANGUAGE fragment]

[TYPOGRAPHY fragment]

[LAYOUT RHYTHM fragment]

[DENSITY fragment]

[MOTION INTENSITY fragment]

[IMAGERY STYLE fragment]

[REQUIRED SECTIONS fragment with user's list]

[CTA URGENCY fragment]

[ACCESSIBILITY fragment]

[DEVICE PRIORITY fragment]

[ANTI-REFERENCES fragment if provided]

---

[GLOBAL FLOOR — always appended verbatim]

---

Tech stack: React + Tailwind + Framer Motion + React Router DOM + Lucide icons.
Output: production-ready code, working, distinctive, defensible against the AI Slop Test.
```

Concatenate in this order. Keep the global floor last so it overrides any accidental contradictions in the earlier fragments.
