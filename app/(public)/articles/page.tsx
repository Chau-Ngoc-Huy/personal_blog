import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/actions/posts";
import { getProfile } from "@/lib/actions/profile";
import { getAllTags } from "@/lib/actions/tags";
import { formatDate } from "@/lib/utils";
import Navbar from "@/components/public/Navbar";
import SiteFooter from "@/components/public/SiteFooter";
import ArticlesIndex, { type ArticleCard } from "@/components/public/ArticlesIndex";

export const metadata: Metadata = {
  title: "Bài viết — Blog",
  description: "Tất cả bài viết",
};

// ISR: cached + prefetchable. Invalidated on edit via revalidatePath().
export const revalidate = 3600;

export default async function ArticlesPage() {
  const [posts, profile, tagsResult] = await Promise.all([
    getPublishedPosts(),
    getProfile(),
    getAllTags(),
  ]);

  const tags = (tagsResult.tags ?? [])
    .filter((t) => t._count.posts > 0)
    .map((t) => t.name);

  const cards: ArticleCard[] = posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    coverImage: p.coverImage,
    date: p.publishedAt ? formatDate(p.publishedAt) : "",
    tags: p.tags.map((t) => t.name),
    viewCount: p.viewCount,
    likeCount: p.likeCount,
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Header — unified soft rounded panel (matches home + post pages) */}
      <div
        style={{
          paddingLeft: "var(--box-margin)",
          paddingRight: "var(--box-margin)",
          paddingTop: "var(--box-margin)",
        }}
      >
        <div
          className="mx-auto w-full overflow-hidden rounded-[24px] border border-[#ECEFEF] bg-[#F5F7F7]"
          style={{ maxWidth: "var(--maxw)" }}
        >
          <Navbar name={profile.displayName} transparent />
          <div
            style={{
              paddingLeft: "var(--page-px)",
              paddingRight: "var(--page-px)",
              paddingTop: "clamp(8px,2vw,20px)",
              paddingBottom: "clamp(28px,5vw,56px)",
            }}
          >
            <div className="mb-5 font-heading text-[13px] uppercase tracking-[0.18em] text-[#8C9496]">
              Lưu trữ
            </div>
            <h1 className="mb-4 font-heading text-[clamp(36px,5vw,64px)] font-semibold leading-[1.04] tracking-[-0.03em] text-[#14181A]">
              Tất cả bài viết
            </h1>
            <p className="max-w-[54ch] text-[clamp(16px,1.6vw,19px)] leading-[1.65] text-[#586063]">
              Mọi thứ mình đã viết — về chuyện dạy học, vài thử nghiệm nhỏ và những lát cắt nhỏ của
              đời sống. Chọn một chủ đề để tìm nhanh.
            </p>
          </div>
        </div>
      </div>

      <main
        className="mx-auto pt-8 md:pt-12"
        style={{ maxWidth: "var(--maxw)", paddingLeft: "var(--page-px)", paddingRight: "var(--page-px)" }}
      >
        <ArticlesIndex posts={cards} tags={tags} />
      </main>
      <SiteFooter profile={profile} />
    </div>
  );
}
