import { getAllPostsForAdmin } from "@/lib/actions/posts";
import PostsManager from "@/components/admin/PostsManager";

export const revalidate = 0;

export default async function DashboardPage() {
  const posts = await getAllPostsForAdmin();
  return <PostsManager posts={posts} />;
}
