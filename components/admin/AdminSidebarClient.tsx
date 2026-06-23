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
      className={`hidden md:flex shrink-0 flex-col gap-4 overflow-y-auto border-r border-[#ECEFEF] bg-white px-3.5 py-5 transition-all duration-300 ${
        isOpen ? "w-[272px]" : "w-20"
      }`}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-2 py-1">
        <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-[var(--ac)]" />
        {isOpen && (
          <>
            <span className="truncate font-heading text-[16px] font-semibold tracking-[-0.01em] text-[#14181A]">
              {profile.displayName}
            </span>
            <span className="ml-auto shrink-0 rounded-full border border-[#ECEFEF] bg-[#F5F7F7] px-[7px] py-0.5 text-[10px] font-semibold tracking-[0.08em] text-[#8C9496]">
              ADMIN
            </span>
          </>
        )}
      </div>

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
