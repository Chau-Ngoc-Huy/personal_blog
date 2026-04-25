import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPostBySlug, getPublishedPosts } from "@/lib/actions/posts";
import { formatDate, parseTags } from "@/lib/utils";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Không tìm thấy" };
  return {
    title: `${post.title} — Blog`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${post.slug}`,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map(p => ({ slug: p.slug }));
}

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();
  const tags = parseTags(post.tags);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Nav ──────────────────────────────────────── */}
      <nav className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-neutral-100">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-900 transition-colors group">
            <span className="group-hover:-translate-x-0.5 transition-transform duration-150 inline-block">←</span>
            Tên của bạn
          </Link>
          {tags.length > 0 && (
            <div className="flex gap-2 max-w-xs justify-end">
              {tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 hidden sm:inline">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* ── Cover image ──────────────────────────────── */}
      {post.coverImage && (
        <div className="w-full aspect-[21/8] overflow-hidden bg-neutral-100">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1400}
            height={533}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      )}

      {/* ── Article ──────────────────────────────────── */}
      <article className="max-w-3xl mx-auto px-6 py-14">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map(tag => (
              <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-neutral-100 text-neutral-500">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-[1.15] tracking-tight mb-5">
          {post.title}
        </h1>

        {/* Meta */}
        {post.publishedAt && (
          <time className="text-sm text-neutral-400">{formatDate(post.publishedAt)}</time>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mt-8 text-lg text-neutral-500 leading-relaxed border-l-[3px] border-neutral-200 pl-5 italic">
            {post.excerpt}
          </p>
        )}

        <hr className="border-neutral-100 my-10" />

        {/* Content */}
        <div className="prose-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      {/* ── Footer bài ───────────────────────────────── */}
      <footer className="max-w-3xl mx-auto px-6 pb-20">
        <div className="border-t border-neutral-100 pt-10 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-900 transition-colors">
            <span className="group-hover:-translate-x-0.5 transition-transform inline-block">←</span>
            Quay về trang chủ
          </Link>
          <p className="text-xs text-neutral-300">Cảm ơn đã đọc</p>
        </div>
      </footer>
    </div>
  );
}
