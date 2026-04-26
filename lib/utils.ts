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
