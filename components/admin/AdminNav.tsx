"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/auth";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard",    icon: "▦" },
  { href: "/admin/posts/new", label: "Bài viết mới", icon: "+" },
  { href: "/admin/tags",      label: "Tags",          icon: "🏷️" },
  { href: "/admin/profile",   label: "Profile",       icon: "👤" },
];

export default function AdminNav({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin/dashboard") return pathname === "/admin/dashboard" || pathname === "/admin";
    if (href === "/admin/posts/new") return pathname.startsWith("/admin/posts");
    return pathname.startsWith(href);
  }

  return (
    <>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            title={isCollapsed ? label : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              isActive(href)
                ? "bg-violet-50 text-violet-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            } ${isCollapsed ? "justify-center" : ""}`}
          >
            <span className="text-base w-5 text-center flex-shrink-0">{icon}</span>
            {!isCollapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-slate-100 space-y-1">
        <Link
          href="/"
          target="_blank"
          title={isCollapsed ? "Xem blog" : undefined}
          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <span className="text-base w-5 text-center flex-shrink-0">↗</span>
          {!isCollapsed && <span>Xem blog</span>}
        </Link>
        <form action={logout}>
          <button
            type="submit"
            title={isCollapsed ? "Đăng xuất" : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <span className="text-base w-5 text-center flex-shrink-0">⎋</span>
            {!isCollapsed && <span>Đăng xuất</span>}
          </button>
        </form>
      </div>
    </>
  );
}
