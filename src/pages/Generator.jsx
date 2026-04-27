import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Navbar from "../Navbar";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  Loader2,
  RotateCcw,
} from "lucide-react";
import LoadingOctopusRunner from "../games/LoadingOctopusRunner";

const API_URL = "https://websiteai-backend-production.up.railway.app";
const FALLBACK_PAGE_NAME = "website-preview.html";

function isPlainObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function normalizePageEntries(pages) {
  if (!isPlainObject(pages)) return [];
  return Object.entries(pages)
    .filter(([, html]) => typeof html === "string" && html.trim())
    .sort(([a], [b]) => {
      if (a === "index.html" && b !== "index.html") return -1;
      if (b === "index.html" && a !== "index.html") return 1;
      return a.localeCompare(b);
    })
    .map(([name, html], index) => ({
      name:
        typeof name === "string" && name.trim().toLowerCase().endsWith(".html")
          ? name
          : `page-${index + 1}.html`,
      html,
    }));
}

function extractPagesFromResponse(json) {
  if (!isPlainObject(json)) return [];
  const directPages = normalizePageEntries(json.pages);
  if (directPages.length > 0) return directPages;
  const packagePages = normalizePageEntries(json.sitePackage?.pages);
  if (packagePages.length > 0) return packagePages;
  if (typeof json.code === "string" && json.code.trim()) {
    try {
      const parsedCode = JSON.parse(json.code);
      const parsedPages = normalizePageEntries(parsedCode?.pages);
      if (parsedPages.length > 0) return parsedPages;
    } catch {
      if (
        json.code.toLowerCase().includes("<html") ||
        json.code.toLowerCase().includes("<!doctype")
      ) {
        return [{ name: FALLBACK_PAGE_NAME, html: json.code }];
      }
    }
  }
  if (typeof json.htmlCode === "string" && json.htmlCode.trim()) {
    return [{ name: FALLBACK_PAGE_NAME, html: json.htmlCode }];
  }
  return [];
}

// ─── Schema options ───────────────────────────────────────────────────────────

const INDUSTRIES = [
  { value: "tech", label: "Tech" },
  { value: "agency", label: "Agency / Services" },
  { value: "handwerk", label: "Local Trades / Services" },
  { value: "health", label: "Health & Wellness" },
  { value: "gastro", label: "Food & Beverage" },
  { value: "sport", label: "Sport" },
  { value: "brand", label: "Brand" },
  { value: "industry", label: "Industry / Engineering" },
  { value: "realestate", label: "Real Estate" },
  { value: "education", label: "Education" },
  { value: "event", label: "Event / Community" },
  { value: "nonprofit", label: "Non-Profit" },
  { value: "corporate", label: "Corporate" },
  { value: "portfolio", label: "Portfolio" },
];

const DESIGN_DIRECTIONS = [
  { value: "minimal", label: "Minimal", desc: "Whitespace, calm, refined" },
  { value: "modern", label: "Modern", desc: "Clean, contemporary, balanced" },
  { value: "brutalist", label: "Brutalist", desc: "Raw, bold, expressive" },
  { value: "luxury", label: "Luxury", desc: "Premium, elegant, serif" },
  { value: "playful", label: "Playful", desc: "Friendly, colourful, fun" },
  { value: "standard", label: "Standard", desc: "Safe, conventional" },
];

const SHAPE_LANGUAGE = [
  { value: "rounded", label: "Rounded" },
  { value: "sharp", label: "Sharp" },
];

const CTAS = [
  { value: "call", label: "Call us", hasLink: false },
  { value: "book", label: "Book appointment", hasLink: true },
  { value: "contact", label: "Contact form", hasLink: false },
  { value: "buy", label: "Buy now", hasLink: true },
  { value: "demo", label: "Book a demo", hasLink: true },
  { value: "other", label: "Other", hasLink: true },
];

const SECTION_OPTIONS = [
  {
    key: "about",
    label: "About / Story",
    contentField: "story",
    placeholder: "Tell the story of your company…",
  },
  {
    key: "team",
    label: "Team",
    contentField: "members",
    placeholder: "Names & short bios of team members…",
  },
  {
    key: "testimonials",
    label: "Testimonials / Reviews",
    contentField: "reviews",
    placeholder: "Paste customer reviews here…",
  },
  {
    key: "process",
    label: "How it works / Process",
    contentField: "description",
    placeholder: "Briefly describe the process…",
  },
  {
    key: "portfolio",
    label: "Portfolio / Projects",
    contentField: "projects",
    placeholder: "Short descriptions of projects…",
  },
  {
    key: "pricing",
    label: "Pricing / Services",
    contentField: "details",
    placeholder: "Prices and what's included…",
  },
  {
    key: "comparison",
    label: "Comparison",
    contentField: "data",
    placeholder: "Comparison data…",
  },
  {
    key: "stats",
    label: "Key Stats / Numbers",
    contentField: "data",
    placeholder: "Important numbers or metrics…",
  },
  { key: "faq", label: "FAQ", contentField: null, placeholder: null },
  {
    key: "careers",
    label: "Careers / Jobs",
    contentField: "jobs",
    placeholder: "Open positions, compensation…",
  },
  {
    key: "locations",
    label: "Locations / Branches",
    contentField: "addresses",
    placeholder: "Addresses of your locations…",
  },
  {
    key: "partners",
    label: "Partners / Logos",
    contentField: "names",
    placeholder: "Partner and integration names…",
  },
];

