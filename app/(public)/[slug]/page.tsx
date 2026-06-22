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
import RelatedPosts from "@/components/public/RelatedPosts";

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

// ISR: cached + prefetchable. Invalidated on edit via revalidatePath().
export const revalidate = 3600;

export default async function PostPage({ params }: Props) {
  const [post, profile, allPosts] = await Promise.all([
    getPostBySlug(params.slug),
    getProfile(),
    getPublishedPosts(),
  ]);
  if (!post) notFound();

  const contentWithIds = addHeadingIds(post.content);
  const headings = extractHeadings(post.content);
  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  let socialLinks: Record<string, string> = {};
  try {
    if (profile.socialLinks) socialLinks = JSON.parse(profile.socialLinks);
  } catch {}

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Unified header panel — navbar + title + cover in one rounded box */}
        <div
          className="mx-auto"
          style={{
            maxWidth: "1240px",
            paddingLeft: "var(--page-px)",
            paddingRight: "var(--page-px)",
            paddingTop: "var(--box-margin)",
          }}
        >
          <div className="overflow-hidden rounded-[24px] border border-[#ECEFEF] bg-[#F5F7F7]">
            <Navbar name={profile.displayName} transparent />
            <PostHeader
              title={post.title}
              tags={post.tags}
              coverImage={post.coverImage}
              profile={profile}
              publishedAt={post.publishedAt}
              excerpt={post.excerpt}
            />
          </div>
        </div>

        <PostContent contentWithIds={contentWithIds} headings={headings} />
        <AuthorBox profile={profile} socialLinks={socialLinks} />
        <RelatedPosts posts={related} />
      </main>
      <SiteFooter profile={profile} />
    </div>
  );
}
