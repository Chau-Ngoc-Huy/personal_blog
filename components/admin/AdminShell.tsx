import dynamic from "next/dynamic";
import { getAllPostsForAdmin } from "@/lib/actions/posts";
import { getProfile } from "@/lib/actions/profile";
import AdminSidebarClient from "./AdminSidebarClient";

const AdminMobileNav = dynamic(() => import("./AdminMobileNav"), { ssr: false });

export default async function AdminShell({ children }: { children: React.ReactNode }) {
  const [posts, profile] = await Promise.all([
    getAllPostsForAdmin(),
    getProfile(),
  ]);
  const published = posts.filter(p => p.status === "published").length;
  const drafts    = posts.filter(p => p.status === "draft").length;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7F7] text-[#14181A]">
      {/* ── Sidebar (hidden on mobile) ──────────────── */}
      <AdminSidebarClient profile={profile} stats={{ total: posts.length, published, drafts }} />

      {/* ── Main content ─────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {children}
      </main>

      {/* ── Bottom nav (mobile only) ─────────────────── */}
      <AdminMobileNav />
    </div>
  );
}
