"use client";

import { slugify } from "@/lib/utils";

interface MetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  onSlugChange: (slug: string) => void;
  excerpt: string;
  onExcerptChange: (excerpt: string) => void;
  tags: string;
  onTagsChange: (tags: string) => void;
  coverImage: string;
  onCoverImageChange: (coverImage: string) => void;
  onSlugEdited: () => void;
}

export default function MetadataModal({
  isOpen,
  onClose,
  slug,
  onSlugChange,
  excerpt,
  onExcerptChange,
  tags,
  onTagsChange,
  coverImage,
  onCoverImageChange,
  onSlugEdited,
}: MetadataModalProps) {
  if (!isOpen) return null;

  const handleSlugChange = (value: string) => {
    onSlugEdited();
    onSlugChange(slugify(value));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
          <h2 className="text-lg font-semibold text-slate-900">Metadata Bài Viết</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
          {/* Slug */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Slug *
            </label>
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-violet-500 bg-white">
              <span className="px-3 py-3 bg-slate-50 text-slate-400 text-sm border-r border-slate-200 shrink-0">
                /
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="duong-dan-bai-viet"
                className="flex-1 px-3 py-3 text-sm font-mono text-slate-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Tóm tắt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => onExcerptChange(e.target.value)}
              rows={3}
              placeholder="Đoạn mô tả ngắn hiển thị ngoài trang chủ..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none bg-white"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => onTagsChange(e.target.value)}
              placeholder="tech, life, travel"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            />
            <p className="text-xs text-slate-400 mt-1.5">
              Phân cách bằng dấu phẩy
            </p>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Ảnh bìa (URL)
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => onCoverImageChange(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            />
            {coverImage && (
              <div className="mt-3 rounded-xl overflow-hidden aspect-video bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium border border-slate-200 rounded-xl hover:bg-white transition-colors text-slate-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </>
  );
}
