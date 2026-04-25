"use client";

import { useState, useTransition } from "react";
import { slugify, formatDate, parseTags } from "@/lib/utils";
import dynamic from "next/dynamic";

const NovelEditor = dynamic(() => import("./NovelEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-slate-200 rounded-xl h-[400px] flex items-center justify-center text-slate-400 text-sm bg-slate-50">
      Đang tải editor...
    </div>
  ),
});

interface Props {
  action: (formData: FormData) => Promise<{ error?: string } | void>;
  defaultValues?: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    tags?: string;
    coverImage?: string;
    status?: string;
  };
}

export default function PostForm({ action, defaultValues = {} }: Props) {
  const [title, setTitle]           = useState(defaultValues.title ?? "");
  const [slug, setSlug]             = useState(defaultValues.slug ?? "");
  const [excerpt, setExcerpt]       = useState(defaultValues.excerpt ?? "");
  const [tags, setTags]             = useState(defaultValues.tags ?? "");
  const [coverImage, setCoverImage] = useState(defaultValues.coverImage ?? "");
  const [content, setContent]       = useState(defaultValues.content ?? "");
  const [slugEdited, setSlugEdited] = useState(!!defaultValues.slug);
  const [error, setError]           = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!slugEdited) setSlug(slugify(v));
  }

  function handleSubmit(actionType: "draft" | "publish") {
    setError(null);
    setPendingAction(actionType);
    const fd = new FormData();
    fd.set("title", title);
    fd.set("slug", slug);
    fd.set("excerpt", excerpt);
    fd.set("tags", tags);
    fd.set("coverImage", coverImage);
    fd.set("content", content);
    fd.set("action", actionType);
    startTransition(async () => {
      const result = await action(fd);
      if (result?.error) { setError(result.error); setPendingAction(null); }
    });
  }

  const tagList = parseTags(tags);

  return (
    <div className="flex gap-6 h-full">

      {/* ── Form ──────────────────────────────────── */}
      <div className={`flex flex-col gap-5 transition-all duration-300 ${showPreview ? "w-1/2" : "w-full max-w-2xl"}`}>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Tiêu đề *
          </label>
          <input type="text" value={title} onChange={e => handleTitleChange(e.target.value)}
            placeholder="Tiêu đề bài viết..."
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Slug *
          </label>
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-violet-500 bg-white">
            <span className="px-3 py-3 bg-slate-50 text-slate-400 text-sm border-r border-slate-200 shrink-0">/</span>
            <input type="text" value={slug} onChange={e => { setSlugEdited(true); setSlug(slugify(e.target.value)); }}
              placeholder="duong-dan-bai-viet"
              className="flex-1 px-3 py-3 text-sm font-mono text-slate-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Row: excerpt + tags */}
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Tóm tắt</label>
            <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2}
              placeholder="Đoạn mô tả ngắn hiển thị ngoài trang chủ..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Tags</label>
            <input type="text" value={tags} onChange={e => setTags(e.target.value)}
              placeholder="tech, life, travel"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            />
          </div>
        </div>

        {/* Cover image */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Ảnh bìa (URL)</label>
          <input type="url" value={coverImage} onChange={e => setCoverImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          />
          {coverImage && (
            <div className="mt-2 rounded-xl overflow-hidden aspect-[3/1] bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImage} alt="preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Content editor */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Nội dung *
          </label>
          <NovelEditor initialContent={defaultValues.content} onChange={setContent} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100 sticky bottom-0 bg-slate-50 py-4 -mx-6 px-6">
          <button type="button" onClick={() => handleSubmit("draft")} disabled={isPending}
            className="px-5 py-2.5 text-sm font-medium border border-slate-200 rounded-xl hover:bg-white transition-colors disabled:opacity-50 text-slate-600">
            {isPending && pendingAction === "draft" ? "Đang lưu..." : "Lưu nháp"}
          </button>
          <button type="button" onClick={() => handleSubmit("publish")} disabled={isPending}
            className="px-5 py-2.5 text-sm font-medium bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 shadow-sm shadow-violet-200">
            {isPending && pendingAction === "publish" ? "Đang đăng..." : "Publish"}
          </button>
          <button type="button" onClick={() => setShowPreview(p => !p)}
            className={`ml-auto flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
              showPreview
                ? "bg-violet-50 text-violet-700 border border-violet-200"
                : "border border-slate-200 text-slate-500 hover:bg-white"
            }`}>
            <span>👁</span>
            {showPreview ? "Ẩn preview" : "Preview"}
          </button>
          <a href="/admin/dashboard" className="text-sm text-slate-400 hover:text-slate-600 transition-colors ml-2">
            Hủy
          </a>
        </div>
      </div>

      {/* ── Preview Panel ─────────────────────────── */}
      {showPreview && (
        <div className="w-1/2 bg-white rounded-2xl border border-slate-200 overflow-y-auto sticky top-0 max-h-screen">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Preview</span>
            <span className="text-xs text-slate-400">Xem trước bài viết</span>
          </div>
          <div className="overflow-y-auto">
            {/* Cover */}
            {coverImage && (
              <div className="aspect-[16/7] overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverImage} alt="cover" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-8">
              {/* Tags */}
              {tagList.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {tagList.map(tag => (
                    <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-500">{tag}</span>
                  ))}
                </div>
              )}
              {/* Title */}
              <h1 className="text-3xl font-bold text-neutral-900 leading-tight tracking-tight mb-4">
                {title || <span className="text-slate-300">Tiêu đề bài viết...</span>}
              </h1>
              <time className="text-sm text-neutral-400">{formatDate(new Date())}</time>
              {/* Excerpt */}
              {excerpt && (
                <p className="mt-6 text-base text-neutral-500 leading-relaxed border-l-[3px] border-neutral-200 pl-4 italic">
                  {excerpt}
                </p>
              )}
              <hr className="border-neutral-100 my-8" />
              {/* Content */}
              <div
                className="prose-content"
                dangerouslySetInnerHTML={{ __html: content || "<p class='text-slate-300'>Nội dung bài viết sẽ hiện ở đây...</p>" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
