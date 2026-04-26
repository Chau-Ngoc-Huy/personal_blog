"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { deletePost } from "@/lib/actions/posts";

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

export default function PostsManager({ posts }: { posts: Post[] }) {
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

  const filtered = posts.filter(p => {
    const searchLower = search.toLowerCase();
    const titleMatch = p.title.toLowerCase().includes(searchLower);
    const tagsMatch = p.tags.some(tag => tag.name.toLowerCase().includes(searchLower));
    return titleMatch || tagsMatch;
  });

  return (
    <div className="p-8">

      {/* ── Header ─────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bài viết</h1>
          <p className="text-sm text-slate-400 mt-0.5">{posts.length} bài viết</p>
        </div>
        <Link href="/admin/posts/new"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
          <span className="text-base leading-none">+</span>
          Bài viết mới
        </Link>
      </div>

      {/* ── Search + View toggle ────────────────────── */}
      <div className="flex items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, tag..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
          {([
            { mode: "list",     icon: "☰",  title: "List" },
            { mode: "grid",     icon: "▦",  title: "Grid" },
            { mode: "calendar", icon: "📅", title: "Calendar" },
          ] as { mode: ViewMode; icon: string; title: string }[]).map(({ mode, icon, title }) => (
            <button key={mode} onClick={() => setViewMode(mode)} title={title}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-150 ${
                view === mode
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-700"
              }`}>
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* ── Empty state ────────────────────────────── */}
      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-sm">Không tìm thấy bài viết nào.</p>
        </div>
      )}

      {/* ── LIST VIEW ──────────────────────────────── */}
      {view === "list" && filtered.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {filtered.map((post, i) => (
            <div key={post.id}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors ${i !== 0 ? "border-t border-slate-100" : ""}`}>
              {/* Cover thumb */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                {post.coverImage
                  ? <Image src={post.coverImage} alt={post.title} width={56} height={56} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-slate-300 text-xl">📝</div>
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 text-sm truncate">{post.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-[11px] text-slate-400">/{post.slug}</code>
                  {post.tags?.slice(0, 2).map(tag => (
                    <span key={tag.id} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{tag.name}</span>
                  ))}
                </div>
              </div>

              {/* Status */}
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                post.status === "published"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}>
                {post.status === "published" ? "Published" : "Draft"}
              </span>

              {/* Date */}
              <p className="text-xs text-slate-400 shrink-0 hidden md:block w-24 text-right">
                {new Date(post.createdAt).toLocaleDateString("vi-VN", { day: "numeric", month: "short" })}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <Link href={`/admin/posts/${post.id}/edit`}
                  className="px-3 py-1.5 text-xs font-medium text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
                  Sửa
                </Link>
                <DeleteBtn id={post.id} title={post.title} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── GRID VIEW ──────────────────────────────── */}
      {view === "grid" && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(post => (
            <div key={post.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md hover:shadow-slate-200/60 transition-shadow group">
              {/* Cover */}
              <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
                {post.coverImage
                  ? <Image src={post.coverImage} alt={post.title} width={400} height={225} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                  : <div className="w-full h-full flex items-center justify-center text-slate-200 text-4xl">📝</div>
                }
              </div>
              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    post.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  }`}>
                    {post.status === "published" ? "Published" : "Draft"}
                  </span>
                  {post.publishedAt && (
                    <time className="text-[11px] text-slate-400">
                      {new Date(post.publishedAt).toLocaleDateString("vi-VN", { day: "numeric", month: "short", year: "numeric" })}
                    </time>
                  )}
                </div>
                <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-2 line-clamp-2">{post.title}</h3>
                {post.excerpt && <p className="text-xs text-slate-400 line-clamp-2 mb-3">{post.excerpt}</p>}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex gap-1">
                    {post.tags?.slice(0, 2).map(tag => (
                      <span key={tag.id} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{tag.name}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={`/admin/posts/${post.id}/edit`}
                      className="text-xs font-medium text-violet-600 hover:bg-violet-50 px-2 py-1 rounded-lg transition-colors">
                      Sửa
                    </Link>
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
  async function handleDelete() {
    if (!confirm(`Xóa "${title}"?`)) return;
    await deletePost(id);
  }
  return (
    <button onClick={handleDelete}
      className={`text-xs font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ${small ? "px-2 py-1" : "px-3 py-1.5"}`}>
      Xóa
    </button>
  );
}

/* ── Calendar View ─────────────────────────────────────── */
function CalendarView({ posts }: { posts: Post[] }) {
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
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-sm font-semibold text-slate-700 capitalize">{monthYear}</h3>
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">{monthPosts.length} bài</span>
          </div>
          <div className="space-y-3">
            {monthPosts.map(post => {
              const date = post.publishedAt ?? post.createdAt;
              return (
                <div key={post.id}
                  className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-sm transition-shadow">
                  {/* Day badge */}
                  <div className="w-12 h-12 rounded-xl bg-violet-50 flex flex-col items-center justify-center shrink-0 border border-violet-100">
                    <span className="text-lg font-bold text-violet-700 leading-none">
                      {new Date(date).getDate()}
                    </span>
                    <span className="text-[9px] font-medium text-violet-400 uppercase mt-0.5">
                      {new Date(date).toLocaleDateString("vi-VN", { weekday: "short" })}
                    </span>
                  </div>
                  {/* Cover thumb */}
                  {post.coverImage && (
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <Image src={post.coverImage} alt={post.title} width={48} height={48} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm truncate">{post.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        post.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {post.status === "published" ? "Published" : "Draft"}
                      </span>
                      {post.tags?.slice(0, 2).map(tag => (
                        <span key={tag.id} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{tag.name}</span>
                      ))}
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Link href={`/admin/posts/${post.id}/edit`}
                      className="text-xs font-medium text-violet-600 hover:bg-violet-50 px-3 py-1.5 rounded-lg transition-colors">
                      Sửa
                    </Link>
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
