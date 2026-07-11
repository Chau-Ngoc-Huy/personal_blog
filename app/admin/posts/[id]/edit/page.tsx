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
  );
}

