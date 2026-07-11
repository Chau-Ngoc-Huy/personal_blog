import SocialLinkIcon from "./SocialLinkIcon";
import { SOCIAL_LINKS } from "@/lib/social-links";

interface AuthorBoxProps {
  profile: {
    displayName: string;
    avatar: string | null;
    bio: string | null;
  };
  socialLinks: Record<string, string>;
}

const SOCIAL_CLASS =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E2E7E7] bg-white text-[#586063] transition-colors hover:border-[var(--ac)] hover:bg-[var(--ac-soft)] hover:text-[var(--ac-dark)]";

export default function AuthorBox({ profile, socialLinks }: AuthorBoxProps) {
  const initials = profile.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const hasSocials = Object.values(socialLinks || {}).some(Boolean);

  return (
    <section className="border-y border-[#ECEFEF] bg-[#F5F7F7]">
      <div
        className="mx-auto flex flex-col gap-6 sm:flex-row sm:items-start"
        style={{
          maxWidth: "760px",
          paddingLeft: "var(--page-px)",
          paddingRight: "var(--page-px)",
          paddingTop: "clamp(40px,6vw,64px)",
          paddingBottom: "clamp(40px,6vw,64px)",
        }}
      >
        <span className="relative h-[66px] w-[66px] flex-none">
          <span className="absolute inset-[3px] overflow-hidden rounded-full bg-[var(--ac)]">
            {profile.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar} alt={profile.displayName} className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center font-heading text-xl font-semibold text-white">
                {initials}
              </span>
            )}
          </span>
        </span>
        <div>
          <div className="mb-2 text-xs uppercase tracking-[0.12em] text-[#B8C0C0]">Tác giả</div>
          <div className="mb-2.5 font-heading text-[20px] font-semibold text-[#14181A]">
            {profile.displayName}
          </div>
          {profile.bio && (
            <p className="mb-4 max-w-[52ch] whitespace-pre-line text-[15px] leading-[1.7] text-[#586063]">
              {profile.bio}
            </p>
          )}
          {hasSocials && (
            <div className="flex flex-wrap gap-2.5">
              {SOCIAL_LINKS.map(({ key, label, icon }) => {
                const href = socialLinks[key];
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
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
