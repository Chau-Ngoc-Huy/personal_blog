import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/actions/posts";
import { formatDate, parseTags } from "@/lib/utils";
import { blogConfig } from "@/lib/config";
import { Heart, Camera, Mail } from "lucide-react";

export const revalidate = 0;

const socialLinks = [
  { label: "Facebook", icon: Heart, href: blogConfig.facebook },
  { label: "Instagram", icon: Camera, href: blogConfig.instagram },
  { label: "Email", icon: Mail, href: `mailto:${blogConfig.email}` },
];

export default async function HomePage() {
  const posts = await getPublishedPosts();
  const featured = posts[0] ?? null;
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Navigation ───────────────────────────────── */}
      <header className="border-b border-neutral-100 sticky top-0 bg-white/90 backdrop-blur-sm z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-neutral-900">{blogConfig.name}</span>
            <span className="text-[10px] tracking-[0.18em] uppercase text-neutral-400">Personal Blog</span>
          </Link>
          <nav className="flex items-center gap-6">
            {socialLinks.map(({ label, icon: Icon, href }) => (
              <a key={label} href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                title={label}
                className="text-neutral-400 hover:text-neutral-900 transition-colors duration-150">
                <Icon size={20} />
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Hero intro ───────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-b border-neutral-100">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-3xl shrink-0 overflow-hidden">
            👤
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{blogConfig.name}</h1>
            <p className="text-neutral-500 text-sm mt-0.5">
              {blogConfig.role} · {blogConfig.bio}
            </p>
          </div>
        </div>
      </section>

      {posts.length === 0 ? (
        <div className="text-center py-32 text-neutral-400 text-sm">Chưa có bài viết nào.</div>
      ) : (
        <>
          {/* ── Featured post ────────────────────────── */}
          {featured && (
            <section className="max-w-6xl mx-auto px-6 py-14 border-b border-neutral-100">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-400 mb-8">
                Bài mới nhất
              </p>
              <Link href={`/${featured.slug}`} className="group flex flex-col md:flex-row gap-8 items-start">
                {/* Cover image */}
                {featured.coverImage && (
                  <div className="w-full md:w-[480px] aspect-[16/10] rounded-2xl overflow-hidden shrink-0 bg-neutral-100">
                    <Image
                      src={featured.coverImage}
                      alt={featured.title}
                      width={480}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                {/* Content */}
                <div className="flex-1 py-2">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {parseTags(featured.tags).map(tag => (
                      <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight leading-[1.15] mb-4 group-hover:text-neutral-600 transition-colors">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="text-neutral-500 text-base leading-relaxed mb-6">
                      {featured.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4">
                    {featured.publishedAt && (
                      <time className="text-sm text-neutral-400">{formatDate(featured.publishedAt)}</time>
                    )}
                    <span className="text-sm font-medium text-neutral-900 group-hover:underline">
                      Đọc bài →
                    </span>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* ── Post grid ────────────────────────────── */}
          {rest.length > 0 && (
            <section className="max-w-6xl mx-auto px-6 py-14">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-400 mb-8">
                Tất cả bài viết
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map(post => (
                  <PostCard key={post.id} {...post} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="border-t border-neutral-100 mt-8">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <p className="text-xs text-neutral-300">© {new Date().getFullYear()} {blogConfig.name}</p>
          <a href="/admin" className="text-xs text-neutral-300 hover:text-neutral-500 transition-colors">Admin ↗</a>
        </div>
      </footer>
    </div>
  );
}

/* ── Post Card (grid) ──────────────────────────────────── */
function PostCard(post: {
  title: string; slug: string; excerpt: string | null;
  tags: string | null; coverImage: string | null; publishedAt: Date | null;
}) {
  const tags = parseTags(post.tags);
  return (
    <article className="group flex flex-col">
      <Link href={`/${post.slug}`} className="flex flex-col h-full">
        {/* Cover */}
        <div className="aspect-[3/2] rounded-xl overflow-hidden bg-neutral-100 mb-4 shrink-0">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              width={400}
              height={267}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200" />
          )}
        </div>
        {/* Meta */}
        <div className="flex items-center gap-2 mb-2.5">
          {tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500">
              {tag}
            </span>
          ))}
          {post.publishedAt && (
            <time className="text-[11px] text-neutral-400 ml-auto">
              {formatDate(post.publishedAt)}
            </time>
          )}
        </div>
        {/* Title */}
        <h3 className="text-base font-semibold text-neutral-900 leading-snug mb-2 group-hover:text-neutral-500 transition-colors">
          {post.title}
        </h3>
        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-neutral-400 leading-relaxed line-clamp-2 flex-1">
            {post.excerpt}
          </p>
        )}
      </Link>
    </article>
  );
}
