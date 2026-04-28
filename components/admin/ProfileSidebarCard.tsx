"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/actions/profile";
import SocialIcon from "../public/SocialIcon";
import SocialLinkIcon from "@/components/public/SocialLinkIcon";
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
  const socials = parseSocialLinks(profile.socialLinks);

  return (
    <>
      {/* ── Sidebar profile card ── */}
      <div className="px-4 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          {profile.avatar ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatar}
                alt={profile.displayName}
                className="w-11 h-11 rounded-full object-cover shrink-0"
              />
            </>
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
              Edit profile
            </button>
          </div>
        </div>

        {(SOCIAL_LINKS.some(({ key }) => Boolean(socials[key])) || profile.email) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {SOCIAL_LINKS.map(({ key, label, icon }) => {
              const href = socials[key];

              return href ? (
                <SocialLinkIcon
                  key={key}
                  href={href}
                  label={label}
                  name={icon}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200"
                  iconClassName="h-4 w-4"
                />
              ) : null;
            })}
            {profile.email && (
              <SocialLinkIcon
                href={`mailto:${profile.email}`}
                label="Email"
                name="email"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200"
                iconClassName="h-4 w-4"
              />
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "Total", value: stats.total },
            { label: "Published", value: stats.published, color: "text-emerald-600" },
            { label: "Drafts", value: stats.drafts, color: "text-amber-500" },
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
    { key: "displayName", label: "Display name" },
    { key: "sayHi",       label: "Say hi",   multiline: true },
    { key: "bio",         label: "Bio",  multiline: true },
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
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
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
            Cancel
          </button>
          <h2 className="text-sm font-semibold text-slate-900">Edit profile</h2>
          <button
            form="ig-profile-form"
            type="submit"
            disabled={loading || success}
            className="text-sm font-semibold text-violet-600 hover:text-violet-700 disabled:opacity-40 transition-colors"
          >
            {success ? "✓ Saved" : loading ? "Saving…" : "Save"}
          </button>
        </div>

        {/* Avatar area */}
        <div className="flex flex-col items-center py-6 bg-slate-50 shrink-0">
          <div className="relative">
            {form.avatar && !avatarErr ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.avatar}
                  alt="Avatar"
                  className="w-22 h-22 rounded-full object-cover border-4 border-white shadow-md"
                  style={{ width: 88, height: 88 }}
                  onError={() => setAvatarErr(true)}
                />
              </>
            ) : (
              <div className="w-[88px] h-[88px] rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-md">
                {form.displayName.charAt(0).toUpperCase() || "?"}
              </div>
            )}
          </div>
          <label className="mt-3 text-sm font-semibold text-violet-600 hover:text-violet-700 cursor-pointer transition-colors">
            Change image
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
                <label className="w-20 text-xs font-semibold text-slate-400 uppercase tracking-wide pt-1.5 shrink-0 flex items-center gap-2">
                  {SOCIAL_LINKS.some(({ key: socialKey }) => socialKey === key) ? (
                    <>
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-600">
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
                    className="flex-1 text-sm text-slate-800 resize-none focus:outline-none placeholder:text-slate-300"
                    placeholder={`Add ${label.toLowerCase()}…`}
                  />
                ) : (
                  <input
                    type={type ?? "text"}
                    required={key === "displayName"}
                    value={form[key]}
                    onChange={e => set(key, e.target.value)}
                    className="flex-1 text-sm text-slate-800 focus:outline-none placeholder:text-slate-300"
                    placeholder={key === "email" ? "you@example.com" : `Add ${label.toLowerCase()}…`}
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
