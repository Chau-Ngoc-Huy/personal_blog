"use client";

import { useState, useEffect } from "react";
import { getAllTags } from "@/lib/actions/tags";
import TagsList from "@/components/admin/TagsList";

interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
  _count?: {
    posts: number;
  };
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTags();
  }, []);

  async function loadTags() {
    setLoading(true);
    const result = await getAllTags();
    if (result.success) {
      setTags(result.tags);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-20 text-slate-400">
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-slate-500">Quản lý các tags/chủ đề của blog</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-8">
        <TagsList tags={tags} onUpdate={loadTags} />
      </div>
    </div>
  );
}
