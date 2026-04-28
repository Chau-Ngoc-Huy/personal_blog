import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

interface Tag { name: string; slug: string }

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  tags: Tag[];
}

const PLACEHOLDERS = [
  { background: "linear-gradient(135deg, rgba(253, 212, 107, 0.3), rgba(253, 151, 109, 0.2))" },
  { background: "linear-gradient(135deg, rgba(93, 205, 241, 0.2), rgba(201, 177, 251, 0.2))" },
  { background: "linear-gradient(135deg, rgba(201, 177, 251, 0.2), rgba(93, 205, 241, 0.2))" },
  { background: "linear-gradient(135deg, rgba(121, 210, 135, 0.2), rgba(93, 205, 241, 0.2))" },
  { background: "linear-gradient(135deg, rgba(253, 151, 109, 0.2), rgba(253, 212, 107, 0.3))" },
  { background: "linear-gradient(135deg, rgb(243, 237, 233), rgb(236, 229, 225))" },
];

export default function BlogsSection({ posts }: { posts: Post[] }) {
  return (
    <section
      id="blogs"
      className="bg-[#FFFFFF]"
      style={{
        paddingTop: "var(--section-py)",
        paddingBottom: "var(--section-py)",
      }}
    >
      <div
        className="max-w-[1400px] mx-auto"
        style={{
          paddingLeft: "var(--page-px)",
          paddingRight: "var(--page-px)",
        }}
      >
        <div className="mb-12">
          <p className="font-sans font-semibold uppercase tracking-[0.18em] text-[#8D8A91] text-xs mb-2">
            Latest posts
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
            My Blogs
          </h2>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 font-sans text-[#8D8A91] text-sm">
            No posts yet — check back soon!
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
  const placeholder = PLACEHOLDERS[colorIndex % PLACEHOLDERS.length];

  return (
    <Link
      href={`/${post.slug}`}
      className="group flex flex-col bg-[#F9F6F3] rounded-[20px] overflow-hidden no-underline
                 transition-all duration-200 cursor-pointer
                 hover:bg-ali-tertiary hover:-translate-y-3 hover:shadow-card-hover"
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
          <div className="w-full h-full flex items-center justify-center text-4xl" style={placeholder}>
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
                className="font-sans text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#ECE5E1] text-[#76737C]"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <h3
          className="font-heading text-[#1B1624] mb-2 line-clamp-2"
          style={{
            fontSize: "clamp(1.125rem,1.125rem + ((1vw - 0.2rem) * 0.455),1.375rem)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
          }}
        >
          {post.title}
        </h3>

        {post.excerpt && (
          <p
            className="font-sans text-[#76737C] leading-relaxed line-clamp-2 flex-1 mb-4"
            style={{
              fontSize: "clamp(0.875rem,0.875rem + ((1vw - 0.2rem) * 0.227),1rem)",
              fontWeight: 500,
            }}
          >
            {post.excerpt}
          </p>
        )}

        <div
          className="flex items-center justify-between mt-auto pt-3"
          style={{ borderTop: "1px solid #ECE5E1" }}
        >
          {post.publishedAt && (
            <time className="font-sans text-xs text-[#8D8A91] font-medium">
              {formatDate(post.publishedAt)}
            </time>
          )}
          <span className="font-sans text-xs font-medium text-[#8D8A91] group-hover:text-[#1B1624] transition-colors ml-auto">
            Read post →
          </span>
        </div>
      </div>
    </Link>
  );
}
