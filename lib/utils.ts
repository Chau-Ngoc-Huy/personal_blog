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

// Rough reading-time estimate from HTML content (~200 words/min). Vietnamese
// is whitespace-tokenizable enough for a "N phút" label.
export function readingTime(html: string | null | undefined): string {
  if (!html) return "1 phút";
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text ? text.split(" ").length : 0;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} phút`;
}

// For backwards compatibility - convert Tag array to tag names
export interface Heading { id: string; text: string; level: number }

export function extractHeadings(html: string): Heading[] {
  const out: Heading[] = [];
  const re = /<h([123])[^>]*>([\s\S]*?)<\/h[123]>/gi;
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
  return html.replace(/<h([123])([^>]*)>([\s\S]*?)<\/h[123]>/gi, (_m, lvl, attrs, inner) => {
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

/**
 * Tailwind classes giving a table-of-contents item its visual hierarchy by
 * heading level (size / weight / colour). H1 is the largest + boldest, deeper
 * levels get smaller and lighter so the outline reads as a real tree.
 * Shared by the public <TableOfContents> and the admin <EditorToc>.
 */
export function tocItemClasses(level: number, active: boolean): string {
  const size = level === 1 ? "text-[14px]" : level === 2 ? "text-[13.5px]" : "text-[13px]";
  const weight = active ? "font-semibold" : level === 1 ? "font-medium" : "font-normal";
  const color = active
    ? "bg-[var(--ac)] text-white"
    : level >= 3
      ? "text-[#8C9496] hover:text-[#14181A]"
      : "text-[#586063] hover:text-[#14181A]";
  return `${size} ${weight} ${color}`;
}
