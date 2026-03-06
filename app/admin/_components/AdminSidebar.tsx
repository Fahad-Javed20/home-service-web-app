"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/service-providers", label: "Providers" },
];

function classes(isActive: boolean) {
  return isActive
    ? "block rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white"
    : "block rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary";
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
        Admin Menu
      </p>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link key={item.href} href={item.href} className={classes(isActive)}>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
