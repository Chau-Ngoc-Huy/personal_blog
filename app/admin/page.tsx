import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session.isAdmin) redirect("/admin/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Đăng nhập để quản lý blog</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
