"use client";

import { useState, useEffect } from "react";
import { createTag, updateTag } from "@/lib/actions/tags";

const COLORS = [
  { name: "Violet", hex: "#7c3aed" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Green", hex: "#059669" },
  { name: "Red", hex: "#dc2626" },
  { name: "Orange", hex: "#ea580c" },
  { name: "Pink", hex: "#db2777" },
  { name: "Indigo", hex: "#4f46e5" },
  { name: "Emerald", hex: "#0891b2" },
];

interface TagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: {
    id: string;
    name: string;
    slug: string;
    color?: string | null;
  };
}

export default function TagDialog({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: TagDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: initialData?.name || "",
    color: initialData?.color || COLORS[0].hex,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        color: initialData.color || COLORS[0].hex,
      });
    } else {
      setForm({ name: "", color: COLORS[0].hex });
    }
    setError("");
  }, [initialData, isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let result;

      if (initialData) {
        result = await updateTag({
          id: initialData.id,
          name: form.name,
          color: form.color,
        });
      } else {
        result = await createTag({
          name: form.name,
          color: form.color,
        });
      }

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || "Thao tác thất bại");
      }
    } catch {
      setError("Lỗi khi xử lý");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-[#ECEFEF] px-6 py-4">
          <h2 className="font-heading text-lg font-semibold text-[#14181A]">
            {initialData ? "Sửa chủ đề" : "Chủ đề mới"}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#586063]">
              Tên chủ đề <span className="text-[#C0584F]">*</span>
            </label>
            <input
              type="text"
              autoFocus
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-[8px] border border-[#E6EAEA] px-3 py-2.5 text-sm text-[#14181A] focus:border-[var(--ac)] focus:outline-none focus:ring-[3px] focus:ring-[var(--ac-soft)]"
              placeholder="VD: Dạy học, Đời sống, STEM"
            />
          </div>

          {/* Color */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#586063]">
              Màu sắc
            </label>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => setForm({ ...form, color: color.hex })}
                  className={`aspect-square w-full rounded-[8px] border-2 transition-all ${
                    form.color === color.hex
                      ? "border-[#14181A] ring-2 ring-[var(--ac)]"
                      : "border-[#E6EAEA] hover:border-[#C8CFCF]"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-[#FBECEC] px-3 py-2.5 text-sm text-[#C0584F]">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-[8px] bg-[var(--ac)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--ac-dark)] disabled:opacity-50"
            >
              {loading ? "…" : initialData ? "Cập nhật" : "Tạo mới"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-[8px] border border-[#E6EAEA] bg-white px-4 py-2.5 text-sm font-medium text-[#586063] transition-colors hover:border-[#C8CFCF]"
            >
              Huỷ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
