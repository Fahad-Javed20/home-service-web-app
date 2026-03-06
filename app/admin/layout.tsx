import type { ReactNode } from "react";
import { requireAdminUser } from "@/backend/auth/session";
import AdminSidebar from "./_components/AdminSidebar";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const admin = await requireAdminUser("/admin");

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
          Admin Dashboard
        </p>
        <h1 className="text-2xl font-bold text-gray-900">HomeServePro Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Signed in as {admin.name} ({admin.email})
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <AdminSidebar />
        <div>{children}</div>
      </div>
    </section>
  );
}
