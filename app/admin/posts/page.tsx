import { getAllPostsForAdmin } from "@/lib/actions/posts";
import PostsManager from "@/components/admin/PostsManager";

export const revalidate = 0;

export default async function PostsPage() {
  const posts = await getAllPostsForAdmin();
  return <PostsManager posts={posts} />;
}
