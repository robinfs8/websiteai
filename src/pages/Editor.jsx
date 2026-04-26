import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Image as ImageIcon,
  Upload,
  Loader2,
  Check,
  RefreshCw,
  Trash2,
  Monitor,
  Smartphone,
} from "lucide-react";
import JSZip from "jszip";

const STORAGE_KEY = "websiteai:sitePackage";
const EDIT_STATE_KEY = "websiteai:editorState";
const IMAGE_SLOT_PATTERN =
  /(image|photo|picture|gallery|hero|logo|avatar|banner|cover|thumb|illustration)/i;

// ─── Theme tokens (match Generator.jsx) ───────────────────────────────────────
const ACCENT = "#494fdf";
const INK = "#0f1115";
const MUTED = "#5b6470";
const HAIR = "#ececf2";
const SOFT = "#f6f7fa";
const FONT_DISPLAY = "'Plus Jakarta Sans', system-ui, sans-serif";
const FONT_BODY = "'Geist', 'Inter', system-ui, sans-serif";

const SECTION_NAMES = {
  nav: "Navigation",
  header: "Header",
  hero: "Hero",
  features: "Features",
  about: "About",
  services: "Services",
  cta: "Call to Action",
  contact: "Contact",
  footer: "Footer",
};

function formatSectionName(prefix) {
  return (
    SECTION_NAMES[prefix] || prefix.charAt(0).toUpperCase() + prefix.slice(1)
  );
}

function formatFieldLabel(fullKey, groupName) {
  const suffix =
    groupName && fullKey.startsWith(groupName + ".")
      ? fullKey.slice(groupName.length + 1)
      : fullKey;
  const last = suffix.split(".").slice(-1)[0] || suffix;
  return last
    .replace(/([a-zA-Z])(\d+)/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function isPlainObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

// ─── Sample data for developer testing ────────────────────────────────────────

const SAMPLE_PACKAGE = {
  pages: {
    "index.html": `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Sample</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-slate-50 text-slate-900 font-sans">
    <header class="border-b border-slate-200">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <span class="font-bold text-lg" data-slot="nav.brand">Beispiel GmbH</span>
        <a href="contact.html" class="text-sm text-indigo-600" data-slot="nav.cta">Kontakt</a>
      </div>
    </header>
    <section class="max-w-5xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h1 class="text-5xl font-bold tracking-tight" data-slot="hero.title">Willkommen bei Beispiel</h1>
        <p class="mt-6 text-lg text-slate-600" data-slot="hero.subtitle">Wir bauen Websites, die begeistern.</p>
        <a href="contact.html" class="mt-8 inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg" data-slot="hero.cta">Jetzt starten</a>
      </div>
      <div class="aspect-video bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400" data-slot="hero.image">Hero Bild</div>
    </section>
    <footer class="border-t border-slate-200 mt-16">
      <div class="max-w-5xl mx-auto px-6 py-8 text-sm text-slate-500" data-slot="footer.copyright">© 2026 Beispiel GmbH</div>
    </footer>
  </body>
</html>`,
  },
  slots: {
    "nav.brand": "Beispiel GmbH",
    "nav.cta": "Kontakt",
    "hero.title": "Willkommen bei Beispiel",
    "hero.subtitle": "Wir bauen Websites, die begeistern.",
    "hero.cta": "Jetzt starten",
    "hero.image": "Hero Bild",
    "footer.copyright": "© 2026 Beispiel GmbH",
  },
  assets: {},
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadStoredPackage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isPlainObject(parsed)) return null;
    if (
      !isPlainObject(parsed.pages) ||
      Object.keys(parsed.pages).length === 0
    ) {
      return null;
    }
    return {
      pages: parsed.pages,
      slots: isPlainObject(parsed.slots) ? parsed.slots : {},
      assets: isPlainObject(parsed.assets) ? parsed.assets : {},
    };
  } catch {
    return null;
  }
}

