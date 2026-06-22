import { prisma } from "@/lib/db";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";

export const revalidate = 0;

export default async function AnalyticsPage() {
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    select: {
      id: true,
      title: true,
      slug: true,
      viewCount: true,
      likeCount: true,
      publishedAt: true,
      tags: { select: { name: true, color: true } },
    },
    orderBy: { viewCount: "desc" },
  });

  const totalViews = posts.reduce((s, p) => s + p.viewCount, 0);
  const totalLikes = posts.reduce((s, p) => s + p.likeCount, 0);
  const totalPosts = posts.length;

  return (
    <AnalyticsDashboard
      posts={posts}
      totalViews={totalViews}
      totalLikes={totalLikes}
      totalPosts={totalPosts}
    />
  );
}
