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


"
PLUS:
UI/UX PRO MAX — COMPLETE DATA DUMP (v2.5.0)                                                                                                                          
                                                                                                                                                                       
---                                                                                                                                                                  
FONT PAIRINGS (73 total)                                                                                                                                             
                
1.  Classic Elegant          | Head: Playfair Display  | Body: Inter               | Mood: elegant, luxury, sophisticated, timeless, premium, editorial         |    
Best For: Luxury brands, fashion, spa, beauty, editorial, high-end e-commerce                                                                                        
2.  Modern Professional      | Head: Poppins           | Body: Open Sans           | Mood: modern, professional, clean, corporate, friendly, approachable       |
Best For: SaaS, corporate sites, business apps, startups                                                                                                             
3.  Tech Startup             | Head: Space Grotesk     | Body: DM Sans             | Mood: tech, startup, modern, innovative, bold, futuristic                  |
Best For: Tech companies, startups, SaaS, developer tools, AI products                                                                                               
4.  Editorial Classic        | Head: Cormorant Garamond| Body: Libre Baskerville   | Mood: editorial, classic, literary, traditional, refined, bookish          |
Best For: Publishing, blogs, news, literary magazines                                                                                                                
5.  Minimal Swiss            | Head: Inter             | Body: Inter               | Mood: minimal, clean, swiss, functional, neutral, professional             |
Best For: Dashboards, admin panels, documentation, enterprise apps                                                                                                   
6.  Playful Creative         | Head: Fredoka           | Body: Nunito              | Mood: playful, friendly, fun, creative, warm, approachable                 |
Best For: Children's apps, educational, gaming, entertainment                                                                                                        
7.  Bold Statement           | Head: Bebas Neue        | Body: Source Sans 3       | Mood: bold, impactful, strong, dramatic, modern, headlines                 |
Best For: Marketing sites, portfolios, agencies, events, sports                                                                                                      
8.  Wellness Calm            | Head: Lora              | Body: Raleway             | Mood: calm, wellness, health, relaxing, natural, organic                   |
Best For: Health apps, wellness, spa, meditation, yoga, organic brands                                                                                               
9.  Developer Mono           | Head: JetBrains Mono    | Body: IBM Plex Sans       | Mood: code, developer, technical, precise, functional, hacker              |
Best For: Developer tools, docs, code editors, tech blogs                                                                                                            
10. Retro Vintage            | Head: Abril Fatface     | Body: Merriweather        | Mood: retro, vintage, nostalgic, dramatic, decorative, bold                |
Best For: Vintage brands, breweries, restaurants, creative portfolios                                                                                                
11. Geometric Modern         | Head: Outfit            | Body: Work Sans           | Mood: geometric, modern, clean, balanced, contemporary, versatile          |
Best For: General purpose, portfolios, agencies, modern brands                                                                                                       
12. Luxury Serif             | Head: Cormorant         | Body: Montserrat          | Mood: luxury, high-end, fashion, elegant, refined, premium                 |
Best For: Fashion brands, luxury e-commerce, jewelry, high-end services                                                                                              
13. Friendly SaaS            | Head: Plus Jakarta Sans | Body: Plus Jakarta Sans   | Mood: friendly, modern, saas, clean, approachable, professional            |
Best For: SaaS products, web apps, dashboards, B2B                                                                                                                   
14. News Editorial           | Head: Newsreader        | Body: Roboto              | Mood: news, editorial, journalism, trustworthy, readable                   |
Best For: News sites, blogs, magazines, journalism                                                                                                                   
15. Handwritten Charm        | Head: Caveat            | Body: Quicksand           | Mood: handwritten, personal, friendly, casual, warm, charming              |
Best For: Personal blogs, invitations, creative portfolios                                                                                                           
16. Corporate Trust          | Head: Lexend            | Body: Source Sans 3       | Mood: corporate, trustworthy, accessible, readable, professional           |
Best For: Enterprise, government, healthcare, finance                                                                                                                
17. Brutalist Raw            | Head: Space Mono        | Body: Space Mono          | Mood: brutalist, raw, technical, monospace, minimal, stark                 |
Best For: Brutalist designs, developer portfolios, experimental                                                                                                      
18. Fashion Forward          | Head: Syne              | Body: Manrope             | Mood: fashion, avant-garde, creative, bold, artistic, edgy                 |
Best For: Fashion brands, creative agencies, art galleries                                                                                                           
19. Soft Rounded             | Head: Varela Round      | Body: Nunito Sans         | Mood: soft, rounded, friendly, approachable, warm, gentle                  |
Best For: Children's products, pet apps, friendly brands, soft UI                                                                                                    
20. Premium Sans             | Head: Satoshi           | Body: General Sans        | Mood: premium, modern, clean, sophisticated, versatile, balanced           |
Best For: Premium brands, modern agencies, SaaS, portfolios                                                                                                          
                                                                                                     
30. Medical Clean            | Head: Figtree           | Body: Noto Sans           | Mood: medical, clean, accessible, professional, healthcare                 |
Best For: Healthcare, medical clinics, pharma, health apps                                                                                                           
31. Financial Trust          | Head: IBM Plex Sans     | Body: IBM Plex Sans       | Mood: financial, trustworthy, professional, corporate, banking             |
Best For: Banks, finance, insurance, investment, fintech                                                                                                             
32. Real Estate Luxury       | Head: Cinzel            | Body: Josefin Sans        | Mood: real estate, luxury, elegant, sophisticated, premium                 |
Best For: Real estate, luxury properties, architecture, interior design                                                                                              
33. Restaurant Menu          | Head: Playfair Display SC| Body: Karla              | Mood: restaurant, menu, culinary, elegant, foodie, hospitality             |
Best For: Restaurants, cafes, food blogs, hospitality                                                                                                                
34. Art Deco                 | Head: Poiret One        | Body: Didact Gothic       | Mood: art deco, vintage, 1920s, elegant, decorative, gatsby                |
Best For: Vintage events, luxury hotels, classic cocktails                                                                                                           
35. Magazine Style           | Head: Libre Bodoni      | Body: Public Sans         | Mood: magazine, editorial, publishing, refined, journalism, print          |
Best For: Magazines, online publications, editorial content                                                                                                          
36. Crypto/Web3              | Head: Orbitron          | Body: Exo 2               | Mood: crypto, web3, futuristic, tech, blockchain, digital                  |
Best For: Crypto platforms, NFT, blockchain, web3, futuristic tech                                                                                                   
37. Gaming Bold              | Head: Russo One         | Body: Chakra Petch        | Mood: gaming, bold, action, esports, competitive, energetic                |
Best For: Gaming, esports, action games, sports, entertainment                                                                                                       
38. Indie/Craft              | Head: Amatic SC         | Body: Cabin               | Mood: indie, craft, handmade, artisan, organic, creative                   |
Best For: Craft brands, indie products, artisan, handmade, organic                                                                                                   
39. Startup Bold             | Head: Clash Display     | Body: Satoshi             | Mood: startup, bold, modern, innovative, confident, dynamic                |
Best For: Startups, pitch decks, product launches, bold brands                                                                                                       
40. E-commerce Clean         | Head: Rubik             | Body: Nunito Sans         | Mood: ecommerce, clean, shopping, product, retail, conversion              |
Best For: E-commerce, online stores, product pages, retail                                                                                                           
41. Academic/Research        | Head: Crimson Pro       | Body: Atkinson Hyperlegible| Mood: academic, research, scholarly, accessible, readable, educational    |
Best For: Universities, research papers, academic journals                                                                                                           
42. Dashboard Data           | Head: Fira Code         | Body: Fira Sans           | Mood: dashboard, data, analytics, code, technical, precise                 |
Best For: Dashboards, analytics, data visualization, admin panels                                                                                                    
43. Music/Entertainment      | Head: Righteous         | Body: Poppins             | Mood: music, entertainment, fun, energetic, bold, performance              |
Best For: Music platforms, entertainment, events, festivals                                                                                                          
44. Minimalist Portfolio     | Head: Archivo           | Body: Space Grotesk       | Mood: minimal, portfolio, designer, creative, clean, artistic              |
Best For: Design portfolios, creative professionals, minimalist brands                                                                                               
45. Kids/Education           | Head: Baloo 2           | Body: Comic Neue          | Mood: kids, education, playful, friendly, colorful, learning               |
Best For: Children's apps, educational games, kid-friendly content                                                                                                   
46. Wedding/Romance          | Head: Great Vibes       | Body: Cormorant Infant    | Mood: wedding, romance, elegant, script, invitation, feminine              |
Best For: Wedding sites, invitations, romantic brands, bridal                                                                                                        
47. Science/Tech             | Head: Exo               | Body: Roboto Mono         | Mood: science, technology, research, data, futuristic, precise             |
Best For: Science, research, tech documentation, data-heavy sites                                                                                                    
48. Accessibility First      | Head: Atkinson Hyperlegible | Body: Atkinson Hyperlegible | Mood: accessible, readable, inclusive, WCAG, dyslexia-friendly         |
Best For: Accessibility-critical sites, government, healthcare                                                                                                       
49. Sports/Fitness           | Head: Barlow Condensed  | Body: Barlow              | Mood: sports, fitness, athletic, energetic, condensed, action              |
Best For: Sports, fitness, gyms, athletic brands                                                                                                                     
50. Luxury Minimalist        | Head: Bodoni Moda       | Body: Jost                | Mood: luxury, minimalist, high-end, sophisticated, refined                 |
Best For: Luxury minimalist brands, high-end fashion                                                                                                                 
51. Tech/HUD Mono            | Head: Share Tech Mono   | Body: Fira Code           | Mood: tech, futuristic, hud, sci-fi, data, monospaced, precise             |
Best For: Sci-fi interfaces, developer tools, cybersecurity                                                                                                          
52. Pixel Retro              | Head: Press Start 2P    | Body: VT323               | Mood: pixel, retro, gaming, 8-bit, nostalgic, arcade                       |
Best For: Pixel art games, retro websites, creative portfolios                                                                                                       
53. Neubrutalist Bold        | Head: Lexend Mega       | Body: Public Sans         | Mood: bold, neubrutalist, loud, strong, geometric, quirky                  |
Best For: Neubrutalist designs, Gen Z brands, bold marketing                                                                                                         
54. Academic/Archival        | Head: EB Garamond       | Body: Crimson Text        | Mood: academic, old-school, university, research, serious, traditional     |
Best For: University sites, archives, research papers, history                                                                                                       
                                                                                     
                
                                                                                                                                
                                                                                                                                                                     
---                                                                                                                                                                  
COLOR PALETTES — 161 PRODUCT TYPES                                                                                                                                   
                                                                                                                                                                     
