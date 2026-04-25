import Link from "next/link";
import { logout } from "@/lib/actions/auth";
import { blogConfig } from "@/lib/config";
import { getAllPostsForAdmin } from "@/lib/actions/posts";

interface Props {
  children: React.ReactNode;
  active?: "dashboard" | "new";
}

export default async function AdminShell({ children, active }: Props) {
  const posts = await getAllPostsForAdmin();
  const published = posts.filter(p => p.status === "published").length;
  const drafts = posts.filter(p => p.status === "draft").length;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* ── Sidebar ──────────────────────────────────── */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shrink-0 overflow-y-auto">

        {/* Brand */}
        <div className="px-5 py-5 border-b border-slate-100">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              B
            </div>
            <span className="font-semibold text-slate-800 text-sm leading-tight">
              Blog Admin
            </span>
          </Link>
        </div>

        {/* Profile card */}
        <div className="px-4 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-lg shrink-0 font-semibold">
              {blogConfig.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-sm truncate">{blogConfig.name}</p>
              <p className="text-xs text-slate-400 truncate">{blogConfig.role}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">{blogConfig.bio}</p>

          {/* Stats pills */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: "Tổng", value: posts.length },
              { label: "Đăng", value: published, color: "text-emerald-600" },
              { label: "Nháp", value: drafts, color: "text-amber-500" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-slate-50 rounded-lg py-2 px-1">
                <p className={`text-base font-bold ${color ?? "text-slate-700"}`}>{value}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { href: "/admin/dashboard", label: "Dashboard",  icon: "▦", key: "dashboard" },
            { href: "/admin/posts/new", label: "Bài viết mới", icon: "+", key: "new" },
          ].map(({ href, label, icon, key }) => (
            <Link
              key={key}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active === key
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <span className="text-base w-5 text-center">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        {/* Social links */}
        <div className="px-4 py-3 border-t border-slate-100">
          <div className="flex items-center justify-around mb-3">
            {[
              { href: blogConfig.github,  label: "GH" },
              { href: blogConfig.twitter, label: "TW" },
              { href: `mailto:${blogConfig.email}`, label: "@" },
            ].map(({ href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-500 transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-3 py-4 border-t border-slate-100 space-y-1">
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors">
            <span className="text-base w-5 text-center">↗</span>
            Xem blog
          </Link>
          <form action={logout}>
            <button type="submit"
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
              <span className="text-base w-5 text-center">⎋</span>
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
