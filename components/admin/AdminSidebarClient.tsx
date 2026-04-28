"use client";

// import { useState } from "react";
import { getProfile } from "@/lib/actions/profile";
import AdminNav from "./AdminNav";
import ProfileSidebarCard from "./ProfileSidebarCard";

interface AdminSidebarClientProps {
  profile: Awaited<ReturnType<typeof getProfile>>;
  stats: { total: number; published: number; drafts: number };
}

export default function AdminSidebarClient({ profile, stats }: AdminSidebarClientProps) {
  // const [isOpen, setIsOpen] = useState(true);
  const isOpen = true; // Force open for now, as collapse is not fully implemented yet

  return (
    <aside
      className={`bg-white border-r border-slate-100 flex flex-col shrink-0 overflow-hidden transition-all duration-300 ${
        isOpen ? "w-54" : "w-20"
      }`}
    >
      {/* Brand */}
      {/* <div className="px-5 py-5 border-b border-slate-100">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
            B
          </div>
          {isOpen && (
            <span className="font-semibold text-slate-800 text-sm leading-tight">
              Blog Admin
            </span>
          )}
        </Link>
      </div> */}

      {/* Toggle Button */}
      {/* <div className="px-3 py-3 border-b border-slate-100">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center px-3 py-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          title={isOpen ? "Thu gọn" : "Mở rộng"}
        >
          {isOpen ? "◀" : "▶"}
        </button>
      </div> */}

      {/* Profile card with edit trigger */}
      {isOpen && (
        <ProfileSidebarCard
          profile={profile}
          stats={stats}
        />
      )}

      {/* Navigation + footer actions */}
      <AdminNav isCollapsed={!isOpen} />
    </aside>
  );
}
