import Link from "next/link";
import { getAllPostsForAdmin } from "@/lib/actions/posts";
import { getProfile } from "@/lib/actions/profile";
import AdminSidebarClient from "./AdminSidebarClient";
import AdminNav from "./AdminNav";
import ProfileSidebarCard from "./ProfileSidebarCard";

export default async function AdminShell({ children }: { children: React.ReactNode }) {
  const [posts, profile] = await Promise.all([
    getAllPostsForAdmin(),
    getProfile(),
  ]);
  const published = posts.filter(p => p.status === "published").length;
  const drafts    = posts.filter(p => p.status === "draft").length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* ── Sidebar (Client Component for Collapse) ──────── */}
      <AdminSidebarClient profile={profile} stats={{ total: posts.length, published, drafts }} />

      {/* ── Main content ─────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
