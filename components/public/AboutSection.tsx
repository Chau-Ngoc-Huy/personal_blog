import Image from "next/image";

interface Profile {
  displayName: string;
  bio: string | null;
  avatar: string | null;
  socialLinks: string | null;
}

interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
}

export default function AboutSection({ profile }: { profile: Profile }) {
  let socials: SocialLinks = {};
  try {
    if (profile.socialLinks) socials = JSON.parse(profile.socialLinks);
  } catch {}

  const initials = profile.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section
      id="about"
      className="bg-[#F9F6F3]"
      style={{
        paddingTop: "var(--section-py)",
        paddingBottom: "var(--section-py)",
      }}
    >
      <div
        className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start"
        style={{
          paddingLeft: "var(--page-px)",
          paddingRight: "var(--page-px)",
          gap: "clamp(2rem,7.5vw,6rem)",
        }}
      >
        {/* ── Photo ── */}
        <div className="shrink-0 mx-auto md:mx-0">
          <div
            className="overflow-hidden bg-[#F3EDE9]"
            style={{
              width: "clamp(180px,22vw,280px)",
              height: "clamp(220px,26vw,320px)",
              borderRadius: "clamp(1.25rem,2.5vw,2rem)",
              boxShadow: "0px 48px 64px -20px rgba(0,0,0,0.15)",
            }}
          >
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt={profile.displayName}
                width={280}
                height={320}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center font-heading text-[#FD976D]"
                style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 400 }}
              >
                {initials}
              </div>
            )}
          </div>
        </div>

        {/* ── Text ── */}
        <div className="flex-1">
          <p className="font-sans font-semibold uppercase tracking-[0.18em] text-[#8D8A91] text-xs mb-3">
            A little about me
          </p>

          <h2
            className="font-heading text-[#1B1624] mb-6"
            style={{
              fontSize: "clamp(1.5rem,1.5rem + ((1vw - 0.2rem) * 2.045),2.625rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.25,
              fontWeight: 400,
            }}
          >
            Hey, I&apos;m{" "}
            <span className="relative inline-block">
              <span className="relative z-10">{profile.displayName}</span>
              <span
                className="absolute left-0 w-full rounded-sm -z-0"
                style={{ bottom: "0.08em", height: "0.28em", background: "#FDD46B", opacity: 0.7 }}
              />
            </span>
          </h2>

          {profile.bio ? (
            <div className="space-y-4">
              {profile.bio.split("\n").filter(Boolean).map((para, i) => (
                <p
                  key={i}
                  className="font-sans text-[#54505B]"
                  style={{
                    fontSize: "clamp(1rem,1rem + ((1vw - 0.2rem) * 0.227),1.125rem)",
                    lineHeight: 1.6,
                    fontWeight: 500,
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          ) : (
            <p className="font-sans text-[#8D8A91] italic">No bio yet.</p>
          )}

          {(socials.twitter || socials.github || socials.linkedin) && (
            <div className="flex items-center flex-wrap mt-8" style={{ gap: "1.5rem" }}>
              {socials.twitter && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans font-medium text-[#76737C] hover:text-[#1B1624] transition-colors"
                  style={{ fontSize: "clamp(0.875rem,0.875rem + ((1vw - 0.2rem) * 0.227),1rem)" }}
                >
                  Twitter ↗
                </a>
              )}
              {socials.github && (
                <a
                  href={socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans font-medium text-[#76737C] hover:text-[#1B1624] transition-colors"
                  style={{ fontSize: "clamp(0.875rem,0.875rem + ((1vw - 0.2rem) * 0.227),1rem)" }}
                >
                  GitHub ↗
                </a>
              )}
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans font-medium text-[#76737C] hover:text-[#1B1624] transition-colors"
                  style={{ fontSize: "clamp(0.875rem,0.875rem + ((1vw - 0.2rem) * 0.227),1rem)" }}
                >
                  LinkedIn ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
