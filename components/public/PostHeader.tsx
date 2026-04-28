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
}

export default function PostHeader({
  title,
  tags,
  coverImage,
  profile,
  publishedAt,
}: PostHeaderProps) {
  return (
    <div
      style={{
        paddingLeft: "var(--page-px)",
        paddingRight: "var(--page-px)",
        paddingTop: "var(--navbar-py)",
        paddingBottom: "var(--navbar-py)",
      }}
    >
      <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
        {/* Text side */}
        <div className="flex-1 min-w-0">
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="font-sans text-[#54505B] bg-white rounded-full px-3 py-1"
                  style={{ fontSize: "0.8125rem", fontWeight: 500, border: "1px solid #ECE5E1" }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1
            className="font-heading text-[#1B1624] mb-5"
            style={{
              fontSize: "clamp(1.75rem,1.75rem + ((1vw - 0.2rem) * 2.5),3.25rem)",
              lineHeight: 1.15,
              fontWeight: 400,
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </h1>

          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap" style={{ fontSize: "0.875rem" }}>
            {profile.avatar ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.avatar}
                  alt={profile.displayName}
                  className="rounded-full object-cover"
                  style={{ width: 36, height: 36 }}
                />
              </>
            ) : (
              <div
                className="rounded-full bg-[#F3EDE9] flex items-center justify-center font-heading text-[#FD976D]"
                style={{ width: 36, height: 36, fontSize: "0.875rem" }}
              >
                {profile.displayName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="font-sans font-semibold text-[#1B1624]">{profile.displayName}</span>
            <span className="text-[#8D8A91]">/</span>
            {publishedAt && (
              <time className="font-sans text-[#76737C]">{formatDate(publishedAt)}</time>
            )}
          </div>
        </div>

        {/* Cover image */}
        {coverImage && (
          <div className="shrink-0 w-full lg:w-auto">
            <div
              className="overflow-hidden"
              style={{
                width: "clamp(180px,28vw,260px)",
                height: "clamp(220px,34vw,340px)",
                borderRadius: "12px",
                boxShadow: "0px 20px 40px -10px rgba(0,0,0,0.18)",
                maxWidth: "100%",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
