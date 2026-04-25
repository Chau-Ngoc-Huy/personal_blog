"use client";

import { deletePost } from "@/lib/actions/posts";

interface Props {
  id: number;
  title: string;
}

export default function DeleteButton({ id, title }: Props) {
  async function handleDelete() {
    if (!confirm(`Xóa bài "${title}"? Hành động này không thể hoàn tác.`)) return;
    await deletePost(id);
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700 transition-colors"
    >
      Xóa
    </button>
  );
}
