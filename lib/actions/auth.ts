"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (
    username !== process.env.ADMIN_USER ||
    password !== process.env.ADMIN_PASS
  ) {
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
