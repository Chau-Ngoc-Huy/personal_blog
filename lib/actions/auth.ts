"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { createErrorResponse, ActionResponse } from "@/lib/error-handler";

export async function login(formData: FormData): Promise<ActionResponse> {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const adminUser = process.env.ADMIN_USER || "admin";
    const adminPass = process.env.ADMIN_PASS || "12345678";

    if (username !== adminUser || password !== adminPass) {
      return createErrorResponse("Incorrect username or password");
    }

    const session = await getSession();
    session.isAdmin = true;
    await session.save();

    redirect("/admin/dashboard");
  } catch (error) {
    return createErrorResponse(error, "Error signing in");
  }
}

export async function logout() {
  try {
    const session = await getSession();
    session.destroy();
    redirect("/admin");
  } catch (error) {
    console.error("Logout error:", error);
    redirect("/admin");
  }
}
