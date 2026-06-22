"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/actions/profile";
import SocialIcon from "../public/SocialIcon";
import { SOCIAL_LINKS, parseSocialLinks } from "../../lib/social-links";

type SocialIconName = Parameters<typeof SocialIcon>[0]["name"];

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
  const initials = profile.displayName
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* ── Sidebar profile card ── */}
      <div className="rounded-[14px] border border-[#EEF1F1] bg-[#F7F9F9] p-4">
        <div className="mb-4 flex items-center gap-3">
          <span className="relative h-[46px] w-[46px] flex-none">
            {profile.avatar ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.avatar}
                  alt={profile.displayName}
                  className="absolute inset-[2px] rounded-full object-cover"
                  style={{ width: "calc(100% - 4px)", height: "calc(100% - 4px)" }}
                />
              </>
            ) : (
              <span className="absolute inset-[2px] flex items-center justify-center rounded-full bg-[var(--ac)] font-heading text-[15px] font-semibold text-white">
                {initials}
              </span>
            )}
            <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
              <circle cx="50" cy="50" r="47" fill="none" stroke="var(--ac)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="74 300" transform="rotate(-52 50 50)" opacity="0.5" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#14181A]">{profile.displayName}</p>
            <button
              onClick={() => setOpen(true)}
              className="text-xs text-[var(--ac-dark)] transition-colors hover:underline"
            >
              Sửa hồ sơ
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Bài", value: stats.total },
            { label: "Đã đăng", value: stats.published, color: "text-[var(--ac-dark)]" },
            { label: "Nháp", value: stats.drafts, color: "text-[#B98900]" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-[9px] border border-[#EEF1F1] bg-white px-1 py-[9px]">
              <p className={`font-heading text-[17px] font-semibold ${color ?? "text-[#14181A]"}`}>{value}</p>
              <p className="mt-0.5 text-[10px] text-[#8C9496]">{label}</p>
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

  const parsedSocials = parseSocialLinks(profile.socialLinks);

  const [form, setForm] = useState({
    displayName: profile.displayName || "",
    sayHi:       profile.sayHi      || "",
    bio:         profile.bio        || "",
    avatar:      profile.avatar     || "",
    email:       profile.email      || "",
    youtube:     parsedSocials.youtube || "",
    instagram:   parsedSocials.instagram || "",
    linkedin:    parsedSocials.linkedin || "",
    tiktok:      parsedSocials.tiktok || "",
    x:           parsedSocials.x || "",
    facebook:    parsedSocials.facebook || "",
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
          youtube: form.youtube || undefined,
          instagram: form.instagram || undefined,
          linkedin: form.linkedin || undefined,
          tiktok: form.tiktok || undefined,
          x: form.x || undefined,
          facebook:  form.facebook  || undefined,
        },
      });
      if (result.success) {
        setSuccess(true);
        setTimeout(() => { onClose(); router.refresh(); }, 900);
      } else {
        setError(result.error || "Update failed");
      }
    } catch {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  const fields: { key: keyof typeof form; label: string; icon?: keyof typeof form; multiline?: boolean; type?: string }[] = [
    { key: "displayName", label: "Tên hiển thị" },
    { key: "sayHi",       label: "Lời chào",   multiline: true },
    { key: "bio",         label: "Tiểu sử",  multiline: true },
    { key: "email",       label: "Email",    type: "email" },
    { key: "youtube",     label: "YouTube" },
    { key: "instagram",   label: "Instagram" },
    { key: "facebook",    label: "Facebook" },
    { key: "linkedin",    label: "LinkedIn" },
    { key: "tiktok",      label: "TikTok" },
    { key: "x",           label: "X" },
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
        className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        style={{ maxHeight: "90vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#ECEFEF] px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-[#586063] transition-colors hover:text-[#14181A]"
          >
            Huỷ
          </button>
          <h2 className="text-sm font-semibold text-[#14181A]">Sửa hồ sơ</h2>
          <button
            form="ig-profile-form"
            type="submit"
            disabled={loading || success}
            className="text-sm font-semibold text-[var(--ac-dark)] transition-colors hover:text-[var(--ac)] disabled:opacity-40"
          >
            {success ? "✓ Đã lưu" : loading ? "Đang lưu…" : "Lưu"}
          </button>
        </div>

        {/* Avatar area */}
        <div className="flex shrink-0 flex-col items-center bg-[#F5F7F7] py-6">
          <div className="relative">
            {form.avatar && !avatarErr ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.avatar}
                  alt="Avatar"
                  className="rounded-full border-4 border-white object-cover shadow-md"
                  style={{ width: 88, height: 88 }}
                  onError={() => setAvatarErr(true)}
                />
              </>
            ) : (
              <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border-4 border-white bg-[var(--ac)] font-heading text-2xl font-semibold text-white shadow-md">
                {form.displayName.charAt(0).toUpperCase() || "?"}
              </div>
            )}
          </div>
          <label className="mt-3 cursor-pointer text-sm font-semibold text-[var(--ac-dark)] transition-colors hover:text-[var(--ac)]">
            Đổi ảnh đại diện
            <input
              type="text"
              className="sr-only"
              placeholder="URL ảnh đại diện..."
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
            className="mt-2 w-56 rounded-lg border border-[#E6EAEA] px-2 py-1 text-center text-xs text-[#8C9496] focus:border-[var(--ac)] focus:outline-none focus:ring-1 focus:ring-[var(--ac)]"
            placeholder="https://..."
          />
        </div>

        {/* Form fields */}
        <form
          id="ig-profile-form"
          onSubmit={handleSubmit}
          className="overflow-y-auto flex-1"
        >
          <div className="divide-y divide-[#F0F3F3]">
            {fields.map(({ key, label, multiline, type }) => (
              <div key={key} className="flex items-start gap-3 px-4 py-3">
                <label className="flex w-20 shrink-0 items-center gap-2 pt-1.5 text-xs font-semibold uppercase tracking-wide text-[#8C9496]">
                  {SOCIAL_LINKS.some(({ key: socialKey }) => socialKey === key) ? (
                    <>
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#F5F7F7] text-[#586063]">
                        <SocialIcon name={key as SocialIconName} className="h-3.5 w-3.5" />
                      </span>
                      <span className="sr-only">{label}</span>
                    </>
                  ) : (
                    <span>{label}</span>
                  )}
                </label>
                {multiline ? (
                  <textarea
                    value={form[key]}
                    onChange={e => set(key, e.target.value)}
                    rows={3}
                    className="flex-1 resize-none text-sm text-[#14181A] placeholder:text-[#B8C0C0] focus:outline-none"
                    placeholder={`Thêm ${label.toLowerCase()}…`}
                  />
                ) : (
                  <input
                    type={type ?? "text"}
                    required={key === "displayName"}
                    value={form[key]}
                    onChange={e => set(key, e.target.value)}
                    className="flex-1 text-sm text-[#14181A] placeholder:text-[#B8C0C0] focus:outline-none"
                    placeholder={key === "email" ? "you@example.com" : `Thêm ${label.toLowerCase()}…`}
                  />
                )}
              </div>
            ))}
          </div>

          {error && (
            <p className="mx-4 my-3 rounded-lg bg-[#FBECEC] px-3 py-2 text-sm text-[#C0584F]">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
