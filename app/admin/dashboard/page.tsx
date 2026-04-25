import { getAllPostsForAdmin } from "@/lib/actions/posts";
import AdminShell from "@/components/admin/AdminShell";
import PostsManager from "@/components/admin/PostsManager";

export const revalidate = 0;

export default async function DashboardPage() {
  const posts = await getAllPostsForAdmin();

  return (
    <AdminShell active="dashboard">
      <PostsManager posts={posts} />
    </AdminShell>
  );
}
