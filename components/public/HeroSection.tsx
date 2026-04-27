import Image from "next/image";
import Link from "next/link";

interface Profile {
  displayName: string;
  bio: string | null;
  avatar: string | null;
}

export default function HeroSection({ profile }: { profile: Profile }) {
  const initials = profile.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section
      className="bg-[#F9F6F3]"
      style={{
        paddingTop: "clamp(2rem,8vw,7.5rem)",
        paddingBottom: "clamp(2rem,8vw,7.5rem)",
      }}
    >
      <div
        className="max-w-[1200px] mx-auto flex flex-col-reverse md:flex-row items-center"
        style={{
          paddingLeft: "clamp(1.25rem,4vw,3rem)",
          paddingRight: "clamp(1.25rem,4vw,3rem)",
          gap: "clamp(2rem,6.5vw,4rem)",
        }}
      >
        {/* ── Text ── */}
        <div className="flex-1 text-center md:text-left">
          <p
            className="font-heading text-[#1B1624] mb-3"
            style={{
              fontSize: "clamp(3rem,3rem + ((1vw - 0.2rem) * 4.091),5.25rem)",
              lineHeight: 1.1,
              fontWeight: 400,
              letterSpacing: "-0.03em",
            }}
          >
            Hey Friends 👋
          </p>

          <h1
            className="font-heading text-[#1B1624] mb-5"
            style={{
              fontSize: "clamp(1.5rem,1.5rem + ((1vw - 0.2rem) * 2.045),2.625rem)",
              lineHeight: 1.25,
              fontWeight: 400,
              letterSpacing: "-0.03em",
            }}
          >
            I&apos;m{" "}
            <span className="relative inline-block">
              <span className="relative z-10">{profile.displayName}</span>
              <span
                className="absolute left-0 w-full rounded-sm -z-0"
                style={{ bottom: "0.1em", height: "0.3em", background: "#FDD46B", opacity: 0.7 }}
              />
            </span>
          </h1>

          {profile.bio && (
            <p
              className="font-sans text-[#54505B] mb-8 max-w-lg mx-auto md:mx-0"
              style={{
                fontSize: "clamp(1.125rem,1.125rem + ((1vw - 0.2rem) * 0.455),1.375rem)",
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              {profile.bio}
            </p>
          )}

          <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
            {/* Primary button — blue, hover goes dark */}
            <Link
              href="#blogs"
              className="font-sans font-medium no-underline bg-[#5DCDF1] text-[#1B1624] hover:bg-[#1B1624] hover:text-white transition-colors duration-150 rounded-full"
              style={{
                paddingTop: "0.7rem",
                paddingBottom: "0.6rem",
                paddingLeft: "clamp(1.5rem,1.75vw,3.5rem)",
                paddingRight: "clamp(1.5rem,1.75vw,3.5rem)",
                fontSize: "clamp(0.875rem,0.875rem + ((1vw - 0.2rem) * 0.227),1rem)",
              }}
            >
              Read my blogs →
            </Link>

            {/* Ghost / outline button */}
            <Link
              href="#about"
              className="font-sans font-medium no-underline bg-transparent text-[#1B1624] hover:bg-[#1B1624] hover:text-white transition-all duration-150 rounded-full"
              style={{
                border: "2px solid #1B1624",
                paddingTop: "0.65rem",
                paddingBottom: "0.55rem",
                paddingLeft: "clamp(1.5rem,1.75vw,3.5rem)",
                paddingRight: "clamp(1.5rem,1.75vw,3.5rem)",
                fontSize: "clamp(0.875rem,0.875rem + ((1vw - 0.2rem) * 0.227),1rem)",
              }}
            >
              About me
            </Link>
          </div>
        </div>

        {/* ── Avatar ── */}
        <div className="shrink-0">
          <div
            className="overflow-hidden bg-[#F3EDE9]"
            style={{
              width: "clamp(180px,25vw,320px)",
              height: "clamp(200px,28vw,360px)",
              borderRadius: "clamp(1.25rem,2.5vw,2rem)",
              boxShadow: "0px 48px 64px -20px rgba(0,0,0,0.15)",
            }}
          >
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt={profile.displayName}
                width={320}
                height={360}
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center font-heading text-[#FD976D]"
                style={{ fontSize: "clamp(2rem,6vw,4rem)", fontWeight: 400 }}
              >
                {initials}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
