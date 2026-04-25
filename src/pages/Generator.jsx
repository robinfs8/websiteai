import { useEffect, useRef, useState } from "react";
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
import JSZip from "jszip";

const API_URL = "https://websiteai-backend-production.up.railway.app";
const BLOB_URL_REVOKE_DELAY_MS = 10000;
const FALLBACK_PAGE_NAME = "website-preview.html";
const PREVIEW_BRIDGE_SCRIPT = `
<script>
  (function () {
    const normalize = (href) => {
      const value = String(href || "").trim();
      if (!value) return null;
      const lower = value.toLowerCase();
      if (
        lower.startsWith("http:") ||
        lower.startsWith("https:") ||
        lower.startsWith("mailto:") ||
        lower.startsWith("tel:") ||
        lower.startsWith("javascript:") ||
        lower.startsWith("#") ||
        lower.startsWith("//")
      ) {
        return null;
      }
      let normalized = value.split("#")[0].split("?")[0].trim();
      if (!normalized || normalized === "/") return "index.html";
      if (normalized.startsWith("/")) normalized = normalized.slice(1);
      if (normalized.startsWith("./")) normalized = normalized.slice(2);
      if (/^[a-z0-9-]+\\.html$/i.test(normalized)) return normalized;
      return null;
    };

    document.addEventListener("click", (event) => {
      const anchor =
        event.target && event.target.closest
          ? event.target.closest("a[href]")
          : null;
      if (!anchor) return;
      const page = normalize(anchor.getAttribute("href"));
      if (!page) return;
      event.preventDefault();
      window.parent.postMessage(
        { type: "websiteai:preview-nav", page },
        __PARENT_ORIGIN__
      );
    });
  })();
</script>`;

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
  { value: "agency", label: "Agentur / Dienstleistung" },
  { value: "handwerk", label: "Lokales Handwerk / Servicebetrieb" },
  { value: "health", label: "Gesundheitsbereich" },
  { value: "gastro", label: "Gastronomie" },
  { value: "sport", label: "Sport" },
  { value: "brand", label: "Marke" },
  { value: "industry", label: "Industrie / Technik" },
  { value: "realestate", label: "Immobilien" },
  { value: "education", label: "Bildung" },
  { value: "event", label: "Event / Community" },
  { value: "nonprofit", label: "Non-Profit" },
  { value: "corporate", label: "Corporate" },
  { value: "portfolio", label: "Portfolio" },
];

const DESIGN_DIRECTIONS = [
  { value: "minimal", label: "Minimal" },
  { value: "modern", label: "Modern" },
  { value: "brutalist", label: "Brutalist" },
  { value: "luxury", label: "Luxury" },
  { value: "playful", label: "Playful" },
  { value: "standard", label: "Standard" },
];

const SHAPE_LANGUAGE = [
  { value: "rounded", label: "Rounded" },
  { value: "sharp", label: "Sharp" },
];

const CTAS = [
  { value: "call", label: "Anrufen" },
  { value: "book", label: "Termin buchen" },
  { value: "contact", label: "Kontaktformular" },
  { value: "buy", label: "Kaufen" },
  { value: "demo", label: "Demo buchen" },
];

