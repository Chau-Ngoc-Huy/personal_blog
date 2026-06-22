"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deletePost } from "@/lib/actions/posts";

const editHref = (id: string) => `/admin/posts/${id}/edit`;

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  tags: Array<{ id: string; name: string; slug: string; color?: string | null }>;
  coverImage: string | null;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
}

type ViewMode = "list" | "grid" | "calendar";

const STRIPE =
  "repeating-linear-gradient(135deg,#F5F7F7,#F5F7F7 8px,#EFF2F2 8px,#EFF2F2 16px)";

function StatusBadge({ status, small }: { status: string; small?: boolean }) {
  const published = status === "published";
  return (
    <span
      className={`${small ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"} shrink-0 whitespace-nowrap rounded-full font-medium ${
        published ? "bg-[#ECF5F0] text-[#186F49]" : "bg-[#FBF3DC] text-[#8C7A1F]"
      }`}
    >
      {published ? "Đã đăng" : "Nháp"}
    </span>
  );
}

export default function PostsManager({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const openEdit = (id: string) => router.push(editHref(id));
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewMode>("list");

  useEffect(() => {
    const saved = localStorage.getItem("admin-view") as ViewMode | null;
    if (saved) setView(saved);
  }, []);

  function setViewMode(v: ViewMode) {
    setView(v);
    localStorage.setItem("admin-view", v);
  }

  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  const filtered = posts.filter(p => {
    const searchLower = search.toLowerCase();
    const titleMatch = p.title.toLowerCase().includes(searchLower);
    const tagsMatch = p.tags.some(tag => tag.name.toLowerCase().includes(searchLower));
    return titleMatch || tagsMatch;
  });

  return (
    <div className="mx-auto w-full max-w-[1200px] p-[clamp(24px,3.5vw,40px)]">

      {/* ── Header ─────────────────────────────────── */}
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-[clamp(24px,3vw,32px)] font-semibold tracking-[-0.02em] text-[#14181A]">Bài viết</h1>
          <p className="mt-1.5 text-sm text-[#8C9496]">
            {posts.length} bài · {published} đã đăng · {drafts} nháp
          </p>
        </div>
        <Link href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-[8px] bg-[var(--ac)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--ac-dark)]">
          <span className="text-base leading-none">＋</span>
          Viết bài mới
        </Link>
      </div>

      {/* ── Search + View toggle ────────────────────── */}
      <div className="mb-5 flex items-center gap-3">
        {/* Search */}
        <div className="flex max-w-sm flex-1 items-center gap-2.5 rounded-full border border-[#E6EAEA] bg-white px-4 py-2.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B8C0C0" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Tìm theo tiêu đề hoặc chủ đề…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-[#14181A] placeholder:text-[#B8C0C0] focus:outline-none"
          />
        </div>

        {/* View toggle */}
        <div className="ml-auto flex items-center gap-[3px] rounded-[10px] border border-[#E6EAEA] bg-white p-[3px]">
          {([
            { mode: "list",     icon: "☰",  title: "Danh sách" },
            { mode: "grid",     icon: "▦",  title: "Lưới" },
            { mode: "calendar", icon: "📅", title: "Lịch" },
          ] as { mode: ViewMode; icon: string; title: string }[]).map(({ mode, icon, title }) => (
            <button key={mode} onClick={() => setViewMode(mode)} title={title}
              className={`flex h-8 w-9 items-center justify-center rounded-[7px] text-[15px] transition-colors ${
                view === mode
                  ? "bg-[var(--ac-soft)] text-[var(--ac-dark)]"
                  : "text-[#8C9496] hover:text-[#14181A]"
              }`}>
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* ── Empty state ────────────────────────────── */}
      {filtered.length === 0 && (
        <div className="py-16 text-center text-[#A7AFAF]">
          <p className="mb-3 font-mono text-[30px]">⌕</p>
          <p className="text-sm">Không tìm thấy bài viết nào.</p>
        </div>
      )}

      {/* ── LIST VIEW ──────────────────────────────── */}
      {view === "list" && filtered.length > 0 && (
        <div className="overflow-hidden rounded-[14px] border border-[#ECEFEF] bg-white">
          {filtered.map((post, i) => (
            <div key={post.id}
              onClick={() => openEdit(post.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.target === e.currentTarget && e.key === "Enter") openEdit(post.id); }}
              className={`flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-[#FAFBFB] ${i !== 0 ? "border-t border-[#F2F4F4]" : ""}`}>
              {/* Cover thumb */}
              <div className="h-[54px] w-[54px] shrink-0 overflow-hidden rounded-[10px] border border-[#ECEFEF]" style={{ background: STRIPE }}>
                {post.coverImage && (
                  <>{
                    /* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
                  </>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#14181A]">{post.title}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <code className="font-mono text-[11px] text-[#B8C0C0]">/{post.slug}</code>
                  {post.tags?.slice(0, 2).map(tag => (
                    <span key={tag.id} className="rounded-full border border-[#ECEFEF] bg-[#F5F7F7] px-2 py-0.5 text-[11px] text-[#586063]">{tag.name}</span>
                  ))}
                </div>
              </div>

              {/* Status */}
              <StatusBadge status={post.status} />

              {/* Date */}
              <p className="hidden w-24 shrink-0 text-right text-xs text-[#8C9496] md:block">
                {new Date(post.createdAt).toLocaleDateString("vi-VN", { day: "numeric", month: "short" })}
              </p>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-1">
                <DeleteBtn id={post.id} title={post.title} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── GRID VIEW ──────────────────────────────── */}
      {view === "grid" && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(post => (
            <div key={post.id}
              onClick={() => openEdit(post.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.target === e.currentTarget && e.key === "Enter") openEdit(post.id); }}
              className="group cursor-pointer overflow-hidden rounded-[14px] border border-[#ECEFEF] bg-white transition-all hover:border-[#E0E5E5] hover:shadow-card-hover">
              {/* Cover */}
              <div className="aspect-[16/9] overflow-hidden border-b border-[#ECEFEF]" style={{ background: STRIPE }}>
                {post.coverImage && (
                  <>{
                    /* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </>
                )}
              </div>
              {/* Content */}
              <div className="p-[18px]">
                <div className="mb-2.5 flex items-center justify-between">
                  <StatusBadge status={post.status} small />
                  {post.publishedAt && (
                    <time className="text-[12px] text-[#B8C0C0]">
                      {new Date(post.publishedAt).toLocaleDateString("vi-VN", { day: "numeric", month: "short", year: "numeric" })}
                    </time>
                  )}
                </div>
                <h3 className="mb-3 line-clamp-2 font-heading text-base font-semibold leading-snug text-[#14181A]">{post.title}</h3>
                {post.excerpt && <p className="mb-3 line-clamp-2 text-xs text-[#8C9496]">{post.excerpt}</p>}
                <div className="flex items-center justify-between border-t border-[#F2F4F4] pt-3">
                  <code className="font-mono text-[11px] text-[#B8C0C0]">/{post.slug}</code>
                  <div className="flex items-center gap-1">
                    <DeleteBtn id={post.id} title={post.title} small />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CALENDAR VIEW ──────────────────────────── */}
      {view === "calendar" && filtered.length > 0 && (
        <CalendarView posts={filtered} />
      )}
    </div>
  );
}

/* ── Delete Button ─────────────────────────────────────── */
function DeleteBtn({ id, title, small }: { id: string; title: string; small?: boolean }) {
  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation(); // don't trigger the row's "open edit" click
    if (!confirm(`Xoá "${title}"?`)) return;
    await deletePost(id);
  }
  return (
      <button onClick={handleDelete} onKeyDown={(e) => e.stopPropagation()}
      className={`rounded-[7px] text-[13px] font-medium text-[#A7AFAF] transition-colors hover:bg-[#FBECEC] hover:text-[#C0584F] ${small ? "px-2 py-1" : "px-3 py-1.5"}`}>
      Xoá
    </button>
  );
}

/* ── Calendar View ─────────────────────────────────────── */
function CalendarView({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const openEdit = (id: string) => router.push(editHref(id));
  const grouped = posts.reduce<Record<string, Post[]>>((acc, post) => {
    const date = post.publishedAt ?? post.createdAt;
    const key = new Date(date).toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
    if (!acc[key]) acc[key] = [];
    acc[key].push(post);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([monthYear, monthPosts]) => (
        <div key={monthYear}>
          <div className="mb-4 flex items-center gap-3">
            <h3 className="font-heading text-sm font-semibold capitalize text-[#14181A]">{monthYear}</h3>
            <div className="h-px flex-1 bg-[#ECEFEF]" />
            <span className="text-xs text-[#8C9496]">{monthPosts.length} bài</span>
          </div>
          <div className="space-y-3">
            {monthPosts.map(post => {
              const date = post.publishedAt ?? post.createdAt;
              return (
                <div key={post.id}
                  onClick={() => openEdit(post.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.target === e.currentTarget && e.key === "Enter") openEdit(post.id); }}
                  className="flex cursor-pointer items-center gap-4 rounded-[14px] border border-[#ECEFEF] bg-white p-4 transition-shadow hover:shadow-card-lift">
                  {/* Day badge */}
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-[10px] border border-[var(--ac-border)] bg-[var(--ac-soft)]">
                    <span className="font-heading text-lg font-semibold leading-none text-[var(--ac-dark)]">
                      {new Date(date).getDate()}
                    </span>
                    <span className="mt-0.5 text-[9px] font-medium uppercase text-[var(--ac)]">
                      {new Date(date).toLocaleDateString("vi-VN", { weekday: "short" })}
                    </span>
                  </div>
                  {/* Cover thumb */}
                  {post.coverImage && (
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[10px]" style={{ background: STRIPE }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
                    </div>
                  )}
                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#14181A]">{post.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <StatusBadge status={post.status} small />
                      {post.tags?.slice(0, 2).map(tag => (
                        <span key={tag.id} className="rounded-full border border-[#ECEFEF] bg-[#F5F7F7] px-2 py-0.5 text-[11px] text-[#586063]">{tag.name}</span>
                      ))}
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1">
                    <DeleteBtn id={post.id} title={post.title} small />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
