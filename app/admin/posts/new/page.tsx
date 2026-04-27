import { createPost } from "@/lib/actions/posts";
import PostForm from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Bài viết mới</h1>
        <p className="text-sm text-slate-400 mt-0.5">Tạo và publish bài viết mới</p>
      </div>
      <PostForm action={createPost} />
    </div>
  );
}
