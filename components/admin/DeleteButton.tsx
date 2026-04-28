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
    if (!confirm(`Delete post "${title}"? This action cannot be undone.`)) return;
    setIsDeleting(true);
    setError(null);
    try {
      const result = await deletePost(id);
      if (result?.error) {
        setError(result.error);
        setIsDeleting(false);
      }
    } catch {
      setError("Error deleting the post. Please try again.");
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
      <ErrorNotification message={error} onDismiss={() => setError(null)} />
    </>
  );
}
