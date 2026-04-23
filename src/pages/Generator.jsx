import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  Loader2,
  Copy,
  ChevronDown,
} from "lucide-react";

const API_URL = "https://websiteai-backend-production.up.railway.app";
const BLOB_URL_REVOKE_DELAY_MS = 10000;

// ─── Schema options ───────────────────────────────────────────────────────────

const INDUSTRIES = [
  { value: "software", label: "Software / SaaS" },
  { value: "agency", label: "Agency" },
  { value: "restaurant", label: "Restaurant" },
  { value: "cafe", label: "Café" },
  { value: "yoga", label: "Yoga / Wellness" },
  { value: "fitness", label: "Fitness / Gym" },
  { value: "handwerk", label: "Trades / Handwerk" },
  { value: "personal", label: "Personal Brand" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "personaldienst", label: "Recruitment / HR" },
  { value: "other", label: "Other" },
];

const STYLES = [
  { value: "modern", label: "Modern" },
  { value: "minimal", label: "Minimal" },
  { value: "brutalist", label: "Brutalist" },
  { value: "classic", label: "Classic" },
  { value: "playful", label: "Playful" },
  { value: "editorial", label: "Editorial" },
  { value: "glassmorphism", label: "Glassmorphism" },
];

const LEVELS = [
  { value: "super-modern", label: "Cutting-edge" },
  { value: "mid", label: "Contemporary" },
  { value: "basic", label: "Clean & Simple" },
];

const SHAPES = [
  { value: "round", label: "Rounded" },
  { value: "mixed", label: "Mixed" },
  { value: "angular", label: "Angular" },
];

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "playful", label: "Playful" },
  { value: "formal", label: "Formal" },
  { value: "youthful", label: "Youthful" },
  { value: "luxurious", label: "Luxurious" },
];

const IMAGERY = [
  { value: "photos", label: "Photography" },
  { value: "illustrations", label: "Illustrations" },
  { value: "abstract", label: "Abstract / Geometric" },
  { value: "minimal", label: "Minimal" },
  { value: "none", label: "None" },
];

const ANIMATIONS = [
  { value: "none", label: "None" },
  { value: "subtle", label: "Subtle" },
  { value: "moderate", label: "Moderate" },
  { value: "heavy", label: "Heavy" },
];

const HERO_STYLES = [
  { value: "fullscreen-image", label: "Fullscreen Image" },
  { value: "split", label: "Split (text + visual)" },
  { value: "video-bg", label: "Video Background" },
  { value: "text-only", label: "Text Only" },
];

const LAYOUTS = [
  { value: "airy", label: "Airy (lots of whitespace)" },
  { value: "balanced", label: "Balanced" },
  { value: "dense", label: "Dense (information-rich)" },
];

const CTAS = [
  { value: "contact", label: "Contact Us" },
  { value: "call", label: "Call Now" },
  { value: "book", label: "Book Appointment" },
  { value: "buy", label: "Buy Now" },
  { value: "demo", label: "Request Demo" },
];

const AUDIENCE_TYPES = [
  { value: "B2C", label: "B2C (consumers)" },
  { value: "B2B", label: "B2B (businesses)" },
  { value: "both", label: "Both" },
];

const SHOW_PRICES = [
  { value: "yes", label: "Show exact prices" },
  { value: "no", label: "Hide prices" },
  { value: "from", label: '"Starting from" prices' },
  { value: "packages", label: "Package pricing" },
];

const SECTION_OPTIONS = [
  { key: "about", label: "About Us" },
  { key: "team", label: "Team" },
  { key: "testimonials", label: "Testimonials" },
  { key: "faq", label: "FAQ" },
  { key: "process", label: "Process Steps" },
  { key: "gallery", label: "Gallery / Portfolio" },
  { key: "blog", label: "Blog Preview" },
  { key: "pricing", label: "Pricing" },
  { key: "compareTable", label: "Comparison Table" },
  { key: "stats", label: "Stats Banner" },
  { key: "careers", label: "Careers / Jobs" },
  { key: "locations", label: "Locations" },
  { key: "partnerLogos", label: "Partner Logos" },
];

