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
    if (!confirm(`Delete tag "${tag.name}"?`)) return;

    setDeleting(tag.id);
    setError("");

    try {
      const result = await deleteTag(tag.id);
      if (result.success) {
        onUpdate();
      } else {
        setError(result.error || "Delete failed");
      }
    } catch {
      setError("Error deleting tag");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Tags</h2>
        <button
          onClick={() => {
            setSelectedTag(null);
            setIsDialogOpen(true);
          }}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
            + New Tag
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Empty state */}
      {tags.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-slate-400">No tags yet</p>
        </div>
      )}

      {/* Table */}
      {tags.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                  Color
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">
                  Posts
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                <tr key={tag.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                    {tag.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <code className="px-2 py-1 bg-slate-100 rounded text-xs">
                      {tag.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {tag.color && (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-slate-200"
                          style={{ backgroundColor: tag.color }}
                        />
                        <code className="text-xs text-slate-600">{tag.color}</code>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {tag._count?.posts || 0}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedTag(tag);
                          setIsDialogOpen(true);
                        }}
                        className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tag)}
                        disabled={deleting === tag.id}
                        className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
