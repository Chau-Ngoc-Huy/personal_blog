"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const adminUser = process.env.ADMIN_USER || "admin";
  const adminPass = process.env.ADMIN_PASS || "12345678";

  if (username !== adminUser || password !== adminPass) {
    return { error: "Tên đăng nhập hoặc mật khẩu không đúng" };
  }

  const session = await getSession();
  session.isAdmin = true;
  await session.save();

  redirect("/admin/dashboard");
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/admin");
}
