import { prisma } from "@/lib/db";
import { getProfile } from "@/lib/actions/profile";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const revalidate = 0;

export default async function DashboardPage() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setUTCHours(0, 0, 0, 0);

  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);
  thisMonthStart.setUTCHours(0, 0, 0, 0);

  const [profile, posts, rawDailyStats] = await Promise.all([
    getProfile(),
    prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        publishedAt: true,
        viewCount: true,
        likeCount: true,
        coverImage: true,
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.dailyStat.findMany({
      where: { date: { gte: thirtyDaysAgo } },
      orderBy: { date: "asc" },
    }),
  ]);

  // Fill in missing days with zeros to always show 30 bars
  const statsByDate = new Map(
    rawDailyStats.map((d) => [d.date.toISOString().slice(0, 10), d])
  );
  const dailyStats = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const found = statsByDate.get(key);
    return { date: d, views: found?.views ?? 0, likes: found?.likes ?? 0 };
  });

  const published = posts.filter((p) => p.status === "published");
  const drafts = posts.filter((p) => p.status === "draft");

  const totalViews = published.reduce((s, p) => s + p.viewCount, 0);
  const totalLikes = published.reduce((s, p) => s + p.likeCount, 0);
  const totalViewsMonth = rawDailyStats
    .filter((d) => d.date >= thisMonthStart)
    .reduce((s, d) => s + d.views, 0);

  const recentPosts = [...posts].slice(0, 5);

  return (
    <AdminDashboard
      displayName={profile.displayName}
      totalViewsMonth={totalViewsMonth}
      totalViews={totalViews}
      totalLikes={totalLikes}
      totalPosts={posts.length}
      publishedPosts={published.length}
      draftPosts={drafts.length}
      dailyStats={dailyStats}
      recentPosts={recentPosts}
    />
  );
}
