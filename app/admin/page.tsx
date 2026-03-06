import Link from "next/link";
import {
  listServiceCategories,
  listServicesForAdmin,
} from "@/backend/services/service-admin";
import { listProvidersForAdmin } from "@/backend/services/provider-admin";
import { listUsersForAdmin } from "@/backend/services/user-admin";

export default async function AdminOverviewPage() {
  const [categories, services, providers, users] = await Promise.all([
    listServiceCategories(),
    listServicesForAdmin(),
    listProvidersForAdmin(),
    listUsersForAdmin(),
  ]);

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
      <p className="mt-2 text-sm text-gray-500">
        Use the admin modules below to maintain services and service providers.
      </p>

      <div className="grid gap-4 sm:grid-cols-4">
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Users</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{users.length}</p>
        </article>
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Categories</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{categories.length}</p>
        </article>
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Services</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{services.length}</p>
        </article>
        <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Providers</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{providers.length}</p>
        </article>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/users"
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-primary transition-colors"
        >
          <h2 className="text-lg font-bold text-gray-900">Users CRUD</h2>
          <p className="mt-1 text-sm text-gray-500">
            Update role and account status or safely remove users.
          </p>
        </Link>

        <Link
          href="/admin/categories"
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-primary transition-colors"
        >
          <h2 className="text-lg font-bold text-gray-900">Categories CRUD</h2>
          <p className="mt-1 text-sm text-gray-500">
            Create and maintain service categories used across the marketplace.
          </p>
        </Link>

        <Link
          href="/admin/services"
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-primary transition-colors"
        >
          <h2 className="text-lg font-bold text-gray-900">Services CRUD</h2>
          <p className="mt-1 text-sm text-gray-500">
            Create, update, and delete service records with category and price.
          </p>
        </Link>

        <Link
          href="/admin/service-providers"
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-primary transition-colors"
        >
          <h2 className="text-lg font-bold text-gray-900">Providers CRUD</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage provider profiles, assigned services, verification, and contact details.
          </p>
        </Link>
      </div>
    </section>
  );
}