const SOCIAL_FIELDS = [
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "tiktok", label: "TikTok" },
  { key: "facebook", label: "Facebook" },
  { key: "youtube", label: "YouTube" },
];

// Character limits — must match FIELD_LIMITS in landing-generator/lib/prompt-builder.js
const LIMITS = {
  companyName:     50,
  slogan:         100,
  description:    1000,
  colors:         100,
  ctaLink:        100,
  phone:           50,
  email:          50,
  address:        50,
  openingHours:   50,
  furtherLinks:   600,
  specials:       400,
  social:         100,
  sectionContent: 1500,
  extras:        1000,
};

// ─── Initial state ────────────────────────────────────────────────────────────

const initialSections = Object.fromEntries(
  SECTION_OPTIONS.map((s) => [
    s.key,
    s.contentField
      ? { enabled: false, [s.contentField]: "" }
      : { enabled: false },
  ])
);

const initialBrief = {
  basics: { companyName: "", industry: "", slogan: "", description: "" },
  design: {
    colors: "",
    shapeLanguage: "rounded",
    designDirection: "modern",
    darkMode: false,
  },
  sections: initialSections,
  contact: {
    primaryCta: "contact",
    ctaLink: "",
    phone: "",
    email: "",
    address: "",
    social: Object.fromEntries(SOCIAL_FIELDS.map((s) => [s.key, ""])),
    furtherLinks: "",
    openingHours: "",
    specials: "",
  },
  extras: "",
};

// ─── Theme tokens ─────────────────────────────────────────────────────────────