const SOCIAL_FIELDS = [
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "tiktok", label: "TikTok" },
  { key: "facebook", label: "Facebook" },
  { key: "youtube", label: "YouTube" },
  { key: "x", label: "X / Twitter" },
];

// ─── Initial state ────────────────────────────────────────────────────────────

const initialBrief = {
  basics: {
    name: "",
    industry: "",
    tagline: "",
    description: "",
    usp: "",
    audience: { type: "B2C", ageRange: "", notes: "" },
  },
  design: {
    style: "modern",
    level: "mid",
    shape: "round",
    tone: "professional",
    imagery: "photos",
    animations: "subtle",
    heroStyle: "split",
    layout: "balanced",
    darkMode: false,
    colors: { primary: "", secondary: "", accent: "" },
  },
  sections: Object.fromEntries(SECTION_OPTIONS.map((s) => [s.key, false])),
  offering: { showPrices: "no", openingHours: "", specials: "" },
  contact: {
    primaryCta: "contact",
    phone: "",
    email: "",
    address: "",
    whatsapp: false,
    social: Object.fromEntries(SOCIAL_FIELDS.map((s) => [s.key, ""])),
  },
  freeText: "",
};

// ─── Shared UI primitives ─────────────────────────────────────────────────────

function Label({ children }) {
  return (
    <label className="block text-sm font-medium text-white/70 mb-1.5">
      {children}
    </label>
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-white/30 focus:bg-white/8 transition-colors"
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/25 text-sm focus:outline-none focus:border-white/30 focus:bg-white/8 transition-colors resize-none"
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/30 transition-colors cursor-pointer pr-10"
      >
        <option value="" disabled className="bg-[#0a0a14] text-white/50">
          Select…
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0a0a14]">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
      />
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${
          checked ? "bg-indigo-500" : "bg-white/15"
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </div>
      <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
        {label}
      </span>
    </label>
  );
}

