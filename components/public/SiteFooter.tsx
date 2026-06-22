import Link from "next/link";
import SocialLinkIcon from "./SocialLinkIcon";
import { SOCIAL_LINKS, parseSocialLinks } from "../../lib/social-links";

interface Profile {
  displayName: string;
  email: string | null;
  socialLinks: string | null;
}

const SOCIAL_CLASS =
  "inline-flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E6EAEA] text-[#586063] transition-colors hover:border-[var(--ac)] hover:bg-[var(--ac-soft)] hover:text-[var(--ac-dark)]";

export default function SiteFooter({ profile }: { profile: Profile }) {
  const socials = parseSocialLinks(profile.socialLinks);
  const hasConnect = SOCIAL_LINKS.some(({ key }) => Boolean(socials[key])) || Boolean(profile.email);
  const year = new Date().getFullYear();

  return (
    <footer
      className="mx-auto"
      style={{
        maxWidth: "var(--maxw)",
        paddingLeft: "var(--page-px)",
        paddingRight: "var(--page-px)",
        paddingTop: "clamp(56px,8vw,96px)",
        paddingBottom: "clamp(40px,5vw,56px)",
      }}
    >
      <div className="grid grid-cols-1 gap-8 border-b border-[#ECEFEF] pb-12 md:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="mb-4 flex items-center gap-2.5">
            <span className="h-[9px] w-[9px] rounded-full bg-[var(--ac)]" />
            <span className="font-heading text-[18px] font-semibold text-[#14181A]">
              {profile.displayName}
            </span>
          </div>
          <p className="max-w-[34ch] text-[15px] leading-[1.65] text-[#8C9496]">
            Viết để giữ lại những điều rồi sẽ trôi đi mất.
          </p>
        </div>
        {hasConnect && (
          <div>
            <div className="mb-4 text-xs uppercase tracking-[0.12em] text-[#B8C0C0]">Kết nối</div>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map(({ key, label, icon }) => {
                const href = socials[key];
                return href ? (
                  <SocialLinkIcon
                    key={key}
                    href={href}
                    label={label}
                    name={icon}
                    className={SOCIAL_CLASS}
                    iconClassName="h-[18px] w-[18px]"
                  />
                ) : null;
              })}
              {profile.email && (
                <SocialLinkIcon
                  href={`mailto:${profile.email}`}
                  label="Email"
                  name="email"
                  className={SOCIAL_CLASS}
                  iconClassName="h-[18px] w-[18px]"
                />
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 text-[13px] text-[#B8C0C0]">
        <span>
          © {year} {profile.displayName}. Viết tay, giữ bằng tim.
        </span>
        <Link href="/admin" className="no-underline transition-colors hover:text-[#586063]">
          Quản trị ↗
        </Link>
      </div>
    </footer>
  );
}
