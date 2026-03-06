import Link from "next/link";
import { UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/backend/auth/session";
import { logoutAction } from "@/backend/actions/auth";
import { getDashboardPathByRole } from "@/backend/auth/role-routes";

export default async function Header() {
  const authUser = await getCurrentUser();
  const dashboardPath = authUser ? getDashboardPathByRole(authUser.role) : "/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-primary to-indigo-700 shadow-md">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-none text-slate-900">
                HomeServe<span className="text-primary">Pro</span>
              </span>
              <span className="text-xs font-medium text-slate-500">Professional Services</span>
            </div>
          </Link>

          <nav className="ml-2 hidden items-center gap-6 md:flex">
            <Link href="/" className="text-sm font-medium text-slate-700 hover:text-primary">
              Home
            </Link>
            <Link
              href="/serviceproviders"
              className="text-sm font-medium text-slate-700 hover:text-primary"
            >
              Services
            </Link>
            <Link href="/about" className="text-sm font-medium text-slate-700 hover:text-primary">
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-slate-700 hover:text-primary"
            >
              Contact
            </Link>
            {authUser?.role === UserRole.ADMIN ? (
              <Link
                href="/admin"
                className="text-sm font-medium text-slate-700 hover:text-primary"
              >
                Admin
              </Link>
            ) : null}
          </nav>
        </div>

        {!authUser ? (
          <Button asChild className="bg-primary text-white hover:bg-purple-700">
            <Link href="/auth?mode=signin">Login / Signup</Link>
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href={dashboardPath}>Dashboard</Link>
            </Button>
            {authUser.role === UserRole.USER ? (
              <Button asChild variant="outline" className="hidden sm:inline-flex">
                <Link href="/my-account">Bookings</Link>
              </Button>
            ) : null}
            <form action={logoutAction}>
              <Button type="submit" className="bg-primary text-white hover:bg-purple-700">
                Logout
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
