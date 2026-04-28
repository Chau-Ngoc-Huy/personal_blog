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
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
          <h2 className="text-lg font-semibold text-slate-900">Post Metadata</h2>
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
              Summary
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => onExcerptChange(e.target.value)}
              rows={3}
              placeholder="Short summary shown on the homepage..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none bg-white"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Tags
            </label>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition-colors"
                    title="Remove tag"
                  >
                    <span>{tag}</span>
                    <span aria-hidden="true">×</span>
                  </button>
                ))}
              </div>
            )}

            <div className="border border-slate-200 rounded-xl bg-white">
              <div className="max-h-56 overflow-y-auto p-3 space-y-2">
                {loadingTags ? (
                  <p className="text-sm text-slate-400 px-1 py-2">
                    Loading tags...
                  </p>
                ) : tagOptions.length > 0 ? (
                  tagOptions.map((tag) => {
                    const checked = selectedTags.includes(tag.name);

                    return (
                      <label
                        key={tag.id}
                        className={`flex items-center gap-3 rounded-lg border px-3 py-2 cursor-pointer transition-colors ${
                          checked
                            ? "border-violet-200 bg-violet-50"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleTag(tag.name)}
                          className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                        />
                        <span
                          className="h-3 w-3 rounded-full border border-slate-200 shrink-0"
                          style={{ backgroundColor: tag.color || "#cbd5e1" }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-slate-800 truncate">
                            {tag.name}
                          </div>
                          <div className="text-xs text-slate-400 truncate">
                            {tag.slug}
                          </div>
                        </div>
                      </label>
                    );
                  })
                ) : (
                  <div className="px-1 py-2 space-y-2">
                    <p className="text-sm text-slate-400">
                      No tags available.
                    </p>
                    <p className="text-xs text-slate-400">
                      Create tags in the tag manager and come back here.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {tagsError && (
              <p className="text-xs text-amber-600 mt-1.5">{tagsError}</p>
            )}

            <p className="text-xs text-slate-400 mt-1.5">
              Select multiple tags from the list. The value is still stored as a comma-separated string.
            </p>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Cover image (URL)
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
                {!coverImageError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverImage}
                    alt="preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={() => setCoverImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center px-4 text-center">
                    <p className="text-sm font-medium text-slate-500">
                      Could not load the image from this URL.
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      The host may be blocking hotlinking or the image may have expired.
                    </p>
                  </div>
                )}
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
            Close
          </button>
        </div>
      </div>
    </>
  );
}
