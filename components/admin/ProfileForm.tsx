"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/actions/profile";
import SocialIcon from "../public/SocialIcon";
import { SOCIAL_LINKS, parseSocialLinks } from "../../lib/social-links";

interface ProfileFormProps {
  initialData?: {
    displayName?: string;
    bio?: string;
    avatar?: string;
    email?: string;
    socialLinks?: string | null;
  };
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const parsedSocialLinks = parseSocialLinks(initialData?.socialLinks);

  const [form, setForm] = useState({
    displayName: initialData?.displayName || "",
    bio: initialData?.bio || "",
    avatar: initialData?.avatar || "",
    email: initialData?.email || "",
    youtube: parsedSocialLinks.youtube || "",
    instagram: parsedSocialLinks.instagram || "",
    linkedin: parsedSocialLinks.linkedin || "",
    tiktok: parsedSocialLinks.tiktok || "",
    x: parsedSocialLinks.x || "",
    facebook: parsedSocialLinks.facebook || "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const result = await updateProfile({
        displayName: form.displayName,
        bio: form.bio || undefined,
        avatar: form.avatar || undefined,
        email: form.email || undefined,
        socialLinks: {
          youtube: form.youtube || undefined,
          instagram: form.instagram || undefined,
          linkedin: form.linkedin || undefined,
          tiktok: form.tiktok || undefined,
          x: form.x || undefined,
          facebook: form.facebook || undefined,
        },
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.refresh();
        }, 1000);
      } else {
        setError(result.error || "Cập nhật thất bại");
      }
    } catch {
      setError("Lỗi khi cập nhật hồ sơ");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-[8px] border border-[#E6EAEA] px-4 py-2.5 text-sm text-[#14181A] placeholder:text-[#B8C0C0] focus:border-[var(--ac)] focus:outline-none focus:ring-[3px] focus:ring-[var(--ac-soft)]";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* Display Name */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#586063]">
          Tên hiển thị <span className="text-[#C0584F]">*</span>
        </label>
        <input
          type="text"
          required
          value={form.displayName}
          onChange={(e) =>
            setForm({ ...form, displayName: e.target.value })
          }
          className={inputClass}
          placeholder="Tên của bạn"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#586063]">
          Tiểu sử
        </label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={4}
          className={`${inputClass} resize-none`}
          placeholder="Viết vài dòng giới thiệu về bạn…"
        />
      </div>

      {/* Avatar URL */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#586063]">
          Ảnh đại diện (URL)
        </label>
        <input
          type="url"
          value={form.avatar}
          onChange={(e) => setForm({ ...form, avatar: e.target.value })}
          className={inputClass}
          placeholder="https://..."
        />
        {form.avatar && (
          <div className="mt-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.avatar}
              alt="Xem trước ảnh đại diện"
              className="h-24 w-24 rounded-[12px] border border-[#E6EAEA] object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e2e8f0' width='100' height='100'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%2364748b' font-size='14'%3EError%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[#586063]">
          Email
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputClass}
          placeholder="you@example.com"
        />
      </div>

      {/* Social Links */}
      <div className="border-t border-[#ECEFEF] pt-4">
        <h3 className="mb-4 font-heading text-lg font-semibold text-[#14181A]">
          Mạng xã hội
        </h3>

        <div className="space-y-4">
          {SOCIAL_LINKS.map(({ key, label, icon }) => (
            <div key={key}>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[#586063]">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#F5F7F7] text-[#586063]">
                  <SocialIcon name={icon} className="h-4 w-4" />
                </span>
                <span>{label}</span>
              </label>
              <input
                type="url"
                value={form[key as keyof typeof form] as string}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
                className={inputClass}
                placeholder={`https://${key}.com/...`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-[#FBECEC] px-3 py-3 text-sm text-[#C0584F]">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="rounded-lg bg-[var(--ac-soft)] px-3 py-3 text-sm text-[var(--ac-dark)]">
          ✓ Đã cập nhật thành công!
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-[8px] bg-[var(--ac)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--ac-dark)] disabled:opacity-50"
        >
          {loading ? "Đang lưu…" : "Lưu thay đổi"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-[8px] border border-[#E6EAEA] bg-white px-6 py-2.5 text-sm font-medium text-[#586063] transition-colors hover:border-[#C8CFCF]"
        >
          Huỷ
        </button>
      </div>
    </form>
  );
}