(Format: Product | Primary | Secondary | Accent | Background | Foreground | Notes)
                                                                                                                                                                     
1.   SaaS (General)                  | #2563EB | #3B82F6 | #EA580C | #F8FAFC | #1E293B | Trust blue + orange CTA
2.   Micro SaaS                      | #6366F1 | #818CF8 | #059669 | #F5F3FF | #1E1B4B | Indigo + emerald CTA                                                        
3.   E-commerce                      | #059669 | #10B981 | #EA580C | #ECFDF5 | #064E3B | Success green + urgency orange                                              
4.   E-commerce Luxury               | #1C1917 | #44403C | #A16207 | #FAFAF9 | #0C0A09 | Premium dark + gold                                                         
5.   B2B Service                     | #0F172A | #334155 | #0369A1 | #F8FAFC | #020617 | Professional navy + blue CTA                                                
6.   Financial Dashboard             | #0F172A | #1E293B | #22C55E | #020617 | #F8FAFC | Dark bg + green indicators                                                  
7.   Analytics Dashboard             | #1E40AF | #3B82F6 | #D97706 | #F8FAFC | #1E3A8A | Blue data + amber highlights                                                
8.   Healthcare App                  | #0891B2 | #22D3EE | #059669 | #ECFEFF | #164E63 | Calm cyan + health green                                                    
9.   Educational App                 | #4F46E5 | #818CF8 | #EA580C | #EEF2FF | #1E1B4B | Playful indigo + orange                                                     
10.  Creative Agency                 | #EC4899 | #F472B6 | #0891B2 | #FDF2F8 | #831843 | Bold pink + cyan                                                            
11.  Portfolio/Personal              | #18181B | #3F3F46 | #2563EB | #FAFAFA | #09090B | Monochrome + blue                                                           
12.  Gaming                          | #7C3AED | #A78BFA | #F43F5E | #0F0F23 | #E2E8F0 | Neon purple + rose                                                          
13.  Government/Public Service       | #0F172A | #334155 | #0369A1 | #F8FAFC | #020617 | High contrast navy                                                          
14.  Fintech/Crypto                  | #F59E0B | #FBBF24 | #8B5CF6 | #0F172A | #F8FAFC | Gold trust + purple tech                                                    
15.  Social Media App                | #E11D48 | #FB7185 | #2563EB | #FFF1F2 | #881337 | Vibrant rose + engagement blue                                              
16.  Productivity Tool               | #0D9488 | #14B8A6 | #EA580C | #F0FDFA | #134E4A | Teal focus + action orange                                                  
17.  Design System/Component Library | #4F46E5 | #6366F1 | #EA580C | #EEF2FF | #312E81 | Indigo brand                                                                
18.  AI/Chatbot Platform             | #7C3AED | #A78BFA | #0891B2 | #FAF5FF | #1E1B4B | AI purple + cyan                                                            
19.  NFT/Web3 Platform               | #8B5CF6 | #A78BFA | #FBBF24 | #0F0F23 | #F8FAFC | Purple tech + gold                                                          
20.  Creator Economy Platform        | #EC4899 | #F472B6 | #EA580C | #FDF2F8 | #831843 | Creator pink + orange                                                       
21.  Remote Work/Collaboration       | #6366F1 | #818CF8 | #059669 | #F5F3FF | #312E81 | Calm indigo + success green                                                 
22.  Mental Health App               | #8B5CF6 | #C4B5FD | #059669 | #FAF5FF | #4C1D95 | Calming lavender + wellness green                                           
23.  Pet Tech App                    | #F97316 | #FB923C | #2563EB | #FFF7ED | #9A3412 | Playful orange + trust blue                                                 
24.  Smart Home/IoT Dashboard        | #1E293B | #334155 | #22C55E | #0F172A | #F8FAFC | Dark tech + status green                                                    
25.  EV/Charging Ecosystem           | #0891B2 | #22D3EE | #16A34A | #ECFEFF | #164E63 | Electric cyan + eco green                                                   
26.  Subscription Box                | #D946EF | #E879F9 | #EA580C | #FDF4FF | #86198F | Excitement purple + orange                                                  
27.  Podcast Platform                | #1E1B4B | #312E81 | #F97316 | #0F0F23 | #F8FAFC | Dark audio + warm accent                                                    
28.  Dating App                      | #E11D48 | #FB7185 | #EA580C | #FFF1F2 | #881337 | Romantic rose + warm orange                                                 
29.  Micro-Credentials/Badges        | #0369A1 | #0EA5E9 | #A16207 | #F0F9FF | #0C4A6E | Trust blue + achievement gold                                               
30.  Knowledge Base/Documentation    | #475569 | #64748B | #2563EB | #F8FAFC | #1E293B | Neutral grey + link blue                                                    
31.  Hyperlocal Services             | #059669 | #10B981 | #EA580C | #ECFDF5 | #064E3B | Location green + action orange                                              
32.  Beauty/Spa/Wellness             | #EC4899 | #F9A8D4 | #8B5CF6 | #FDF2F8 | #831843 | Soft pink + lavender luxury                                                 
33.  Luxury/Premium Brand            | #1C1917 | #44403C | #A16207 | #FAFAF9 | #0C0A09 | Premium black + gold                                                        
34.  Restaurant/Food Service         | #DC2626 | #F87171 | #A16207 | #FEF2F2 | #450A0A | Appetizing red + warm gold                                                  
35.  Fitness/Gym App                 | #F97316 | #FB923C | #22C55E | #1F2937 | #F8FAFC | Energy orange + success green                                               
36.  Real Estate/Property            | #0F766E | #14B8A6 | #0369A1 | #F0FDFA | #134E4A | Trust teal + professional blue                                              
37.  Travel/Tourism Agency           | #0EA5E9 | #38BDF8 | #EA580C | #F0F9FF | #0C4A6E | Sky blue + adventure orange                                                 
38.  Hotel/Hospitality               | #1E3A8A | #3B82F6 | #A16207 | #F8FAFC | #1E40AF | Luxury navy + gold service                                                  
39.  Wedding/Event Planning          | #DB2777 | #F472B6 | #A16207 | #FDF2F8 | #831843 | Romantic pink + elegant gold                                                
40.  Legal Services                  | #1E3A8A | #1E40AF | #B45309 | #F8FAFC | #0F172A | Authority navy + trust gold                                                 
41.  Insurance Platform              | #0369A1 | #0EA5E9 | #16A34A | #F0F9FF | #0C4A6E | Security blue + protected green                                             
42.  Banking/Traditional Finance     | #0F172A | #1E3A8A | #A16207 | #F8FAFC | #020617 | Trust navy + premium gold                                                   
43.  Online Course/E-learning        | #0D9488 | #2DD4BF | #EA580C | #F0FDFA | #134E4A | Progress teal + achievement orange                                          
44.  Non-profit/Charity              | #0891B2 | #22D3EE | #EA580C | #ECFEFF | #164E63 | Compassion blue + action orange                                             
45.  Music Streaming                 | #1E1B4B | #4338CA | #22C55E | #0F0F23 | #F8FAFC | Dark audio + play green                                                     
46.  Video Streaming/OTT             | #0F0F23 | #1E1B4B | #E11D48 | #000000 | #F8FAFC | Cinema dark + play red                                                      
47.  Job Board/Recruitment           | #0369A1 | #0EA5E9 | #16A34A | #F0F9FF | #0C4A6E | Professional blue + success green                                           
48.  Marketplace (P2P)               | #7C3AED | #A78BFA | #16A34A | #FAF5FF | #4C1D95 | Trust purple + transaction green                                            
49.  Logistics/Delivery              | #2563EB | #3B82F6 | #EA580C | #EFF6FF | #1E40AF | Tracking blue + delivery orange                                             
50.  Agriculture/Farm Tech           | #15803D | #22C55E | #A16207 | #F0FDF4 | #14532D | Earth green + harvest gold                                                  
51.  Construction/Architecture       | #64748B | #94A3B8 | #EA580C | #F8FAFC | #334155 | Industrial grey + safety orange                                             
52.  Automotive/Car Dealership       | #1E293B | #334155 | #DC2626 | #F8FAFC | #0F172A | Premium dark + action red                                                   
53.  Photography Studio              | #18181B | #27272A | #F8FAFC | #000000 | #FAFAFA | Pure black + white contrast                                                 
54.  Coworking Space                 | #F59E0B | #FBBF24 | #2563EB | #FFFBEB | #78350F | Energetic amber + booking blue                                              
55.  Home Services                   | #1E40AF | #3B82F6 | #EA580C | #EFF6FF | #1E3A8A | Professional blue + urgent orange                                           
56.  Childcare/Daycare               | #F472B6 | #FBCFE8 | #16A34A | #FDF2F8 | #9D174D | Soft pink + safe green                                                      
57.  Senior Care/Elderly             | #0369A1 | #38BDF8 | #16A34A | #F0F9FF | #0C4A6E | Calm blue + reassuring green                                                
58.  Medical Clinic                  | #0891B2 | #22D3EE | #16A34A | #F0FDFA | #134E4A | Medical teal + health green                                                 
59.  Pharmacy/Drug Store             | #15803D | #22C55E | #0369A1 | #F0FDF4 | #14532D | Pharmacy green + trust blue                                                 
60.  Dental Practice                 | #0EA5E9 | #38BDF8 | #0EA5E9 | #F0F9FF | #0C4A6E | Fresh blue + smile yellow                                                   
61.  Veterinary Clinic               | #0D9488 | #14B8A6 | #EA580C | #F0FDFA | #134E4A | Caring teal + warm orange                                                   
62.  Florist/Plant Shop              | #15803D | #22C55E | #EC4899 | #F0FDF4 | #14532D | Natural green + floral pink                                                 
63.  Bakery/Cafe                     | #92400E | #B45309 | #92400E | #FEF3C7 | #78350F | Warm brown + cream white                                                    
64.  Brewery/Winery                  | #7C2D12 | #B91C1C | #A16207 | #FEF2F2 | #450A0A | Deep burgundy + craft gold                                                  
65.  Airline                         | #1E3A8A | #3B82F6 | #EA580C | #EFF6FF | #1E40AF | Sky blue + booking orange                                                   
66.  News/Media Platform             | #DC2626 | #EF4444 | #1E40AF | #FEF2F2 | #450A0A | Breaking red + link blue                                                    
67.  Magazine/Blog                   | #18181B | #3F3F46 | #EC4899 | #FAFAFA | #09090B | Editorial black + accent pink                                               
68.  Freelancer Platform             | #6366F1 | #818CF8 | #16A34A | #EEF2FF | #312E81 | Creative indigo + hire green                                                
69.  Marketing Agency                | #EC4899 | #F472B6 | #0891B2 | #FDF2F8 | #831843 | Bold pink + creative cyan                                                   
70.  Event Management                | #7C3AED | #A78BFA | #EA580C | #FAF5FF | #4C1D95 | Excitement purple + action orange                                           
71.  Membership/Community            | #7C3AED | #A78BFA | #16A34A | #FAF5FF | #4C1D95 | Community purple + join green                                               
72.  Newsletter Platform             | #0369A1 | #0EA5E9 | #EA580C | #F0F9FF | #0C4A6E | Trust blue + subscribe orange                                               
73.  Digital Products/Downloads      | #6366F1 | #818CF8 | #16A34A | #EEF2FF | #312E81 | Digital indigo + buy green                                                  
74.  Church/Religious Organization   | #7C3AED | #A78BFA | #A16207 | #FAF5FF | #4C1D95 | Spiritual purple + warm gold                                                
75.  Sports Team/Club                | #DC2626 | #EF4444 | #DC2626 | #FEF2F2 | #7F1D1D | Team red + championship gold                                                
76.  Museum/Gallery                  | #18181B | #27272A | #18181B | #FAFAFA | #09090B | Gallery black + white space                                                 
77.  Theater/Cinema                  | #1E1B4B | #312E81 | #CA8A04 | #0F0F23 | #F8FAFC | Dramatic dark + spotlight gold                                              
78.  Language Learning App           | #4F46E5 | #818CF8 | #16A34A | #EEF2FF | #312E81 | Learning indigo + progress green                                            
79.  Coding Bootcamp                 | #0F172A | #1E293B | #22C55E | #020617 | #F8FAFC | Terminal dark + success green                                               
80.  Cybersecurity Platform          | #00FF41 | #0D0D0D | #FF3333 | #000000 | #E0E0E0 | Matrix green + alert red                                                    
81.  Developer Tool / IDE            | #1E293B | #334155 | #22C55E | #0F172A | #F8FAFC | Code dark + run green                                                       
82.  Biotech / Life Sciences         | #0EA5E9 | #0284C7 | #059669 | #F0F9FF | #0C4A6E | DNA blue + life green                                                       
83.  Space Tech / Aerospace          | #F8FAFC | #94A3B8 | #3B82F6 | #0B0B10 | #F8FAFC | Star white + launch blue                                                    
84.  Architecture / Interior         | #171717 | #404040 | #A16207 | #FFFFFF | #171717 | Minimal black + accent gold                                                 
85.  Quantum Computing Interface     | #00FFFF | #7B61FF | #FF00FF | #050510 | #E0E0FF | Quantum cyan + interference purple                                          
86.  Biohacking / Longevity App      | #FF4D4D | #4D94FF | #059669 | #F5F5F7 | #1C1C1E | Bio red/blue + vitality green                                               
87.  Autonomous Drone Fleet Manager  | #00FF41 | #008F11 | #FF3333 | #0D1117 | #E6EDF3 | Terminal green + alert red                                                  
88.  Generative Art Platform         | #18181B | #3F3F46 | #EC4899 | #FAFAFA | #09090B | Canvas neutral + creative pink                                              
89.  Spatial Computing OS / App      | #FFFFFF | #E5E5E5 | #FFFFFF | #888888 | #000000 | Glass white + system blue                                                   
90.  Sustainable Energy / Climate    | #059669 | #10B981 | #059669 | #ECFDF5 | #064E3B | Nature green + solar gold                                                   
91.  Personal Finance Tracker        | #1E40AF | #3B82F6 | #059669 | #0F172A | #FFFFFF | Trust blue + profit green (dark)                                            
92.  Chat & Messaging App            | #2563EB | #6366F1 | #059669 | #FFFFFF | #0F172A | Messenger blue + online green                                               
93.  Notes & Writing App             | #78716C | #A8A29E | #D97706 | #FFFBEB | #0F172A | Warm ink + amber on cream                                                   
94.  Habit Tracker                   | #D97706 | #F59E0B | #059669 | #FFFBEB | #0F172A | Streak amber + habit green                                                  
95.  Food Delivery / On-Demand       | #EA580C | #F97316 | #2563EB | #FFF7ED | #0F172A | Appetizing orange + trust blue                                              
96.  Ride Hailing / Transportation   | #1E293B | #334155 | #2563EB | #0F172A | #FFFFFF | Map dark + route blue                                                       
97.  Recipe & Cooking App            | #9A3412 | #C2410C | #059669 | #FFFBEB | #0F172A | Warm terracotta + fresh green                                               
98.  Meditation & Mindfulness        | #7C3AED | #8B5CF6 | #059669 | #FAF5FF | #0F172A | Calm lavender + mindful green                                               
99.  Weather App                     | #0284C7 | #0EA5E9 | #F59E0B | #F0F9FF | #0F172A | Sky blue + sun amber                                                        
100. Diary & Journal App             | #92400E | #A16207 | #6366F1 | #FFFBEB | #0F172A | Warm journal brown + ink violet                                             
101. CRM & Client Management         | #2563EB | #3B82F6 | #059669 | #F8FAFC | #0F172A | Professional blue + deal green                                              
102. Inventory & Stock Management    | #334155 | #475569 | #059669 | #F8FAFC | #0F172A | Industrial slate + stock green                                              
103. Flashcard & Study Tool          | #7C3AED | #8B5CF6 | #059669 | #FAF5FF | #0F172A | Study purple + correct green                                                
104. Booking & Appointment App       | #0284C7 | #0EA5E9 | #059669 | #F0F9FF | #0F172A | Calendar blue + available green                                             
105. Invoice & Billing Tool          | #1E3A5F | #2563EB | #059669 | #F8FAFC | #0F172A | Navy professional + paid green                                              
106. Grocery & Shopping List         | #059669 | #10B981 | #D97706 | #ECFDF5 | #0F172A | Fresh green + food amber                                                    
107. Timer & Pomodoro                | #DC2626 | #EF4444 | #059669 | #0F172A | #FFFFFF | Focus red (dark) + break green                                              
108. Parenting & Baby Tracker        | #EC4899 | #F472B6 | #0284C7 | #FDF2F8 | #0F172A | Soft pink + trust blue                                                      
109. Scanner & Document Manager      | #1E293B | #334155 | #2563EB | #F8FAFC | #0F172A | Document grey + scan blue                                                   
110. Calendar & Scheduling App       | #2563EB | #3B82F6 | #059669 | #F8FAFC | #0F172A | Calendar blue + event green                                                 
111. Password Manager                | #1E3A5F | #334155 | #059669 | #0F172A | #FFFFFF | Vault dark blue + secure green                                              
112. Expense Splitter / Bill Split   | #059669 | #10B981 | #DC2626 | #F8FAFC | #0F172A | Balance green + owe red                                                     
113. Voice Recorder & Memo           | #DC2626 | #EF4444 | #2563EB | #FFFFFF | #0F172A | Recording red + waveform blue                                               
114. Bookmark & Read-Later           | #D97706 | #F59E0B | #2563EB | #FFFBEB | #0F172A | Warm amber + link blue                                                      
115. Translator App                  | #2563EB | #0891B2 | #EA580C | #F8FAFC | #0F172A | Global blue + teal + accent orange                                          
116. Calculator & Unit Converter     | #EA580C | #F97316 | #2563EB | #1C1917 | #FFFFFF | Operation orange on dark                                                    
117. Alarm & World Clock             | #D97706 | #F59E0B | #6366F1 | #0F172A | #FFFFFF | Time amber + night indigo (dark)                                            
118. File Manager & Transfer         | #2563EB | #3B82F6 | #D97706 | #F8FAFC | #0F172A | Folder blue + file amber                                                    
119. Email Client                    | #2563EB | #3B82F6 | #DC2626 | #FFFFFF | #0F172A | Inbox blue + priority red                                                   
120. Casual Puzzle Game              | #EC4899 | #8B5CF6 | #F59E0B | #FDF2F8 | #0F172A | Cheerful pink + reward gold                                                 
121. Trivia & Quiz Game              | #2563EB | #7C3AED | #F59E0B | #EFF6FF | #0F172A | Quiz blue + gold leaderboard                                                
122. Card & Board Game               | #15803D | #166534 | #D97706 | #0F172A | #FFFFFF | Felt green + gold (dark)                                                    
123. Idle & Clicker Game             | #D97706 | #F59E0B | #7C3AED | #FFFBEB | #0F172A | Coin gold + prestige purple                                                 
124. Word & Crossword Game           | #15803D | #059669 | #D97706 | #FFFFFF | #0F172A | Word green + letter amber                                                   
125. Arcade & Retro Game             | #DC2626 | #2563EB | #22C55E | #0F172A | #FFFFFF | Neon red+blue (dark) + score green                                          
126. Photo Editor & Filters          | #7C3AED | #6366F1 | #0891B2 | #0F172A | #FFFFFF | Editor violet + filter cyan (dark)                                          
127. Short Video Editor              | #EC4899 | #DB2777 | #2563EB | #0F172A | #FFFFFF | Video pink (dark) + timeline blue                                           
128. Drawing & Sketching Canvas      | #7C3AED | #8B5CF6 | #0891B2 | #1C1917 | #FFFFFF | Canvas purple + tool teal (dark)                                            
129. Music Creation & Beat Maker     | #7C3AED | #6366F1 | #22C55E | #0F172A | #FFFFFF | Studio purple + waveform green (dark)                                       
130. Meme & Sticker Maker            | #EC4899 | #F59E0B | #2563EB | #FFFFFF | #0F172A | Viral pink + comedy yellow + share blue                                     
131. AI Photo & Avatar Generator     | #7C3AED | #6366F1 | #EC4899 | #FAF5FF | #0F172A | AI purple + generation pink                                                 
132. Link-in-Bio Page Builder        | #2563EB | #7C3AED | #EC4899 | #FFFFFF | #0F172A | Brand blue + creator purple                                                 
133. Wardrobe & Outfit Planner       | #BE185D | #EC4899 | #D97706 | #FDF2F8 | #0F172A | Fashion rose + gold accent                                                  
134. Plant Care Tracker              | #15803D | #059669 | #D97706 | #F0FDF4 | #0F172A | Nature green + sun yellow                                                   
135. Book & Reading Tracker          | #78716C | #92400E | #D97706 | #FFFBEB | #0F172A | Book brown + page amber                                                     
136. Couple & Relationship App       | #BE185D | #EC4899 | #DC2626 | #FDF2F8 | #0F172A | Romance rose + love red                                                     
137. Family Calendar & Chores        | #2563EB | #059669 | #D97706 | #F8FAFC | #0F172A | Family blue + chore green                                                   
138. Mood Tracker                    | #7C3AED | #6366F1 | #D97706 | #FAF5FF | #0F172A | Mood purple + insight amber                                                 
139. Gift & Wishlist                 | #DC2626 | #D97706 | #EC4899 | #FFF1F2 | #0F172A | Gift red + gold + surprise pink                                             
140. Running & Cycling GPS           | #EA580C | #F97316 | #059669 | #0F172A | #FFFFFF | Energetic orange + pace green (dark)                                        
141. Yoga & Stretching Guide         | #6B7280 | #78716C | #0891B2 | #F5F5F0 | #0F172A | Sage neutral + calm teal                                                    
142. Sleep Tracker                   | #4338CA | #6366F1 | #7C3AED | #0F172A | #FFFFFF | Night indigo + dream violet (dark)                                          
143. Calorie & Nutrition Counter     | #059669 | #10B981 | #EA580C | #ECFDF5 | #0F172A | Healthy green + macro orange                                                
144. Period & Cycle Tracker          | #BE185D | #EC4899 | #7C3AED | #FDF2F8 | #0F172A | Blush rose + fertility lavender                                             
145. Medication & Pill Reminder      | #0284C7 | #0891B2 | #DC2626 | #F0F9FF | #0F172A | Medical blue + alert red                                                    
146. Water & Hydration Reminder      | #0284C7 | #06B6D4 | #0891B2 | #F0F9FF | #0F172A | Refreshing blue + water cyan                                                
147. Fasting & Intermittent Timer    | #6366F1 | #4338CA | #059669 | #0F172A | #FFFFFF | Fasting indigo (dark) + eating green                                        
148. Anonymous Community/Confession  | #475569 | #334155 | #0891B2 | #0F172A | #FFFFFF | Protective grey + subtle teal (dark)                                        
149. Local Events & Discovery        | #EA580C | #F97316 | #2563EB | #FFF7ED | #0F172A | Event orange + map blue                                                     
150. Study Together / Virtual Cowork | #2563EB | #3B82F6 | #059669 | #F8FAFC | #0F172A | Focus blue + session green                                                  
151. Coding Challenge & Practice     | #22C55E | #059669 | #D97706 | #0F172A | #FFFFFF | Code green (dark) + difficulty amber                                        
152. Kids Learning (ABC & Math)      | #2563EB | #F59E0B | #EC4899 | #EFF6FF | #0F172A | Learning blue + play yellow + fun pink                                      
153. Music Instrument Learning       | #DC2626 | #9A3412 | #D97706 | #FFFBEB | #0F172A | Musical red + warm amber                                                    
154. Parking Finder                  | #2563EB | #059669 | #DC2626 | #F0F9FF | #0F172A | Available blue/green + occupied red                                         
155. Public Transit Guide            | #2563EB | #0891B2 | #EA580C | #F8FAFC | #0F172A | Transit blue + line colors                                                  
156. Road Trip Planner               | #EA580C | #0891B2 | #D97706 | #FFF7ED | #0F172A | Adventure orange + map teal                                                 
157. VPN & Privacy Tool              | #1E3A5F | #334155 | #22C55E | #0F172A | #FFFFFF | Shield dark + connected green                                               
158. Emergency SOS & Safety          | #DC2626 | #EF4444 | #2563EB | #FFF1F2 | #0F172A | Alert red + safety blue                                                     
159. Wallpaper & Theme App           | #7C3AED | #EC4899 | #2563EB | #FAF5FF | #0F172A | Aesthetic purple + trending pink                                            
160. White Noise & Ambient Sound     | #475569 | #334155 | #4338CA | #0F172A | #FFFFFF | Ambient grey + deep indigo (dark)                                           
161. Home Decoration & Interior      | #78716C | #A8A29E | #D97706 | #FAF5F2 | #0F172A | Interior warm grey + gold accent                                            
                                                                                                                                                                     
