export type SocialLinkKey = "youtube" | "instagram" | "linkedin" | "tiktok" | "x" | "facebook";

export type SocialLinks = Partial<Record<SocialLinkKey, string>>;

export const SOCIAL_LINKS: Array<{
  key: SocialLinkKey;
  label: string;
  icon: SocialLinkKey;
}> = [
  { key: "youtube", label: "YouTube", icon: "youtube" },
  { key: "instagram", label: "Instagram", icon: "instagram" },
  { key: "linkedin", label: "LinkedIn", icon: "linkedin" },
  { key: "tiktok", label: "TikTok", icon: "tiktok" },
  { key: "x", label: "X", icon: "x" },
  { key: "facebook", label: "Facebook", icon: "facebook" },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseSocialLinks(value: string | null | undefined): SocialLinks {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value);

    if (!isRecord(parsed)) return {};

    return {
      youtube: typeof parsed.youtube === "string" ? parsed.youtube : undefined,
      instagram: typeof parsed.instagram === "string" ? parsed.instagram : undefined,
      linkedin: typeof parsed.linkedin === "string" ? parsed.linkedin : undefined,
      tiktok: typeof parsed.tiktok === "string" ? parsed.tiktok : undefined,
      x: typeof parsed.x === "string" ? parsed.x : typeof parsed.twitter === "string" ? parsed.twitter : undefined,
      facebook: typeof parsed.facebook === "string" ? parsed.facebook : typeof parsed.github === "string" ? parsed.github : undefined,
    };
  } catch {
    return {};
  }
}

export function stringifySocialLinks(value: SocialLinks | null | undefined): string | null {
  if (!value) return null;

  const cleaned = Object.fromEntries(
    Object.entries(value).filter(([, link]) => typeof link === "string" && link.trim().length > 0)
  );

  return Object.keys(cleaned).length > 0 ? JSON.stringify(cleaned) : null;
}