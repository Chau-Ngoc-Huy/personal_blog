import Link from "next/link";
import { getAllPostsForAdmin } from "@/lib/actions/posts";
import { getProfile } from "@/lib/actions/profile";
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

      {/* ── Sidebar ──────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shrink-0 overflow-hidden">

        {/* Brand */}
        <div className="px-5 py-5 border-b border-slate-100">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              B
            </div>
            <span className="font-semibold text-slate-800 text-sm leading-tight">
              Blog Admin
            </span>
          </Link>
        </div>

        {/* Profile card with edit trigger */}
        <ProfileSidebarCard
          profile={profile}
          stats={{ total: posts.length, published, drafts }}
        />

        {/* Navigation + footer actions (client — usePathname) */}
        <AdminNav />

      </aside>

      {/* ── Main content ─────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
