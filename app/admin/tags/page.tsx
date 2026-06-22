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
      <div className="mx-auto w-full max-w-[1200px] p-[clamp(24px,3.5vw,40px)]">
        <div className="py-20 text-center text-sm text-[#8C9496]">
          <p>Đang tải…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] p-[clamp(24px,3.5vw,40px)]">
      <TagsList tags={tags} onUpdate={loadTags} />
    </div>
  );
}
