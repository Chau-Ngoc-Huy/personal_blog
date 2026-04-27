import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug, getPublishedPosts } from "@/lib/actions/posts";
import { getProfile } from "@/lib/actions/profile";
import { extractHeadings, addHeadingIds } from "@/lib/utils";
import Navbar from "@/components/public/Navbar";
import SiteFooter from "@/components/public/SiteFooter";
import PostHeader from "@/components/public/PostHeader";
import PostContent from "@/components/public/PostContent";
import AuthorBox from "@/components/public/AuthorBox";

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
  return posts.map((p) => ({ slug: p.slug }));
}

export const revalidate = 0;

export default async function PostPage({ params }: Props) {
  const [post, profile] = await Promise.all([
    getPostBySlug(params.slug),
    getProfile(),
  ]);
  if (!post) notFound();

  const contentWithIds = addHeadingIds(post.content);
  const headings = extractHeadings(post.content);

  let socialLinks: Record<string, string> = {};
  try {
    if (profile.socialLinks) socialLinks = JSON.parse(profile.socialLinks);
  } catch {}

  return (
    <div className="min-h-screen bg-white">
      {/* ── Combined Navbar + Post Header ── */}
      <div
        className="max-w-[1400px] mx-auto bg-[#F9F6F3]"
        style={{
          margin: "var(--box-margin) auto",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <Navbar name={profile.displayName} transparent />
        <PostHeader
          title={post.title}
          tags={post.tags}
          coverImage={post.coverImage}
          profile={profile}
          publishedAt={post.publishedAt}
        />
      </div>

      {/* ── Post Content ── */}
      <PostContent
        excerpt={post.excerpt}
        contentWithIds={contentWithIds}
        headings={headings}
      />

      {/* ── Author Box ── */}
      <div
        className="max-w-[1400px] mx-auto"
        style={{
          paddingLeft: "var(--page-px)",
          paddingRight: "var(--page-px)",
          paddingBottom: "var(--navbar-py)",
        }}
      >
        <div className="flex-1 min-w-0">
          <AuthorBox profile={profile} socialLinks={socialLinks} />
        </div>
      </div>

      <SiteFooter profile={profile} />
    </div>
  );
}