const ACCENT = "#494fdf";
const INK = "#0f1115";
const MUTED = "#5b6470";
const HAIR = "#ececf2";
const FONT_DISPLAY = "'Plus Jakarta Sans', system-ui, sans-serif";
const FONT_BODY = "'Geist', 'Inter', system-ui, sans-serif";

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Geist:wght@300;400;500;600;700&display=swap');

  @keyframes orbFloatA {
    0%, 100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(40px,-30px) scale(1.06); }
  }
  @keyframes orbFloatB {
    0%, 100% { transform: translate(0,0) scale(1); }
    50%      { transform: translate(-30px,40px) scale(1.04); }
  }
  @keyframes slideIn {
    0%   { opacity: 0; transform: translateY(18px); filter: blur(6px); }
    60%  { filter: blur(0); }
    100% { opacity: 1; transform: translateY(0); filter: blur(0); }
  }
  @keyframes badgePop {
    from { opacity: 0; transform: scale(0.9) translateY(6px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes ringPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(73,79,223,0.18); }
    50%      { box-shadow: 0 0 0 14px rgba(73,79,223,0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .gen-input::placeholder { color: #aab1bd; }
  .gen-link:hover { color: ${ACCENT} !important; }
  .gen-section-card:hover { border-color: rgba(73,79,223,0.25) !important; }
`;

// ─── Background ───────────────────────────────────────────────────────────────

function BgOrbs() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: "-10%",
          width: 640,
          height: 640,
          background: "rgba(73,79,223,0.16)",
          borderRadius: "50%",
          filter: "blur(120px)",
          animation: "orbFloatA 14s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "-15%",
          width: 560,
          height: 560,
          background: "rgba(73,79,223,0.10)",
          borderRadius: "50%",
          filter: "blur(120px)",
          animation: "orbFloatB 18s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "20%",
          width: 720,
          height: 720,
          background: "rgba(73,79,223,0.07)",
          borderRadius: "50%",
          filter: "blur(160px)",
          animation: "orbFloatA 22s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  autoFocus = false,
  maxLength,
}) {
  const atLimit  = maxLength && value.length >= maxLength;
  const nearLimit = maxLength && value.length >= Math.floor(maxLength * 0.9);
  return (
    <>
      <input
        autoFocus={autoFocus}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="gen-input"
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: atLimit ? "1.5px solid #dc2626" : `1px solid ${HAIR}`,
          borderRadius: 16,
          padding: "16px 18px",
          fontSize: 17,
          fontFamily: FONT_BODY,
          color: INK,
          outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
          boxShadow: "0 1px 2px rgba(15,17,21,0.02)",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = atLimit ? "#dc2626" : ACCENT;
          e.target.style.boxShadow = atLimit
            ? "0 0 0 4px rgba(220,38,38,0.10)"
            : `0 0 0 4px rgba(73,79,223,0.10)`;
          e.target.style.background = "rgba(255,255,255,0.95)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = atLimit ? "#dc2626" : HAIR;
          e.target.style.boxShadow = "0 1px 2px rgba(15,17,21,0.02)";
          e.target.style.background = "rgba(255,255,255,0.8)";
        }}
      />
      {maxLength && value.length > 0 && (
        <div
          style={{
            fontSize: 11,
            textAlign: "right",
            marginTop: 4,
            fontFamily: FONT_BODY,
            color: atLimit ? "#dc2626" : nearLimit ? "#d97706" : "#c8ccd4",
            fontWeight: atLimit ? 600 : 400,
          }}
        >
          {value.length} / {maxLength}
        </div>
      )}
    </>
  );
}

function Textarea({ value, onChange, placeholder, rows = 4, maxLength }) {
  const atLimit   = maxLength && value.length >= maxLength;
  const nearLimit = maxLength && value.length >= Math.floor(maxLength * 0.9);
  return (
    <>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="gen-input"
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: atLimit ? "1.5px solid #dc2626" : `1px solid ${HAIR}`,
          borderRadius: 16,
          padding: "16px 18px",
          fontSize: 16,
          lineHeight: 1.55,
          fontFamily: FONT_BODY,
          color: INK,
          outline: "none",
          resize: "none",
          transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
          boxShadow: "0 1px 2px rgba(15,17,21,0.02)",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = atLimit ? "#dc2626" : ACCENT;
          e.target.style.boxShadow = atLimit
            ? "0 0 0 4px rgba(220,38,38,0.10)"
            : `0 0 0 4px rgba(73,79,223,0.10)`;
          e.target.style.background = "rgba(255,255,255,0.95)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = atLimit ? "#dc2626" : HAIR;
          e.target.style.boxShadow = "0 1px 2px rgba(15,17,21,0.02)";
          e.target.style.background = "rgba(255,255,255,0.8)";
        }}
      />
      {maxLength && value.length > 0 && (
        <div
          style={{
            fontSize: 11,
            textAlign: "right",
            marginTop: 4,
            fontFamily: FONT_BODY,
            color: atLimit ? "#dc2626" : nearLimit ? "#d97706" : "#c8ccd4",
            fontWeight: atLimit ? 600 : 400,
          }}
        >
          {value.length} / {maxLength}
        </div>
      )}
    </>
  );
}

function FieldLabel({ children, optional }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
        fontSize: 13,
        fontFamily: FONT_BODY,
        fontWeight: 500,
        color: MUTED,
        letterSpacing: "0.01em",
      }}
    >
      <span>{children}</span>
      {optional && (
        <span style={{ fontSize: 11, color: "#a3a9b3", fontWeight: 400 }}>
          optional
        </span>
      )}
    </div>
  );
}

function ChipPicker({ value, onChange, options, columns = 2 }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 10,
      }}
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              padding: "14px 16px",
              borderRadius: 14,
              border: active ? `1.5px solid ${ACCENT}` : `1px solid ${HAIR}`,
              background: active
                ? "rgba(73,79,223,0.06)"
                : "rgba(255,255,255,0.7)",
              color: active ? ACCENT : INK,
              fontFamily: FONT_BODY,
              fontWeight: active ? 600 : 500,
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.2s ease",
              textAlign: "left",
              boxShadow: active ? "0 6px 20px rgba(73,79,223,0.12)" : "none",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function BigChoiceTile({ option, active, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: "left",
        padding: "22px 22px",
        borderRadius: 20,
        border: active ? `1.5px solid ${ACCENT}` : `1px solid ${HAIR}`,
        background: active ? "rgba(73,79,223,0.05)" : "rgba(255,255,255,0.85)",
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(.22,1,.36,1)",
        transform: hover && !active ? "translateY(-2px)" : "translateY(0)",
        boxShadow: active
          ? "0 16px 40px rgba(73,79,223,0.16)"
          : hover
          ? "0 8px 28px rgba(15,17,21,0.06)"
          : "0 1px 2px rgba(15,17,21,0.02)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {active && (
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: ACCENT,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Check size={13} strokeWidth={3} />
        </div>
      )}
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 22,
          fontWeight: 700,
          color: INK,
          marginBottom: 6,
          letterSpacing: "-0.02em",
        }}
      >
        {option.label}
      </div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 13, color: MUTED }}>
        {option.desc}
      </div>
    </button>
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 18px",
        borderRadius: 16,
        border: checked ? `1.5px solid ${ACCENT}` : `1px solid ${HAIR}`,
        background: checked ? "rgba(73,79,223,0.05)" : "rgba(255,255,255,0.7)",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      <div
        style={{
          width: 44,
          height: 26,
          borderRadius: 999,
          background: checked ? ACCENT : "#dcdfe6",
          position: "relative",
          flexShrink: 0,
          transition: "background 0.2s",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: checked ? 21 : 3,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            transition: "left 0.2s cubic-bezier(.22,1,.36,1)",
          }}
        />
      </div>
      <div>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontWeight: 600,
            fontSize: 15,
            color: INK,
          }}
        >
          {label}
        </div>
        {description && (
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: 13,
              color: MUTED,
              marginTop: 2,
            }}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Slide shell ──────────────────────────────────────────────────────────────

function Slide({ stepKey, eyebrow, title, subtitle, children }) {
  return (
    <div
      key={stepKey}
      style={{
        animation: "slideIn 0.55s cubic-bezier(.22,1,.36,1) both",
      }}
    >
      <h1
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: "clamp(34px, 5.2vw, 50px)",
          lineHeight: 1.08,
          letterSpacing: "-0.025em",
          color: INK,
          margin: 0,
          marginBottom: subtitle ? 14 : 28,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 17,
            lineHeight: 1.55,
            color: MUTED,
            margin: 0,
            marginBottom: 36,
            maxWidth: 560,
          }}
        >
          {subtitle}
        </p>
      )}
      <div>{children}</div>
    </div>
  );
}

// ─── Slide definitions ────────────────────────────────────────────────────────

function S_Basics({ brief, update }) {
  const b = brief.basics;
  const set = (k) => (v) => update("basics", { ...b, [k]: v });
  return (
    <Slide
      stepKey="basics"
      eyebrow="01 — Basics"
      title="Let's start with your brand."
      subtitle="A few essentials so we know who we're building for."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div>
          <FieldLabel>Company name</FieldLabel>
          <Input
            value={b.companyName}
            onChange={set("companyName")}
            placeholder="e.g. Acme Inc."
            autoFocus
            maxLength={LIMITS.companyName}
          />
        </div>
        <div>
          <FieldLabel>Industry</FieldLabel>
          <ChipPicker
            value={b.industry}
            onChange={set("industry")}
            options={INDUSTRIES}
            columns={2}
          />
        </div>
      </div>
    </Slide>
  );
}

function S_Pitch({ brief, update }) {
  const b = brief.basics;
  const set = (k) => (v) => update("basics", { ...b, [k]: v });
  return (
    <Slide
      stepKey="pitch"
      eyebrow="02 — Pitch"
      title="How would you describe it?"
      subtitle="Your hero line and elevator pitch — they sharpen the result."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div>
          <FieldLabel optional>Slogan</FieldLabel>
          <Input
            value={b.slogan}
            onChange={set("slogan")}
            placeholder="e.g. We build websites that inspire."
            maxLength={LIMITS.slogan}
          />
        </div>
        <div>
          <FieldLabel>Short description</FieldLabel>
          <Textarea
            value={b.description}
            onChange={set("description")}
            placeholder="2–3 sentences: Who are you? What do you do?"
            rows={4}
            maxLength={LIMITS.description}
          />
        </div>
      </div>
    </Slide>
  );
}

function S_Direction({ brief, update }) {
  const d = brief.design;
  const set = (k) => (v) => update("design", { ...d, [k]: v });
  return (
    <Slide
      stepKey="direction"
      eyebrow="03 — Direction"
      title="Pick your aesthetic."
      subtitle="The single biggest design decision. You can refine details next."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
        }}
      >
        {DESIGN_DIRECTIONS.map((opt) => (
          <BigChoiceTile
            key={opt.value}
            option={opt}
            active={d.designDirection === opt.value}
            onClick={() => set("designDirection")(opt.value)}
          />
        ))}
      </div>
    </Slide>
  );
}

function S_Style({ brief, update }) {
  const d = brief.design;
  const set = (k) => (v) => update("design", { ...d, [k]: v });
  return (
    <Slide
      stepKey="style"
      eyebrow="04 — Style details"
      title="Colour, shape, mode."
      subtitle="Three small choices that change everything."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div>
          <FieldLabel>Colour palette</FieldLabel>
          <Input
            value={d.colors}
            onChange={set("colors")}
            placeholder="e.g. logo colours, accent colour, background colour"
            maxLength={LIMITS.colors}
          />
        </div>
        <div>
          <FieldLabel>Shape language</FieldLabel>
          <ChipPicker
            value={d.shapeLanguage}
            onChange={set("shapeLanguage")}
            options={SHAPE_LANGUAGE}
            columns={2}
          />
        </div>
        <Toggle
          checked={d.darkMode}
          onChange={set("darkMode")}
          label="Dark mode"
          description="Invert the palette for a moodier, premium look."
        />
      </div>
    </Slide>
  );
}

function S_Sections({ brief, update }) {
  const sections = brief.sections;
  const toggleSection = (key) => {
    const cur = sections[key];
    update("sections", {
      ...sections,
      [key]: { ...cur, enabled: !cur.enabled },
    });
  };
  const setSectionContent = (key, field) => (val) => {
    const cur = sections[key];
    update("sections", { ...sections, [key]: { ...cur, [field]: val } });
  };

  return (
    <Slide
      stepKey="sections"
      eyebrow="05 — Sections"
      title="What should be on the page?"
      subtitle="Header, navbar, hero, primary CTA and footer are always included. Pick anything else you want."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 10,
        }}
      >
        {SECTION_OPTIONS.map(({ key, label }) => {
          const enabled = sections[key].enabled;
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleSection(key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "13px 16px",
                borderRadius: 14,
                border: enabled ? `1.5px solid ${ACCENT}` : `1px solid ${HAIR}`,
                background: enabled
                  ? "rgba(73,79,223,0.06)"
                  : "rgba(255,255,255,0.75)",
                fontFamily: FONT_BODY,
                fontSize: 14,
                fontWeight: enabled ? 600 : 500,
                color: enabled ? ACCENT : INK,
                cursor: "pointer",
                transition: "all 0.2s",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 6,
                  background: enabled ? ACCENT : "rgba(0,0,0,0.04)",
                  border: enabled ? "none" : `1px solid ${HAIR}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.2s",
                }}
              >
                {enabled && <Check size={11} strokeWidth={3} color="#fff" />}
              </div>
              {label}
            </button>
          );
        })}
      </div>

      {/* Inline content fields for enabled sections */}
      {SECTION_OPTIONS.some(
        (s) => sections[s.key].enabled && s.contentField
      ) && (
        <div
          style={{
            marginTop: 28,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {SECTION_OPTIONS.filter(
            (s) => sections[s.key].enabled && s.contentField
          ).map(({ key, label, contentField, placeholder }) => (
            <div key={key}>
              <FieldLabel optional>{label}</FieldLabel>
              <Textarea
                value={sections[key][contentField] ?? ""}
                onChange={setSectionContent(key, contentField)}
                placeholder={placeholder}
                rows={3}
                maxLength={LIMITS.sectionContent}
              />
            </div>
          ))}
        </div>
      )}
    </Slide>
  );
}

