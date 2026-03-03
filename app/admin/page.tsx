import Link from "next/link";
import {
  listServiceCategories,
  listServicesForAdmin,
} from "@/lib/services/service-admin";
import { listProvidersForAdmin } from "@/lib/services/provider-admin";

export default async function AdminOverviewPage() {
  const [categories, services, providers] = await Promise.all([
    listServiceCategories(),
    listServicesForAdmin(),
    listProvidersForAdmin(),
  ]);

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
      <p className="mt-2 text-sm text-gray-500">
        Use the admin modules below to maintain services and service providers.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
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