---                                                                                                                                                                  
PRODUCT TYPE → STYLE & LANDING RECOMMENDATIONS (161 types, first 50 shown as pattern — full list available)                                                          
                                                                                                                                                                     
1.   SaaS (General)            | Style: Glassmorphism + Flat Design          | Landing: Hero + Features + CTA       | Colors: Trust blue + accent contrast
2.   Micro SaaS               | Style: Flat Design + Vibrant & Block        | Landing: Minimal & Direct + Demo     | Colors: Vibrant primary + white space           
3.   E-commerce               | Style: Vibrant & Block-based                | Landing: Feature-Rich Showcase       | Colors: Brand primary + success green           
4.   E-commerce Luxury        | Style: Liquid Glass + Glassmorphism         | Landing: Feature-Rich Showcase       | Colors: Premium colors + minimal accent         
5.   B2B Service              | Style: Trust & Authority + Minimal          | Landing: Feature-Rich Showcase       | Colors: Professional blue + neutral grey        
6.   Financial Dashboard      | Style: Dark Mode (OLED) + Data-Dense        | Landing: N/A — Dashboard focused     | Colors: Dark bg + red/green alerts + trust blue 
7.   Analytics Dashboard      | Style: Data-Dense + Heat Map Style          | Landing: N/A — Analytics focused     | Colors: Cool→Hot gradients + neutral grey       
8.   Healthcare App           | Style: Neumorphism + Accessible & Ethical   | Landing: Social Proof-Focused        | Colors: Calm blue + health green + trust        
9.   Educational App          | Style: Claymorphism + Micro-interactions    | Landing: Storytelling-Driven         | Colors: Playful colors + clear hierarchy        
10.  Creative Agency          | Style: Brutalism + Motion-Driven            | Landing: Storytelling-Driven         | Colors: Bold primaries + artistic freedom       
11.  Portfolio/Personal       | Style: Minimalism + Exaggerated Minimalism  | Landing: Minimal & Direct            | Colors: Monochrome + single accent              
12.  Gaming                   | Style: Cyberpunk UI + 3D & Hyperrealism     | Landing: Feature-Rich Showcase       | Colors: Neon accents + dark bg                  
13.  Government/Public        | Style: Accessible & Ethical + Flat Design   | Landing: Trust & Authority           | Colors: High contrast navy + accessible         
14.  Fintech/Crypto           | Style: Dark Mode + Glassmorphism            | Landing: Hero + Features + CTA       | Colors: Gold trust + purple tech                
15.  Social Media             | Style: Vibrant & Block + Motion-Driven      | Landing: Feature-Rich Showcase       | Colors: Vibrant rose + engagement blue          
16.  Productivity Tool        | Style: Flat Design + Soft UI Evolution      | Landing: Minimal & Direct            | Colors: Teal focus + action orange              
17.  Design System/Library    | Style: Minimalism + Flat Design             | Landing: Feature-Rich Showcase       | Colors: Indigo brand + doc hierarchy            
18.  AI/Chatbot Platform      | Style: AI-Native UI + Aurora UI             | Landing: Interactive Product Demo    | Colors: AI purple + cyan                        
19.  NFT/Web3 Platform        | Style: Cyberpunk UI + Dark Mode             | Landing: Storytelling-Driven         | Colors: Purple tech + gold value                
20.  Creator Economy          | Style: Vibrant & Block + Motion-Driven      | Landing: Feature-Rich Showcase       | Colors: Creator pink + engagement orange        
                                                                                                                                                                     