function S_Goal({ brief, update }) {
  const c = brief.contact;
  const set = (k) => (v) => update("contact", { ...c, [k]: v });
  const selectedCta = CTAS.find((ct) => ct.value === c.primaryCta);
  const showLinkField = selectedCta?.hasLink;
  return (
    <Slide
      stepKey="goal"
      eyebrow="06 — Goal"
      title="What should visitors do?"
      subtitle="One primary call-to-action drives the whole layout."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <ChipPicker
          value={c.primaryCta}
          onChange={(v) =>
            update("contact", { ...c, primaryCta: v, ctaLink: "" })
          }
          options={CTAS}
          columns={2}
        />
        {showLinkField && (
          <div>
            <FieldLabel>Link for "{selectedCta.label}"</FieldLabel>
            <Input
              value={c.ctaLink}
              onChange={set("ctaLink")}
              placeholder="https://…"
              type="url"
              maxLength={LIMITS.ctaLink}
            />
          </div>
        )}
      </div>
    </Slide>
  );
}

function S_Contact({ brief, update }) {
  const c = brief.contact;
  const set = (k) => (v) => update("contact", { ...c, [k]: v });
  return (
    <Slide
      stepKey="contact"
      eyebrow="07 — Reach"
      title="How can people reach you?"
      subtitle="Phone, email, address — leave blank what doesn't apply."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div>
          <FieldLabel optional>Phone</FieldLabel>
          <Input
            value={c.phone}
            onChange={set("phone")}
            placeholder="+49 30 123456"
            type="tel"
            maxLength={LIMITS.phone}
          />
        </div>
        <div>
          <FieldLabel>E-mail</FieldLabel>
          <Input
            value={c.email}
            onChange={set("email")}
            placeholder="hello@company.com"
            type="email"
            maxLength={LIMITS.email}
          />
        </div>
        <div>
          <FieldLabel>Address</FieldLabel>
          <Input
            value={c.address}
            onChange={set("address")}
            placeholder="123 Main St, New York, NY 10001"
            maxLength={LIMITS.address}
          />
        </div>
      </div>
    </Slide>
  );
}