function SegmentedControl({ value, onChange, options }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
            value === opt.value
              ? "bg-indigo-500 text-white shadow"
              : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80 border border-white/10"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 space-y-5">
      {title && (
        <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepBasics({ brief, update }) {
  const b = brief.basics;
  const set = (key) => (val) => update("basics", { ...b, [key]: val });
  const setAudience = (key) => (val) =>
    update("basics", { ...b, audience: { ...b.audience, [key]: val } });

  return (
    <div className="space-y-4">
      <SectionCard title="Company">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Company / Brand name *">
            <Input
              value={b.name}
              onChange={set("name")}
              placeholder="Acme GmbH"
            />
          </Field>
          <Field label="Industry *">
            <Select
              value={b.industry}
              onChange={set("industry")}
              options={INDUSTRIES}
            />
          </Field>
        </div>
        <Field label="Tagline">
          <Input
            value={b.tagline}
            onChange={set("tagline")}
            placeholder="Short, punchy headline for the hero"
          />
        </Field>
        <Field label="Description">
          <Textarea
            value={b.description}
            onChange={set("description")}
            placeholder="What does this business do? Who does it serve?"
            rows={3}
          />
        </Field>
        <Field label="Unique Selling Point (USP)">
          <Textarea
            value={b.usp}
            onChange={set("usp")}
            placeholder="What makes this business different from competitors?"
            rows={2}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Audience">
        <Field label="Target audience type">
          <SegmentedControl
            value={b.audience.type}
            onChange={setAudience("type")}
            options={AUDIENCE_TYPES}
          />
        </Field>
        <Field label="Age range (optional)">
          <Input
            value={b.audience.ageRange}
            onChange={setAudience("ageRange")}
            placeholder="e.g. 25–45"
          />
        </Field>
        <Field label="Audience notes (optional)">
          <Input
            value={b.audience.notes}
            onChange={setAudience("notes")}
            placeholder="e.g. tech-savvy professionals, local families…"
          />
        </Field>
      </SectionCard>
    </div>
  );
}

function StepDesign({ brief, update }) {
  const d = brief.design;
  const set = (key) => (val) => update("design", { ...d, [key]: val });
  const setColor = (key) => (val) =>
    update("design", { ...d, colors: { ...d.colors, [key]: val } });

  return (
    <div className="space-y-4">
      <SectionCard title="Style">
        <Field label="Design style">
          <SegmentedControl
            value={d.style}
            onChange={set("style")}
            options={STYLES}
          />
        </Field>
        <Field label="Sophistication level">
          <SegmentedControl
            value={d.level}
            onChange={set("level")}
            options={LEVELS}
          />
        </Field>
        <Field label="Shape language">
          <SegmentedControl
            value={d.shape}
            onChange={set("shape")}
            options={SHAPES}
          />
        </Field>
        <Field label="Communication tone">
          <SegmentedControl
            value={d.tone}
            onChange={set("tone")}
            options={TONES}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Layout & Visuals">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Imagery type">
            <Select
              value={d.imagery}
              onChange={set("imagery")}
              options={IMAGERY}
            />
          </Field>
          <Field label="Animations">
            <Select
              value={d.animations}
              onChange={set("animations")}
              options={ANIMATIONS}
            />
          </Field>
          <Field label="Hero style">
            <Select
              value={d.heroStyle}
              onChange={set("heroStyle")}
              options={HERO_STYLES}
            />
          </Field>
          <Field label="Layout density">
            <Select
              value={d.layout}
              onChange={set("layout")}
              options={LAYOUTS}
            />
          </Field>
        </div>
        <Toggle
          checked={d.darkMode}
          onChange={set("darkMode")}
          label="Dark mode"
        />
      </SectionCard>

      <SectionCard title="Colors (optional — leave blank to auto-select)">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: "primary", label: "Primary" },
            { key: "secondary", label: "Secondary" },
            { key: "accent", label: "Accent" },
          ].map(({ key, label }) => (
            <Field key={key} label={label}>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={d.colors[key] || "#6366f1"}
                  onChange={(e) => setColor(key)(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0.5"
                />
                <Input
                  value={d.colors[key]}
                  onChange={setColor(key)}
                  placeholder="#6366f1"
                />
              </div>
            </Field>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function StepSections({ brief, update }) {
  const sections = brief.sections;
  const toggle = (key) =>
    update("sections", { ...sections, [key]: !sections[key] });

  return (
    <div className="space-y-4">
      <SectionCard title="Optional sections">
        <p className="text-sm text-white/40 -mt-2">
          The hero, navbar, contact page, and footer are always included.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SECTION_OPTIONS.map(({ key, label }) => (
            <label
              key={key}
              onClick={() => toggle(key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                sections[key]
                  ? "bg-indigo-500/15 border-indigo-400/40 text-white"
                  : "bg-white/3 border-white/8 text-white/50 hover:border-white/20 hover:text-white/70"
              }`}
            >
              <div
                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                  sections[key] ? "bg-indigo-500" : "bg-white/10"
                }`}
              >
                {sections[key] && (
                  <Check size={10} strokeWidth={3} className="text-white" />
                )}
              </div>
              <span className="text-sm font-medium">{label}</span>
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Offering & Content">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Show prices">
            <Select
              value={brief.offering.showPrices}
              onChange={(val) =>
                update("offering", { ...brief.offering, showPrices: val })
              }
              options={SHOW_PRICES}
            />
          </Field>
          <Field label="Opening hours (optional)">
            <Input
              value={brief.offering.openingHours}
              onChange={(val) =>
                update("offering", { ...brief.offering, openingHours: val })
              }
              placeholder="Mon–Fri 9–18, Sat 10–14"
            />
          </Field>
        </div>
        <Field label="Specials / promotions (optional)">
          <Textarea
            value={brief.offering.specials}
            onChange={(val) =>
              update("offering", { ...brief.offering, specials: val })
            }
            placeholder="e.g. Happy Hour Mon–Thu 17–19, 2-for-1 cocktails"
            rows={2}
          />
        </Field>
      </SectionCard>
    </div>
  );
}

function StepContact({ brief, update }) {
  const c = brief.contact;
  const set = (key) => (val) => update("contact", { ...c, [key]: val });
  const setSocial = (key) => (val) =>
    update("contact", { ...c, social: { ...c.social, [key]: val } });

  return (
    <div className="space-y-4">
      <SectionCard title="Primary CTA">
        <Field label="Main call-to-action">
          <SegmentedControl
            value={c.primaryCta}
            onChange={set("primaryCta")}
            options={CTAS}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Contact details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Email">
            <Input
              value={c.email}
              onChange={set("email")}
              placeholder="hello@acme.de"
              type="email"
            />
          </Field>
          <Field label="Phone">
            <Input
              value={c.phone}
              onChange={set("phone")}
              placeholder="+49 30 123456"
              type="tel"
            />
          </Field>
        </div>
        <Field label="Address">
          <Input
            value={c.address}
            onChange={set("address")}
            placeholder="Musterstraße 1, 10115 Berlin"
          />
        </Field>
        <Toggle
          checked={c.whatsapp}
          onChange={set("whatsapp")}
          label="WhatsApp button"
        />
      </SectionCard>

      <SectionCard title="Social media (optional)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SOCIAL_FIELDS.map(({ key, label }) => (
            <Field key={key} label={label}>
              <Input
                value={c.social[key]}
                onChange={setSocial(key)}
                placeholder={`@${label.toLowerCase()}`}
              />
            </Field>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Additional instructions (optional)">
        <Field label="Free text — anything the AI should know">
          <Textarea
            value={brief.freeText}
            onChange={(val) => update("freeText", val)}
            placeholder="e.g. Use Austrian German. The hero background should feel like a mountain sunrise. Include a seasonal menu section for autumn."
            rows={4}
          />
        </Field>
      </SectionCard>
    </div>
  );
}

function StepGenerate({ brief, onGenerate, result, loading, error }) {
  const [copied, setCopied] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const [previewMode, setPreviewMode] = useState("desktop");

  const htmlContent = result?.trim() || "";

  const normalizedHtml = (() => {
    if (!htmlContent) return "";
    const lower = htmlContent.toLowerCase();
    if (lower.includes("<html") || lower.includes("<!doctype")) return htmlContent;
    return `<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head><body>${htmlContent}</body></html>`;
  })();

  const copy = () => {
    if (!htmlContent) return;
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInNewTab = () => {
    if (!normalizedHtml) return;
    const blob = new Blob([normalizedHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), BLOB_URL_REVOKE_DELAY_MS);
  };

  const downloadHtml = () => {
    if (!normalizedHtml) return;
    const blob = new Blob([normalizedHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "website-preview.html";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <SectionCard title="Brief summary">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          {[
            { label: "Company", value: brief.basics.name },
            {
              label: "Industry",
              value: INDUSTRIES.find((i) => i.value === brief.basics.industry)
                ?.label,
            },
            {
              label: "Style",
              value: STYLES.find((s) => s.value === brief.design.style)?.label,
            },
            {
              label: "Tone",
              value: TONES.find((t) => t.value === brief.design.tone)?.label,
            },
            {
              label: "Level",
              value: LEVELS.find((l) => l.value === brief.design.level)?.label,
            },
            {
              label: "Sections",
              value:
                Object.entries(brief.sections)
                  .filter(([, v]) => v)
                  .map(([k]) => SECTION_OPTIONS.find((s) => s.key === k)?.label)
                  .join(", ") || "Default only",
            },
          ].map(({ label, value }) => (
            <div key={label} className="space-y-0.5">
              <div className="text-white/35 text-xs uppercase tracking-wider">
                {label}
              </div>
              <div className="text-white/80">{value || "—"}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="flex justify-center">
        <button
          onClick={onGenerate}
          disabled={loading || !brief.basics.name || !brief.basics.industry}
          className="flex items-center gap-2.5 px-8 py-3.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-colors shadow-lg shadow-indigo-500/20"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Sparkles size={18} />
          )}
          {loading ? "Generating with AI…" : "Generate Website Code"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-400/20 rounded-xl px-5 py-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {result && normalizedHtml && (
        <SectionCard title="HTML Preview">
          <div className="flex flex-wrap items-center justify-between gap-2 -mt-2">
            <div className="inline-flex rounded-lg border border-white/10 bg-white/5 p-1 text-xs">
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  previewMode === "mobile"
                    ? "bg-indigo-500 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Mobile
              </button>
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  previewMode === "desktop"
                    ? "bg-indigo-500 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Desktop
              </button>
            </div>
            <div className="flex flex-wrap justify-end gap-3 text-xs">
              <button
                onClick={() => setFrameKey((v) => v + 1)}
                className="text-white/50 hover:text-white/80 transition-colors"
              >
                Reload
              </button>
              <button
                onClick={openInNewTab}
                className="text-white/50 hover:text-white/80 transition-colors"
              >
                Open
              </button>
              <button
                onClick={downloadHtml}
                className="text-white/50 hover:text-white/80 transition-colors"
              >
                Download
              </button>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div
            className={`mx-auto overflow-hidden rounded-xl border border-white/10 bg-white ${
              previewMode === "mobile"
                ? "w-full max-w-[390px] h-[720px]"
                : "w-full h-[720px]"
            }`}
          >
            <iframe
              key={frameKey}
              title="Generated website preview"
              srcDoc={normalizedHtml}
              // Intentionally no allow-same-origin to keep preview isolated.
              sandbox="allow-scripts allow-forms"
              className="h-full w-full border-0"
            />
          </div>
        </SectionCard>
      )}
    </div>
  );
}

// ─── Main Generator ───────────────────────────────────────────────────────────

const STEPS = ["Basics", "Design", "Sections", "Contact", "Generate"];

export default function Generator() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [brief, setBrief] = useState(initialBrief);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (section, value) => {
    setBrief((prev) => ({ ...prev, [section]: value }));
  };

  const generate = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error ?? "Request failed");
      }

      const json = await res.json();
      const responseHtml =
        typeof json?.htmlCode === "string" && json.htmlCode.trim()
          ? json.htmlCode
          : typeof json?.code === "string" && json.code.trim()
          ? json.code
          : "";
      if (!responseHtml) {
        throw new Error(
          "Invalid response: htmlCode or code field is missing or empty"
        );
      }
      setResult(responseHtml);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stepProps = { brief, update };

  return (
    <div className="min-h-screen bg-[#06060f] text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/6 bg-[#06060f]/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            <ArrowLeft size={15} />
            Back
          </button>
          <span className="text-sm font-semibold tracking-tight text-white/80">
            Landing Generator
          </span>
          <div className="w-16" />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-10">
        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className="flex items-center flex-1 last:flex-none"
            >
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex flex-col items-center gap-1 group ${
                  i < step ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i < step
                      ? "bg-indigo-500 text-white"
                      : i === step
                      ? "bg-white text-[#06060f]"
                      : "bg-white/10 text-white/30"
                  }`}
                >
                  {i < step ? <Check size={12} strokeWidth={3} /> : i + 1}
                </div>
                <span
                  className={`text-xs hidden sm:block transition-colors ${
                    i === step ? "text-white" : "text-white/30"
                  }`}
                >
                  {label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 transition-colors ${
                    i < step ? "bg-indigo-500/50" : "bg-white/8"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="mb-8">
          {step === 0 && <StepBasics {...stepProps} />}
          {step === 1 && <StepDesign {...stepProps} />}
          {step === 2 && <StepSections {...stepProps} />}
          {step === 3 && <StepContact {...stepProps} />}
          {step === 4 && (
            <StepGenerate
              {...stepProps}
              onGenerate={generate}
              result={result}
              loading={loading}
              error={error}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white/80 disabled:opacity-0 disabled:pointer-events-none transition-colors"
          >
            <ArrowLeft size={15} />
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={
                step === 0 &&
                (!brief.basics.name.trim() || !brief.basics.industry)
              }
              className="flex items-center gap-2 px-6 py-2.5 bg-white/8 hover:bg-white/14 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 rounded-xl text-sm font-medium transition-colors"
            >
              Next
              <ArrowRight size={15} />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
