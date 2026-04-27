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
    <section className="max-w-5xl mx-auto px-6 py-20 md:py-28">
      <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">
        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-4xl md:text-5xl font-bold text-stone-900 mb-3 leading-tight">
            Hey 👋
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900 mb-5 leading-snug tracking-tight">
            I&apos;m{" "}
            <span className="relative inline">
              <span className="relative z-10">{profile.displayName}</span>
              <span
                className="absolute left-0 bottom-0.5 w-full h-2.5 rounded-sm -z-0"
                style={{ background: "rgba(251,191,36,0.4)" }}
              />
            </span>
          </h1>
          {profile.bio && (
            <p className="text-base md:text-lg text-stone-500 leading-relaxed mb-8 max-w-lg mx-auto md:mx-0">
              {profile.bio}
            </p>
          )}
          <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
            <Link
              href="#blogs"
              className="bg-stone-900 text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-stone-700 transition-colors duration-150"
            >
              Read my blogs →
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-stone-700 px-6 py-3 rounded-full border border-stone-200 hover:border-stone-400 transition-colors duration-150"
            >
              About me
            </Link>
          </div>
        </div>

        {/* Avatar */}
        <div className="shrink-0">
          <div className="w-48 h-48 md:w-60 md:h-60 rounded-3xl overflow-hidden bg-stone-100 shadow-lg ring-4 ring-white">
            {profile.avatar ? (
              <Image
                src={profile.avatar}
                alt={profile.displayName}
                width={240}
                height={240}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-4xl font-bold text-amber-400">
                {initials}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
