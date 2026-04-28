import Link from "next/link";
import SocialLinkIcon from "./SocialLinkIcon";

interface Profile {
  displayName: string;
  email: string | null;
  socialLinks: string | null;
}

interface SocialLinks {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  x?: string;
  twitter?: string;
}

export default function SiteFooter({ profile }: { profile: Profile }) {
  let socials: SocialLinks = {};
  try {
    if (profile.socialLinks) socials = JSON.parse(profile.socialLinks);
  } catch {}

  const hasConnect = Boolean(
    socials.instagram ||
      socials.facebook ||
      socials.linkedin ||
      socials.youtube ||
      socials.tiktok ||
      socials.x ||
      socials.twitter ||
      profile.email
  );
  const year = new Date().getFullYear();

  const socialItems: Array<{ key: keyof SocialLinks; label: string; icon: "youtube" | "instagram" | "linkedin" | "tiktok" | "x" | "facebook" }> = [
    { key: "youtube", label: "YouTube", icon: "youtube" },
    { key: "instagram", label: "Instagram", icon: "instagram" },
    { key: "linkedin", label: "LinkedIn", icon: "linkedin" },
    { key: "tiktok", label: "TikTok", icon: "tiktok" },
    { key: "x", label: "X", icon: "x" },
    { key: "twitter", label: "X", icon: "x" },
    { key: "facebook", label: "Facebook", icon: "facebook" },
  ];

  return (
    <footer className="bg-[#F9F6F3]" style={{ marginTop: "clamp(0.75rem,2vw,1.5rem)" }}>
      {/* ── Divider ── */}
      <div
        className="max-w-[1400px] mx-auto"
        style={{ paddingLeft: "var(--page-px)", paddingRight: "var(--page-px)" }}
      >
        <hr style={{ border: "none", borderTop: "1px solid #F3EDE9", margin: 0 }} />
      </div>

      {/* ── Main content ── */}
      <div
        className="max-w-[1400px] mx-auto"
        style={{
          paddingLeft: "var(--page-px)",
          paddingRight: "var(--page-px)",
          paddingTop: "clamp(1.5rem,6.5vw,4rem)",
          paddingBottom: "clamp(1.5rem,6.5vw,4rem)",
        }}
      >
        <div className="flex flex-col md:flex-row justify-between" style={{ gap: "clamp(2rem,5vw,5rem)" }}>

          {/* Brand */}
          <div style={{ maxWidth: 320 }}>
            <p
              className="font-heading text-[#1B1624] mb-1"
              style={{ fontSize: "clamp(1.125rem,1.125rem + ((1vw - 0.2rem) * 0.455),1.375rem)", fontWeight: 400, letterSpacing: "-0.03em" }}
            >
              {profile.displayName}
            </p>
            <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#8D8A91] font-medium mb-4">
              Personal Blog
            </p>
            <p
              className="font-sans text-[#76737C]"
              style={{ fontSize: "clamp(0.875rem,0.875rem + ((1vw - 0.2rem) * 0.227),1rem)", lineHeight: 1.6, fontWeight: 500 }}
            >
              Thanks for reading. Writing is how I think out loud.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col" style={{ gap: "0.75rem" }}>
            <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#8D8A91] font-semibold mb-1">
              Navigation
            </p>
            <FooterLink href="#blogs" label="Blogs" />
            <FooterLink href="#about" label="About Me" />
          </div>

          {/* Connect */}
          {hasConnect && (
            <div className="flex flex-col" style={{ gap: "0.75rem" }}>
              <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#8D8A91] font-semibold mb-1">
                Connect
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {socialItems.map(({ key, label, icon }) => {
                  const href = socials[key];

                  return href ? (
                    <SocialLinkIcon
                      key={key}
                      href={href}
                      label={label}
                      name={icon}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#ECE5E1] text-[#060C39] transition-colors hover:bg-[#E2D8D2]"
                      iconClassName="h-5 w-5"
                    />
                  ) : null;
                })}
              </div>
              {profile.email    && <ExternalLink href={`mailto:${profile.email}`} label="Email" />}
            </div>
          )}
        </div>

        {/* ── Bottom bar ── */}
        <hr style={{ border: "none", borderTop: "1px solid #F3EDE9", margin: "clamp(2rem,5vw,4rem) 0 clamp(1rem,2vw,2rem)" }} />
        <div className="flex items-center justify-between">
          <p
            className="font-sans text-[#8D8A91] font-medium"
            style={{ fontSize: "clamp(0.875rem,0.875rem + ((1vw - 0.2rem) * 0.227),1rem)" }}
          >
            © {profile.displayName} {year}. All rights reserved.
          </p>
          <a
            href="/admin"
            className="font-sans text-[#8D8A91] hover:text-[#54505B] transition-colors font-medium"
            style={{ fontSize: "clamp(0.875rem,0.875rem + ((1vw - 0.2rem) * 0.227),1rem)" }}
          >
            Admin ↗
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="font-sans text-[#76737C] hover:text-[#1B1624] transition-colors font-medium"
      style={{ fontSize: "clamp(0.875rem,0.875rem + ((1vw - 0.2rem) * 0.227),1rem)", textDecoration: "none" }}
    >
      {label}
    </Link>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto") ? undefined : "_blank"}
      rel="noopener noreferrer"
      className="font-sans text-[#76737C] hover:text-[#1B1624] transition-colors font-medium"
      style={{ fontSize: "clamp(0.875rem,0.875rem + ((1vw - 0.2rem) * 0.227),1rem)", textDecoration: "none" }}
    >
      {label} ↗
    </a>
  );
}