---                                                                                                                                                                  
LANDING PAGE PATTERNS (34 total)                                                                                                                                     
                
1.  Hero + Features + CTA              | CTA Placement: Hero (sticky) + Bottom  | Colors: Brand primary hero + contrast accent CTA
2.  Hero + Testimonials + CTA          | CTA Placement: Hero + Post-testimonials | Colors: Brand + light testimonial bg + vibrant CTA                                
3.  Product Demo + Features            | CTA Placement: Video center + Right/Bottom | Colors: Brand overlay on video + icon accent #0080FF                           
4.  Minimal Single Column              | CTA Placement: Center, large CTA button | Colors: Brand + white + high contrast accent                                      
5.  Funnel (3-Step Conversion)         | CTA Placement: Mini CTAs per step + Final | Colors: Red (problem) → Orange (process) → Green (solution)                     
6.  Comparison Table + CTA             | CTA Placement: Table right + Below table | Colors: Alternating rows + your product highlighted                              
7.  Lead Magnet + Form                 | CTA Placement: Form submit button        | Colors: Professional design + clean white form                                   
8.  Pricing Page + CTA                 | CTA Placement: Each card + Sticky nav    | Colors: Free grey / Starter blue / Pro green / Enterprise dark                   
9.  Video-First Hero                   | CTA Placement: Overlay center/bottom + Section | Colors: Dark overlay 60% + brand accent CTA                                
10. Scroll-Triggered Storytelling      | CTA Placement: End of each chapter + Climax | Colors: Progressive reveal, chapter-distinct colors                           
11. AI Personalization Landing         | CTA Placement: Context-aware by segment  | Colors: Adaptive based on user data                                              
12. Waitlist/Coming Soon               | CTA Placement: Email form above fold + Sticky | Colors: Dark + accent highlights + urgency                                  
13. Comparison Table Focus             | CTA Placement: After table (highlighted row) | Colors: Your column highlighted (accent bg or green)                         
14. Pricing-Focused Landing            | CTA Placement: Each pricing card + Sticky nav | Colors: Popular plan highlighted (brand border)                             
15. App Store Style Landing            | CTA Placement: Download buttons throughout | Colors: Dark/light app store feel + gold star ratings                          
16. FAQ/Documentation Landing          | CTA Placement: Search bar + Contact CTA  | Colors: Clean, minimal, category icons in brand color                            
17. Immersive/Interactive Experience   | CTA Placement: After interaction complete | Colors: Immersive colors, dark bg focus                                         
18. Event/Conference Landing           | CTA Placement: Register CTA sticky + After speakers | Colors: Urgency (countdown) + event branding                          
19. Product Review/Ratings Focused     | CTA Placement: After reviews + Buy button | Colors: Trust + gold stars + verified badge green                               
20. Community/Forum Landing            | CTA Placement: Join button + After members | Colors: Warm, welcoming + member photo humanization                            
21. Before-After Transformation        | CTA Placement: After transformation + Bottom | Colors: Muted/grey (before) → Vibrant/colorful (after)                       
22. Marketplace / Directory            | CTA Placement: Hero Search Bar + Navbar  | Colors: Search high contrast + categories visual icons                           
23. Newsletter / Content First         | CTA Placement: Hero inline form + Sticky header | Colors: Minimalist, paper-like bg, text focus                             
24. Webinar Registration               | CTA Placement: Hero right-side form + Bottom | Colors: Urgency red/orange + professional blue                               
25. Enterprise Gateway                 | CTA Placement: Contact Sales + Login     | Colors: Corporate navy/grey + high integrity                                     
26. Portfolio Grid                     | CTA Placement: Project card hover + Footer | Colors: Neutral bg (let work shine) + minimal accent                           
27. Horizontal Scroll Journey          | CTA Placement: Floating sticky or end of track | Colors: Continuous palette transition + progress bar                       
28. Bento Grid Showcase                | CTA Placement: Floating Action Button or Bottom | Colors: #F5F5F7 cards / Glass + vibrant brand icons                       
29. Interactive 3D Configurator        | CTA Placement: Inside configurator + Sticky bottom | Colors: Neutral studio bg + realistic materials                        
30. AI-Driven Dynamic Landing          | CTA Placement: Input Field (Hero) + Try it | Colors: Adaptive to user input + dark mode + neon                              
31. Feature-Rich Showcase              | CTA Placement: Hero (sticky) + After features + Bottom | Colors: Brand primary + #FAFAFA card bg                            
32. Hero-Centric Design                | CTA Placement: Hero dominant + Sticky nav | Colors: High-impact visual + minimal text + 7:1 contrast CTA                    
33. Trust & Authority + Conversion     | CTA Placement: Contact Sales / Get Quote  | Colors: Navy/grey corporate + trust blue + CTA accent only                      
34. Real-Time / Operations Landing     | CTA Placement: Primary CTA in nav + After metrics | Colors: Dark or neutral + status colors (green/amber/red)               
                                                                                                                                                                     
                                                                                                                                                         
---                                                                                                                                                                  
UX GUIDELINES (99 rules — key rules by category)                                                                                                                     
                                                                                                                                                                     
