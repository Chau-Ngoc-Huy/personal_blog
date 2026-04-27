import Link from "next/link";

const TOPIC_ICONS = ["✍️", "💡", "🚀", "📚", "⚡", "🎯", "💻", "🎨"];

interface Tag {
  id: string;
  name: string;
  slug: string;
  _count: { posts: number };
}

export default function HelpCardsSection({ tags }: { tags: Tag[] }) {
  const visible = tags.filter((t) => t._count.posts > 0).slice(0, 6);
  if (visible.length === 0) return null;

  return (
    <section
      className="bg-[#FFFFFF]"
      style={{
        paddingTop: "clamp(2rem,8vw,7.5rem)",
        paddingBottom: "clamp(2rem,8vw,7.5rem)",
      }}
    >
      <div
        className="max-w-[1200px] mx-auto"
        style={{
          paddingLeft: "clamp(1.25rem,4vw,3rem)",
          paddingRight: "clamp(1.25rem,4vw,3rem)",
        }}
      >
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="font-sans font-semibold uppercase tracking-[0.18em] text-[#8D8A91] text-xs mb-3">
            Browse by topic
          </p>
          <h2
            className="font-heading text-[#1B1624]"
            style={{
              fontSize: "clamp(1.5rem,1.5rem + ((1vw - 0.2rem) * 2.045),2.625rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.25,
              fontWeight: 400,
            }}
          >
            How Can I Help You?
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((tag, i) => (
            <Link
              key={tag.id}
              href="#blogs"
              className="group relative flex flex-col bg-[#F9F6F3] rounded-[20px] p-6 no-underline
                         transition-all duration-200 cursor-pointer
                         hover:bg-ali-tertiary hover:-translate-y-3 hover:shadow-card-hover"
            >
              <span className="text-3xl mb-4 block">{TOPIC_ICONS[i % TOPIC_ICONS.length]}</span>
              <h3
                className="font-heading text-[#1B1624] mb-1"
                style={{
                  fontSize: "clamp(1.125rem,1.125rem + ((1vw - 0.2rem) * 0.455),1.375rem)",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                }}
              >
                {tag.name}
              </h3>
              <p className="font-sans text-[#76737C] text-sm font-medium">
                {tag._count.posts} {tag._count.posts === 1 ? "post" : "posts"}
              </p>
              <span className="absolute bottom-5 right-5 font-sans text-sm font-medium text-[#8D8A91] group-hover:text-[#1B1624] transition-colors">
                Browse →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