function S_Hours({ brief, update }) {
  const c = brief.contact;
  const set = (k) => (v) => update("contact", { ...c, [k]: v });
  return (
    <Slide
      stepKey="hours"
      eyebrow="08 — Details"
      title="Anything time-sensitive?"
      subtitle="Hours, booking link, or a current promo."
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div>
          <FieldLabel optional>Opening hours</FieldLabel>
          <Input
            value={c.openingHours}
            onChange={set("openingHours")}
            placeholder="Mo–Fr 9–18, Sa 10–14"
            maxLength={LIMITS.openingHours}
          />
        </div>
        <div>
          <FieldLabel optional>Booking / further link</FieldLabel>
          <Input
            value={c.furtherLinks}
            onChange={set("furtherLinks")}
            placeholder="https://calendly.com/…"
            maxLength={LIMITS.furtherLinks}
          />
        </div>
        <div>
          <FieldLabel optional>Specials / promotion</FieldLabel>
          <Textarea
            value={c.specials}
            onChange={set("specials")}
            placeholder="e.g. Happy Hour Mon–Thu 5–7 pm"
            rows={2}
            maxLength={LIMITS.specials}
          />
        </div>
      </div>
    </Slide>
  );
}

function S_Social({ brief, update }) {
  const c = brief.contact;
  const setSocial = (k) => (v) =>
    update("contact", { ...c, social: { ...c.social, [k]: v } });
  return (
    <Slide
      stepKey="social"
      eyebrow="09 — Social"
      title="Where can people find you?"
      subtitle="All channels are optional — drop in handles or full URLs."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {SOCIAL_FIELDS.map(({ key, label }) => (
          <div key={key}>
            <FieldLabel optional>{label}</FieldLabel>
            <Input
              value={c.social[key]}
              onChange={setSocial(key)}
              placeholder={`@${label.toLowerCase()} or URL`}
              maxLength={LIMITS.social}
            />
          </div>
        ))}
      </div>
    </Slide>
  );
}

function S_Extras({ brief, update }) {
  return (
    <Slide
      stepKey="extras"
      eyebrow="10 — Notes"
      title="Anything else we should know?"
      subtitle="Mood, references, language, must-have details — anything goes here."
    >
      <Textarea
        value={brief.extras}
        onChange={(v) => update("extras", v)}
        placeholder="e.g. Include menu, hero should feel like a sunrise, use formal tone…"
        rows={6}
        maxLength={LIMITS.extras}
      />
    </Slide>
  );
}


// ─── Final / generate slide ───────────────────────────────────────────────────

