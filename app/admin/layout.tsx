import { getSession } from "@/lib/session";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // The login page lives at /admin and is excluded from the auth middleware.
  // When not signed in, render it bare — no admin sidebar/shell.
  if (!session.isAdmin) return <>{children}</>;

  return <AdminShell>{children}</AdminShell>;
}
