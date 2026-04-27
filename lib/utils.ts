export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// For backwards compatibility - convert Tag array to tag names
export interface Heading { id: string; text: string; level: number }

export function extractHeadings(html: string): Heading[] {
  const out: Heading[] = [];
  const re = /<h([23])[^>]*>([\s\S]*?)<\/h[23]>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const text = m[2].replace(/<[^>]+>/g, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    if (id) out.push({ id, text, level: parseInt(m[1]) });
  }
  return out;
}

export function addHeadingIds(html: string): string {
  return html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h[23]>/gi, (_m, lvl, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    return `<h${lvl}${attrs} id="${id}">${inner}</h${lvl}>`;
  });
}

export function parseTags(
  tags: string | null | Array<{ name: string; slug: string }>
): string[] {
  if (!tags) return [];
  
  // If tags is a string (old format)
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  // If tags is an array of Tag objects (new format)
  if (Array.isArray(tags)) {
    return tags.map((t) => t.name);
  }

  return [];
}