NAVIGATION:
- Smooth scroll: use scroll-behavior: smooth on html                                                                                                                 
- Sticky nav: add padding-top equal to nav height to prevent content overlap                                                                                         
- Active state: highlight current page/section (color/underline)                                                                                                     
- Back button: always preserve navigation history (never break it)                                                                                                   
- Deep linking: update URL on every state/view change                                                                                                                
- Breadcrumbs: use for 3+ levels deep hierarchy                                                                                                                      
                                                                                                                                                                     
ANIMATION:                                                                                                                                                           
- Max 1-2 animated elements per view                                                                                                                                 
- Duration: 150-300ms for micro-interactions; never >500ms for UI                                                                                                    
- Always check prefers-reduced-motion                                                                                                                                
- Show skeleton/spinner for operations >300ms                                                                                                                        
- Use hover/click not hover-only for primary actions                                                                                                                 
- No infinite decorative animations; only loaders                                                                                                                    
- Use transform/opacity only; never animate width/height/top/left                                                                                                    
- Easing: ease-out entering, ease-in exiting; never linear for UI                                                                                                    
                                                                                                                                                                     
LAYOUT:                                                                                                                                                              
- Define z-index scale system (10 / 20 / 30 / 50); never arbitrary large values                                                                                      
- Test overflow-hidden carefully before applying                                                                                                                     
- Account for safe areas with fixed positioned elements                                                                                                              
- Reserve space for async content (prevent CLS)                                                                                                                      
- Use min-h-dvh not h-screen on mobile                                                                                                                               
- Limit text max-width (max-w-prose for readability)                                                                                                                 
                                                                                                                                                                     
