"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/actions/profile";

interface Profile {
  displayName: string;
  sayHi: string | null;
  bio: string | null;
  avatar: string | null;
  email: string | null;
  socialLinks: string | null;
}

interface Stats {
  total: number;
  published: number;
  drafts: number;
}

export default function ProfileSidebarCard({
  profile,
  stats,
}: {
  profile: Profile;
  stats: Stats;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Sidebar profile card ── */}
      <div className="px-4 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          {profile.avatar ? (
            <Image
              src={profile.avatar}
              alt={profile.displayName}
              width={44}
              height={44}
              className="w-11 h-11 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-lg shrink-0 font-semibold">
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-800 text-sm truncate">{profile.displayName}</p>
            <button
              onClick={() => setOpen(true)}
              className="text-xs text-violet-500 hover:text-violet-700 font-medium transition-colors"
            >
              Chỉnh sửa trang cá nhân
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Tổng", value: stats.total },
            { label: "Đăng", value: stats.published, color: "text-emerald-600" },
            { label: "Nháp", value: stats.drafts, color: "text-amber-500" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-slate-50 rounded-lg py-2 px-1">
              <p className={`text-base font-bold ${color ?? "text-slate-700"}`}>{value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Instagram-style edit modal ── */}
      {open && (
        <ProfileEditModal
          profile={profile}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

/* ─────────────────────────────────────────────── */

function ProfileEditModal({
  profile,
  onClose,
}: {
  profile: Profile;
  onClose: () => void;
}) {
  const router = useRouter();

  let initSocials: Record<string, string> = {};
  try {
    if (profile.socialLinks) initSocials = JSON.parse(profile.socialLinks);
  } catch {}

  const [form, setForm] = useState({
    displayName: profile.displayName || "",
    sayHi:       profile.sayHi      || "",
    bio:         profile.bio        || "",
    avatar:      profile.avatar     || "",
    email:       profile.email      || "",
    twitter:     initSocials.twitter  || "",
    github:      initSocials.github   || "",
    linkedin:    initSocials.linkedin || "",
  });
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState("");
  const [avatarErr, setAvatarErr] = useState(false);

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await updateProfile({
        displayName: form.displayName,
        sayHi:       form.sayHi   || undefined,
        bio:         form.bio     || undefined,
        avatar:      form.avatar  || undefined,
        email:       form.email   || undefined,
        socialLinks: {
          twitter:  form.twitter  || undefined,
          github:   form.github   || undefined,
          linkedin: form.linkedin || undefined,
        },
      });
      if (result.success) {
        setSuccess(true);
        setTimeout(() => { onClose(); router.refresh(); }, 900);
      } else {
        setError(result.error || "Cập nhật thất bại");
      }
    } catch {
      setError("Lỗi khi cập nhật profile");
    } finally {
      setLoading(false);
    }
  }

  const fields: { key: keyof typeof form; label: string; multiline?: boolean; type?: string }[] = [
    { key: "displayName", label: "Tên" },
    { key: "sayHi",       label: "Say hi",   multiline: true },
    { key: "bio",         label: "Tiểu sử",  multiline: true },
    { key: "email",       label: "Email",    type: "email" },
    { key: "twitter",     label: "Twitter" },
    { key: "github",      label: "GitHub" },
    { key: "linkedin",    label: "LinkedIn" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors"
          >
            Hủy
          </button>
          <h2 className="text-sm font-semibold text-slate-900">Chỉnh sửa trang cá nhân</h2>
          <button
            form="ig-profile-form"
            type="submit"
            disabled={loading || success}
            className="text-sm font-semibold text-violet-600 hover:text-violet-700 disabled:opacity-40 transition-colors"
          >
            {success ? "✓ Đã lưu" : loading ? "Đang lưu…" : "Lưu"}
          </button>
        </div>

        {/* Avatar area */}
        <div className="flex flex-col items-center py-6 bg-slate-50 shrink-0">
          <div className="relative">
            {form.avatar && !avatarErr ? (
              <Image
                src={form.avatar}
                alt="Avatar"
                width={88}
                height={88}
                className="w-22 h-22 rounded-full object-cover border-4 border-white shadow-md"
                style={{ width: 88, height: 88 }}
                onError={() => setAvatarErr(true)}
              />
            ) : (
              <div className="w-[88px] h-[88px] rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-md">
                {form.displayName.charAt(0).toUpperCase() || "?"}
              </div>
            )}
          </div>
          <label className="mt-3 text-sm font-semibold text-violet-600 hover:text-violet-700 cursor-pointer transition-colors">
            Thay đổi ảnh
            <input
              type="text"
              className="sr-only"
              placeholder="URL avatar..."
              onBlur={e => { set("avatar", e.target.value); setAvatarErr(false); }}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  set("avatar", (e.target as HTMLInputElement).value);
                  setAvatarErr(false);
                }
              }}
            />
          </label>
          {/* Avatar URL inline */}
          <input
            type="text"
            value={form.avatar}
            onChange={e => { set("avatar", e.target.value); setAvatarErr(false); }}
            className="mt-2 w-56 text-xs text-center text-slate-400 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-violet-400"
            placeholder="https://..."
          />
        </div>

        {/* Form fields */}
        <form
          id="ig-profile-form"
          onSubmit={handleSubmit}
          className="overflow-y-auto flex-1"
        >
          <div className="divide-y divide-slate-100">
            {fields.map(({ key, label, multiline, type }) => (
              <div key={key} className="flex items-start px-4 py-3 gap-3">
                <label className="w-20 text-xs font-semibold text-slate-400 uppercase tracking-wide pt-1.5 shrink-0">
                  {label}
                </label>
                {multiline ? (
                  <textarea
                    value={form[key]}
                    onChange={e => set(key, e.target.value)}
                    rows={3}
                    className="flex-1 text-sm text-slate-800 resize-none focus:outline-none placeholder:text-slate-300"
                    placeholder={`Thêm ${label.toLowerCase()}…`}
                  />
                ) : (
                  <input
                    type={type ?? "text"}
                    required={key === "displayName"}
                    value={form[key]}
                    onChange={e => set(key, e.target.value)}
                    className="flex-1 text-sm text-slate-800 focus:outline-none placeholder:text-slate-300"
                    placeholder={`Thêm ${label.toLowerCase()}…`}
                  />
                )}
              </div>
            ))}
          </div>

          {error && (
            <p className="mx-4 my-3 text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
