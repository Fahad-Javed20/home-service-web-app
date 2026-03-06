import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createServiceAction,
  deleteServiceAction,
  updateServiceAction,
} from "@/backend/actions/admin-services";
import {
  listServiceCategories,
  listServicesForAdmin,
} from "@/backend/services/service-admin";

type AdminServicesPageProps = {
  searchParams: Promise<{
    status?: string;
    error?: string;
  }>;
};

function getStatusMessage(status: string | undefined) {
  switch (status) {
    case "service-created":
      return "Service created successfully.";
    case "service-updated":
      return "Service updated successfully.";
    case "service-deleted":
      return "Service deleted successfully.";
    default:
      return "";
  }
}

function formatDate(value: Date) {
  return value.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminServicesPage({
  searchParams,
}: AdminServicesPageProps) {
  const [params, categories, services] = await Promise.all([
    searchParams,
    listServiceCategories(),
    listServicesForAdmin(),
  ]);

  const statusMessage = getStatusMessage(params.status);

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900">Services</h2>
      <p className="mt-2 text-sm text-gray-500">
        Create new services and manage existing service records.
      </p>

      {params.error ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {params.error}
        </p>
      ) : null}

      {statusMessage ? (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          {statusMessage}
        </p>
      ) : null}

      <article className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900">Add Service</h3>
        <form action={createServiceAction} className="mt-4 grid gap-3 md:grid-cols-4">
          <input
            name="name"
            placeholder="Service name"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
            required
          />
          <input
            name="basePrice"
            type="number"
            min="0"
            step="0.01"
            placeholder="Base price"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
            required
          />
          <select
            name="categoryId"
            defaultValue=""
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
            required
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <Button type="submit">Create Service</Button>
          <textarea
            name="description"
            placeholder="Description (optional)"
            className="md:col-span-4 min-h-20 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </form>
      </article>

      <article className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Service List</h3>
          <p className="text-sm text-gray-500">{services.length} records</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Providers</TableHead>
              <TableHead className="text-right">Bookings</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                  No services found.
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <p className="text-xs text-gray-500">{service.description ?? "No description"}</p>
                  </TableCell>
                  <TableCell>{service.categoryName}</TableCell>
                  <TableCell className="text-right">${service.basePrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{service.providersCount}</TableCell>
                  <TableCell className="text-right">{service.bookingsCount}</TableCell>
                  <TableCell>{formatDate(service.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <details>
                        <summary className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-primary hover:text-primary">
                          Edit
                        </summary>
                        <form
                          action={updateServiceAction}
                          className="mt-2 grid min-w-[320px] gap-2 rounded-md border border-gray-200 bg-gray-50 p-3"
                        >
                          <input type="hidden" name="serviceId" value={service.id} />
                          <input
                            name="name"
                            defaultValue={service.name}
                            className="rounded-md border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-primary"
                            required
                          />
                          <input
                            name="basePrice"
                            type="number"
                            min="0"
                            step="0.01"
                            defaultValue={service.basePrice.toFixed(2)}
                            className="rounded-md border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-primary"
                            required
                          />
                          <select
                            name="categoryId"
                            defaultValue={service.categoryId}
                            className="rounded-md border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-primary"
                            required
                          >
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                          <textarea
                            name="description"
                            defaultValue={service.description ?? ""}
                            className="min-h-16 rounded-md border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-primary"
                          />
                          <Button type="submit" size="sm">
                            Save
                          </Button>
                        </form>
                      </details>

                      <form action={deleteServiceAction}>
                        <input type="hidden" name="serviceId" value={service.id} />
                        <Button
                          type="submit"
                          variant="outline"
                          size="sm"
                          className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </article>
    </section>
  );
}
