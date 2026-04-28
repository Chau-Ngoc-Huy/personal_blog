import { notFound } from "next/navigation";
import { getPostById, updatePost } from "@/lib/actions/posts";
import { getProfile } from "@/lib/actions/profile";
import PostForm from "@/components/admin/PostForm";

interface Props { params: { id: string } }

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: Props) {
  const id = params.id;
  const [post, profile] = await Promise.all([
    getPostById(id),
    getProfile(),
  ]);
  
  if (!post) notFound();

  async function update(formData: FormData) {
    "use server";
    return updatePost(id, formData);
  }

  return (
    <div className="p-8 h-screen flex flex-col">
      <div className="mb-8 shrink-0">
        <h1 className="text-2xl font-bold text-slate-900">Edit Post</h1>
        <p className="text-sm text-slate-400 mt-0.5 truncate max-w-md">{post.title}</p>
      </div>
      <div className="flex-1 flex overflow-y-auto">
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
          profile={profile}
        />
      </div>
    </div>
  );
}

