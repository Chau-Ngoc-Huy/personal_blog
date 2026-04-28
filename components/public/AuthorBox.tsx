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

export default function AuthorBox({ profile, socialLinks }: AuthorBoxProps) {
  return (
    <div
      className="mt-8 rounded-[20px] p-8 flex flex-col items-center text-center gap-4 bg-[#FAF8F3]"
      style={{ border: "2px dashed #ECE5E1" }}
    >
      {profile.avatar ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatar}
            alt={profile.displayName}
            className="rounded-full object-cover"
            style={{ width: 80, height: 80 }}
          />
        </>
      ) : (
        <div
          className="rounded-full bg-[#F3EDE9] flex items-center justify-center font-heading text-[#FD976D]"
          style={{ width: 80, height: 80, fontSize: "1.5rem" }}
        >
          {profile.displayName.slice(0, 2).toUpperCase()}
        </div>
      )}

      <p
        className="font-heading text-[#1B1624]"
        style={{ fontSize: "clamp(1.25rem,1.5vw,1.5rem)", fontWeight: 400 }}
      >
        {profile.displayName}
      </p>

      {profile.bio && (
        <p className="font-sans text-[#54505B] max-w-lg" style={{ fontSize: "1rem", lineHeight: 1.65 }}>
          {profile.bio}
        </p>
      )}

      {/* Social links */}
      {Object.keys(socialLinks).length > 0 && (
        <div className="flex gap-4 flex-wrap justify-center">
          {SOCIAL_LINKS.map(({ key, label, icon }) => {
            const href = socialLinks[key];

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
      )}
    </div>
  );
}
