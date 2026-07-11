"use client";

import { useEffect, useMemo, useState } from "react";
import { slugify } from "@/lib/utils";
import { getAllTags } from "@/lib/actions/tags";

interface TagOption {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
}

interface MetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  onSlugChange: (slug: string) => void;
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
  tags,
  onTagsChange,
  coverImage,
  onCoverImageChange,
  onSlugEdited,
}: MetadataModalProps) {
  const [tagOptions, setTagOptions] = useState<TagOption[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [tagsError, setTagsError] = useState("");
  const [coverImageError, setCoverImageError] = useState(false);

  const selectedTags = useMemo(
    () =>
      tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tags]
  );

  useEffect(() => {
    if (!isOpen) return;

    let active = true;

    async function loadTags() {
      setLoadingTags(true);
      setTagsError("");

      try {
        const result = await getAllTags();
        if (!active) return;

        if (result.success) {
          setTagOptions(result.tags);
        } else {
          setTagOptions([]);
          setTagsError(result.error || "Failed to load tags");
        }
      } catch {
        if (!active) return;
        setTagOptions([]);
        setTagsError("Failed to load tags");
      } finally {
        if (active) {
          setLoadingTags(false);
        }
      }
    }

    loadTags();

    return () => {
      active = false;
    };
  }, [isOpen]);

  useEffect(() => {
    setCoverImageError(false);
  }, [coverImage]);

  const updateSelectedTags = (nextTags: string[]) => {
    onTagsChange(nextTags.join(", "));
  };

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      updateSelectedTags(selectedTags.filter((tag) => tag !== tagName));
      return;
    }

    updateSelectedTags([...selectedTags, tagName]);
  };

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
      <div className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl border-b border-[#ECEFEF] bg-[#F5F7F7] px-8 py-5">
          <h2 className="font-heading text-lg font-semibold text-[#14181A]">Thông tin bài viết</h2>
          <button
            onClick={onClose}
            className="text-2xl leading-none text-[#8C9496] hover:text-[#14181A]"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5 overflow-y-auto px-8 py-6">
          {/* Slug */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8C9496]">
              Đường dẫn (slug) *
            </label>
            <div className="flex items-center overflow-hidden rounded-[8px] border border-[#E6EAEA] bg-white focus-within:border-[var(--ac)] focus-within:ring-[3px] focus-within:ring-[var(--ac-soft)]">
              <span className="shrink-0 border-r border-[#E6EAEA] bg-[#F5F7F7] px-3 py-3 text-sm text-[#8C9496]">
                /
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="duong-dan-bai-viet"
                className="flex-1 px-3 py-3 font-mono text-sm text-[#14181A] focus:outline-none"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8C9496]">
              Chủ đề
            </label>

            {selectedTags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--ac-border)] bg-[var(--ac-soft)] px-3 py-1.5 text-xs font-medium text-[var(--ac-dark)] transition-colors hover:bg-[#E1EFE8]"
                    title="Bỏ chủ đề"
                  >
                    <span>{tag}</span>
                    <span aria-hidden="true">×</span>
                  </button>
                ))}
              </div>
            )}

            <div className="rounded-[8px] border border-[#E6EAEA] bg-white">
              <div className="max-h-56 space-y-2 overflow-y-auto p-3">
                {loadingTags ? (
                  <p className="px-1 py-2 text-sm text-[#8C9496]">
                    Đang tải chủ đề…
                  </p>
                ) : tagOptions.length > 0 ? (
                  tagOptions.map((tag) => {
                    const checked = selectedTags.includes(tag.name);

                    return (
                      <label
                        key={tag.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
                          checked
                            ? "border-[var(--ac-border)] bg-[var(--ac-soft)]"
                            : "border-[#E6EAEA] hover:border-[#C8CFCF] hover:bg-[#F5F7F7]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleTag(tag.name)}
                          className="h-4 w-4 rounded border-[#C8CFCF] text-[var(--ac)] focus:ring-[var(--ac)]"
                        />
                        <span
                          className="h-3 w-3 shrink-0 rounded-full border border-[#E6EAEA]"
                          style={{ backgroundColor: tag.color || "#CBD2D2" }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-[#14181A]">
                            {tag.name}
                          </div>
                          <div className="truncate text-xs text-[#8C9496]">
                            {tag.slug}
                          </div>
                        </div>
                      </label>
                    );
                  })
                ) : (
                  <div className="space-y-2 px-1 py-2">
                    <p className="text-sm text-[#8C9496]">
                      Chưa có chủ đề nào.
                    </p>
                    <p className="text-xs text-[#B8C0C0]">
                      Tạo chủ đề trong mục Chủ đề rồi quay lại đây.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {tagsError && (
              <p className="mt-1.5 text-xs text-[#B98900]">{tagsError}</p>
            )}

            <p className="mt-1.5 text-xs text-[#8C9496]">
              Chọn nhiều chủ đề từ danh sách. Giá trị vẫn được lưu dưới dạng chuỗi ngăn cách bằng dấu phẩy.
            </p>
          </div>

          {/* Cover Image */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#8C9496]">
              Ảnh bìa (URL)
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => onCoverImageChange(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-[8px] border border-[#E6EAEA] bg-white px-4 py-3 text-sm text-[#14181A] placeholder:text-[#B8C0C0] focus:border-[var(--ac)] focus:outline-none focus:ring-[3px] focus:ring-[var(--ac-soft)]"
            />
            {coverImage && (
              <div className="mt-3 aspect-video overflow-hidden rounded-[12px] bg-[#F5F7F7]">
                {!coverImageError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverImage}
                    alt="preview"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                    onError={() => setCoverImageError(true)}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center px-4 text-center">
                    <p className="text-sm font-medium text-[#586063]">
                      Không tải được ảnh từ đường dẫn này.
                    </p>
                    <p className="mt-1 text-xs text-[#8C9496]">
                      Máy chủ ảnh có thể chặn liên kết ngoài hoặc ảnh đã hết hạn.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 rounded-b-2xl border-t border-[#ECEFEF] bg-[#F5F7F7] px-8 py-4">
          <button
            onClick={onClose}
            className="rounded-[8px] border border-[#E6EAEA] bg-white px-5 py-2.5 text-sm font-medium text-[#586063] transition-colors hover:border-[#C8CFCF]"
          >
            Đóng
          </button>
        </div>
      </div>
    </>
  );
}