TOUCH:                                                                                                                                                               
- Min 44×44px touch targets                                                                                                                                          
- Min 8px gap between touch targets                                                                                                                                  
- Avoid horizontal swipe on main content (conflicts with system)
- Use touch-action: manipulation to reduce 300ms delay                                                                                                               
- Disable pull-to-refresh where not needed (overscroll-behavior: contain)
                                                                                                                                                                     
INTERACTION:    
- Visible focus rings: focus:ring-2 focus:ring-blue-500                                                                                                              
- Hover states: change cursor + visual change                                                                                                                        
- Active/press states: add visual feedback
- Disabled: opacity-50 + cursor-not-allowed                                                                                                                          
- Loading buttons: disable during async + show spinner                                                                                                               
- Error feedback: clear messages near the problem                                                                                                                    
- Success feedback: toast/checkmark confirmation                                                                                                                     
- Confirmation dialogs before destructive actions
                                                                                                                                                                     
ACCESSIBILITY:  
- Contrast: min 4.5:1 for normal text; 3:1 for large text                                                                                                            
- Never convey info by color alone (add icon/text)                                                                                                                   
- Descriptive alt text on all meaningful images
- Sequential heading hierarchy h1→h2→h3 (no skipping)                                                                                                                
- aria-label on all icon-only buttons                                                                                                                                
- Full keyboard navigation (tab order matches visual order)                                                                                                          
- Use semantic HTML (<nav>, <main>, <article>)                                                                                                                       
- label[for] on all inputs
- role="alert" / aria-live for dynamic error messages                                                                                                                
- Skip to main content link
                                                                                                                                                                     
