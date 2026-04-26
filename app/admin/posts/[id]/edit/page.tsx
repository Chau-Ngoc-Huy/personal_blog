import { notFound } from "next/navigation";
import { getPostById, updatePost } from "@/lib/actions/posts";
import AdminShell from "@/components/admin/AdminShell";
import PostForm from "@/components/admin/PostForm";

interface Props { params: { id: string } }

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: Props) {
  const id = params.id;
  const post = await getPostById(id);
  if (!post) notFound();

  async function update(formData: FormData) {
    "use server";
    return updatePost(id, formData);
  }

  return (
    <AdminShell>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Sửa bài viết</h1>
          <p className="text-sm text-slate-400 mt-0.5 truncate max-w-md">{post.title}</p>
        </div>
        <PostForm
          action={update}
          defaultValues={{
            title:      post.title,
            slug:       post.slug,
            excerpt:    post.excerpt ?? "",
            content:    post.content,
            tags:       post.tags?.map(t => t.name).join(", ") ?? "",
            coverImage: post.coverImage ?? "",
            status:     post.status,
          }}
        />
      </div>
    </AdminShell>
  );
}
