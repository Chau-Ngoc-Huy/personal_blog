import Link from "next/link";

interface Profile {
  displayName: string;
  email: string | null;
  socialLinks: string | null;
}

interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
}

export default function SiteFooter({ profile }: { profile: Profile }) {
  let socials: SocialLinks = {};
  try {
    if (profile.socialLinks) socials = JSON.parse(profile.socialLinks);
  } catch {}

  const hasConnect = socials.twitter || socials.github || socials.linkedin || profile.email;

  return (
    <footer className="bg-stone-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <p className="text-base font-bold tracking-tight mb-1">{profile.displayName}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-5">Personal Blog</p>
            <p className="text-sm text-stone-400 leading-relaxed">
              Thanks for reading. Writing is how I think out loud.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-semibold mb-1">
              Navigation
            </p>
            <Link href="#blogs" className="text-sm text-stone-400 hover:text-white transition-colors duration-150">
              Blogs
            </Link>
            <Link href="#about" className="text-sm text-stone-400 hover:text-white transition-colors duration-150">
              About Me
            </Link>
          </div>

          {/* Connect */}
          {hasConnect && (
            <div className="flex flex-col gap-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-semibold mb-1">
                Connect
              </p>
              {socials.twitter && (
                <a href={socials.twitter} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-stone-400 hover:text-white transition-colors duration-150">
                  Twitter ↗
                </a>
              )}
              {socials.github && (
                <a href={socials.github} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-stone-400 hover:text-white transition-colors duration-150">
                  GitHub ↗
                </a>
              )}
              {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-stone-400 hover:text-white transition-colors duration-150">
                  LinkedIn ↗
                </a>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`}
                  className="text-sm text-stone-400 hover:text-white transition-colors duration-150">
                  Email ↗
                </a>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-stone-800 mt-14 pt-8 flex items-center justify-between">
          <p className="text-xs text-stone-600">
            © {new Date().getFullYear()} {profile.displayName}. All rights reserved.
          </p>
          <a href="/admin" className="text-xs text-stone-600 hover:text-stone-400 transition-colors duration-150">
            Admin ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
