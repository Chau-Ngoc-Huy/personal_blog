"use client";

import Link from "next/link";
import { useState } from "react";

interface DayStat {
  date: Date;
  views: number;
  likes: number;
}

interface RecentPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  publishedAt: Date | null;
  viewCount: number;
  likeCount: number;
  coverImage: string | null;
}

interface Props {
  displayName: string;
  totalViewsMonth: number;
  totalViews: number;
  totalLikes: number;
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  dailyStats: DayStat[];
  recentPosts: RecentPost[];
}

function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

type ChartMetric = "views" | "likes" | "both";

export default function AdminDashboard({
  displayName,
  totalViewsMonth,
  totalViews,
  totalLikes,
  totalPosts,
  publishedPosts,
  draftPosts,
  dailyStats,
  recentPosts,
}: Props) {
  const [metric, setMetric] = useState<ChartMetric>("both");

  const maxViews = Math.max(...dailyStats.map((d) => d.views), 1);
  const maxLikes = Math.max(...dailyStats.map((d) => d.likes), 1);
  const maxBoth = Math.max(maxViews, maxLikes, 1);

  const totalChartViews = dailyStats.reduce((s, d) => s + d.views, 0);

  return (
    <div className="min-h-full p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-[22px] font-semibold tracking-[-0.02em] text-[#14181A]">
            Chào {displayName} 👋
          </h1>
          <p className="mt-1 text-[14px] text-[#8C9496]">Đây là tình hình blog của bạn hôm nay.</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-1.5 rounded-full bg-[#1A7A4A] px-4 py-2 text-[14px] font-medium text-white hover:bg-[#15693f] transition-colors"
        >
          <span className="text-[18px] leading-none">+</span> Viết bài mới
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Lượt xem tháng này"
          value={fmt(totalViewsMonth)}
          badge="↑ 8%"
          badgeColor="text-[#1A7A4A]"
        />
        <StatCard
          label="Bài viết"
          value={String(totalPosts)}
          badge={`+${draftPosts} nháp`}
          badgeColor="text-[#1A7A4A]"
        />
        <StatCard
          label="Lượt xem"
          value={fmt(totalViews)}
          badge="↑ 3%"
          badgeColor="text-[#1A7A4A]"
        />
        <StatCard
          label="Lượt thích"
          value={fmt(totalLikes)}
          badge="↑ 12%"
          badgeColor="text-[#1A7A4A]"
        />
      </div>

      {/* Chart + Recent Posts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
        {/* Bar Chart */}
        <div className="min-w-0 overflow-hidden rounded-2xl border border-[#ECEFEF] bg-white p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="font-heading text-[15px] font-semibold text-[#14181A]">
                Lượt xem · 30 ngày
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-[#8C9496]">{fmt(totalChartViews)} tổng</span>
              <div className="flex overflow-hidden rounded-lg border border-[#ECEFEF] text-[12px] font-medium">
                {(["both", "views", "likes"] as ChartMetric[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMetric(m)}
                    className={`px-2.5 py-1 transition-colors ${
                      metric === m
                        ? "bg-[#1A7A4A] text-white"
                        : "bg-white text-[#8C9496] hover:bg-[#F5F7F7]"
                    }`}
                  >
                    {m === "both" ? "Cả hai" : m === "views" ? "Xem" : "Thích"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bars */}
          <div className="flex h-[160px] items-end gap-[3px]">
            {dailyStats.map((day, i) => {
              const vPct = (day.views / (metric === "likes" ? maxLikes : maxBoth)) * 100;
              const lPct = (day.likes / (metric === "views" ? maxViews : maxBoth)) * 100;
              const isToday = i === dailyStats.length - 1;

              return (
                <div key={i} className="group relative flex flex-1 flex-col items-center justify-end gap-[2px]" style={{ height: "100%" }}>
                  {metric !== "likes" && (
                    <div
                      className={`w-full rounded-t-sm transition-all duration-300 ${
                        isToday ? "bg-[#1A7A4A]" : "bg-[#C6DDD3] group-hover:bg-[#1A7A4A]/60"
                      }`}
                      style={{ height: `${Math.max(vPct, 2)}%` }}
                    />
                  )}
                  {metric !== "views" && (
                    <div
                      className={`w-full rounded-t-sm transition-all duration-300 ${
                        isToday ? "bg-[#E8506A]" : "bg-[#F9C0CB] group-hover:bg-[#E8506A]/60"
                      }`}
                      style={{ height: `${Math.max(lPct, 2)}%` }}
                    />
                  )}
                  {/* Tooltip */}
                  <div className="pointer-events-none absolute bottom-full mb-1 hidden rounded-lg border border-[#ECEFEF] bg-white px-2 py-1 text-[11px] shadow-md group-hover:block z-10 whitespace-nowrap left-1/2 -translate-x-1/2">
                    <div className="text-[#14181A] font-medium">{fmtDate(day.date)}</div>
                    {metric !== "likes" && <div className="text-[#1A7A4A]">👁 {day.views}</div>}
                    {metric !== "views" && <div className="text-[#E8506A]">♥ {day.likes}</div>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-3 flex items-center gap-4">
            {metric !== "likes" && (
              <span className="flex items-center gap-1.5 text-[12px] text-[#8C9496]">
                <span className="h-2 w-2 rounded-full bg-[#1A7A4A]" /> Lượt xem
              </span>
            )}
            {metric !== "views" && (
              <span className="flex items-center gap-1.5 text-[12px] text-[#8C9496]">
                <span className="h-2 w-2 rounded-full bg-[#E8506A]" /> Lượt thích
              </span>
            )}
          </div>
        </div>

        {/* Recent Posts */}
        <div className="rounded-2xl border border-[#ECEFEF] bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-heading text-[15px] font-semibold text-[#14181A]">Bài gần đây</span>
            <Link href="/admin/posts" className="text-[13px] text-[#1A7A4A] hover:underline">
              Tất cả
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-center gap-3">
                {/* Cover thumbnail */}
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[#F5F7F7]">
                  {post.coverImage && (
                    <img src={post.coverImage} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="block truncate text-[13px] font-medium text-[#14181A] hover:text-[#1A7A4A]"
                  >
                    {post.title}
                  </Link>
                  <div className="mt-0.5 text-[12px] text-[#8C9496]">
                    {post.status === "draft"
                      ? "Nháp"
                      : post.publishedAt
                      ? fmtShortDate(post.publishedAt)
                      : ""}{" "}
                    · {fmt(post.viewCount)} lượt
                  </div>
                </div>
                {/* Status dot */}
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    background:
                      post.status === "published"
                        ? "#1A7A4A"
                        : post.likeCount > 0
                        ? "#F59E0B"
                        : "#D1D8D9",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  badge,
  badgeColor,
}: {
  label: string;
  value: string;
  badge: string;
  badgeColor: string;
}) {
  return (
    <div className="rounded-2xl border border-[#ECEFEF] bg-white p-5">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[13px] text-[#8C9496]">{label}</span>
        <span className="h-3.5 w-3.5 rounded-full border border-[#ECEFEF]" />
      </div>
      <div className="font-heading text-[30px] font-semibold tracking-[-0.02em] text-[#14181A]">
        {value}
      </div>
      <div className={`mt-1 text-[12px] font-medium ${badgeColor}`}>{badge}</div>
    </div>
  );
}

function fmtDate(d: Date) {
  return new Date(d).toLocaleDateString("vi-VN", { day: "numeric", month: "short" });
}

function fmtShortDate(d: Date) {
  return new Date(d).toLocaleDateString("vi-VN", { day: "numeric", month: "short" });
}
