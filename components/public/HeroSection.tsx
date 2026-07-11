import Link from "next/link";
import AvatarBubble from "./AvatarBubble";

interface Profile {
  displayName: string;
  sayHi: string | null;
  avatar: string | null;
}

export default function HeroSection({ profile }: { profile: Profile }) {
  return (
    <section
      className="mx-auto"
      style={{ maxWidth: "var(--maxw)", paddingLeft: "var(--page-px)", paddingRight: "var(--page-px)" }}
    >
      <div className="grid items-center gap-8 py-12 md:grid-cols-[1.08fr_0.92fr] md:gap-16 md:py-20 lg:py-24">
        {/* Text */}
        <div>
          <div className="mb-5 font-heading text-[13px] uppercase tracking-[0.18em] text-[#8C9496]">
            Blog cá nhân
          </div>
          <h1 className="mb-6 font-heading text-[clamp(40px,5.6vw,72px)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#14181A]">
            Chào bạn, mình là{" "}
            <span className="relative inline-block">
              <span className="relative z-10">{profile.displayName}</span>
              <span className="absolute bottom-[0.05em] left-[-2px] right-[-2px] z-0 h-[0.3em] rounded-[3px] bg-[var(--ac)] opacity-[0.85]" />
            </span>
            .
          </h1>
          {profile.sayHi && (
            <p className="mb-8 max-w-[52ch] text-[clamp(16px,1.6vw,19px)] leading-[1.7] text-[#586063]">
              {profile.sayHi}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3.5 text-sm text-[#586063]">
            <span className="inline-flex items-center gap-2.5">
              <span
                className="h-2 w-2 rounded-full bg-[var(--ac)]"
                style={{ boxShadow: "0 0 0 4px var(--ac-soft)" }}
              />
              Đang viết hằng tuần
            </span>
            <Link
              href="/articles"
              className="font-medium text-[#14181A] no-underline transition-colors hover:text-[var(--ac-dark)]"
            >
              Đọc bài viết →
            </Link>
          </div>
        </div>

        {/* Avatar */}
        <div className="justify-self-center">
          <AvatarBubble
            avatar={profile.avatar}
            displayName={profile.displayName}
            className="w-[clamp(260px,33vw,420px)]"
            initialsTextClassName="text-[clamp(2rem,6vw,3.5rem)]"
          />
        </div>
      </div>
    </section>
  );
}