function loadStoredEdits() {
  try {
    const raw = localStorage.getItem(EDIT_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isPlainObject(parsed)) return null;
    return {
      slots: isPlainObject(parsed.slots) ? parsed.slots : {},
      assets: isPlainObject(parsed.assets) ? parsed.assets : {},
    };
  } catch {
    return null;
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function safeAssetName(originalName) {
  const cleaned = String(originalName || "image")
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || "image";
}

function indexPackage(pkg) {
  const textSlots = new Map();
  const imageSlots = new Map();
  const assetUsage = new Map();

  Object.entries(pkg.pages).forEach(([pageName, html]) => {
    const doc = new DOMParser().parseFromString(html, "text/html");

    doc.querySelectorAll("[data-slot]").forEach((el) => {
      const key = el.getAttribute("data-slot");
      if (!key) return;

      if (el.tagName === "IMG") {
        const src = el.getAttribute("src") || "";
        const assetName = src.startsWith("/assets/")
          ? src.slice("/assets/".length)
          : null;
        imageSlots.set(key, { key, kind: "img", assetName, page: pageName });
        return;
      }

      const looksLikeImage = IMAGE_SLOT_PATTERN.test(key);
      if (looksLikeImage && !el.querySelector("img")) {
        imageSlots.set(key, { key, kind: "placeholder", page: pageName });
      }

      if (!textSlots.has(key) && el.children.length === 0) {
        textSlots.set(key, {
          key,
          defaultText: pkg.slots[key] ?? el.textContent.trim(),
        });
      }
    });

    doc.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!src.startsWith("/assets/")) return;
      const name = src.slice("/assets/".length);
      if (!assetUsage.has(name)) assetUsage.set(name, new Set());
      assetUsage.get(name).add(pageName);
    });
  });

  for (const key of imageSlots.keys()) textSlots.delete(key);

  return {
    textSlots: [...textSlots.values()],
    imageSlots: [...imageSlots.values()],
    assetUsage,
  };
}

function renderPage(html, slots, assets, mode) {
  const doc = new DOMParser().parseFromString(html, "text/html");

  doc.querySelectorAll("[data-slot]").forEach((el) => {
    const key = el.getAttribute("data-slot");
    if (!key) return;

    if (el.tagName === "IMG") {
      const src = el.getAttribute("src") || "";
      if (src.startsWith("/assets/")) {
        const name = src.slice("/assets/".length);
        const asset = assets[name];
        if (asset?.dataUrl) {
          el.setAttribute(
            "src",
            mode === "preview" ? asset.dataUrl : `assets/${name}`
          );
        } else if (mode === "export") {
          el.setAttribute("src", `assets/${name}`);
        }
      }
      return;
    }

    const placeholderAsset = Object.entries(assets).find(
      ([, a]) => a && a.slotKey === key
    );
    if (placeholderAsset) {
      const [name, asset] = placeholderAsset;
      const img = doc.createElement("img");
      img.setAttribute(
        "src",
        mode === "preview" ? asset.dataUrl : `assets/${name}`
      );
      img.setAttribute("alt", slots[key] ?? "");
      img.setAttribute("data-slot", key);
      const cls = el.getAttribute("class");
      if (cls) img.setAttribute("class", `${cls} object-cover`);
      el.replaceWith(img);
      return;
    }

    if (Object.prototype.hasOwnProperty.call(slots, key)) {
      if (el.children.length === 0) {
        el.textContent = slots[key];
      }
    }
  });

  doc.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src") || "";
    if (!src.startsWith("/assets/")) return;
    const name = src.slice("/assets/".length);
    const asset = assets[name];
    if (asset?.dataUrl) {
      img.setAttribute(
        "src",
        mode === "preview" ? asset.dataUrl : `assets/${name}`
      );
    } else if (mode === "export") {
      img.setAttribute("src", `assets/${name}`);
    }
  });

  if (mode === "preview" && doc.body) {
    const s = doc.createElement("script");
    s.textContent = `document.addEventListener('click',function(e){var a=e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href');if(!h||h[0]==='#'||h.indexOf('//')!==-1||h.indexOf('mailto:')===0||h.indexOf('tel:')===0)return;e.preventDefault();window.parent.postMessage({type:'previewNav',href:h},'*');});`;
    doc.body.appendChild(s);
  }

  return `<!doctype html>${doc.documentElement.outerHTML}`;
}

