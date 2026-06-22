"use client";

import { useState } from "react";
import { deletePost } from "@/lib/actions/posts";
import { ErrorNotification } from "../ErrorNotification";

interface Props {
  id: string;
  title: string;
}

export default function DeleteButton({ id, title }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Xoá bài viết "${title}"? Hành động này không thể hoàn tác.`)) return;
    setIsDeleting(true);
    setError(null);
    try {
      const result = await deletePost(id);
      if (result?.error) {
        setError(result.error);
        setIsDeleting(false);
      }
    } catch {
      setError("Lỗi khi xoá bài viết. Vui lòng thử lại.");
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-[#C0584F] transition-colors hover:text-[#A23F37] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isDeleting ? "Đang xoá…" : "Xoá"}
      </button>
      <ErrorNotification message={error} onDismiss={() => setError(null)} />
    </>
  );
}
