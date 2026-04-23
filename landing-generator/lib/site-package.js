const SLOT_KEY_PATTERN = /^[a-z0-9]+(?:\.[a-z0-9]+)+$/;

function extractJsonCandidate(raw) {
  const text = String(raw ?? "").trim();
  if (!text) throw new Error("empty model response");

  const fence = text.match(/```(?:json)?\s*\n([\s\S]*?)```/i);
  if (fence?.[1]) return fence[1].trim();

  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) {
    throw new Error("model response does not contain a JSON object");
  }
  return text.slice(first, last + 1).trim();
}

function isPlainObject(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function findAllMatches(text, regex) {
  return [...String(text).matchAll(regex)];
}

function validatePageHtml(fileName, html) {
  const trimmed = html.trim();
  const lower = trimmed.toLowerCase();
  if (!lower.startsWith("<!doctype html")) {
    throw new Error(`pages.${fileName} must start with <!doctype html>`);
  }
  if (!lower.endsWith("</html>")) {
    throw new Error(`pages.${fileName} must end with </html>`);
  }
  if (/(href\s*=\s*["']#)|(window\.location\.hash)|(router\.push\s*\()/.test(html)) {
    throw new Error(`pages.${fileName} contains forbidden hash or SPA navigation`);
  }
  if (/href\s*=\s*["']\/home["']/i.test(html)) {
    throw new Error(`pages.${fileName} contains forbidden /home link`);
  }
}

export function parseAndValidateSitePackage(raw) {
  const jsonText = extractJsonCandidate(raw);

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    throw new Error(`invalid JSON from model: ${err.message}`);
  }

  if (!isPlainObject(parsed)) {
    throw new Error("top-level response must be a JSON object");
  }

  const topLevelKeys = Object.keys(parsed).sort();
  const expectedKeys = ["assets", "pages", "slots"];
  if (
    topLevelKeys.length !== expectedKeys.length ||
    !expectedKeys.every((key) => topLevelKeys.includes(key))
  ) {
    throw new Error('top-level keys must be exactly: "pages", "assets", "slots"');
  }

  const { pages, assets, slots } = parsed;
  if (!isPlainObject(pages) || Object.keys(pages).length === 0) {
    throw new Error('"pages" must be a non-empty object');
  }
  if (!isPlainObject(assets)) {
    throw new Error('"assets" must be an object');
  }
  if (!isPlainObject(slots)) {
    throw new Error('"slots" must be an object');
  }

  const slotKeysInPages = new Set();
  const assetKeysInPages = new Set();

  for (const [fileName, html] of Object.entries(pages)) {
    if (!/^[a-z0-9-]+\.html$/.test(fileName)) {
      throw new Error(`invalid page filename "${fileName}" (must end with .html)`);
    }
    if (typeof html !== "string" || !html.trim()) {
      throw new Error(`pages.${fileName} must be a non-empty HTML string`);
    }

    validatePageHtml(fileName, html);

    const slotMatches = findAllMatches(
      html,
      /data-slot\s*=\s*["']([a-z0-9]+(?:\.[a-z0-9]+)+)["']/g,
    );
    for (const slotMatch of slotMatches) {
      slotKeysInPages.add(slotMatch[1]);
    }

    const imgSrcMatches = findAllMatches(
      html,
      /<img[^>]*\ssrc\s*=\s*["']([^"']+)["'][^>]*>/gi,
    );
    for (const imgMatch of imgSrcMatches) {
      const src = imgMatch[1].trim();
      if (/^https?:\/\//i.test(src)) {
        throw new Error(`pages.${fileName} contains external image URL "${src}"`);
      }
      if (!src.startsWith("/assets/")) {
        throw new Error(
          `pages.${fileName} image src "${src}" must start with /assets/`,
        );
      }
      const assetName = src.slice("/assets/".length).trim();
      if (!assetName) {
        throw new Error(`pages.${fileName} contains invalid /assets image path`);
      }
      assetKeysInPages.add(assetName);
    }
  }

  if (slotKeysInPages.size === 0) {
    throw new Error("at least one data-slot must be present in pages HTML");
  }

  for (const [slotKey, defaultText] of Object.entries(slots)) {
    if (!SLOT_KEY_PATTERN.test(slotKey)) {
      throw new Error(
        `invalid slot key "${slotKey}" (must match section.element format)`,
      );
    }
    if (typeof defaultText !== "string") {
      throw new Error(`slots.${slotKey} must be a string`);
    }
  }

  for (const slotKey of slotKeysInPages) {
    if (!(slotKey in slots)) {
      throw new Error(`missing slots entry for data-slot "${slotKey}"`);
    }
  }
  for (const slotKey of Object.keys(slots)) {
    if (!slotKeysInPages.has(slotKey)) {
      throw new Error(`slots.${slotKey} is unused in pages HTML`);
    }
  }

  for (const [assetName, assetValue] of Object.entries(assets)) {
    if (typeof assetValue !== "string" || !assetValue.trim()) {
      throw new Error(`assets.${assetName} must be a non-empty string`);
    }
  }
  for (const assetName of assetKeysInPages) {
    if (!(assetName in assets)) {
      throw new Error(`missing assets entry for image "${assetName}"`);
    }
  }

  return parsed;
}