function dataUrlToBytes(dataUrl) {
  const comma = dataUrl.indexOf(",");
  const meta = dataUrl.slice(5, comma);
  const isBase64 = meta.includes(";base64");
  const payload = dataUrl.slice(comma + 1);
  if (!isBase64) {
    return new TextEncoder().encode(decodeURIComponent(payload));
  }
  const binary = atob(payload);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// ─── UI components ────────────────────────────────────────────────────────────

function GroupHeader({ name }) {
  return (
    <div
      style={{
        marginTop: 28,
        marginBottom: 14,
        paddingBottom: 10,
        borderBottom: `1px solid ${HAIR}`,
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: 17,
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: INK,
        }}
      >
        {formatSectionName(name)}
      </h3>
    </div>
  );
}

function TextSlotField({ slot, value, onChange, groupName }) {
  const label = formatFieldLabel(slot.key, groupName);
  const isLong = (value ?? "").length > 80 || (value ?? "").includes("\n");
  const inputStyle = {
    width: "100%",
    background: "#fff",
    border: `1px solid ${HAIR}`,
    borderRadius: 12,
    padding: "11px 14px",
    fontSize: 14,
    color: INK,
    fontFamily: FONT_BODY,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };
  return (
    <div style={{ marginBottom: 12 }}>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 500,
          color: MUTED,
          marginBottom: 6,
          fontFamily: FONT_BODY,
        }}
      >
        {label}
      </label>
      {isLong ? (
        <textarea
          rows={Math.min(6, Math.max(2, Math.ceil((value ?? "").length / 60)))}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }}
          onFocus={(e) => {
            e.target.style.borderColor = ACCENT;
            e.target.style.boxShadow = `0 0 0 3px rgba(73,79,223,0.10)`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = HAIR;
            e.target.style.boxShadow = "none";
          }}
        />
      ) : (
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = ACCENT;
            e.target.style.boxShadow = `0 0 0 3px rgba(73,79,223,0.10)`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = HAIR;
            e.target.style.boxShadow = "none";
          }}
        />
      )}
    </div>
  );
}

