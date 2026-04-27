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
    <section id="about" className="py-20 bg-[#FAF8F3]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-14 md:gap-20 items-start">
          {/* Photo */}
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="w-56 h-64 md:w-64 md:h-72 rounded-3xl overflow-hidden bg-stone-100 shadow-xl ring-4 ring-white">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.displayName}
                  width={256}
                  height={288}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-5xl font-bold text-amber-400">
                  {initials}
                </div>
              )}
            </div>
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 mb-3">
              A little about me
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6 tracking-tight leading-tight">
              Hey, I&apos;m{" "}
              <span className="relative inline">
                <span className="relative z-10">{profile.displayName}</span>
                <span
                  className="absolute left-0 bottom-0.5 w-full h-2.5 rounded-sm -z-0"
                  style={{ background: "rgba(251,191,36,0.4)" }}
                />
              </span>
            </h2>

            {profile.bio ? (
              <div className="space-y-4 text-stone-500 leading-relaxed text-[15px]">
                {profile.bio.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            ) : (
              <p className="text-stone-400 italic">No bio yet.</p>
            )}

            {(socials.twitter || socials.github || socials.linkedin) && (
              <div className="flex items-center gap-5 mt-8 flex-wrap">
                {socials.twitter && (
                  <a
                    href={socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900"
                  >
                    Twitter ↗
                  </a>
                )}
                {socials.github && (
                  <a
                    href={socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900"
                  >
                    GitHub ↗
                  </a>
                )}
                {socials.linkedin && (
                  <a
                    href={socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900"
                  >
                    LinkedIn ↗
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
