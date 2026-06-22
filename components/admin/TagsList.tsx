"use client";

import { useState } from "react";
import TagDialog from "./TagDialog";
import { deleteTag } from "@/lib/actions/tags";

interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  _count?: {
    posts: number;
  };
}

interface TagsListProps {
  tags: Tag[];
  onUpdate: () => void;
}

export default function TagsList({ tags, onUpdate }: TagsListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleDelete(tag: Tag) {
    if (!confirm(`Xoá chủ đề "${tag.name}"?`)) return;

    setDeleting(tag.id);
    setError("");

    try {
      const result = await deleteTag(tag.id);
      if (result.success) {
        onUpdate();
      } else {
        setError(result.error || "Xoá thất bại");
      }
    } catch {
      setError("Lỗi khi xoá chủ đề");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-[clamp(24px,3vw,32px)] font-semibold tracking-[-0.02em] text-[#14181A]">Chủ đề</h1>
          <p className="mt-1.5 text-sm text-[#8C9496]">Phân loại bài viết theo chủ đề.</p>
        </div>
        <button
          onClick={() => {
            setSelectedTag(null);
            setIsDialogOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-[8px] border border-[#E6EAEA] bg-white px-4 py-2.5 text-sm font-medium text-[#14181A] transition-colors hover:border-[var(--ac)]"
        >
          <span className="text-base leading-none">＋</span> Thêm chủ đề
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg bg-[#FBECEC] px-3 py-2.5 text-sm text-[#C0584F]">
          {error}
        </div>
      )}

      {/* Empty state */}
      {tags.length === 0 && (
        <div className="rounded-[14px] border border-[#ECEFEF] bg-white py-16 text-center">
          <p className="mb-3 font-mono text-[30px] text-[#A7AFAF]">#</p>
          <p className="text-sm text-[#8C9496]">Chưa có chủ đề nào.</p>
        </div>
      )}

      {/* Grid */}
      {tags.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3.5">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-3 rounded-[12px] border border-[#ECEFEF] bg-white px-[18px] py-4 transition-colors hover:border-[#E0E5E5]"
            >
              <span
                className="h-3 w-3 flex-none rounded-full"
                style={{ backgroundColor: tag.color || "#CBD2D2" }}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-[#14181A]">{tag.name}</div>
                <div className="mt-0.5 text-xs text-[#8C9496]">{tag._count?.posts || 0} bài viết</div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setSelectedTag(tag);
                    setIsDialogOpen(true);
                  }}
                  className="rounded-[7px] px-2.5 py-1.5 text-[13px] font-medium text-[var(--ac-dark)] transition-colors hover:bg-[var(--ac-soft)]"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(tag)}
                  disabled={deleting === tag.id}
                  className="rounded-[7px] px-2.5 py-1.5 text-[13px] font-medium text-[#A7AFAF] transition-colors hover:bg-[#FBECEC] hover:text-[#C0584F] disabled:opacity-50"
                >
                  {deleting === tag.id ? "…" : "Xoá"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <TagDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedTag(null);
        }}
        onSuccess={onUpdate}
        initialData={selectedTag || undefined}
      />
    </div>
  );
}