function ImageSlotCard({ slot, asset, onUpload, onClear, groupName }) {
  const inputRef = useRef(null);
  const label = formatFieldLabel(slot.key, groupName);

  const handleFile = async (file) => {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    onUpload({ file, dataUrl });
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 12,
          fontWeight: 500,
          color: MUTED,
          marginBottom: 6,
          fontFamily: FONT_BODY,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <ImageIcon size={12} /> {label}
        </span>
        {asset && (
          <button
            onClick={onClear}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#a3a9b3",
              padding: 0,
              display: "flex",
            }}
            title="Remove image"
          >
            <Trash2 size={12} />
          </button>
        )}
      </label>

      {asset?.dataUrl ? (
        <div
          style={{
            position: "relative",
            borderRadius: 12,
            overflow: "hidden",
            aspectRatio: "16/9",
            background: SOFT,
            border: `1px solid ${HAIR}`,
          }}
        >
          <img
            src={asset.dataUrl}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <button
            onClick={() => inputRef.current?.click()}
            style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              padding: "6px 12px",
              fontSize: 12,
              fontFamily: FONT_BODY,
              fontWeight: 600,
              color: "#fff",
              background: "rgba(15,17,21,0.7)",
              backdropFilter: "blur(8px)",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Replace
          </button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          style={{
            width: "100%",
            aspectRatio: "16/9",
            background: SOFT,
            border: `1.5px dashed ${HAIR}`,
            borderRadius: 12,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            color: "#a3a9b3",
            transition: "border-color 0.2s, color 0.2s, background 0.2s",
            fontFamily: FONT_BODY,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = ACCENT;
            e.currentTarget.style.color = ACCENT;
            e.currentTarget.style.background = "rgba(73,79,223,0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = HAIR;
            e.currentTarget.style.color = "#a3a9b3";
            e.currentTarget.style.background = SOFT;
          }}
        >
          <Upload size={16} />
          <span style={{ fontSize: 12, fontWeight: 500 }}>Upload image</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Editor() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pkg, setPkg] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [slots, setSlots] = useState({});
  const [assets, setAssets] = useState({});
  const [activePage, setActivePage] = useState("");
  const [previewMode, setPreviewMode] = useState("desktop");
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const [importError, setImportError] = useState("");

  useEffect(() => {
    if (!pkg) return;
    const handler = (event) => {
      if (event.data?.type !== "previewNav") return;
      const href = String(event.data.href || "");
      const pageNames = Object.keys(pkg.pages);
      const match = pageNames.find(
        (p) =>
          p === href ||
          p === href.replace(/^\.?\//, "") ||
          href.endsWith("/" + p) ||
          href.endsWith(p)
      );
      if (match) {
        setActivePage(match);
        setFrameKey((k) => k + 1);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [pkg]);

  useEffect(() => {
    const routerState = location.state?.sitePackage;
    if (
      isPlainObject(routerState) &&
      isPlainObject(routerState.pages) &&
      Object.keys(routerState.pages).length > 0
    ) {
      const normalized = {
        pages: routerState.pages,
        slots: isPlainObject(routerState.slots) ? routerState.slots : {},
        assets: isPlainObject(routerState.assets) ? routerState.assets : {},
      };
      hydrate(normalized, loadStoredEdits());
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      } catch {
        /* ignore quota */
      }
      return;
    }

    const stored = loadStoredPackage();
    if (stored) {
      hydrate(stored, loadStoredEdits());
      return;
    }

    let raw = null;
    let parseError = null;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch (err) {
      parseError = `localStorage unreadable: ${err.message}`;
    }
    let parsedKeys = null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        parsedKeys = isPlainObject(parsed)
          ? Object.keys(parsed).join(", ") || "(no keys)"
          : `not an object (${typeof parsed})`;
      } catch (err) {
        parseError = `JSON parse failed: ${err.message}`;
      }
    }
    setDebugInfo({
      hasRouterState: !!location.state,
      hasStorageEntry: raw !== null,
      storageBytes: raw ? raw.length : 0,
      parsedKeys,
      parseError,
    });
  }, [location.state]);

  const hydrate = (incoming, savedEdits = null) => {
    setPkg(incoming);
    const baseSlots = { ...incoming.slots };
    if (savedEdits?.slots) Object.assign(baseSlots, savedEdits.slots);
    setSlots(baseSlots);

    const assetMap = {};
    Object.keys(incoming.assets || {}).forEach((name) => {
      assetMap[name] = null;
    });
    if (savedEdits?.assets) {
      Object.entries(savedEdits.assets).forEach(([name, asset]) => {
        if (asset && asset.dataUrl) assetMap[name] = asset;
      });
    }
    setAssets(assetMap);
    setActivePage(Object.keys(incoming.pages)[0] || "");
    setImportError("");
  };

  useEffect(() => {
    if (!pkg) return;
    try {
      localStorage.setItem(EDIT_STATE_KEY, JSON.stringify({ slots, assets }));
    } catch {
      try {
        localStorage.setItem(
          EDIT_STATE_KEY,
          JSON.stringify({ slots, assets: {} })
        );
      } catch {
        /* give up silently */
      }
    }
  }, [pkg, slots, assets]);

  const index = useMemo(() => (pkg ? indexPackage(pkg) : null), [pkg]);

  const imageSlotEntries = useMemo(() => {
    if (!index) return [];
    return index.imageSlots.map((slot) => {
      const existingByKey = Object.entries(assets).find(
        ([, a]) => a && a.slotKey === slot.key
      );
      const existingByName =
        slot.assetName && assets[slot.assetName]?.dataUrl
          ? [slot.assetName, assets[slot.assetName]]
          : null;
      const [assetName, asset] = existingByKey || existingByName || [];
      return {
        slot,
        assetName: assetName || slot.assetName || null,
        asset: asset || null,
      };
    });
  }, [index, assets]);

  const groupedSections = useMemo(() => {
    if (!index) return [];
    const allPrefixes = new Set([
      ...index.textSlots.map((s) => s.key.split(".")[0]),
      ...index.imageSlots.map((s) => s.key.split(".")[0]),
    ]);
    const PREFERRED = [
      "nav",
      "header",
      "hero",
      "features",
      "about",
      "services",
      "cta",
      "contact",
      "footer",
    ];
    const sorted = [...allPrefixes].sort((a, b) => {
      const ai = PREFERRED.indexOf(a);
      const bi = PREFERRED.indexOf(b);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.localeCompare(b);
    });
    return sorted
      .map((prefix) => ({
        name: prefix,
        textItems: index.textSlots.filter(
          (s) => s.key.split(".")[0] === prefix
        ),
        imageItems: imageSlotEntries.filter(
          (e) => e.slot.key.split(".")[0] === prefix
        ),
      }))
      .filter((g) => g.textItems.length > 0 || g.imageItems.length > 0);
  }, [index, imageSlotEntries]);

  const handleSlotChange = (key) => (val) => {
    setSlots((prev) => ({ ...prev, [key]: val }));
  };

  const handleImageUpload =
    (slot, currentAssetName) =>
    async ({ file, dataUrl }) => {
      let name = currentAssetName;
      if (!name) {
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        name = `${safeAssetName(slot.key.replace(/\./g, "-"))}.${ext}`;
      }
      setAssets((prev) => ({
        ...prev,
        [name]: {
          dataUrl,
          fileName: file.name,
          mimeType: file.type || "image/jpeg",
          slotKey: slot.kind === "placeholder" ? slot.key : undefined,
        },
      }));
    };

  const handleImageClear = (assetName) => () => {
    if (!assetName) return;
    setAssets((prev) => {
      const next = { ...prev };
      next[assetName] = null;
      return next;
    });
  };

  const previewHtml = useMemo(() => {
    if (!pkg || !activePage) return "";
    const html = pkg.pages[activePage];
    if (!html) return "";
    return renderPage(html, slots, assets, "preview");
  }, [pkg, activePage, slots, assets]);

  const downloadZip = async () => {
    if (!pkg) return;
    setDownloading(true);
    setDownloaded(false);
    try {
      const zip = new JSZip();
      Object.entries(pkg.pages).forEach(([name, html]) => {
        zip.file(name, renderPage(html, slots, assets, "export"));
      });
      const assetsFolder = zip.folder("assets");
      Object.entries(assets).forEach(([name, asset]) => {
        if (!asset?.dataUrl) return;
        assetsFolder.file(name, dataUrlToBytes(asset.dataUrl), {
          binary: true,
        });
      });
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "website.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setDownloading(false);
    }
  };

  const importFromFile = async (file) => {
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (
        !isPlainObject(parsed) ||
        !isPlainObject(parsed.pages) ||
        !isPlainObject(parsed.slots) ||
        !isPlainObject(parsed.assets)
      ) {
        throw new Error('JSON must contain "pages", "slots" and "assets".');
      }
      hydrate(parsed);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      } catch {
        /* ignore */
      }
    } catch (err) {
      setImportError(err.message);
    }
  };

  // ─── Empty state ─────────────────────────────────────────────────────────────
  if (!pkg) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          fontFamily: FONT_BODY,
        }}
      >
        <div
          style={{
            maxWidth: 440,
            width: "100%",
            background: "#fff",
            border: `1px solid ${HAIR}`,
            borderRadius: 24,
            padding: 36,
            boxShadow: "0 8px 40px rgba(0,0,0,0.04)",
          }}
        >
          <h1
            style={{
              fontSize: 28,
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              color: INK,
              marginBottom: 8,
              margin: 0,
            }}
          >
            Editor
          </h1>
          <p
            style={{
              fontSize: 15,
              color: MUTED,
              margin: "10px 0 24px",
              lineHeight: 1.55,
            }}
          >
            Generate a website first, then customize text and images here.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => navigate("/generate")}
              style={{
                width: "100%",
                background: ACCENT,
                color: "white",
                border: "none",
                borderRadius: 999,
                padding: "13px 0",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: FONT_BODY,
                cursor: "pointer",
                boxShadow: "0 12px 32px rgba(73,79,223,0.28)",
              }}
            >
              Go to Generator
            </button>
            <label
              style={{
                width: "100%",
                textAlign: "center",
                background: "#fff",
                border: `1px solid ${HAIR}`,
                color: INK,
                borderRadius: 999,
                padding: "13px 0",
                fontSize: 14,
                fontWeight: 500,
                fontFamily: FONT_BODY,
                cursor: "pointer",
                boxSizing: "border-box",
                display: "block",
              }}
            >
              Upload JSON file
              <input
                type="file"
                accept="application/json"
                style={{ display: "none" }}
                onChange={(e) => importFromFile(e.target.files?.[0])}
              />
            </label>
            <button
              onClick={() => hydrate(SAMPLE_PACKAGE)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                fontSize: 12,
                color: "#a3a9b3",
                cursor: "pointer",
                padding: "8px 0",
                fontFamily: FONT_BODY,
              }}
            >
              Load sample data (developer)
            </button>
          </div>
          {importError && (
            <div
              style={{
                marginTop: 16,
                fontSize: 13,
                color: "#b91c1c",
                background: "rgba(254,226,226,0.6)",
                border: "1px solid rgba(220,38,38,0.25)",
                borderRadius: 12,
                padding: "10px 14px",
              }}
            >
              {importError}
            </div>
          )}
          {debugInfo && (
            <div
              style={{
                marginTop: 16,
                fontSize: 11,
                color: MUTED,
                background: SOFT,
                border: `1px solid ${HAIR}`,
                borderRadius: 12,
                padding: 12,
                fontFamily: "monospace",
                lineHeight: 1.7,
              }}
            >
              <div
                style={{
                  fontFamily: FONT_BODY,
                  fontWeight: 600,
                  marginBottom: 4,
                  color: INK,
                }}
              >
                Diagnostics
              </div>
              <div>router-state: {debugInfo.hasRouterState ? "yes" : "no"}</div>
              <div>
                localStorage:{" "}
                {debugInfo.hasStorageEntry
                  ? `${debugInfo.storageBytes} bytes`
                  : "missing"}
              </div>
              {debugInfo.parsedKeys && <div>keys: {debugInfo.parsedKeys}</div>}
              {debugInfo.parseError && (
                <div style={{ color: "#b91c1c" }}>{debugInfo.parseError}</div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  const pages = Object.keys(pkg.pages);

  return (
    <div
      style={{
        height: "100vh",
        background: "#fff",
        color: INK,
        fontFamily: FONT_BODY,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Single horizontal toolbar ────────────────────────────────────── */}
      <header
        style={{
          flexShrink: 0,
          background: "#fff",
          borderBottom: `1px solid ${HAIR}`,
          zIndex: 10,
        }}
      >
        <div
          style={{
            padding: "0 20px",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* Left: back + title */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => navigate("/generate")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: MUTED,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: FONT_BODY,
                fontWeight: 500,
                padding: "8px 10px",
                marginLeft: -10,
                borderRadius: 8,
                transition: "color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = INK;
                e.currentTarget.style.background = SOFT;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = MUTED;
                e.currentTarget.style.background = "transparent";
              }}
            >
              <ArrowLeft size={14} />
              Back
            </button>
            <span
              style={{
                fontSize: 15,
                fontFamily: FONT_DISPLAY,
                fontWeight: 700,
                color: INK,
                letterSpacing: "-0.02em",
              }}
            >
              Editor
            </span>
          </div>

          {/* Middle: device toggle + refresh + page tabs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flex: 1,
              justifyContent: "center",
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 2,
                background: SOFT,
                border: `1px solid ${HAIR}`,
                borderRadius: 10,
                padding: 3,
              }}
            >
              <button
                onClick={() => setPreviewMode("desktop")}
                title="Desktop"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 7,
                  border: "none",
                  cursor: "pointer",
                  background:
                    previewMode === "desktop" ? "#fff" : "transparent",
                  color: previewMode === "desktop" ? INK : MUTED,
                  fontSize: 12,
                  fontFamily: FONT_BODY,
                  fontWeight: 500,
                  boxShadow:
                    previewMode === "desktop"
                      ? "0 1px 3px rgba(15,17,21,0.08)"
                      : "none",
                  transition: "all 0.2s",
                }}
              >
                <Monitor size={13} />
                Desktop
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                title="Mobile"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 7,
                  border: "none",
                  cursor: "pointer",
                  background: previewMode === "mobile" ? "#fff" : "transparent",
                  color: previewMode === "mobile" ? INK : MUTED,
                  fontSize: 12,
                  fontFamily: FONT_BODY,
                  fontWeight: 500,
                  boxShadow:
                    previewMode === "mobile"
                      ? "0 1px 3px rgba(15,17,21,0.08)"
                      : "none",
                  transition: "all 0.2s",
                }}
              >
                <Smartphone size={13} />
                Mobile
              </button>
            </div>

            <button
              onClick={() => setFrameKey((k) => k + 1)}
              title="Refresh preview"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: 9,
                border: `1px solid ${HAIR}`,
                background: "#fff",
                cursor: "pointer",
                color: MUTED,
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = ACCENT;
                e.currentTarget.style.borderColor = ACCENT;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = MUTED;
                e.currentTarget.style.borderColor = HAIR;
              }}
            >
              <RefreshCw size={13} />
            </button>

            {pages.length > 1 && (
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  background: SOFT,
                  border: `1px solid ${HAIR}`,
                  borderRadius: 10,
                  padding: 3,
                  overflowX: "auto",
                  maxWidth: 360,
                }}
              >
                {pages.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setActivePage(p);
                      setFrameKey((k) => k + 1);
                    }}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 7,
                      border: "none",
                      cursor: "pointer",
                      background: activePage === p ? "#fff" : "transparent",
                      color: activePage === p ? INK : MUTED,
                      fontSize: 12,
                      fontFamily: FONT_BODY,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      boxShadow:
                        activePage === p
                          ? "0 1px 3px rgba(15,17,21,0.08)"
                          : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    {p.replace(/\.html$/, "")}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: download */}
          <button
            onClick={downloadZip}
            disabled={downloading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              background: downloading || downloaded ? SOFT : ACCENT,
              color: downloading || downloaded ? MUTED : "#fff",
              border: "none",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: FONT_BODY,
              cursor: downloading ? "not-allowed" : "pointer",
              opacity: downloading ? 0.7 : 1,
              transition: "all 0.2s",
              boxShadow:
                downloading || downloaded
                  ? "none"
                  : "0 8px 20px rgba(73,79,223,0.28)",
            }}
          >
            {downloading ? (
              <Loader2
                size={14}
                style={{ animation: "spin 1s linear infinite" }}
              />
            ) : downloaded ? (
              <Check size={14} />
            ) : (
              <Download size={14} />
            )}
            {downloading
              ? "Packaging…"
              : downloaded
              ? "Downloaded"
              : "Download"}
          </button>
        </div>
      </header>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside
          style={{
            width: 340,
            flexShrink: 0,
            background: "#fff",
            borderRight: `1px solid ${HAIR}`,
            overflowY: "auto",
          }}
        >
          <div style={{ padding: "20px 22px 40px" }}>
            <div style={{ marginBottom: 4 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontFamily: FONT_BODY,
                  fontWeight: 500,
                  color: MUTED,
                }}
              >
                Content
              </h2>
            </div>
            {groupedSections.map((section, idx) => (
              <div key={section.name}>
                {idx === 0 ? (
                  <div style={{ marginTop: 14, marginBottom: 14 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 17,
                        fontFamily: FONT_DISPLAY,
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        color: INK,
                      }}
                    >
                      {formatSectionName(section.name)}
                    </h3>
                  </div>
                ) : (
                  <GroupHeader name={section.name} />
                )}
                {section.imageItems.map(({ slot, assetName, asset }) => (
                  <ImageSlotCard
                    key={slot.key}
                    slot={slot}
                    asset={asset}
                    groupName={section.name}
                    onUpload={handleImageUpload(slot, assetName)}
                    onClear={handleImageClear(assetName)}
                  />
                ))}
                {section.textItems.map((slot) => (
                  <TextSlotField
                    key={slot.key}
                    slot={slot}
                    groupName={section.name}
                    value={slots[slot.key] ?? slot.defaultText}
                    onChange={handleSlotChange(slot.key)}
                  />
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* ── Preview ─────────────────────────────────────────────────────── */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: SOFT,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              flex: 1,
              overflow: "auto",
              display: "flex",
              alignItems: previewMode === "mobile" ? "flex-start" : "stretch",
              justifyContent: "center",
              padding: previewMode === "mobile" ? "32px 24px" : "24px",
            }}
          >
            {previewMode === "desktop" ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow:
                    "0 24px 80px rgba(15,17,21,0.10), 0 4px 16px rgba(15,17,21,0.04)",
                  border: `1px solid ${HAIR}`,
                  minHeight: 0,
                  background: "#fff",
                }}
              >
                <div
                  style={{
                    background: SOFT,
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 14px",
                    gap: 8,
                    flexShrink: 0,
                    borderBottom: `1px solid ${HAIR}`,
                  }}
                >
                  <div style={{ display: "flex", gap: 6 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#ff5f57",
                      }}
                    />
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#febc2e",
                      }}
                    />
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#28c840",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      flex: 1,
                      maxWidth: 380,
                      background: "#fff",
                      borderRadius: 6,
                      height: 22,
                      marginLeft: 10,
                      display: "flex",
                      alignItems: "center",
                      padding: "0 10px",
                      fontSize: 11,
                      color: MUTED,
                      border: `1px solid ${HAIR}`,
                      fontFamily: FONT_BODY,
                    }}
                  >
                    {activePage}
                  </div>
                </div>
                <iframe
                  key={frameKey}
                  title="Edited preview"
                  srcDoc={previewHtml}
                  sandbox="allow-scripts allow-forms"
                  style={{
                    flex: 1,
                    border: 0,
                    background: "white",
                    minHeight: 600,
                  }}
                />
              </div>
            ) : (
              /* ── Cleaner mobile mockup ───────────────────────────────── */
              <div
                style={{
                  background: "#0f1115",
                  borderRadius: 44,
                  padding: 8,
                  boxShadow:
                    "0 30px 80px rgba(15,17,21,0.25), 0 8px 24px rgba(15,17,21,0.10), inset 0 0 0 1px rgba(255,255,255,0.06)",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                {/* Dynamic island */}
                <div
                  style={{
                    position: "absolute",
                    top: 18,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 96,
                    height: 28,
                    background: "#0f1115",
                    borderRadius: 20,
                    zIndex: 2,
                  }}
                />
                {/* Screen */}
                <div
                  style={{
                    width: 360,
                    height: 740,
                    borderRadius: 36,
                    overflow: "hidden",
                    background: "#fff",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <iframe
                    key={frameKey}
                    title="Edited preview (mobile)"
                    srcDoc={previewHtml}
                    sandbox="allow-scripts allow-forms"
                    style={{
                      width: "100%",
                      height: "100%",
                      border: 0,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
