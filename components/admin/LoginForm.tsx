"use client";

import { useState } from "react";
import { login } from "@/lib/actions/auth";
import { ErrorNotification } from "../ErrorNotification";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#586063]">
            Tên đăng nhập
          </label>
          <input
            type="text"
            name="username"
            required
            autoComplete="username"
            className="w-full rounded-[8px] border border-[#E6EAEA] px-3 py-2.5 text-sm text-[#14181A] focus:border-[var(--ac)] focus:outline-none focus:ring-[3px] focus:ring-[var(--ac-soft)]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#586063]">
            Mật khẩu
          </label>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="w-full rounded-[8px] border border-[#E6EAEA] px-3 py-2.5 text-sm text-[#14181A] focus:border-[var(--ac)] focus:outline-none focus:ring-[3px] focus:ring-[var(--ac-soft)]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[8px] bg-[var(--ac)] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--ac-dark)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Đang đăng nhập…" : "Đăng nhập"}
        </button>
      </form>
      <ErrorNotification message={error} onDismiss={() => setError(null)} />
    </>
  );
}