PERFORMANCE:    
- Use WebP/AVIF + srcset for images                                                                                                                                  
- Declare width/height on images (prevents CLS)
- Lazy load below-fold images (loading="lazy")                                                                                                                       
- Code split by route (dynamic imports)
- font-display: swap                                                                                                                                                 
- Load third-party scripts async/defer
- Virtualize lists with 50+ items                                                                                                                                    
                                                                                                                                                                     
FORMS:                                                                                                                                                               
- Always show visible labels (never placeholder-only)                                                                                                                
- Show errors below the related field                                                                                                                                
- Validate on blur, not on every keystroke
- Use semantic input types (email, tel, number, url)                                                                                                                 
- Use autocomplete attributes
- Mark required fields with asterisk                                                                                                                                 
- Password show/hide toggle
- Submit button: loading → success/error state                                                                                                                       
                                                                                                                                                                     
RESPONSIVE:
- Mobile-first breakpoints                                                                                                                                           
- Test at 320 / 375 / 414 / 768 / 1024 / 1440px
- Min 16px body text on mobile (avoids iOS auto-zoom)                                                                                                                
- Viewport meta: width=device-width initial-scale=1 (never disable zoom)                                                                                             
- No horizontal scroll on mobile                                                                                                                                     
                                                                                                                                                                     
TYPOGRAPHY:                                                                                                                                                          
- Line height 1.5–1.75 for body
- Line length 65–75 characters per line                                                                                                                              
- Min 16px body text on mobile                                                                                                                                       
- Use consistent type scale (12 / 14 / 16 / 18 / 24 / 32)                                                                                                            
- Dark text on light backgrounds (slate-900 on white)                                                                                                                
- Headings clearly differentiated from body (size + weight)                                                                                                          
                                                                                                                                                                     
FEEDBACK:                                                                                                                                                            
- Spinner/skeleton for loading >300ms                                                                                                                                
- Helpful empty states with action (not blank)
- Error messages must include recovery path (retry button)                                                                                                           
- Progress indicators for multi-step flows                                                                                                                           
- Auto-dismiss toasts in 3–5s                                                                                                                                        
                                                                                                                                                                     
---             
REACT NATIVE GUIDELINES (51 rules)                                                                                                                                   
                                                                                                                                                                     
COMPONENTS:
- Use functional components with hooks (not class components)                                                                                                        
- Keep components small (single responsibility)
- Use TypeScript for type safety
- Colocate component files (folder with index.tsx + styles.ts)                                                                                                       
                                                                                                                                                                     
STYLING:                                                                                                                                                             
- Always use StyleSheet.create (never inline style objects in render)                                                                                                
- Flexbox for all layout (not absolute positioning everywhere)                                                                                                       
- Use Platform.select or .ios/.android files for platform differences                                                                                                
- Use Dimensions or useWindowDimensions for responsive sizing (not fixed px)                                                                                         
                                                                                                                                                                     
NAVIGATION:                                                                                                                                                          
- Use React Navigation                                                                                                                                               
- Type all navigation params
- Configure deep linking (linking prop)
- Handle Android back button with useFocusEffect + BackHandler                                                                                                       
                                                                                                                                                                     
STATE:                                                                                                                                                               
- useState for UI state; useReducer for complex related state                                                                                                        
- Context only for theme/auth/locale (not frequently changing data)                                                                                                  
- Zustand for simple global state; Redux for complex                                                                                                                 
                                                                                                                                                                     
LISTS:                                                                                                                                                               
- FlatList for 50+ items (never ScrollView with .map)
- Always provide stable keyExtractor (not index)                                                                                                                     
- React.memo for all list item components                                                                                                                            
- getItemLayout when item height is known (skips measurement)                                                                                                        
- Adjust windowSize for large lists to reduce memory                                                                                                                 
                                                                                                                                                                     
PERFORMANCE:                                                                                                                                                         
- React.memo for pure components                                                                                                                                     
- useCallback for handlers passed as props
- useMemo for expensive computations
- No anonymous functions in JSX
- Enable Hermes engine in build config                                                                                                                               
 
IMAGES:                                                                                                                                                              
- Use expo-image (better caching, blur, performance)
- Always specify width and height for remote images                                                                                                                  
- Set appropriate resizeMode (cover/contain, not stretch)
                                                                                                                                                                     
FORMS:          
- Controlled inputs only (value + onChangeText)                                                                                                                      
- KeyboardAvoidingView to prevent hidden-by-keyboard issues                                                                                                          
- Correct keyboardType for each input type
                                                                                                                                                                     
TOUCH:          
- Use Pressable (not TouchableOpacity for new code)                                                                                                                  
- Visual feedback on press (ripple or opacity change)                                                                                                                
- hitSlop for small icons/buttons (≥44×44pt effective area)
                                                                                                                                                                     
ANIMATION:      
- react-native-reanimated for complex animations (not Animated API)                                                                                                  
- Run animations on UI thread (worklets)                                                                                                                             
- react-native-gesture-handler for gesture recognition
- Always check reduceMotionEnabled; skip animations if true                                                                                                          
- Reserve Animated.loop only for loaders (not decorative)                                                                                                            
                                                                                                                                                                     
ASYNC:                                                                                                                                                               
- ActivityIndicator for loading >300ms
- Error UI with fallback for failed requests                                                                                                                         
- AbortController / cleanup on unmount (prevent memory leaks)                                                                                                        
 
ACCESSIBILITY:                                                                                                                                                       
- accessibilityLabel on every interactive element
- accessibilityRole for semantic meaning                                                                                                                             
- Test with TalkBack (Android) + VoiceOver (iOS)
                                                                                                                                                                     
TESTING:        
- React Native Testing Library (render + fireEvent)                                                                                                                  
- Test on real iOS AND Android devices (not simulators only)
- Detox for critical E2E flows                                                                                                                                       
                                                                                                                                                                     
NATIVE:                                                                                                                                                              
- Batch native bridge calls (bridge has overhead)                                                                                                                    
- Use Expo for standard features (avoids bare RN complexity)                                                                                                         
- Always check and request permissions before use                                                                                                                    
                                                                                                                                                                     
---                                                                                                                                                                  
ICONS — PHOSPHOR LIBRARY (105 icons)
                                                                                                                                                                     
NAVIGATION:    List, ArrowLeft, ArrowRight, CaretDown, CaretUp, House, X, ArrowSquareOut
ACTION:        Plus, Minus, Trash, PencilSimple, FloppyDisk, DownloadSimple, UploadSimple, Copy, Share, MagnifyingGlass, Funnel, Gear                                
STATUS:        Check, CheckCircle, XCircle, Warning, WarningCircle, Info, CircleNotch (animate-spin), Clock                                                          
COMMUNICATION: Envelope, ChatCircle, Phone, PaperPlaneTilt, Bell                                                                                                     
USER:          User, Users, UserPlus, SignIn, SignOut                                                                                                                
MEDIA:         Image, Video, Play, Pause, SpeakerHigh, Microphone, Camera                                                                                            
COMMERCE:      ShoppingCart, ShoppingBag, CreditCard, CurrencyDollar, Tag, Gift, Percent                                                                             
DATA:          ChartBar, ChartPie, TrendUp, TrendDown, Activity, Database                                                                                            
FILES:         File, FileText, Folder, FolderOpen, Paperclip, Link, Clipboard                                                                                        
LAYOUT:        GridFour, ListBullets, Columns, ArrowsOut, ArrowsIn, Sidebar                                                                                          
SOCIAL:        Heart, Star, ThumbsUp, ThumbsDown, Bookmark, Flag                                                                                                     
DEVICE:        DeviceMobile, DeviceTablet, Monitor, Laptop, Printer                                                                                                  
SECURITY:      Lock, LockOpen, Shield, Key, Eye, EyeSlash                                                                                                            
LOCATION:      MapPin, Map, Compass, Globe                                                                                                                           
TIME:          Calendar, ArrowsClockwise, ArrowCounterClockwise, ArrowClockwise                                                                                      
DEVELOPMENT:   Code, Terminal, GitBranch, GithubLogo                                                                                                                 
                                                                                                                                                                     
