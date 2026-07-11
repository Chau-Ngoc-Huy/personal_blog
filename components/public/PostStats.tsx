"use client";

import { useEffect, useState } from "react";

interface PostStatsProps {
  slug: string;
  initialViews: number;
  initialLikes: number;
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function PostStats({ slug, initialViews, initialLikes }: PostStatsProps) {
  const [views, setViews] = useState(initialViews);
  const [likes, setLikes] = useState(initialLikes);
  // null = chưa biết (đang load), true/false = server đã trả về
  const [liked, setLiked] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  // Track view và đồng thời lấy trạng thái liked từ server cookie
  useEffect(() => {
    fetch(`/api/posts/${slug}/view`, { method: "POST" })
      .then((r) => r.json())
      .then((d) => {
        setViews(d.viewCount);
        setLiked(d.liked);
      })
      .catch(() => setLiked(false));
  }, [slug]);

  async function toggleLike() {
    if (loading || liked === null) return;
    setLoading(true);
    const action = liked ? "unlike" : "like";
    const next = !liked;

    // Optimistic update
    setLiked(next);
    setLikes((l) => l + (next ? 1 : -1));

    try {
      const res = await fetch(`/api/posts/${slug}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      setLikes(data.likeCount);
      // Đồng bộ lại trạng thái thực từ server (nếu bị block vì spam → revert)
      if (data.alreadyLiked) setLiked(true);
    } catch {
      setLiked(!next);
      setLikes((l) => l + (next ? -1 : 1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-5">
      {/* Views */}
      <div className="flex items-center gap-1.5 text-[#8C9496]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span className="text-[13px] tabular-nums">{formatCount(views)}</span>
      </div>

      {/* Like button */}
      <button
        onClick={toggleLike}
        disabled={loading || liked === null}
        aria-label={liked ? "Bỏ thích" : "Thích bài viết"}
        className="group flex items-center gap-1.5 transition-colors"
        style={{ color: liked ? "#E8506A" : "#8C9496" }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-150 group-hover:scale-110"
          aria-hidden="true"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span className="text-[13px] tabular-nums">{formatCount(likes)}</span>
      </button>
    </div>
  );
}
