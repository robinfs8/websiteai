import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import {
  ArrowLeft,
  Download,
  Upload,
  Loader2,
  Check,
  RefreshCw,
  Trash2,
  Monitor,
  Smartphone,
  Rocket,
  ExternalLink,
  X,
  Pencil,
  Sparkles,
  Send,
  Type,
  Image as ImageIcon,
} from "lucide-react";
import JSZip from "jszip";

const API_URL = "https://websiteai-backend-production.up.railway.app";

const STORAGE_KEY = "websiteai:sitePackage";
const EDIT_STATE_KEY = "websiteai:editorState";
const IMAGE_SLOT_PATTERN =
  /(image|photo|picture|gallery|hero|logo|avatar|banner|cover|thumb|illustration)/i;

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

function slotFieldLabel(key) {
  const suffix = key.split(".").slice(1).join(" ").replace(/_/g, " ");
  return suffix.charAt(0).toUpperCase() + suffix.slice(1);
}

function isPlainObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

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

function renderPage(html, slots, assets, mode, mobileViewport = false) {
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

  // Override viewport for mobile preview so responsive breakpoints and
  // viewport-relative units (vw, clamp) behave as if on a real 360px phone.
  // Without this, device-width inside an iframe resolves to the host screen
  // width, so Tailwind's md: breakpoints never fire.
  if (mode === "preview" && mobileViewport && doc.head) {
    let meta = doc.head.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = doc.createElement("meta");
      meta.setAttribute("name", "viewport");
      doc.head.prepend(meta);
    }
    meta.setAttribute("content", "width=390, initial-scale=1");
  }

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

function SectionLabel({ name, isFirst }) {
  return (
    <div style={{ marginTop: isFirst ? 0 : 20, marginBottom: 8 }}>
      <span
        style={{
          fontSize: 10,
          fontFamily: FONT_BODY,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: MUTED,
        }}
      >
        {formatSectionName(name)}
      </span>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontFamily: FONT_BODY,
        fontWeight: 500,
        color: "#8b929e",
        marginBottom: 4,
        paddingLeft: 1,
      }}
    >
      {children}
    </div>
  );
}

function AutoGrowTextarea({ value, onChange }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "0px";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);
  return (
    <textarea
      ref={ref}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      rows={1}
      style={{
        width: "100%",
        background: SOFT,
        border: `1.5px solid transparent`,
        borderRadius: 8,
        padding: "8px 10px",
        fontSize: 13,
        color: INK,
        fontFamily: FONT_BODY,
        outline: "none",
        boxSizing: "border-box",
        resize: "none",
        overflow: "hidden",
        lineHeight: 1.55,
        transition: "border-color 0.15s, background 0.15s",
      }}
      onFocus={(e) => {
        e.target.style.borderColor = ACCENT;
        e.target.style.background = "#fff";
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "transparent";
        e.target.style.background = SOFT;
      }}
    />
  );
}

