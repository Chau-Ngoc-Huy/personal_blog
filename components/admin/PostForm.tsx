"use client";

import { useState, useTransition } from "react";
import { slugify } from "@/lib/utils";
import dynamic from "next/dynamic";
import { ErrorNotification, SuccessNotification } from "../ErrorNotification";
import MetadataModal from "./MetadataModal";
import PostPreview from "./PostPreview";
import { ActionResponse } from "@/lib/error-handler";
import { getProfile } from "@/lib/actions/profile";

const NovelEditor = dynamic(() => import("./NovelEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-slate-200 rounded-xl h-[400px] flex items-center justify-center text-slate-400 text-sm bg-slate-50">
      Đang tải editor...
    </div>
  ),
});

interface Props {
  action: (formData: FormData) => Promise<ActionResponse | void>;
  defaultValues?: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    tags?: string;
    coverImage?: string;
    status?: string;
  };
  profile?: Awaited<ReturnType<typeof getProfile>>;
}

export default function PostForm({ action, defaultValues = {}, profile }: Props) {
  const [title, setTitle] = useState(defaultValues.title ?? "");
  const [slug, setSlug] = useState(defaultValues.slug ?? "");
  const [excerpt, setExcerpt] = useState(defaultValues.excerpt ?? "");
  const [tags, setTags] = useState(defaultValues.tags ?? "");
  const [coverImage, setCoverImage] = useState(defaultValues.coverImage ?? "");
  const [content, setContent] = useState(defaultValues.content ?? "");
  const [slugEdited, setSlugEdited] = useState(!!defaultValues.slug);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!slugEdited) setSlug(slugify(v));
  }

  function handleSubmit(actionType: "draft" | "publish") {
    setError(null);
    setSuccess(null);
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
      try {
        const result = await action(fd);
        if (result?.error) {
          setError(result.error);
          setPendingAction(null);
        } else if (result?.success) {
          setSuccess(
            actionType === "publish"
              ? "Bài viết đã được xuất bản!"
              : "Bài viết đã được lưu!"
          );
          setPendingAction(null);
        }
      } catch {
        setError("Có lỗi xảy ra. Vui lòng thử lại.");
        setPendingAction(null);
      }
    });
  }

  return (
    <>
      <div className="flex gap-6 h-full overflow-y-auto">
        {/* ── Left: Content Editor ──────────────────────────── */}
        <div className="flex flex-col gap-5 flex-1 overflow-visible">
          {/* Title - Editable Inline */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Tiêu đề bài viết..."
              className="w-full text-3xl font-bold text-slate-900 focus:outline-none placeholder:text-slate-300 border-b-2 border-transparent hover:border-slate-200 focus:border-violet-500 pb-3 transition-colors"
            />
          </div>

          {/* Content Editor */}
          <div className="flex-1 flex flex-col overflow-visible">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
              Nội dung *
            </label>
            <div className="flex-1 overflow-y-auto">
              <NovelEditor
                initialContent={defaultValues.content}
                onChange={setContent}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-100 sticky bottom-0 bg-white py-4">
            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              disabled={isPending}
              className="px-5 py-2.5 text-sm font-medium border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 text-slate-600"
            >
              {isPending && pendingAction === "draft"
                ? "Đang lưu..."
                : "Lưu nháp"}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("publish")}
              disabled={isPending}
              className="px-5 py-2.5 text-sm font-medium bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 shadow-sm shadow-violet-200"
            >
              {isPending && pendingAction === "publish"
                ? "Đang đăng..."
                : "Publish"}
            </button>

            <button
              type="button"
              onClick={() => setShowMetadata(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600"
            >
              <span>⚙️</span>
              Metadata
            </button>

            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`ml-auto flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                showPreview
                  ? "bg-violet-50 text-violet-700 border border-violet-200"
                  : "border border-slate-200 text-slate-500 hover:bg-white"
              }`}
            >
              <span>👁</span>
              {showPreview ? "Ẩn preview" : "Preview"}
            </button>

            <a
              href="/admin/dashboard"
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors ml-2"
            >
              Hủy
            </a>
          </div>
        </div>
      </div>

      {/* ── Fullscreen Preview Modal ────────────────────────── */}
      {showPreview && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowPreview(false)}
          />

          {/* Preview Panel - Full Width */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
            <div className="w-full h-full bg-white rounded-2xl shadow-2xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
                <span className="text-sm font-semibold text-slate-700">
                  📄 Preview Bài Viết
                </span>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl leading-none transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <PostPreview
                  title={title}
                  excerpt={excerpt}
                  tags={tags}
                  coverImage={coverImage}
                  content={content}
                  profile={profile}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Metadata Modal ────────────────────────────────── */}
      <MetadataModal
        isOpen={showMetadata}
        onClose={() => setShowMetadata(false)}
        slug={slug}
        onSlugChange={setSlug}
        excerpt={excerpt}
        onExcerptChange={setExcerpt}
        tags={tags}
        onTagsChange={setTags}
        coverImage={coverImage}
        onCoverImageChange={setCoverImage}
        onSlugEdited={() => setSlugEdited(true)}
      />

      <ErrorNotification message={error} onDismiss={() => setError(null)} />
      <SuccessNotification
        message={success}
        onDismiss={() => setSuccess(null)}
      />
    </>
  );
}

