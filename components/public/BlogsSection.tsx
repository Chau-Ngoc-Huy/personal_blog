import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

interface Tag {
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  tags: Tag[];
}

const PLACEHOLDER_COLORS = [
  "from-amber-100 to-orange-100",
  "from-blue-100 to-indigo-100",
  "from-purple-100 to-violet-100",
  "from-emerald-100 to-teal-100",
  "from-rose-100 to-pink-100",
  "from-sky-100 to-cyan-100",
];

export default function BlogsSection({ posts }: { posts: Post[] }) {
  return (
    <section id="blogs" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 mb-2">
              Latest posts
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
              My Blogs
            </h2>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-stone-400 text-sm">
            No posts yet. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <BlogCard key={post.id} post={post} colorIndex={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function BlogCard({ post, colorIndex }: { post: Post; colorIndex: number }) {
  const gradient = PLACEHOLDER_COLORS[colorIndex % PLACEHOLDER_COLORS.length];

  return (
    <Link
      href={`/${post.slug}`}
      className="group flex flex-col bg-[#FAF8F3] border border-stone-200 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(194,179,164,0.5)] hover:border-transparent"
    >
      {/* Cover */}
      <div className="aspect-[3/2] overflow-hidden shrink-0">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            width={400}
            height={267}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-4xl`}>
            ✍️
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag.slug}
                className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-500"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <h3 className="text-base font-semibold text-stone-900 leading-snug mb-2 group-hover:text-stone-600 transition-colors line-clamp-2">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-sm text-stone-400 leading-relaxed line-clamp-2 flex-1 mb-4">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-stone-100">
          {post.publishedAt && (
            <time className="text-xs text-stone-400">{formatDate(post.publishedAt)}</time>
          )}
          <span className="text-xs font-medium text-stone-400 group-hover:text-stone-700 transition-colors ml-auto">
            Read post →
          </span>
        </div>
      </div>
    </Link>
  );
}