function ImageSlotCard({ slot, asset, onUpload, onClear }) {
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    onUpload({ file, dataUrl });
  };

  return (
    <div style={{ marginBottom: 4 }}>
      {asset?.dataUrl ? (
        <div
          style={{
            position: "relative",
            borderRadius: 8,
            overflow: "hidden",
            aspectRatio: "16/9",
            background: SOFT,
          }}
        >
          <img
            src={asset.dataUrl}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 6,
              right: 6,
              display: "flex",
              gap: 4,
            }}
          >
            <button
              onClick={() => inputRef.current?.click()}
              style={{
                padding: "4px 9px",
                fontSize: 11,
                fontFamily: FONT_BODY,
                fontWeight: 600,
                color: "#fff",
                background: "rgba(15,17,21,0.65)",
                backdropFilter: "blur(8px)",
                border: "none",
                borderRadius: 5,
                cursor: "pointer",
              }}
            >
              Replace
            </button>
            <button
              onClick={onClear}
              style={{
                padding: "4px 7px",
                fontSize: 11,
                fontFamily: FONT_BODY,
                color: "#fff",
                background: "rgba(15,17,21,0.65)",
                backdropFilter: "blur(8px)",
                border: "none",
                borderRadius: 5,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              title="Remove image"
            >
              <Trash2 size={10} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          style={{
            width: "100%",
            padding: "14px 0",
            background: SOFT,
            border: `1.5px dashed ${HAIR}`,
            borderRadius: 8,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            color: "#a3a9b3",
            transition: "border-color 0.15s, color 0.15s",
            fontFamily: FONT_BODY,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = ACCENT;
            e.currentTarget.style.color = ACCENT;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = HAIR;
            e.currentTarget.style.color = "#a3a9b3";
          }}
        >
          <Upload size={13} />
          <span style={{ fontSize: 11, fontWeight: 500 }}>Upload image</span>
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

// ─── Sidebar toggle button ────────────────────────────────────────────────────

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        padding: "6px 0",
        borderRadius: 7,
        border: "none",
        cursor: "pointer",
        background: active ? "#fff" : "transparent",
        color: active ? INK : MUTED,
        fontSize: 12,
        fontFamily: FONT_BODY,
        fontWeight: 500,
        boxShadow: active ? "0 1px 3px rgba(15,17,21,0.08)" : "none",
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Editor() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authUser, setAuthUser] = useState(undefined);
  const [pkg, setPkg] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [slots, setSlots] = useState({});
  const [assets, setAssets] = useState({});
  const [activePage, setActivePage] = useState("");
  const [previewMode, setPreviewMode] = useState("desktop");
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState(null);
  const [deployError, setDeployError] = useState("");
  const [persistedUrl, setPersistedUrl] = useState(null);
  const [frameKey, setFrameKey] = useState(0);
  const [importError, setImportError] = useState("");

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState("text");

  // AI Edit
  const [aiEditOpen, setAiEditOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setAuthUser(u ?? null);
      if (u === null)
        navigate("/waitlist", { replace: true, state: { from: "/editor" } });
    });
    return unsub;
  }, [navigate]);

  useEffect(() => {
    if (!authUser) return;
    authUser.getIdToken().then((idToken) =>
      fetch(`${API_URL}/site-info`, {
        headers: { Authorization: `Bearer ${idToken}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data?.netlify?.url) setPersistedUrl(data.netlify.url);
        })
        .catch(() => {})
    );
  }, [authUser]);

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

  // Persist AI-edited pages (pkg.pages changes from submitAiEdit).
  // Slots are already persisted above via EDIT_STATE_KEY; this covers the
  // HTML structure which lives in pkg and would otherwise be lost on refresh.
  useEffect(() => {
    if (!pkg) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pkg));
    } catch {
      /* ignore quota — slots are still saved separately */
    }
  }, [pkg]);

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
    return renderPage(html, slots, assets, "preview", previewMode === "mobile");
  }, [pkg, activePage, slots, assets, previewMode]);

  const buildZipBlob = async () => {
    const zip = new JSZip();
    Object.entries(pkg.pages).forEach(([name, html]) => {
      zip.file(name, renderPage(html, slots, assets, "export"));
    });
    const assetsFolder = zip.folder("assets");
    Object.entries(assets).forEach(([name, asset]) => {
      if (!asset?.dataUrl) return;
      assetsFolder.file(name, dataUrlToBytes(asset.dataUrl), { binary: true });
    });
    return zip.generateAsync({ type: "blob" });
  };

  const downloadZip = async () => {
    if (!pkg) return;
    setDownloading(true);
    setDownloaded(false);
    try {
      const blob = await buildZipBlob();
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

  const deployToNetlify = async () => {
    if (!pkg || deploying) return;
    setDeploying(true);
    setDeployError("");
    setDeployResult(null);
    try {
      const idToken = await authUser.getIdToken();
      const blob = await buildZipBlob();
      const res = await fetch(`${API_URL}/deploy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/zip",
          Authorization: `Bearer ${idToken}`,
        },
        body: blob,
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(json?.error || `Deploy failed (${res.status})`);
      }
      if (!json?.url) throw new Error("Deploy succeeded but no URL returned");
      setDeployResult(json);
      setPersistedUrl(json.url);
    } catch (err) {
      console.error("Deploy failed", err);
      setDeployError(err.message || "Deploy failed");
    } finally {
      setDeploying(false);
    }
  };

  const submitAiEdit = async () => {
    if (!aiPrompt.trim() || aiLoading || !authUser) return;
    setAiLoading(true);
    setAiError("");
    try {
      const idToken = await authUser.getIdToken();
      const res = await fetch(`${API_URL}/ai-edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          prompt: aiPrompt.trim(),
          slots,
          pages: pkg.pages,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "AI edit failed");
      if (json.slots && typeof json.slots === "object") {
        setSlots((prev) => ({ ...prev, ...json.slots }));
      }
      if (json.pages && typeof json.pages === "object") {
        setPkg((prev) => ({ ...prev, pages: json.pages }));
      }
      setFrameKey((k) => k + 1);
      setAiEditOpen(false);
      setAiPrompt("");
    } catch (err) {
      setAiError(err.message || "AI edit failed");
    } finally {
      setAiLoading(false);
    }
  };

  if (authUser === undefined) return null;

  // ─── Empty state ──────────────────────────────────────────────────────────────
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

  // ─── Main editor ──────────────────────────────────────────────────────────────
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
      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <header
        style={{
          flexShrink: 0,
          height: 54,
          background: "#fff",
          borderBottom: `1px solid ${HAIR}`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 12,
          zIndex: 10,
        }}
      >
        {/* Left: back + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => navigate("/generate")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 13,
              color: MUTED,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: FONT_BODY,
              fontWeight: 500,
              padding: "6px 8px",
              marginLeft: -8,
              borderRadius: 7,
              transition: "color 0.15s, background 0.15s",
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

          <div
            style={{ width: 1, height: 16, background: HAIR, flexShrink: 0 }}
          />

          <span
            style={{
              fontSize: 14,
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              color: INK,
              letterSpacing: "-0.02em",
            }}
          >
            Editor
          </span>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Right: url + actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Deployed URL */}
          {persistedUrl && (
            <a
              href={persistedUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 12,
                color: MUTED,
                textDecoration: "none",
                fontFamily: FONT_BODY,
                fontWeight: 400,
                background: SOFT,
                border: `1px solid ${HAIR}`,
                padding: "5px 10px",
                borderRadius: 7,
                maxWidth: 220,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                transition: "color 0.15s, border-color 0.15s",
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
              <ExternalLink size={10} />
              {persistedUrl.replace(/^https?:\/\//, "")}
            </a>
          )}

          {/* Publish Updates */}
          <button
            onClick={deployToNetlify}
            disabled={deploying}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              background: "#fff",
              color: deploying ? MUTED : INK,
              border: `1px solid ${HAIR}`,
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: FONT_BODY,
              cursor: deploying ? "not-allowed" : "pointer",
              opacity: deploying ? 0.6 : 1,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (deploying) return;
              e.currentTarget.style.borderColor = ACCENT;
              e.currentTarget.style.color = ACCENT;
            }}
            onMouseLeave={(e) => {
              if (deploying) return;
              e.currentTarget.style.borderColor = HAIR;
              e.currentTarget.style.color = INK;
            }}
          >
            {deploying ? (
              <Loader2
                size={13}
                style={{ animation: "spin 1s linear infinite" }}
              />
            ) : (
              <Rocket size={13} />
            )}
            {deploying ? "Publishing…" : "Publish"}
          </button>

          {/* Download */}
          <button
            onClick={downloadZip}
            disabled={downloading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              background: downloading || downloaded ? SOFT : ACCENT,
              color: downloading || downloaded ? MUTED : "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: FONT_BODY,
              cursor: downloading ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              boxShadow:
                downloading || downloaded
                  ? "none"
                  : "0 4px 14px rgba(73,79,223,0.3)",
            }}
          >
            {downloading ? (
              <Loader2
                size={13}
                style={{ animation: "spin 1s linear infinite" }}
              />
            ) : downloaded ? (
              <Check size={13} />
            ) : (
              <Download size={13} />
            )}
            {downloading ? "Packing…" : downloaded ? "Done" : "Download"}
          </button>

          {/* Edit toggle */}
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              background: sidebarOpen ? INK : SOFT,
              color: sidebarOpen ? "#fff" : INK,
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: FONT_BODY,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <Pencil size={13} />
            Edit
          </button>
        </div>
      </header>

      {/* ── Content: preview + sidebar ──────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Preview area */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: SOFT,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              flex: 1,
              overflow: "auto",
              display: "flex",
              alignItems: "stretch",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            {previewMode === "desktop" ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow:
                    "0 20px 60px rgba(15,17,21,0.08), 0 2px 8px rgba(15,17,21,0.04)",
                  border: `1px solid ${HAIR}`,
                  background: "#fff",
                  minHeight: 0,
                }}
              >
                {/* Browser chrome */}
                <div
                  style={{
                    background: SOFT,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 12px",
                    gap: 8,
                    flexShrink: 0,
                    borderBottom: `1px solid ${HAIR}`,
                  }}
                >
                  <div style={{ display: "flex", gap: 5 }}>
                    {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                      <div
                        key={c}
                        style={{
                          width: 9,
                          height: 9,
                          borderRadius: "50%",
                          background: c,
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      maxWidth: 340,
                      background: "#fff",
                      borderRadius: 5,
                      height: 20,
                      marginLeft: 8,
                      display: "flex",
                      alignItems: "center",
                      padding: "0 8px",
                      fontSize: 10,
                      color: MUTED,
                      border: `1px solid ${HAIR}`,
                      fontFamily: FONT_BODY,
                    }}
                  >
                    {persistedUrl
                      ? persistedUrl.replace(/^https?:\/\//, "")
                      : activePage}
                  </div>
                  <button
                    onClick={() => setFrameKey((k) => k + 1)}
                    title="Refresh"
                    style={{
                      marginLeft: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 24,
                      height: 24,
                      borderRadius: 5,
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: MUTED,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = ACCENT)
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
                  >
                    <RefreshCw size={11} />
                  </button>
                </div>
                <iframe
                  key={frameKey}
                  title="Preview"
                  srcDoc={previewHtml}
                  sandbox="allow-scripts allow-forms"
                  style={{ flex: 1, border: 0, background: "white", minHeight: 600 }}
                />
              </div>
            ) : (
              // True mobile preview: iframe rendered at 390 px (iPhone width).
              // The viewport meta is set to width=390 so Tailwind breakpoints,
              // clamp() typography, and all responsive CSS fire correctly.
              // Displayed full-height so content is readable — no tiny phone shell.
              <div
                style={{
                  flexShrink: 0,
                  width: 390,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow:
                    "0 20px 60px rgba(15,17,21,0.10), 0 2px 8px rgba(15,17,21,0.06)",
                  border: `1px solid ${HAIR}`,
                  background: "#fff",
                }}
              >
                {/* Minimal device indicator */}
                <div
                  style={{
                    background: SOFT,
                    borderBottom: `1px solid ${HAIR}`,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 4,
                      borderRadius: 2,
                      background: "#d0d4db",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: FONT_BODY,
                      color: MUTED,
                      fontWeight: 500,
                      letterSpacing: "0.04em",
                    }}
                  >
                    390 px
                  </span>
                </div>
                <iframe
                  key={`${frameKey}-mobile`}
                  title="Preview mobile"
                  srcDoc={previewHtml}
                  sandbox="allow-scripts allow-forms"
                  style={{ flex: 1, border: 0, minHeight: 700 }}
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Right sidebar overlay ──────────────────────────────────────── */}
        {sidebarOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 340,
              background: "#fff",
              borderLeft: `1px solid ${HAIR}`,
              boxShadow: "-12px 0 40px rgba(15,17,21,0.08)",
              display: "flex",
              flexDirection: "column",
              zIndex: 20,
            }}
          >
            {/* Sidebar header */}
            <div
              style={{
                flexShrink: 0,
                padding: "14px 16px 12px",
                borderBottom: `1px solid ${HAIR}`,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {/* Title row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: INK,
                    fontFamily: FONT_BODY,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Edit Content
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 26,
                    height: 26,
                    borderRadius: 6,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: MUTED,
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = SOFT;
                    e.currentTarget.style.color = INK;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = MUTED;
                  }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Device toggle */}
              <div
                style={{
                  display: "flex",
                  gap: 2,
                  background: SOFT,
                  border: `1px solid ${HAIR}`,
                  borderRadius: 9,
                  padding: 3,
                }}
              >
                <TabBtn
                  active={previewMode === "desktop"}
                  onClick={() => setPreviewMode("desktop")}
                >
                  <Monitor size={11} />
                  Desktop
                </TabBtn>
                <TabBtn
                  active={previewMode === "mobile"}
                  onClick={() => setPreviewMode("mobile")}
                >
                  <Smartphone size={11} />
                  Mobile
                </TabBtn>
              </div>

              {/* Text / Images tab */}
              <div
                style={{
                  display: "flex",
                  gap: 2,
                  background: SOFT,
                  border: `1px solid ${HAIR}`,
                  borderRadius: 9,
                  padding: 3,
                }}
              >
                <TabBtn
                  active={sidebarTab === "text"}
                  onClick={() => setSidebarTab("text")}
                >
                  <Type size={11} />
                  Text
                </TabBtn>
                <TabBtn
                  active={sidebarTab === "images"}
                  onClick={() => setSidebarTab("images")}
                >
                  <ImageIcon size={11} />
                  Images
                </TabBtn>
              </div>
            </div>

            {/* Sidebar scrollable content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 24px" }}>
              {sidebarTab === "text" ? (
                <>
                  {groupedSections.map((section, idx) =>
                    section.textItems.length > 0 ? (
                      <div key={section.name}>
                        <SectionLabel name={section.name} isFirst={idx === 0} />
                        {section.textItems.map((slot) => (
                          <div key={slot.key} style={{ marginBottom: 10 }}>
                            <FieldLabel>{slotFieldLabel(slot.key)}</FieldLabel>
                            <AutoGrowTextarea
                              value={slots[slot.key] ?? slot.defaultText}
                              onChange={handleSlotChange(slot.key)}
                            />
                          </div>
                        ))}
                      </div>
                    ) : null
                  )}
                  {groupedSections.every((s) => s.textItems.length === 0) && (
                    <p
                      style={{
                        fontSize: 13,
                        color: MUTED,
                        textAlign: "center",
                        marginTop: 32,
                        lineHeight: 1.6,
                      }}
                    >
                      No editable text found.
                    </p>
                  )}
                </>
              ) : (
                <>
                  {groupedSections.map((section, idx) =>
                    section.imageItems.length > 0 ? (
                      <div key={section.name}>
                        <SectionLabel name={section.name} isFirst={idx === 0} />
                        {section.imageItems.map(({ slot, assetName, asset }) => (
                          <div key={slot.key} style={{ marginBottom: 10 }}>
                            <FieldLabel>{slotFieldLabel(slot.key)}</FieldLabel>
                            <ImageSlotCard
                              slot={slot}
                              asset={asset}
                              onUpload={handleImageUpload(slot, assetName)}
                              onClear={handleImageClear(assetName)}
                            />
                          </div>
                        ))}
                      </div>
                    ) : null
                  )}
                  {groupedSections.every((s) => s.imageItems.length === 0) && (
                    <p
                      style={{
                        fontSize: 13,
                        color: MUTED,
                        textAlign: "center",
                        marginTop: 32,
                        lineHeight: 1.6,
                      }}
                    >
                      No image slots found.
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Sidebar footer: AI edit */}
            <div
              style={{
                flexShrink: 0,
                padding: "12px 16px",
                borderTop: `1px solid ${HAIR}`,
              }}
            >
              <button
                onClick={() => setAiEditOpen(true)}
                style={{
                  width: "100%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  padding: "10px 0",
                  background: `linear-gradient(135deg, #6366f1, ${ACCENT})`,
                  color: "#fff",
                  border: "none",
                  borderRadius: 9,
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: FONT_BODY,
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(73,79,223,0.3)",
                  transition: "opacity 0.15s, transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Sparkles size={14} />
                Edit with AI
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── AI Edit fullscreen overlay ──────────────────────────────────────── */}
      {aiEditOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(24px) saturate(0.7)",
            background: "rgba(15,17,21,0.6)",
            padding: "24px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !aiLoading) {
              setAiEditOpen(false);
              setAiError("");
            }
          }}
        >
          <div
            style={{
              width: "min(660px, 100%)",
              background: "#fff",
              borderRadius: 20,
              padding: "32px",
              boxShadow:
                "0 40px 120px rgba(0,0,0,0.25), 0 8px 32px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Header */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    background: `linear-gradient(135deg, #6366f1, ${ACCENT})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Sparkles size={15} color="#fff" />
                </div>
                <h2
                  style={{
                    fontSize: 20,
                    fontFamily: FONT_DISPLAY,
                    fontWeight: 700,
                    color: INK,
                    letterSpacing: "-0.025em",
                    margin: 0,
                  }}
                >
                  Edit with AI
                </h2>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: MUTED,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Describe the changes you'd like to make. The AI will update
                your website content accordingly.
              </p>
            </div>

            {/* Textarea */}
            <div style={{ position: "relative" }}>
              <textarea
                autoFocus
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submitAiEdit();
                  }
                }}
                placeholder={`e.g. "Change the hero title to 'Transform your business', make the CTA button say 'Start free trial'"`}
                rows={5}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: SOFT,
                  border: `1.5px solid ${HAIR}`,
                  borderRadius: 12,
                  padding: "14px 50px 14px 14px",
                  fontSize: 14,
                  color: INK,
                  fontFamily: FONT_BODY,
                  outline: "none",
                  resize: "none",
                  lineHeight: 1.6,
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = ACCENT;
                  e.target.style.background = "#fff";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = HAIR;
                  e.target.style.background = SOFT;
                }}
              />
              {/* Send button inside textarea */}
              <button
                onClick={submitAiEdit}
                disabled={!aiPrompt.trim() || aiLoading}
                title="Send (Enter)"
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "none",
                  background:
                    !aiPrompt.trim() || aiLoading
                      ? HAIR
                      : `linear-gradient(135deg, #6366f1, ${ACCENT})`,
                  color:
                    !aiPrompt.trim() || aiLoading ? MUTED : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor:
                    !aiPrompt.trim() || aiLoading
                      ? "not-allowed"
                      : "pointer",
                  transition: "all 0.15s",
                  boxShadow:
                    !aiPrompt.trim() || aiLoading
                      ? "none"
                      : "0 4px 12px rgba(73,79,223,0.35)",
                }}
              >
                {aiLoading ? (
                  <Loader2
                    size={14}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                ) : (
                  <Send size={13} />
                )}
              </button>
            </div>

            {/* Hint */}
            <p
              style={{
                fontSize: 12,
                color: "#a3a9b3",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Press{" "}
              <kbd
                style={{
                  background: SOFT,
                  border: `1px solid ${HAIR}`,
                  borderRadius: 4,
                  padding: "1px 5px",
                  fontSize: 11,
                  fontFamily: FONT_BODY,
                }}
              >
                Enter
              </kbd>{" "}
              to send,{" "}
              <kbd
                style={{
                  background: SOFT,
                  border: `1px solid ${HAIR}`,
                  borderRadius: 4,
                  padding: "1px 5px",
                  fontSize: 11,
                  fontFamily: FONT_BODY,
                }}
              >
                Shift+Enter
              </kbd>{" "}
              for new line.
            </p>

            {/* Error */}
            {aiError && (
              <div
                style={{
                  fontSize: 13,
                  color: "#b91c1c",
                  background: "rgba(254,226,226,0.6)",
                  border: "1px solid rgba(220,38,38,0.2)",
                  borderRadius: 9,
                  padding: "10px 14px",
                }}
              >
                {aiError}
              </div>
            )}

            {/* Cancel */}
            <button
              onClick={() => {
                if (aiLoading) return;
                setAiEditOpen(false);
                setAiError("");
              }}
              disabled={aiLoading}
              style={{
                alignSelf: "flex-start",
                background: "none",
                border: "none",
                fontSize: 13,
                color: MUTED,
                cursor: aiLoading ? "not-allowed" : "pointer",
                fontFamily: FONT_BODY,
                padding: "4px 0",
                textDecoration: "underline",
                textDecorationColor: "transparent",
                transition: "color 0.15s, text-decoration-color 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = INK;
                e.currentTarget.style.textDecorationColor = INK;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = MUTED;
                e.currentTarget.style.textDecorationColor = "transparent";
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Deploy result toast ────────────────────────────────────────────── */}
      {(deployResult || deployError) && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            maxWidth: 360,
            background: "#fff",
            border: `1px solid ${HAIR}`,
            borderRadius: 14,
            boxShadow: "0 24px 60px rgba(15,17,21,0.14)",
            padding: "16px 18px",
            zIndex: 50,
            fontFamily: FONT_BODY,
          }}
        >
          <button
            onClick={() => {
              setDeployResult(null);
              setDeployError("");
            }}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: MUTED,
              padding: 4,
              display: "inline-flex",
            }}
          >
            <X size={13} />
          </button>
          {deployResult ? (
            <>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: INK,
                  marginBottom: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Check size={13} color={ACCENT} />
                Published to Netlify
              </div>
              <a
                href={deployResult.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12,
                  color: ACCENT,
                  textDecoration: "none",
                  wordBreak: "break-all",
                }}
              >
                {deployResult.url}
                <ExternalLink size={11} />
              </a>
            </>
          ) : (
            <>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#b91c1c",
                  marginBottom: 4,
                }}
              >
                Publish failed
              </div>
              <div style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>
                {deployError}
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
