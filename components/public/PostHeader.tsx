import { formatDate } from "@/lib/utils";

interface PostHeaderProps {
  title: string;
  tags: Array<{ id: string; name: string }>;
  coverImage: string | null;
  profile: {
    displayName: string;
    avatar: string | null;
  };
  publishedAt: Date | null;
  excerpt?: string | null;
  // kept for compatibility; not displayed (header matches the old "name / date" layout)
  readingLabel?: string;
}

export default function PostHeader({
  title,
  tags,
  coverImage,
  profile,
  publishedAt,
  excerpt,
}: PostHeaderProps) {
  const initials = profile.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const hasCover = !!coverImage;

  return (
    <div
      className={
        hasCover
          ? "grid grid-cols-1 items-center gap-8 md:grid-cols-[1.2fr_0.8fr] md:gap-12"
          : ""
      }
      style={{
        paddingLeft: "var(--page-px)",
        paddingRight: "var(--page-px)",
        paddingTop: "clamp(8px,2vw,20px)",
        paddingBottom: "clamp(28px,5vw,56px)",
      }}
    >
      {/* Left — title + meta */}
      <div>
        {tags.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-3">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-[var(--ac-border)] bg-[var(--ac-soft)] px-3 py-[5px] text-xs font-semibold tracking-[0.04em] text-[var(--ac-dark)]"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <h1 className="mb-5 font-heading text-[clamp(30px,4.4vw,52px)] font-semibold leading-[1.06] tracking-[-0.025em] text-[#14181A]">
          {title}
        </h1>

        {excerpt && (
          <p className="mb-6 max-w-[52ch] text-[clamp(16px,1.6vw,19px)] leading-[1.6] text-[#586063]">
            {excerpt}
          </p>
        )}

        <div className="flex items-center gap-3 text-sm">
          <span className="relative h-[40px] w-[40px] flex-none">
            <span className="absolute inset-[2px] overflow-hidden rounded-full bg-[var(--ac)]">
              {profile.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar} alt={profile.displayName} className="h-full w-full object-cover" />
              ) : (
                <span
                  className="absolute inset-0"
                  style={{ background: "radial-gradient(120% 90% at 30% 14%, rgba(255,255,255,0.25), transparent 60%)" }}
                />
              )}
            </span>
            <svg
              viewBox="0 0 100 100"
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            >
              <circle cx="50" cy="50" r="47" fill="none" stroke="var(--ac)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="74 300" transform="rotate(-52 50 50)" opacity="0.5" />
            </svg>
            {!profile.avatar && (
              <span className="absolute inset-0 flex items-center justify-center font-heading text-[12px] font-semibold text-white">
                {initials}
              </span>
            )}
          </span>
          <span className="font-medium text-[#14181A]">{profile.displayName}</span>
          {publishedAt && (
            <>
              <span className="text-[#B8C0C0]">/</span>
              <time className="text-[#8C9496]">{formatDate(publishedAt)}</time>
            </>
          )}
        </div>
      </div>

      {/* Right — cover (only when present) */}
      {hasCover && (
        <div
          className="aspect-[4/3] overflow-hidden rounded-[16px]"
          style={{ boxShadow: "0 16px 40px rgba(20,24,26,0.16)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverImage as string} alt={title} className="h-full w-full object-cover" />
        </div>
      )}
    </div>
  );
}
