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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            {initialData ? "Chỉnh sửa Tag" : "Tag mới"}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tên Tag <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              autoFocus
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="vd: Tech, Life, Travel"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Màu sắc
            </label>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => setForm({ ...form, color: color.hex })}
                  className={`w-full aspect-square rounded-lg transition-all border-2 ${
                    form.color === color.hex
                      ? "border-slate-900 ring-2 ring-violet-500"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-400 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {loading ? "..." : initialData ? "Cập nhật" : "Tạo"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-lg transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
