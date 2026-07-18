"use client";

import { useState, useTransition, useMemo, useRef } from "react";
import { slugify, extractHeadings } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Editor } from "@tiptap/react";
import { ErrorNotification, SuccessNotification } from "../ErrorNotification";
import MetadataModal from "./MetadataModal";
import PostPreview from "./PostPreview";
import EditorToolbar from "./EditorToolbar";
import TocList from "../public/TocList";
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

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 15l-6-6-6 6" />
  </svg>
);

const OutlineIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3.5" y="4" width="17" height="16" rx="1.5" />
    <path d="M8 9h9M8 12.5h9M8 16h6" />
  </svg>
);


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
  const [headerExpanded, setHeaderExpanded] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [activeHeadingIndex, setActiveHeadingIndex] = useState(0);

  const published = defaultValues.status === "published";
  const words = countWords(content, title);
  const headings = useMemo(() => extractHeadings(content), [content]);
  const editorColRef = useRef<HTMLDivElement>(null);

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!slugEdited) setSlug(slugify(v));
  }

  function handleTocNavigate(index: number) {
    setActiveHeadingIndex(index);
    const heading = headings[index];
    if (!heading) return;
    // Scroll to the heading element in the editor
    const element = editorColRef.current?.querySelector(`h${heading.level}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E6EAEA]">
        {/* Main header row */}
        <div className="flex h-[52px] items-center justify-between px-7">
          {/* Left: Status + Mode toggle */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[13px] font-[600]">
              <span className="w-2 h-2 rounded-full bg-[#178a5e]" />
              <span className={published ? "text-[#178a5e]" : "text-[#8C9496]"}>
                {published ? "Đã đăng" : "Bản nháp"}
              </span>
            </div>

            {/* Tab toggle */}
            <div className="flex gap-0 bg-[#F5F7F7] rounded-[6px] p-[3px]">
              <button
                type="button"
                onClick={() => setMode("edit")}
                className={`px-3 py-1.5 text-[12px] font-[600] rounded-[5px] transition-all ${
                  mode === "edit"
                    ? "bg-white text-[#111]"
                    : "bg-transparent text-[#8C9496] hover:text-[#14181A]"
                }`}
              >
                Soạn thảo
              </button>
              <button
                type="button"
                onClick={() => setMode("preview")}
                className={`px-3 py-1.5 text-[12px] font-[600] rounded-[5px] transition-all ${
                  mode === "preview"
                    ? "bg-white text-[#111]"
                    : "bg-transparent text-[#8C9496] hover:text-[#14181A]"
                }`}
              >
                Xem trước
              </button>
            </div>
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMetadata(true)}
              className="w-8 h-8 flex items-center justify-center rounded-[6px] text-[#8C9496] hover:bg-[#F5F7F7] transition-colors"
              title="Thông tin"
            >
              ⓘ
            </button>

            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              disabled={isPending}
              className="px-3 py-1.5 text-[12px] font-[600] text-[#586063] border border-[#E6EAEA] bg-white rounded-[6px] hover:bg-[#F5F7F7] transition-colors disabled:opacity-50 hidden sm:block"
            >
              {isPending && pendingAction === "draft" ? "Đang lưu…" : "Lưu nháp"}
            </button>

            <button
              type="button"
              onClick={() => handleSubmit("publish")}
              disabled={isPending}
              className="px-3 py-1.5 text-[12px] font-[700] text-white bg-[#178a5e] rounded-[6px] hover:bg-[#136f4b] transition-colors disabled:opacity-50"
            >
              {isPending && pendingAction === "publish" ? "Đang đăng…" : "Đăng bài"}
            </button>
          </div>
        </div>

        {/* Toolbar row - only show in edit mode */}
        {mode === "edit" && (
          <div className="h-[44px] border-t border-[#E6EAEA] flex items-center justify-center">
            <EditorToolbar editor={editor} compact={true} />
          </div>
        )}
      </header>

      {/* ── Edit mode ───────────────────────────────────── */}
      {mode === "edit" && (
        <main className="flex h-[calc(100vh-96px)] overflow-hidden bg-[#F6F5F1]">
          {/* TOC Rail */}
          <div className="w-[52px] flex-none border-r border-[#E6EAEA] bg-[#FBFAF7] flex flex-col items-center pt-4 gap-2">
            <button
              type="button"
              onClick={() => setTocOpen(!tocOpen)}
              className={`w-8 h-8 rounded-md border-none flex items-center justify-center cursor-pointer transition-colors ${
                tocOpen ? "bg-[#F1F1F1]" : "bg-transparent hover:bg-[#F1F1F1]"
              }`}
              title="Outline"
            >
              <OutlineIcon />
            </button>
          </div>

          {/* TOC Sidebar */}
          {tocOpen && (
            <div className="w-[280px] flex-none border-l border-[#E6EAEA] bg-white p-5 overflow-y-auto">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#8C9496]">
                Trong bài viết
              </p>
              {headings.length > 0 ? (
                <nav>
                  <TocList
                    headings={headings}
                    activeIndex={activeHeadingIndex}
                    onNavigate={handleTocNavigate}
                  />
                </nav>
              ) : (
                <div className="text-[13px] text-[#8C9496]">Chưa có tiêu đề</div>
              )}
            </div>
          )}

          {/* Editor column */}
          <div className="flex-1 overflow-y-auto px-6 py-7 pb-20">
            <div className="max-w-[900px] mx-auto">
              <div ref={editorColRef} className="w-full min-w-0">
                {/* Editor Card */}
                <div className="bg-white border border-[#E6EAEA] rounded-[16px] overflow-hidden">
                  {/* Collapsed Header */}
                  {!headerExpanded && (
                    <div
                      onClick={() => setHeaderExpanded(true)}
                      className="flex items-center gap-3 px-5 py-4 cursor-pointer border-b border-[#E6EAEA] hover:bg-[#FBFAF7] transition-colors"
                    >
                      {coverImage && (
                        <img
                          src={coverImage}
                          alt="Cover"
                          className="w-11 h-11 rounded-[9px] object-cover flex-none"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-[15px] font-[700] whitespace-nowrap overflow-hidden text-ellipsis">
                          {title || "Tiêu đề không tên"}
                        </div>
                        <div className="text-[12px] text-[#8C9496] mt-0.5">
                          Bìa & tiêu đề · nhấn để chỉnh sửa
                        </div>
                      </div>
                      <ChevronDownIcon />
                    </div>
                  )}

                  {/* Expanded Header */}
                  {headerExpanded && (
                    <div className="px-6 py-6 pb-1.5 border-b border-[#E6EAEA]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-[11px] font-[700] letter-spacing-[0.05em] text-[#8C9496] uppercase">
                          BỊA & TIÊU ĐỀ
                        </div>
                        <button
                          type="button"
                          onClick={() => setHeaderExpanded(false)}
                          className="border-none bg-none text-[#8C9496] text-[12.5px] font-[600] cursor-pointer flex items-center gap-1 hover:text-[#178a5e] transition-colors"
                        >
                          Thu gọn
                          <ChevronUpIcon />
                        </button>
                      </div>

                      <div className="flex gap-4 mb-4">
                        {coverImage ? (
                          <div className="relative w-[180px] h-[120px] rounded-[10px] overflow-hidden flex-none">
                            <img
                              src={coverImage}
                              alt="Ảnh bìa"
                              className="absolute inset-0 w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowMetadata(true)}
                            className="w-[180px] h-[120px] rounded-[10px] border border-dashed border-[#CFD6D6] flex items-center justify-center text-sm text-[#8C9496] hover:border-[#178a5e] hover:text-[#178a5e] transition-colors flex-none"
                            style={{ background: "repeating-linear-gradient(135deg,#F7F9F9,#F7F9F9 10px,#F1F4F4 10px,#F1F4F4 20px)" }}
                          >
                            <span className="text-center">
                              <div className="text-lg">＋</div>
                              <div>Chọn ảnh</div>
                            </span>
                          </button>
                        )}

                        <div className="flex flex-col justify-center gap-2">
                          {coverImage && (
                            <>
                              <button
                                type="button"
                                onClick={() => setShowMetadata(true)}
                                className="border border-[#D7CBBD] bg-white px-4 py-2 text-[12.5px] font-[600] rounded-[8px] hover:bg-[#F5F4EF] transition-colors"
                              >
                                Đổi ảnh
                              </button>
                              <button
                                type="button"
                                onClick={() => setCoverImage("")}
                                className="border-none bg-none text-[#B5502E] text-[12.5px] font-[600] cursor-pointer hover:text-[#A0432A] transition-colors"
                              >
                                Xoá ảnh
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <input
                        type="text"
                        value={title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Tiêu đề không tên"
                        className="w-full border-none outline-none text-[28px] font-[800] font-serif px-0 pb-2 bg-transparent text-[#14181A] caret-[#178a5e] placeholder:text-[#B8C0C0] focus:outline-none"
                      />

                      <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        rows={2}
                        placeholder="Viết đoạn tóm tắt ngắn hiển thị ở trang chủ…"
                        className="w-full border-none outline-none resize-none text-[14.5px] leading-[1.6] text-[#8C9496] bg-transparent caret-[#178a5e] placeholder:text-[#B8C0C0] focus:outline-none"
                      />
                    </div>
                  )}

                  {/* Meta Row */}
                  <div className="flex items-center px-6 py-3 text-[12.5px] text-[#8C9496] border-b border-[#E6EAEA] font-[500]">
                    {words} từ
                  </div>

                  {/* Content */}
                  <div className="px-6 py-8">
                    <NovelEditor initialContent={defaultValues.content} onChange={setContent} onEditorReady={setEditor} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ── Preview mode ──────────── */}
      {mode === "preview" && (
        <PostPreview
          title={title}
          excerpt={excerpt}
          tags={tags}
          coverImage={coverImage}
          content={content}
          profile={profile}
        />
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
