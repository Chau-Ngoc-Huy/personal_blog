import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session.isAdmin) redirect("/admin/dashboard");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7F7] px-4">
      <div className="w-full max-w-sm rounded-[20px] border border-[#ECEFEF] bg-white p-8 shadow-card-lift">
        <div className="mb-8 text-center">
          <div className="mb-5 inline-flex items-center gap-2.5">
            <span className="h-[9px] w-[9px] rounded-full bg-[var(--ac)]" />
            <span className="font-heading text-[16px] font-semibold tracking-[-0.01em] text-[#14181A]">
              Quản trị
            </span>
          </div>
          <h1 className="font-heading text-2xl font-semibold tracking-[-0.02em] text-[#14181A]">Đăng nhập</h1>
          <p className="mt-1.5 text-sm text-[#8C9496]">Đăng nhập để quản lý blog của bạn</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
