"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/auth";

const navItems = [
  { href: "/admin/dashboard", label: "Tổng quan", icon: "▣" },
  { href: "/admin/posts",     label: "Bài viết",  icon: "▤" },
  { href: "/admin/tags",      label: "Chủ đề",    icon: "#" },
];

export default function AdminNav({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin/posts")
      return pathname === "/admin/posts" || pathname.startsWith("/admin/posts/");
    return pathname === href;
  }

  return (
    <>
      <div className="flex-1">
        {!isCollapsed && (
          <div className="px-2 pb-2.5 text-[11px] uppercase tracking-[0.12em] text-[#B8C0C0]">
            Quản lý
          </div>
        )}
        <nav className="space-y-[3px]">
          {navItems.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              title={isCollapsed ? label : undefined}
              className={`flex items-center gap-3 rounded-[9px] px-3 py-2.5 text-sm transition-colors duration-150 ${
                isActive(href)
                  ? "bg-[var(--ac-soft)] font-medium text-[var(--ac-dark)]"
                  : "text-[#586063] hover:bg-[#F5F7F7] hover:text-[#14181A]"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <span className="w-[18px] flex-shrink-0 text-center font-mono text-[14px]">{icon}</span>
              {!isCollapsed && <span>{label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto space-y-0.5 border-t border-[#F0F3F3] pt-2.5">
        <Link
          href="/"
          target="_blank"
          title={isCollapsed ? "Xem trang" : undefined}
          className={`flex items-center gap-3 rounded-[9px] px-3 py-2 text-sm text-[#586063] transition-colors hover:bg-[#F5F7F7] ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <span className="w-[18px] flex-shrink-0 text-center font-mono text-[13px]">↗</span>
          {!isCollapsed && <span>Xem trang</span>}
        </Link>
        <form action={logout}>
          <button
            type="submit"
            title={isCollapsed ? "Đăng xuất" : undefined}
            className={`flex w-full items-center gap-3 rounded-[9px] px-3 py-2 text-sm text-[#8C9496] transition-colors hover:bg-[#FBECEC] hover:text-[#C0584F] ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <span className="w-[18px] flex-shrink-0 text-center font-mono text-[13px]">⎋</span>
            {!isCollapsed && <span>Đăng xuất</span>}
          </button>
        </form>
      </div>
    </>
  );
}
