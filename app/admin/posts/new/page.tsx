import { createPost } from "@/lib/actions/posts";
import { getProfile } from "@/lib/actions/profile";
import PostForm from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const profile = await getProfile();
  return <PostForm action={createPost} profile={profile} />;
}
