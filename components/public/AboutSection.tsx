import AvatarBubble from "./AvatarBubble";
import SocialLinkIcon from "./SocialLinkIcon";
import { SOCIAL_LINKS, parseSocialLinks } from "../../lib/social-links";

interface Profile {
  displayName: string;
  bio: string | null;
  avatar: string | null;
  email: string | null;
  socialLinks: string | null;
}

const SOCIAL_CLASS =
  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E2E7E7] bg-white text-[#586063] transition-colors hover:border-[var(--ac)] hover:bg-[var(--ac-soft)] hover:text-[var(--ac-dark)]";

export default function AboutSection({ profile }: { profile: Profile }) {
  const socials = parseSocialLinks(profile.socialLinks);

  const paras = (profile.bio || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const lead = paras[0] || "";
  const rest = paras.slice(1);
  const hasConnect = SOCIAL_LINKS.some(({ key }) => Boolean(socials[key])) || Boolean(profile.email);

  return (
    <section
      id="gioi-thieu"
      className="border-y border-[#ECEFEF] bg-[#F5F7F7]"
      style={{ marginTop: "clamp(40px,7vw,88px)" }}
    >
      <div
        className="mx-auto grid items-center gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16"
        style={{
          maxWidth: "var(--maxw)",
          paddingLeft: "var(--page-px)",
          paddingRight: "var(--page-px)",
          paddingTop: "clamp(56px,9vw,112px)",
          paddingBottom: "clamp(56px,9vw,112px)",
        }}
      >
        {/* Portrait */}
        <div className="mx-auto w-full max-w-[320px] md:mx-0">
          <AvatarBubble
            avatar={profile.avatar}
            displayName={profile.displayName}
            className="w-full"
            initialsTextClassName="text-[clamp(2rem,5vw,3.5rem)]"
          />
        </div>

        {/* Text */}
        <div>
          <div className="mb-5 font-heading text-[13px] uppercase tracking-[0.18em] text-[#8C9496]">
            Giới thiệu
          </div>
          {lead && (
            <p className="mb-5 max-w-[34ch] font-heading text-[clamp(20px,2.4vw,28px)] font-medium leading-[1.4] tracking-[-0.01em] text-[#14181A]">
              {lead}
            </p>
          )}
          {rest.map((p, i) => (
            <p key={i} className="mb-5 max-w-[54ch] text-[16px] leading-[1.7] text-[#586063] last:mb-0">
              {p}
            </p>
          ))}
          {hasConnect && (
            <div className="mt-7">
              <div className="mb-3.5 text-xs uppercase tracking-[0.12em] text-[#A7AFAF]">
                Kết nối với mình
              </div>
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
                      iconClassName="h-[19px] w-[19px]"
                    />
                  ) : null;
                })}
                {profile.email && (
                  <SocialLinkIcon
                    href={`mailto:${profile.email}`}
                    label="Email"
                    name="email"
                    className={SOCIAL_CLASS}
                    iconClassName="h-[19px] w-[19px]"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
