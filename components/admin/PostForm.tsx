"use client";

import { useState, useTransition, useMemo, useRef } from "react";
import { slugify, extractHeadings } from "@/lib/utils";
import dynamic from "next/dynamic";
import { ErrorNotification, SuccessNotification } from "../ErrorNotification";
import MetadataModal from "./MetadataModal";
import PostPreview from "./PostPreview";
import EditorToc from "./EditorToc";
import { ActionResponse } from "@/lib/error-handler";
import { getProfile } from "@/lib/actions/profile";

const NovelEditor = dynamic(() => import("./NovelEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-xl border border-[#E6EAEA] bg-[#F5F7F7] text-sm text-[#8C9496]">
      Đang tải trình soạn thảo…
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

function countWords(html: string, title: string) {
  const text = `${title} ${html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ")}`;
  return text.trim().split(/\s+/).filter(Boolean).length;
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
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [showMetadata, setShowMetadata] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const published = defaultValues.status === "published";
  const words = countWords(content, title);
  const headings = useMemo(() => extractHeadings(content), [content]);
  const editorColRef = useRef<HTMLDivElement>(null);
  const initials =
    (profile?.displayName ?? "")
      .split(" ")
      .map((w) => w.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "·";

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
          setSuccess(actionType === "publish" ? "Đã đăng bài!" : "Đã lưu bài!");
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
      {/* ── Top bar (fixed 60px tall so the editor toolbar can stick right below) ── */}
      <header className="sticky top-0 z-40 border-b border-[#ECEFEF] bg-white/[0.86] backdrop-blur-[12px]">
        <div className="mx-auto flex h-[60px] max-w-[1100px] items-center gap-3.5 px-[clamp(16px,4vw,40px)]">
          <span className="text-sm text-[#8C9496]">{published ? "Đã đăng" : "Bản nháp"}</span>

          <div className="ml-auto flex items-center gap-3.5">
            <button
              type="button"
              onClick={() => setShowMetadata(true)}
              className="inline-flex items-center gap-2 rounded-[8px] border border-[#E6EAEA] px-3.5 py-2 text-[13px] font-medium text-[#586063] transition-colors hover:bg-[#F5F7F7]"
            >
              <span>⚙</span> <span className="hidden sm:inline">Thông tin</span>
            </button>

            {/* Segmented toggle */}
            <div className="flex rounded-full border border-[#ECEFEF] bg-[#F2F4F4] p-[3px]">
              <button
                type="button"
                onClick={() => setMode("edit")}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  mode === "edit"
                    ? "bg-white text-[#14181A] shadow-[0_1px_2px_rgba(20,24,26,0.06)]"
                    : "text-[#586063] hover:text-[#14181A]"
                }`}
              >
                Soạn thảo
              </button>
              <button
                type="button"
                onClick={() => setMode("preview")}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  mode === "preview"
                    ? "bg-white text-[#14181A] shadow-[0_1px_2px_rgba(20,24,26,0.06)]"
                    : "text-[#586063] hover:text-[#14181A]"
                }`}
              >
                Xem trước
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              disabled={isPending}
              className="hidden rounded-[8px] border border-[#E6EAEA] px-4 py-2 text-[13px] font-medium text-[#586063] transition-colors hover:bg-[#F5F7F7] disabled:opacity-50 sm:block"
            >
              {isPending && pendingAction === "draft" ? "Đang lưu…" : "Lưu nháp"}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("publish")}
              disabled={isPending}
              className="rounded-[8px] bg-[var(--ac)] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[var(--ac-dark)] disabled:opacity-50"
            >
              {isPending && pendingAction === "publish" ? "Đang đăng…" : "Đăng bài"}
            </button>
          </div>
        </div>
      </header>

      {/* ── Edit mode ───────────────────────────────────── */}
      {mode === "edit" && (
        <main className="mx-auto max-w-[1120px] px-[clamp(16px,4vw,28px)] pb-[140px] pt-[clamp(32px,5vw,64px)]">
          <div className="flex flex-col items-start gap-10 xl:flex-row xl:gap-14">
            {/* TOC — mirrors the public post layout */}
            <EditorToc headings={headings} containerRef={editorColRef} />

            {/* Editor column */}
            <div ref={editorColRef} className="w-full min-w-0 xl:flex-1">
              <div className="mx-auto max-w-[760px] xl:mx-0">
          {/* Cover */}
          <div className="mb-7">
            {coverImage ? (
              <div>
                <div className="relative aspect-[16/7] w-full max-w-[420px] overflow-hidden rounded-[16px] border border-[#E6EAEA] shadow-card-lift">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverImage} alt="Ảnh bìa" className="absolute inset-0 h-full w-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="mt-3.5 flex items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => setShowMetadata(true)}
                    className="rounded-[8px] border border-[#E6EAEA] bg-white px-3.5 py-2 text-[13px] text-[#586063] transition-colors hover:border-[#C8CFCF]"
                  >
                    Đổi ảnh
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="px-1 py-2 text-[13px] text-[#C0584F] transition-colors hover:underline"
                  >
                    Xoá ảnh
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowMetadata(true)}
                className="flex aspect-[16/6] w-full max-w-[380px] items-center justify-center gap-2.5 rounded-[14px] border border-dashed border-[#CFD6D6] text-sm text-[#8C9496] transition-colors hover:border-[var(--ac)] hover:text-[var(--ac-dark)]"
                style={{ background: "repeating-linear-gradient(135deg,#F7F9F9,#F7F9F9 10px,#F1F4F4 10px,#F1F4F4 20px)" }}
              >
                <span className="text-lg leading-none">＋</span> Chọn ảnh bìa
              </button>
            )}
          </div>

          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Tiêu đề không tên"
            className="w-full border-none bg-transparent font-heading text-[clamp(30px,4.4vw,46px)] font-semibold leading-[1.1] tracking-[-0.025em] text-[#14181A] caret-[var(--ac)] placeholder:text-[#B8C0C0] focus:outline-none"
          />

          {/* Excerpt / summary */}
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            placeholder="Viết đoạn tóm tắt ngắn hiển thị ở trang chủ…"
            className="mt-3.5 w-full resize-none border-none bg-transparent text-[clamp(16px,2vw,19px)] leading-[1.55] text-[#586063] caret-[var(--ac)] placeholder:text-[#B8C0C0] focus:outline-none"
          />

          {/* Author meta */}
          <div className="mb-3.5 mt-3 flex items-center gap-3 border-b border-[#F0F3F3] pb-[18px] text-[13px] text-[#8C9496]">
            <span className="inline-flex items-center gap-2">
              <span className="relative inline-block h-6 w-6 flex-none">
                {profile?.avatar ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={profile.avatar} alt={profile.displayName} className="absolute inset-0 h-full w-full rounded-full object-cover" />
                  </>
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-[var(--ac)] font-heading text-[9px] font-semibold text-white">
                    {initials}
                  </span>
                )}
              </span>
              <span className="text-[#14181A]">{profile?.displayName ?? "Tác giả"}</span>
            </span>
            <span className="text-[#C8CFCF]">·</span>
            <span>{words} từ</span>
          </div>

          {/* Content editor */}
          <NovelEditor initialContent={defaultValues.content} onChange={setContent} />
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ── Preview mode (inline full article) ──────────── */}
      {mode === "preview" && (
        <div>
          <PostPreview
            title={title}
            excerpt={excerpt}
            tags={tags}
            coverImage={coverImage}
            content={content}
            profile={profile}
          />

          {/* Floating preview control */}
          <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-[#14181A] py-2 pl-[18px] pr-2 text-white shadow-[0_12px_36px_rgba(20,24,26,0.22)]">
            <span className="inline-flex items-center gap-2 whitespace-nowrap text-[13px]">
              <span className="h-[7px] w-[7px] rounded-full bg-[#5FD0A8]" />
              Đang xem trước
            </span>
            <button
              type="button"
              onClick={() => setMode("edit")}
              className="rounded-full bg-white/[0.14] px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-white/[0.24]"
            >
              ← Soạn thảo
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("publish")}
              disabled={isPending}
              className="rounded-full bg-[var(--ac)] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[var(--ac-dark)] disabled:opacity-50"
            >
              {isPending && pendingAction === "publish" ? "Đang đăng…" : "Đăng bài"}
            </button>
          </div>
        </div>
      )}

      {/* ── Metadata Modal ──────────────────────────────── */}
      <MetadataModal
        isOpen={showMetadata}
        onClose={() => setShowMetadata(false)}
        slug={slug}
        onSlugChange={setSlug}
        tags={tags}
        onTagsChange={setTags}
        coverImage={coverImage}
        onCoverImageChange={setCoverImage}
        onSlugEdited={() => setSlugEdited(true)}
      />

      <ErrorNotification message={error} onDismiss={() => setError(null)} />
      <SuccessNotification message={success} onDismiss={() => setSuccess(null)} />
    </>
  );
}