const SECTION_OPTIONS = [
  {
    key: "about",
    label: "Über uns / Story",
    contentField: "story",
    placeholder: "Erzähle die Geschichte deines Unternehmens…",
  },
  {
    key: "team",
    label: "Team",
    contentField: "members",
    placeholder:
      "Namen & kurze Beschreibung der Teammitglieder (ein Eintrag pro Zeile)…",
  },
  {
    key: "testimonials",
    label: "Testimonials / Reviews",
    contentField: "reviews",
    placeholder: "Kundenbewertungen eintragen…",
  },
  {
    key: "process",
    label: "How it works / Prozess",
    contentField: "description",
    placeholder: "Beschreibe den Prozess kurz (Schritt für Schritt)…",
  },
  {
    key: "portfolio",
    label: "Portfolio / Projekte",
    contentField: "projects",
    placeholder:
      "Kurze Texte zu Projekten (Bilder/Screenshots können später ergänzt werden)…",
  },
  {
    key: "pricing",
    label: "Pricing / Leistungen",
    contentField: "details",
    placeholder: "Preise und was inklusive ist…",
  },
  {
    key: "comparison",
    label: "Vergleich / Features vs. Konkurrenz",
    contentField: "data",
    placeholder: "Vergleichsdaten eintragen…",
  },
  {
    key: "stats",
    label: "Key Stats / Zahlen & Trust",
    contentField: "data",
    placeholder:
      "Wichtige Zahlen eintragen (z. B. 500+ Kunden, 10 Jahre Erfahrung)…",
  },
  {
    key: "faq",
    label: "FAQ",
    contentField: null,
    placeholder: null,
  },
  {
    key: "careers",
    label: "Karriere / Jobs",
    contentField: "jobs",
    placeholder: "Offene Stellen, Bezahlung und weitere Infos…",
  },
  {
    key: "locations",
    label: "Standorte / Filialen",
    contentField: "addresses",
    placeholder: "Adressen der Standorte…",
  },
  {
    key: "partners",
    label: "Partner / Logos / Integrationen",
    contentField: "names",
    placeholder: "Partner- und Integrationsnamen eintragen…",
  },
];

