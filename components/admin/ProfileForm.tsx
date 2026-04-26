"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/actions/profile";

interface ProfileFormProps {
  initialData?: {
    displayName?: string;
    bio?: string;
    avatar?: string;
    email?: string;
    socialLinks?: {
      twitter?: string;
      github?: string;
      linkedin?: string;
    };
  };
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    displayName: initialData?.displayName || "",
    bio: initialData?.bio || "",
    avatar: initialData?.avatar || "",
    email: initialData?.email || "",
    twitter: initialData?.socialLinks?.twitter || "",
    github: initialData?.socialLinks?.github || "",
    linkedin: initialData?.socialLinks?.linkedin || "",
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
          twitter: form.twitter || undefined,
          github: form.github || undefined,
          linkedin: form.linkedin || undefined,
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
      setError("Lỗi khi cập nhật profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* Display Name */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Tên hiển thị <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={form.displayName}
          onChange={(e) =>
            setForm({ ...form, displayName: e.target.value })
          }
          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder="Tên của bạn"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Giới thiệu
        </label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={4}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          placeholder="Viết một chút về bạn..."
        />
      </div>

      {/* Avatar URL */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Avatar (URL)
        </label>
        <input
          type="url"
          value={form.avatar}
          onChange={(e) => setForm({ ...form, avatar: e.target.value })}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder="https://..."
        />
        {form.avatar && (
          <div className="mt-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.avatar}
              alt="Avatar preview"
              className="w-24 h-24 rounded-lg object-cover border border-slate-200"
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
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Email
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder="you@example.com"
        />
      </div>

      {/* Social Links */}
      <div className="pt-4 border-t border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Mạng xã hội
        </h3>

        <div className="space-y-4">
          {[
            { key: "twitter", label: "Twitter" },
            { key: "github", label: "GitHub" },
            { key: "linkedin", label: "LinkedIn" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {label}
              </label>
              <input
                type="url"
                value={form[key as keyof typeof form] as string}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder={`https://${key === "twitter" ? "x.com" : key}.com/...`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          ✓ Cập nhật thành công!
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-400 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-lg transition-colors"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
