"use client";

import Link from "next/link";

interface PostStat {
  id: string;
  title: string;
  slug: string;
  viewCount: number;
  likeCount: number;
  publishedAt: Date | null;
  tags: { name: string; color: string | null }[];
}

interface Props {
  posts: PostStat[];
  totalViews: number;
  totalLikes: number;
  totalPosts: number;
}

function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

const MAX_BAR = 200; // px width for 100%

export default function AnalyticsDashboard({ posts, totalViews, totalLikes, totalPosts }: Props) {
  const maxViews = Math.max(...posts.map((p) => p.viewCount), 1);
  const maxLikes = Math.max(...posts.map((p) => p.likeCount), 1);
  const avgViews = totalPosts > 0 ? Math.round(totalViews / totalPosts) : 0;

  return (
    <div className="min-h-full p-6 md:p-8">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="font-heading text-[22px] font-semibold tracking-[-0.02em] text-[#14181A]">
          Thống kê
        </h1>
        <p className="mt-1 text-[14px] text-[#8C9496]">Lượt xem và tương tác của các bài đã xuất bản</p>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Tổng lượt xem" value={fmt(totalViews)} icon={EyeIcon} color="bg-[#EEF2FF]" iconColor="text-[#6366F1]" />
        <KpiCard label="Tổng lượt thích" value={fmt(totalLikes)} icon={HeartIcon} color="bg-[#FFF1F3]" iconColor="text-[#E8506A]" />
        <KpiCard label="Bài đã đăng" value={String(totalPosts)} icon={DocIcon} color="bg-[#F0FDF4]" iconColor="text-[#22C55E]" />
        <KpiCard label="TB lượt xem/bài" value={fmt(avgViews)} icon={TrendIcon} color="bg-[#FFF7ED]" iconColor="text-[#F59E0B]" />
      </div>

      {/* Top posts table */}
      <div className="rounded-2xl border border-[#ECEFEF] bg-white">
        <div className="border-b border-[#F5F7F7] px-6 py-4">
          <h2 className="font-heading text-[15px] font-semibold text-[#14181A]">Bài viết theo lượt xem</h2>
        </div>

        {posts.length === 0 ? (
          <div className="px-6 py-12 text-center text-[14px] text-[#8C9496]">Chưa có bài viết nào được xuất bản.</div>
        ) : (
          <div className="divide-y divide-[#F5F7F7]">
            {posts.map((post, i) => (
              <div key={post.id} className="flex items-center gap-4 px-6 py-4">
                {/* Rank */}
                <span className="w-6 shrink-0 text-center font-mono text-[12px] text-[#B8C0C0]">{i + 1}</span>

                {/* Title + tag */}
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/${post.slug}`}
                    target="_blank"
                    className="block truncate text-[14px] font-medium text-[#14181A] hover:text-[var(--ac-dark)]"
                  >
                    {post.title}
                  </Link>
                  {post.tags[0] && (
                    <span
                      className="mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{
                        background: post.tags[0].color ? `${post.tags[0].color}18` : "#F5F7F7",
                        color: post.tags[0].color ?? "#8C9496",
                      }}
                    >
                      {post.tags[0].name}
                    </span>
                  )}
                </div>

                {/* Bars + stats */}
                <div className="hidden shrink-0 flex-col gap-1.5 sm:flex" style={{ width: MAX_BAR + 60 }}>
                  <div className="flex items-center gap-2">
                    <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-[#F0F3F3]">
                      <div
                        className="h-full rounded-full bg-[#6366F1] transition-all duration-500"
                        style={{ width: `${(post.viewCount / maxViews) * 100}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-mono text-[12px] text-[#586063]">{fmt(post.viewCount)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-[#F0F3F3]">
                      <div
                        className="h-full rounded-full bg-[#E8506A] transition-all duration-500"
                        style={{ width: `${(post.likeCount / maxLikes) * 100}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-mono text-[12px] text-[#586063]">{fmt(post.likeCount)}</span>
                  </div>
                </div>

                {/* Mobile stats */}
                <div className="flex shrink-0 flex-col items-end gap-1 sm:hidden">
                  <span className="flex items-center gap-1 text-[12px] text-[#586063]">
                    <EyeIcon className="h-3 w-3" /> {fmt(post.viewCount)}
                  </span>
                  <span className="flex items-center gap-1 text-[12px] text-[#E8506A]">
                    <HeartIcon className="h-3 w-3" /> {fmt(post.likeCount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-5 border-t border-[#F5F7F7] px-6 py-3">
          <span className="flex items-center gap-1.5 text-[12px] text-[#8C9496]">
            <span className="h-2 w-2 rounded-full bg-[#6366F1]" /> Lượt xem
          </span>
          <span className="flex items-center gap-1.5 text-[12px] text-[#8C9496]">
            <span className="h-2 w-2 rounded-full bg-[#E8506A]" /> Lượt thích
          </span>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  icon: Icon,
  color,
  iconColor,
}: {
  label: string;
  value: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-2xl border border-[#ECEFEF] bg-white p-5">
      <div className={`mb-3 inline-flex rounded-xl p-2.5 ${color}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div className="font-heading text-[28px] font-semibold tracking-[-0.02em] text-[#14181A]">{value}</div>
      <div className="mt-0.5 text-[13px] text-[#8C9496]">{label}</div>
    </div>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function DocIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function TrendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
