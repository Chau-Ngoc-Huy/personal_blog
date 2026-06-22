"use client";

import { useState } from "react";
import Link from "next/link";

export interface ArticleCard {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  date: string;
  tags: string[];
  viewCount?: number;
  likeCount?: number;
}

const COVER_BG = {
  backgroundImage:
    "repeating-linear-gradient(135deg,#F5F7F7,#F5F7F7 11px,#EFF2F2 11px,#EFF2F2 22px)",
};

export default function ArticlesIndex({ posts, tags }: { posts: ArticleCard[]; tags: string[] }) {
  const [tag, setTag] = useState("Tất cả");
  const [q, setQ] = useState("");

  const chips = ["Tất cả", ...tags];
  const ql = q.trim().toLowerCase();
  const filtered = posts.filter(
    (p) =>
      (tag === "Tất cả" || p.tags.includes(tag)) &&
      (!ql ||
        p.title.toLowerCase().includes(ql) ||
        (p.excerpt || "").toLowerCase().includes(ql))
  );

  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ECEFEF] pb-7 pt-2 md:pb-10">
        <div className="flex flex-wrap gap-2.5">
          {chips.map((c) => {
            const active = c === tag;
            return (
              <button
                key={c}
                onClick={() => setTag(c)}
                className={
                  active
                    ? "rounded-full border border-[var(--ac-border)] bg-[var(--ac-soft)] px-4 py-2 text-[13px] font-medium text-[var(--ac-dark)]"
                    : "rounded-full border border-[#E6EAEA] bg-white px-4 py-2 text-[13px] text-[#586063] transition-colors hover:border-[#C8CFCF] hover:text-[#14181A]"
                }
              >
                {c}
              </button>
            );
          })}
        </div>
        <div className="flex min-w-[200px] flex-1 items-center gap-2.5 rounded-full border border-[#E6EAEA] bg-white px-4 py-2.5 sm:flex-none">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B8C0C0" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm bài viết…"
            className="w-full border-none bg-transparent text-sm text-[#14181A] outline-none placeholder:text-[#B8C0C0]"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="py-8 md:py-14">
        <div className="mb-6 text-[13px] text-[#8C9496]">{filtered.length} bài viết</div>
        {filtered.length === 0 ? (
          <p className="text-[15px] text-[#8C9496]">Không tìm thấy bài viết phù hợp.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <Link
                key={p.id}
                href={`/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#ECEFEF] bg-white no-underline transition-all hover:-translate-y-1 hover:border-[#E0E5E5] hover:shadow-card-hover"
              >
                <div className="aspect-[16/10] border-b border-[#ECEFEF]" style={p.coverImage ? undefined : COVER_BG}>
                  {p.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.coverImage} alt={p.title} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  {p.tags[0] && (
                    <div className="mb-3">
                      <span className="rounded-full border border-[var(--ac-border)] bg-[var(--ac-soft)] px-[11px] py-1 text-[12px] font-semibold tracking-[0.03em] text-[var(--ac-dark)]">
                        {p.tags[0]}
                      </span>
                    </div>
                  )}
                  <h3 className="mb-2.5 font-heading text-[20px] font-semibold leading-[1.24] tracking-[-0.015em] text-[#14181A] transition-colors group-hover:text-[var(--ac-dark)]">
                    {p.title}
                  </h3>
                  {p.excerpt && (
                    <p className="mb-4 flex-1 text-[14px] leading-[1.6] text-[#586063] line-clamp-3">
                      {p.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] text-[#8C9496]">{p.date}</span>
                    <div className="flex items-center gap-3 text-[12px] text-[#B8C0C0]">
                      {(p.viewCount ?? 0) > 0 && (
                        <span className="flex items-center gap-1">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          {p.viewCount}
                        </span>
                      )}
                      {(p.likeCount ?? 0) > 0 && (
                        <span className="flex items-center gap-1">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                          {p.likeCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