const SOCIAL_FIELDS = [
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "tiktok", label: "TikTok" },
  { key: "facebook", label: "Facebook" },
  { key: "youtube", label: "YouTube" },
];

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
  basics: {
    companyName: "",
    industry: "",
    slogan: "",
    description: "",
  },
  design: {
    colors: "",
    shapeLanguage: "rounded",
    designDirection: "modern",
    darkMode: false,
  },
  sections: initialSections,
  contact: {
    primaryCta: "",
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

// ─── Shared UI primitives ─────────────────────────────────────────────────────

function Label({ children, hint }) {
  return (
    <label className="block text-sm font-medium text-white/70 mb-1.5">
      {children}
      {hint && <span className="ml-1.5 text-white/30 font-normal">{hint}</span>}
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

function Select({ value, onChange, options, placeholder = "Auswählen…" }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/30 transition-colors cursor-pointer pr-10"
      >
        <option value="" disabled className="bg-[#0a0a14] text-white/50">
          {placeholder}
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

function Field({ label, hint, children }) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      {children}
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 space-y-5">
      {title && (
        <div className="space-y-1">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">
            {title}
          </h3>
          {subtitle && <p className="text-sm text-white/30">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── Step components ──────────────────────────────────────────────────────────

function StepBasics({ brief, update }) {
  const b = brief.basics;
  const set = (key) => (val) => update("basics", { ...b, [key]: val });

  return (
    <div className="space-y-4">
      <SectionCard title="Dein Unternehmen">
        <Field label="Name des Unternehmens *">
          <Input
            value={b.companyName}
            onChange={set("companyName")}
            placeholder="z. B. Müller GmbH"
          />
        </Field>

        <Field label="Unternehmensbereich *">
          <Select
            value={b.industry}
            onChange={set("industry")}
            options={INDUSTRIES}
            placeholder="Bereich auswählen…"
          />
        </Field>
      </SectionCard>

      <SectionCard
        title="Beschreibung"
        subtitle="Wie soll sich dein Unternehmen vorstellen?"
      >
        <Field label="Slogan" hint="(optional – 1 Satz im Hero)">
          <Input
            value={b.slogan}
            onChange={set("slogan")}
            placeholder="z. B. Wir bauen Websites, die begeistern."
          />
        </Field>

        <Field label="Kurzbeschreibung" hint="(2–3 Sätze: Wer seid ihr, was macht ihr?)">
          <Textarea
            value={b.description}
            onChange={set("description")}
            placeholder="z. B. Wir sind eine Digitalagentur aus Berlin und helfen kleinen Unternehmen dabei, online sichtbar zu werden…"
            rows={4}
          />
        </Field>
      </SectionCard>
    </div>
  );
}

function StepDesign({ brief, update }) {
  const d = brief.design;
  const set = (key) => (val) => update("design", { ...d, [key]: val });

  return (
    <div className="space-y-4">
      <SectionCard title="Farben & Form">
        <Field
          label="Farbe / Farbkombination"
          hint="(optional – Logofarben, Hexcodes, Beschreibung)"
        >
          <Input
            value={d.colors}
            onChange={set("colors")}
            placeholder="z. B. Dunkelblau #1a2e5a + Gold #c9a84c, oder: Grün & Weiß"
          />
        </Field>

        <Field label="Formensprache">
          <SegmentedControl
            value={d.shapeLanguage}
            onChange={set("shapeLanguage")}
            options={SHAPE_LANGUAGE}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Designrichtung">
        <Field label="Stil">
          <SegmentedControl
            value={d.designDirection}
            onChange={set("designDirection")}
            options={DESIGN_DIRECTIONS}
          />
        </Field>

        <Toggle
          checked={d.darkMode}
          onChange={set("darkMode")}
          label="Dark Mode"
        />
      </SectionCard>
    </div>
  );
}

function StepSections({ brief, update }) {
  const sections = brief.sections;

  const toggleSection = (key) => {
    const current = sections[key];
    update("sections", { ...sections, [key]: { ...current, enabled: !current.enabled } });
  };

  const setSectionContent = (key, field) => (val) => {
    const current = sections[key];
    update("sections", { ...sections, [key]: { ...current, [field]: val } });
  };

  return (
    <div className="space-y-4">
      <SectionCard
        title="Sektionen auswählen"
        subtitle="Header, Navbar, CTA und Footer sind immer enthalten."
      >
        <div className="space-y-2">
          {SECTION_OPTIONS.map(({ key, label, contentField, placeholder }) => {
            const section = sections[key];
            const isEnabled = section.enabled;

            return (
              <div key={key} className="overflow-hidden rounded-xl border border-white/8 transition-all">
                <button
                  type="button"
                  onClick={() => toggleSection(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer transition-all text-left ${
                    isEnabled
                      ? "bg-indigo-500/12 border-b border-indigo-400/20"
                      : "bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                      isEnabled ? "bg-indigo-500" : "bg-white/10"
                    }`}
                  >
                    {isEnabled && (
                      <Check size={10} strokeWidth={3} className="text-white" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors ${
                      isEnabled ? "text-white" : "text-white/50"
                    }`}
                  >
                    {label}
                  </span>
                  {key === "faq" && isEnabled && (
                    <span className="ml-auto text-xs text-indigo-400/70">
                      KI erstellt automatisch
                    </span>
                  )}
                </button>

                {isEnabled && contentField && (
                  <div className="px-4 py-3 bg-indigo-500/5">
                    <Textarea
                      value={section[contentField] ?? ""}
                      onChange={setSectionContent(key, contentField)}
                      placeholder={placeholder}
                      rows={3}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
      <SectionCard title="Call-to-Action">
        <Field label="Primäres Call-to-Action *">
          <SegmentedControl
            value={c.primaryCta}
            onChange={set("primaryCta")}
            options={CTAS}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Kontaktdaten">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Telefonnummer">
            <Input
              value={c.phone}
              onChange={set("phone")}
              placeholder="+49 30 123456"
              type="tel"
            />
          </Field>
          <Field label="E-Mail">
            <Input
              value={c.email}
              onChange={set("email")}
              placeholder="info@firma.de"
              type="email"
            />
          </Field>
        </div>
        <Field label="Adresse">
          <Input
            value={c.address}
            onChange={set("address")}
            placeholder="Musterstraße 1, 10115 Berlin"
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Öffnungszeiten" hint="(optional)">
            <Input
              value={c.openingHours}
              onChange={set("openingHours")}
              placeholder="Mo–Fr 9–18, Sa 10–14"
            />
          </Field>
          <Field label="Weiterführende Links" hint="(optional, z. B. Terminbuchung)">
            <Input
              value={c.furtherLinks}
              onChange={set("furtherLinks")}
              placeholder="https://calendly.com/..."
            />
          </Field>
        </div>
        <Field label="Besondere Angebote / Aktionen" hint="(optional)">
          <Textarea
            value={c.specials}
            onChange={set("specials")}
            placeholder="z. B. Happy Hour Mo–Do 17–19 Uhr, 2-für-1 Cocktails"
            rows={2}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Social Media" subtitle="Alle Felder optional.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SOCIAL_FIELDS.map(({ key, label }) => (
            <Field key={key} label={label}>
              <Input
                value={c.social[key]}
                onChange={setSocial(key)}
                placeholder={`@${label.toLowerCase()} oder URL`}
              />
            </Field>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Branchen-spezifisch"
        subtitle="Gibt es etwas Besonderes, das die KI wissen soll?"
      >
        <Field label="Weitere Wünsche & Hinweise" hint="(optional)">
          <Textarea
            value={brief.extras}
            onChange={(val) => update("extras", val)}
            placeholder="z. B. Speisekarte einfügen, Stundenplan anzeigen, österreichisches Deutsch verwenden, Hero-Hintergrund soll wie ein Sonnenaufgang wirken…"
            rows={4}
          />
        </Field>
      </SectionCard>
    </div>
  );
}

function StepGenerate({
  brief,
  onGenerate,
  pages,
  activePage,
  onSelectPage,
  loading,
  error,
}) {
  const [copied, setCopied] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const [previewMode, setPreviewMode] = useState("desktop");
  const iframeRef = useRef(null);
  const selectedPage =
    pages.find((page) => page.name === activePage) ?? pages[0] ?? null;

  const htmlContent = selectedPage?.html?.trim() || "";

  const normalizedHtml = (() => {
    if (!htmlContent) return "";
    const lower = htmlContent.toLowerCase();
    if (lower.includes("<html") || lower.includes("<!doctype"))
      return htmlContent;
    return `<!doctype html><html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head><body>${htmlContent}</body></html>`;
  })();

  const previewHtml = (() => {
    if (!normalizedHtml) return "";
    const bridgeScript = PREVIEW_BRIDGE_SCRIPT.replace(
      "__PARENT_ORIGIN__",
      JSON.stringify(window.location.origin)
    );
    if (normalizedHtml.includes("</body>")) {
      return normalizedHtml.replace("</body>", `${bridgeScript}</body>`);
    }
    return `${normalizedHtml}${bridgeScript}`;
  })();

  useEffect(() => {
    const handlePreviewNavigation = (event) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      const payload = event.data;
      if (
        !payload ||
        typeof payload !== "object" ||
        payload.type !== "websiteai:preview-nav" ||
        typeof payload.page !== "string"
      ) {
        return;
      }
      const targetPage = payload.page.trim();
      if (!/^[a-z0-9-]+\.html$/i.test(targetPage)) return;
      const match = pages.find((page) => page.name === targetPage);
      if (!match) return;
      onSelectPage(match.name);
      setFrameKey((value) => value + 1);
    };
    window.addEventListener("message", handlePreviewNavigation);
    return () => window.removeEventListener("message", handlePreviewNavigation);
  }, [pages, onSelectPage]);

  const copy = () => {
    if (!htmlContent) return;
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInNewTab = () => {
    if (!normalizedHtml) return;
    const blob = new Blob([normalizedHtml], {
      type: "text/html;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), BLOB_URL_REVOKE_DELAY_MS);
  };

  const downloadHtml = () => {
    if (!normalizedHtml) return;
    const blob = new Blob([normalizedHtml], {
      type: "text/html;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = selectedPage?.name || FALLBACK_PAGE_NAME;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const downloadAllHtml = async () => {
    if (pages.length === 0) return;
    try {
      const zip = new JSZip();
      pages.forEach((page) => {
        const pageHtml = page.html?.trim();
        if (!pageHtml) return;
        zip.file(page.name, pageHtml);
      });
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "website-pages.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      console.error("Failed to download all pages", downloadError);
    }
  };

  const enabledSections = Object.entries(brief.sections)
    .filter(([, v]) => v.enabled)
    .map(([k]) => SECTION_OPTIONS.find((s) => s.key === k)?.label)
    .join(", ");

  return (
    <div className="space-y-4">
      <SectionCard title="Zusammenfassung">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          {[
            { label: "Unternehmen", value: brief.basics.companyName },
            {
              label: "Bereich",
              value: INDUSTRIES.find((i) => i.value === brief.basics.industry)?.label,
            },
            {
              label: "Design",
              value: DESIGN_DIRECTIONS.find(
                (d) => d.value === brief.design.designDirection
              )?.label,
            },
            {
              label: "Form",
              value: SHAPE_LANGUAGE.find(
                (s) => s.value === brief.design.shapeLanguage
              )?.label,
            },
            {
              label: "Dark Mode",
              value: brief.design.darkMode ? "Ja" : "Nein",
            },
            {
              label: "Sektionen",
              value: enabledSections || "Standard",
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
          disabled={
            loading ||
            !brief.basics.companyName.trim() ||
            !brief.basics.industry
          }
          className="flex items-center gap-2.5 px-8 py-3.5 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-colors shadow-lg shadow-indigo-500/20"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Sparkles size={18} />
          )}
          {loading ? "Website wird generiert…" : "Website generieren"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-400/20 rounded-xl px-5 py-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {pages.length > 0 && normalizedHtml && (
        <SectionCard title="HTML Preview">
          <div className="flex flex-wrap items-center justify-between gap-2 -mt-2 mb-2">
            <div className="inline-flex flex-wrap gap-1 rounded-lg border border-white/10 bg-white/5 p-1 text-xs">
              {pages.map((page) => (
                <button
                  key={page.name}
                  onClick={() => {
                    onSelectPage(page.name);
                    setFrameKey((v) => v + 1);
                  }}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    selectedPage?.name === page.name
                      ? "bg-indigo-500 text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {page.name}
                </button>
              ))}
            </div>
          </div>
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
                Download Page
              </button>
              <button
                onClick={downloadAllHtml}
                className="text-white/50 hover:text-white/80 transition-colors"
              >
                Download All
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
              ref={iframeRef}
              key={frameKey}
              title="Generated website preview"
              srcDoc={previewHtml}
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

const STEPS = ["Basics", "Design", "Sektionen", "Kontakt", "Generieren"];

export default function Generator() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [brief, setBrief] = useState(initialBrief);
  const [generatedPages, setGeneratedPages] = useState([]);
  const [activePage, setActivePage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (section, value) => {
    setBrief((prev) => ({ ...prev, [section]: value }));
  };

  const generate = async () => {
    setLoading(true);
    setError("");
    setGeneratedPages([]);
    setActivePage("");
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
      const pages = extractPagesFromResponse(json);
      if (pages.length === 0) {
        throw new Error(
          "Unable to generate website pages. Please try again in a moment."
        );
      }
      setGeneratedPages(pages);
      setActivePage(pages[0].name);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stepProps = { brief, update };

  const canAdvance = () => {
    if (step === 0)
      return brief.basics.companyName.trim() && brief.basics.industry;
    return true;
  };

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
              pages={generatedPages}
              activePage={activePage}
              onSelectPage={setActivePage}
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
            Zurück
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance()}
              className="flex items-center gap-2 px-6 py-2.5 bg-white/8 hover:bg-white/14 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 rounded-xl text-sm font-medium transition-colors"
            >
              Weiter
              <ArrowRight size={15} />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