Import pattern: import { IconName } from '@phosphor-icons/react'                                                                                                     
Usage: <IconName size={20} weight="regular" />                                                                                                                       
Fallback library: Heroicons (@heroicons/react/24/outline or /solid)                                                                                                  
                                                                                                                                                                     
---                                                                                                                                                                  
APP INTERFACE GUIDELINES — MOBILE (30 critical rules)                                                                                                                
                                                                                                                                                                     
ACCESSIBILITY:
- Icon-only buttons MUST have accessibilityLabel (Critical)                                                                                                          
- All inputs MUST have visible label + accessibilityLabel (Critical)
- Interactive elements MUST have correct accessibilityRole (High)                                                                                                    
- Async status updates: use accessibilityLiveRegion="polite" (Medium)                                                                                                
- Decorative icons: accessible={false} importantForAccessibility="no" (Medium)                                                                                       
                                                                                                                                                                     
TOUCH:                                                                                                                                                               
- Min 44×44pt touch target; use hitSlop if smaller (Critical)                                                                                                        
- Min 8dp gap between adjacent touchables (Medium)                                                                                                                   
- Don't conflict custom gestures with system scroll/back (High)                                                                                                      
                                                                                                                                                                     
NAVIGATION:                                                                                                                                                          
- Back button: always navigation.goBack() — never exitApp() on first press (Critical)                                                                                
- Bottom tab bar: max 5 items (Medium)                                                                                                                               
- Modals MUST have close button + swipe-down affordance (High)                                                                                                       
- Returning to a screen must restore scroll + form state (Medium)                                                                                                    
                                                                                                                                                                     
FEEDBACK:                                                                                                                                                            
- Show ActivityIndicator / skeleton for operations >300ms (High)                                                                                                     
- Confirm successful actions with toast/checkmark (Medium)                                                                                                           
- Show inline error + summary banner for form errors (High)
                                                                                                                                                                     
FORMS:          
- Validate onBlur (not every keystroke) (Medium)                                                                                                                     
- Match keyboardType to input (email-address, numeric, etc.) (Medium)                                                                                                
- Use onSubmitEditing to chain fields with Next/Done (Low)                                                                                                           
- Always provide password show/hide toggle (Medium)                                                                                                                  
                                                                                                                                                                     
PERFORMANCE:                                                                                                                                                         
- FlatList for 50+ items (never ScrollView + map) (High)                                                                                                             
- Correctly sized and cached images with resizeMode (Medium)
- Debounce scroll/search handlers (Medium)                                                                                                                           
                                                                                                                                                                     
ANIMATION:                                                                                                                                                           
- 150-300ms with ease-out (enter) / ease-in (exit) (Medium)                                                                                                          
- Always check reduceMotionEnabled; skip animations if true (Critical)                                                                                               
- Looping animations only for loaders/live data (Medium)                                                                                                             
                                                                                                                                                                     
TYPOGRAPHY:                                                                                                                                                          
- Body text min 16pt; support Dynamic Type / fontScale (High)                                                                                                        
- Never set allowFontScaling={false} globally (High)                                                                                                                 
                                                                                                                                                                     
SAFE AREAS:                                                                                                                                                          
- Wrap screens in SafeAreaView (not just View) (High)                                                                                                                
                                                                                                                                                                     
THEMING:
- Test light AND dark mode; use semantic tokens not hardcoded hex (High)                                                                                             
- Primary text contrast ≥4.5:1 in both modes (High)                                                                                                                  
- Modal scrim: typically 40–60% black opacity (High)                                                                                                                 
                                                                                                                                                                     
ANTI-PATTERNS:                                                                                                                                                       
- Never rely on gesture-only for core actions (always provide visible button) (Critical)                                                                             
                                                                                                                                                                     
---
REACT / NEXT.JS PERFORMANCE (44 patterns)                                                                                                                            
                                                                                                                                                                     
ASYNC WATERFALL:
- Move await into branches where actually used (not always at function top) [Critical]                                                                               
- Promise.all for independent concurrent operations [Critical]                                                                                                       
- Use better-all for partial-dependency parallelization [Critical]
- Start promises early, await late in API routes [Critical]                                                                                                          
- Wrap async components in <Suspense fallback={<Skeleton />}> [High]                                                                                                 
                                                                                                                                                                     
BUNDLE SIZE:                                                                                                                                                         
- Import directly from source (not barrel/index files) — e.g., 'lucide-react/dist/esm/icons/check' [Critical]                                                        
- next/dynamic() for heavy components not needed on initial render [Critical]                                                                                        
- Load analytics scripts after hydration (dynamic with ssr: false) [Medium]
- Dynamic import of large modules only when feature is activated [High]                                                                                              
- Preload heavy bundles on hover/focus intent (not just on click) [Medium]                                                                                           
                                                                                                                                                                     
SERVER:                                                                                                                                                              
- React.cache() for dedup within single request [Medium]                                                                                                             
- LRU cache for cross-request shared data [High]                                                                                                                     
- Pass only needed fields to client components across RSC boundary [High]
- Restructure for parallel data fetching via component composition [Critical]                                                                                        
- Use Next.js after() for non-blocking logging post-response [Medium]                                                                                                
                                                                                                                                                                     
CLIENT:                                                                                                                                                              
- useSWR for automatic deduplication and caching [Medium-High]                                                                                                       
- useSWRSubscription for shared global event listeners [Low]                                                                                                         
                                                                                                                                                                     
RE-RENDER PREVENTION:                                                                                                                                                
- Don't subscribe to state used only in callbacks [Medium]                                                                                                           
- Extract expensive work into memoized components [Medium]                                                                                                           
- Use primitive values (not objects) in useEffect dependency arrays [Low]                                                                                            
- Subscribe to derived booleans (not continuous values) [Medium]                                                                                                     
- Always use functional setState: setState(curr => ...) [Medium]                                                                                                     
- Lazy useState init: useState(() => buildIndex(items)) [Medium]                                                                                                     
- startTransition for non-urgent state updates (e.g., scroll events) [Medium]                                                                                        
                                                                                                                                                                     
RENDERING:                                                                                                                                                           
- Animate div wrapper around SVG (not the SVG itself) [Low]
- content-visibility: auto for off-screen list items [High]                                                                                                          
- Hoist static JSX to module scope (outside component) [Low]
- Inline script for client-only values (prevents hydration flicker) [Medium]                                                                                         
- Use ternary not && when condition can be 0/NaN [Low]                                                                                                               
- Activity component for toggle-show/hide (preserves state) [Medium]                                                                                                 
                                                                                                                                                                     
JS PERFORMANCE:                                                                                                                                                      
- Group CSS changes via classList.add or cssText to minimize reflows [Medium]                                                                                        
- Build Map for repeated lookups instead of .find() in loops [Low-Medium]                                                                                            
- Cache nested property accesses in hot-path loops [Low-Medium]                                                                                                      
- Module-level Map to cache repeated function results [Medium]                                                                                                       
- Cache localStorage reads in memory [Low-Medium]                                                                                                                    
- Combine multiple filter/map into single loop [Low-Medium]                                                                                                          
- Check array lengths before expensive comparisons (early return) [Medium-High]                                                                                      
- Return early when result is determined [Low-Medium]                                                                                                                
- Hoist RegExp to module scope (not inside render) [Low-Medium]                                                                                                      
- Single-pass loop for min/max (not sort()[0] — O(n) vs O(n log n)) [Low]                                                                                            
- Set/Map for O(1) membership checks (not Array.includes for repeated) [Low-Medium]                                                                                  
- toSorted() instead of sort() to avoid array mutation [Medium-High]  
"