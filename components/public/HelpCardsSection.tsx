import Link from "next/link";

const TOPIC_ICONS = ["✍️", "💡", "🚀", "📚", "⚡", "🎯", "💻", "🎨"];
const HOVER_CLASSES = [
  "hover:bg-amber-50 hover:border-amber-200",
  "hover:bg-blue-50 hover:border-blue-200",
  "hover:bg-purple-50 hover:border-purple-200",
  "hover:bg-emerald-50 hover:border-emerald-200",
  "hover:bg-rose-50 hover:border-rose-200",
  "hover:bg-orange-50 hover:border-orange-200",
  "hover:bg-sky-50 hover:border-sky-200",
  "hover:bg-pink-50 hover:border-pink-200",
];

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
    <section className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 mb-3">
            Browse by topic
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            How Can I Help You?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((tag, i) => (
            <Link
              key={tag.id}
              href="#blogs"
              className={`group relative bg-[#FAF8F3] border border-stone-200 rounded-2xl p-6 transition-all duration-200 ${HOVER_CLASSES[i % HOVER_CLASSES.length]} hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(194,179,164,0.5)]`}
            >
              <div className="text-3xl mb-4">{TOPIC_ICONS[i % TOPIC_ICONS.length]}</div>
              <h3 className="text-base font-semibold text-stone-900 mb-1">{tag.name}</h3>
              <p className="text-sm text-stone-400">
                {tag._count.posts} {tag._count.posts === 1 ? "post" : "posts"}
              </p>
              <span className="absolute bottom-5 right-5 text-stone-300 group-hover:text-stone-600 transition-colors text-sm font-medium">
                Browse →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
