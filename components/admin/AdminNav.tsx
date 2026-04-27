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

export default function AdminNav() {
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
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
              isActive(href)
                ? "bg-violet-50 text-violet-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <span className="text-base w-5 text-center">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-slate-100 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <span className="text-base w-5 text-center">↗</span>
          Xem blog
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <span className="text-base w-5 text-center">⎋</span>
            Đăng xuất
          </button>
        </form>
      </div>
    </>
  );
}