function S_Generate({
  brief,
  onGenerate,
  pages,
  loading,
  error,
  navigate,
  sitePackage,
  onReset,
}) {
  const [btnHover, setBtnHover] = useState(false);

  const goToEditor = () => {
    const fallback = {
      pages: Object.fromEntries(pages.map((p) => [p.name, p.html])),
      slots: {},
      assets: {},
    };
    const payload =
      sitePackage && Object.keys(sitePackage.pages || {}).length
        ? sitePackage
        : fallback;
    try {
      localStorage.setItem("websiteai:sitePackage", JSON.stringify(payload));
    } catch (e) {
      console.warn("save failed", e);
    }
    navigate("/edit", { state: { sitePackage: payload } });
  };

  const enabledSections = Object.entries(brief.sections)
    .filter(([, v]) => v.enabled)
    .map(([k]) => SECTION_OPTIONS.find((s) => s.key === k)?.label)
    .filter(Boolean)
    .join(", ");

  const summary = [
    { label: "Brand", value: brief.basics.companyName },
    {
      label: "Industry",
      value: INDUSTRIES.find((i) => i.value === brief.basics.industry)?.label,
    },
    {
      label: "Direction",
      value: DESIGN_DIRECTIONS.find(
        (d) => d.value === brief.design.designDirection
      )?.label,
    },
    {
      label: "Shape",
      value: SHAPE_LANGUAGE.find((s) => s.value === brief.design.shapeLanguage)
        ?.label,
    },
    { label: "Dark mode", value: brief.design.darkMode ? "On" : "Off" },
    { label: "Sections", value: enabledSections || "Defaults" },
  ];

  const hasResults = pages.length > 0;
  const canGenerate =
    !loading && brief.basics.companyName.trim() && brief.basics.industry;

  return (
    <div style={{ animation: "slideIn 0.55s cubic-bezier(.22,1,.36,1) both" }}>
      {!hasResults && !loading && (
        <>
          <h1
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: "clamp(34px, 5.2vw, 52px)",
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              color: INK,
              margin: 0,
              marginBottom: 14,
            }}
          >
            Ready to build {brief.basics.companyName}'s site.
          </h1>
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: 17,
              lineHeight: 1.55,
              color: MUTED,
              margin: 0,
              marginBottom: 36,
              maxWidth: 560,
            }}
          >
            Quick summary below — hit generate when you're ready. Takes about 30
            seconds.
          </p>

          <div
            className="gen-section-card"
            style={{
              border: `1px solid ${HAIR}`,
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(12px)",
              borderRadius: 24,
              padding: 28,
              transition: "border-color 0.2s",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: 22,
              }}
            >
              {summary.map(({ label, value }) => (
                <div key={label}>
                  <div
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#a3a9b3",
                      marginBottom: 6,
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: 15,
                      fontWeight: 500,
                      color: INK,
                      wordBreak: "break-word",
                    }}
                  >
                    {value || "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                position: "relative",
              }}
            >
              <button
                onClick={onGenerate}
                disabled={!canGenerate}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "16px 28px 16px 30px",
                  borderRadius: 999,
                  background: canGenerate ? ACCENT : "#c5c8d4",
                  color: "#fff",
                  border: "none",
                  fontFamily: FONT_BODY,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: canGenerate ? "pointer" : "not-allowed",
                  transform:
                    btnHover && canGenerate
                      ? "translateY(-2px)"
                      : "translateY(0)",
                  boxShadow:
                    btnHover && canGenerate
                      ? "0 24px 60px rgba(73,79,223,0.40), 0 6px 16px rgba(73,79,223,0.20)"
                      : "0 12px 32px rgba(73,79,223,0.28)",
                }}
              >
                <Sparkles size={18} />
                Generate website
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.18)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: btnHover ? "translateX(3px)" : "translateX(0)",
                  }}
                >
                  <ArrowRight size={16} />
                </span>
              </button>
            </div>
          </div>
        </>
      )}

      {loading && (
        <div
          style={{
            padding: "80px 32px",
            textAlign: "center",
            animation: "fadeIn 0.4s ease both",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              margin: "0 auto 28px",
              borderRadius: "50%",
              background: "rgba(73,79,223,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "ringPulse 1.6s ease-in-out infinite",
            }}
          >
            <Loader2
              size={28}
              color={ACCENT}
              className="animate-spin"
              style={{ animation: "spin 1s linear infinite" }}
            />
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <h2
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: 34,
              letterSpacing: "-0.02em",
              color: INK,
              margin: 0,
              marginBottom: 10,
              backgroundImage: `linear-gradient(90deg, ${INK} 0%, ${ACCENT} 50%, ${INK} 100%)`,
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 3s linear infinite",
            }}
          >
            Crafting your website…
          </h2>
          <p style={{ fontFamily: FONT_BODY, color: MUTED, fontSize: 15 }}>
            Composing layout, typography, and copy. ~30 seconds.
          </p>
          <LoadingOctopusRunner />
        </div>
      )}

      {error && !loading && (
        <div
          style={{
            border: "1px solid rgba(220,38,38,0.25)",
            background: "rgba(254,226,226,0.6)",
            color: "#b91c1c",
            padding: "18px 20px",
            borderRadius: 16,
            fontFamily: FONT_BODY,
            fontSize: 14,
            marginTop: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span style={{ flex: 1, minWidth: 220 }}>{error}</span>
          <button
            onClick={onGenerate}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              borderRadius: 999,
              background: "#b91c1c",
              color: "#fff",
              border: "none",
              fontFamily: FONT_BODY,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <RotateCcw size={13} />
            Regenerate
          </button>
        </div>
      )}

      {hasResults && (
        <div
          style={{ animation: "slideIn 0.5s cubic-bezier(.22,1,.36,1) both" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 999,
              background: "rgba(73,79,223,0.08)",
              color: ACCENT,
              fontFamily: FONT_BODY,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            <Check size={12} strokeWidth={3} /> Done
          </div>
          <h1
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: "clamp(32px, 5vw, 50px)",
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              color: INK,
              margin: 0,
              marginBottom: 14,
            }}
          >
            Your website is ready.
          </h1>
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: 17,
              color: MUTED,
              margin: 0,
              marginBottom: 40,
              maxWidth: 480,
            }}
          >
            Open the editor to fine-tune copy, swap sections, and finalise your
            site.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            <button
              onClick={goToEditor}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 26px 14px 28px",
                borderRadius: 999,
                background: ACCENT,
                color: "#fff",
                border: "none",
                fontFamily: FONT_BODY,
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(.22,1,.36,1)",
                boxShadow: "0 12px 32px rgba(73,79,223,0.28)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 48px rgba(73,79,223,0.38)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 12px 32px rgba(73,79,223,0.28)";
              }}
            >
              Open editor
              <ArrowRight size={15} />
            </button>

            <button
              onClick={onReset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 20px",
                borderRadius: 999,
                background: "transparent",
                color: MUTED,
                border: `1px solid ${HAIR}`,
                fontFamily: FONT_BODY,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = INK;
                e.currentTarget.style.borderColor = "#c5c8d4";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = MUTED;
                e.currentTarget.style.borderColor = HAIR;
              }}
            >
              <RotateCcw size={13} />
              Make a new website
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Generator ───────────────────────────────────────────────────────────

const SLIDES = [
  { key: "basics", component: S_Basics, label: "Basics" },
  { key: "pitch", component: S_Pitch, label: "Pitch" },
  { key: "direction", component: S_Direction, label: "Direction" },
  { key: "style", component: S_Style, label: "Style" },
  { key: "sections", component: S_Sections, label: "Sections" },
  { key: "goal", component: S_Goal, label: "Goal" },
  { key: "contact", component: S_Contact, label: "Contact" },
  { key: "hours", component: S_Hours, label: "Details" },
  { key: "social", component: S_Social, label: "Social" },
  { key: "extras", component: S_Extras, label: "Notes" },
  { key: "generate", component: null, label: "Generate" },
];

const BRIEF_STORAGE_KEY = "websiteai:brief";
const PAGES_STORAGE_KEY = "websiteai:generatedPages";

function loadJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Generator() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(undefined); // undefined = loading
  const [step, setStep] = useState(0);
  const [brief, setBrief] = useState(() => {
    const saved = loadJson(BRIEF_STORAGE_KEY);
    return isPlainObject(saved) ? { ...initialBrief, ...saved } : initialBrief;
  });
  const [generatedPages, setGeneratedPages] = useState(() => {
    const saved = loadJson(PAGES_STORAGE_KEY);
    return Array.isArray(saved) ? saved : [];
  });
  const [sitePackage, setSitePackage] = useState(() =>
    loadJson("websiteai:sitePackage")
  );
  const [activePage, setActivePage] = useState(() => {
    const saved = loadJson(PAGES_STORAGE_KEY);
    return Array.isArray(saved) && saved[0]?.name ? saved[0].name : "";
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef(null);

  // Auth guard — redirect to sign-in if not authenticated.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setAuthUser(u ?? null);
      if (u === null) navigate("/waitlist", { replace: true, state: { from: "/generate" } });
    });
    return unsub;
  }, [navigate]);

  useEffect(() => {
    try {
      localStorage.setItem(BRIEF_STORAGE_KEY, JSON.stringify(brief));
    } catch {
      /* ignore */
    }
  }, [brief]);

  useEffect(() => {
    try {
      if (generatedPages.length > 0) {
        localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(generatedPages));
      }
    } catch {
      /* ignore quota */
    }
  }, [generatedPages]);

  useEffect(() => {
    if (generatedPages.length > 0 && step === 0) {
      setStep(SLIDES.length - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (section, value) => {
    setBrief((prev) => ({ ...prev, [section]: value }));
  };

  const generate = async () => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Hard client-side cap — backend timeout is 120s; allow a small buffer
    // before we give up so the user is never stuck on the loading screen.
    const CLIENT_TIMEOUT_MS = 260_000;
    const timeoutId = setTimeout(() => controller.abort("timeout"), CLIENT_TIMEOUT_MS);

    setLoading(true);
    setError("");
    setGeneratedPages([]);
    setActivePage("");
    try {
      const idToken = await authUser.getIdToken();
      const res = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ brief }),
        signal: controller.signal,
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(
          json?.error ?? `Request failed (${res.status}). Please try again.`
        );
      }
      let json;
      try {
        json = await res.json();
      } catch {
        throw new Error(
          "The AI returned an unreadable response. Please regenerate."
        );
      }
      const pages = extractPagesFromResponse(json);
      if (pages.length === 0) {
        throw new Error(
          "The AI returned an invalid format. Please regenerate."
        );
      }
      setGeneratedPages(pages);
      setActivePage(pages[0].name);

      const source = isPlainObject(json?.sitePackage) ? json.sitePackage : json;
      const builtPackage = {
        pages: isPlainObject(source?.pages)
          ? source.pages
          : Object.fromEntries(pages.map((p) => [p.name, p.html])),
        slots: isPlainObject(source?.slots) ? source.slots : {},
        assets: isPlainObject(source?.assets) ? source.assets : {},
      };
      setSitePackage(builtPackage);
      try {
        localStorage.setItem(
          "websiteai:sitePackage",
          JSON.stringify(builtPackage)
        );
        localStorage.removeItem("websiteai:editorState");
      } catch (storageErr) {
        console.warn("[generator] localStorage save failed:", storageErr);
      }
    } catch (err) {
      if (err.name === "AbortError") {
        if (controller.signal.reason === "timeout") {
          setError(
            "The AI took too long to respond. Please regenerate."
          );
        } else {
          return;
        }
      } else {
        setError(err.message);
      }
    } finally {
      clearTimeout(timeoutId);
      if (abortRef.current === controller) {
        abortRef.current = null;
        setLoading(false);
      }
    }
  };

  useEffect(
    () => () => {
      if (abortRef.current) abortRef.current.abort();
    },
    []
  );

  const reset = () => {
    if (abortRef.current) abortRef.current.abort();
    setBrief(initialBrief);
    setGeneratedPages([]);
    setActivePage("");
    setSitePackage(null);
    setError("");
    setStep(0);
    try {
      localStorage.removeItem(BRIEF_STORAGE_KEY);
      localStorage.removeItem(PAGES_STORAGE_KEY);
      localStorage.removeItem("websiteai:sitePackage");
      localStorage.removeItem("websiteai:editorState");
    } catch {
      /* ignore */
    }
  };

  const canAdvance = () => {
    const b = brief.basics;
    const d = brief.design;
    const c = brief.contact;
    const selectedCta = CTAS.find((ct) => ct.value === c.primaryCta);
    switch (step) {
      case 0:
        return !!(b.companyName.trim() && b.industry);
      case 1:
        return !!b.description.trim();
      case 2:
        return !!d.designDirection;
      case 3:
        return !!d.colors.trim();
      case 5:
        return !!(c.primaryCta && (!selectedCta?.hasLink || c.ctaLink.trim()));
      case 6:
        return !!(c.email.trim() && c.address.trim());
      default:
        return true;
    }
  };

  // Waiting for Firebase to resolve auth state — render nothing to avoid flash.
  if (authUser === undefined) return null;

  const isLast = step === SLIDES.length - 1;
  const SlideComp = SLIDES[step].component;
  const progress = ((step + 1) / SLIDES.length) * 100;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: INK,
        fontFamily: FONT_BODY,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{GLOBAL_STYLES}</style>
      <BgOrbs />

      <Navbar showCta={false} />

      {/* Main */}
      <main
        style={{
          flex: 1,
          padding: "140px 24px 40px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          {isLast ? (
            <S_Generate
              brief={brief}
              onGenerate={generate}
              pages={generatedPages}
              loading={loading}
              error={error}
              navigate={navigate}
              sitePackage={sitePackage}
              onReset={reset}
            />
          ) : (
            <SlideComp brief={brief} update={update} />
          )}
        </div>
      </main>

      {/* Bottom nav */}
      {
        <div
          style={{
            position: "sticky",
            bottom: 0,
            zIndex: 30,
            padding: "16px 24px",
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: `1px solid ${HAIR}`,
          }}
        >
          <div
            style={{
              maxWidth: 720,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "11px 18px",
                borderRadius: 999,
                border: `1px solid ${HAIR}`,
                background: "rgba(255,255,255,0.7)",
                color: step === 0 ? "#c5c8d4" : INK,
                fontFamily: FONT_BODY,
                fontSize: 14,
                fontWeight: 500,
                cursor: step === 0 ? "not-allowed" : "pointer",
                opacity: step === 0 ? 0 : 1,
                pointerEvents: step === 0 ? "none" : "auto",
                transition: "all 0.2s",
              }}
            >
              <ArrowLeft size={14} />
              Back
            </button>

            {!isLast && (
              <NextBtn
                disabled={!canAdvance()}
                onClick={() => setStep((s) => s + 1)}
              />
            )}
          </div>
        </div>
      }
    </div>
  );
}

function NextBtn({ disabled, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 20px 12px 22px",
        borderRadius: 999,
        background: disabled ? "#dcdfe6" : hover ? ACCENT : INK,
        color: "#fff",
        border: "none",
        fontFamily: FONT_BODY,
        fontSize: 14,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.25s cubic-bezier(.22,1,.36,1)",
        transform: hover && !disabled ? "translateY(-1px)" : "translateY(0)",
        boxShadow:
          hover && !disabled
            ? "0 16px 36px rgba(73,79,223,0.32)"
            : "0 8px 20px rgba(15,17,21,0.14)",
      }}
    >
      Continue
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.18)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transform: hover && !disabled ? "translateX(2px)" : "translateX(0)",
          transition: "transform 0.3s cubic-bezier(.34,1.56,.64,1)",
        }}
      >
        <ArrowRight size={14} />
      </span>
    </button>
  );
}
