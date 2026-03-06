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
  createProviderAction,
  deleteProviderAction,
  updateProviderAction,
} from "@/backend/actions/admin-providers";
import {
  listProvidersForAdmin,
  listServicesForProviderForm,
} from "@/backend/services/provider-admin";

type AdminProvidersPageProps = {
  searchParams: Promise<{
    status?: string;
    error?: string;
  }>;
};

function getStatusMessage(status: string | undefined) {
  switch (status) {
    case "provider-created":
      return "Provider created successfully.";
    case "provider-updated":
      return "Provider updated successfully.";
    case "provider-deleted":
      return "Provider deleted successfully.";
    default:
      return "";
  }
}

function formatLocation(city: string | null, state: string | null, country: string | null) {
  const cityState = [city, state].filter(Boolean).join(", ");
  return [cityState, country].filter(Boolean).join(", ") || "N/A";
}

export default async function AdminProvidersPage({
  searchParams,
}: AdminProvidersPageProps) {
  const [params, providers, services] = await Promise.all([
    searchParams,
    listProvidersForAdmin(),
    listServicesForProviderForm(),
  ]);

  const statusMessage = getStatusMessage(params.status);

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900">Service Providers</h2>
      <p className="mt-2 text-sm text-gray-500">
        Add and manage provider profiles and assignments.
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
        <h3 className="text-lg font-bold text-gray-900">Add Provider</h3>
        <form action={createProviderAction} className="mt-4 grid gap-3 md:grid-cols-4">
          <input
            name="userName"
            placeholder="Provider name"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
            required
          />
          <input
            name="userEmail"
            type="email"
            placeholder="Email"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <select
            name="serviceId"
            defaultValue=""
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
            required
          >
            <option value="" disabled>
              Select service
            </option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} ({service.categoryName})
              </option>
            ))}
          </select>

          <input
            name="profileImage"
            placeholder="Profile image URL"
            className="md:col-span-2 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <input
            name="imageUrl"
            placeholder="Service image URL"
            className="md:col-span-2 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />

          <textarea
            name="bio"
            placeholder="Bio"
            className="md:col-span-4 min-h-20 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />

          <input
            name="addressLine1"
            placeholder="Address"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <input
            name="city"
            placeholder="City"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <input
            name="state"
            placeholder="State"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <input
            name="country"
            defaultValue="USA"
            placeholder="Country"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />

          <input
            name="yearsOfExperience"
            type="number"
            min="0"
            step="1"
            placeholder="Years of experience"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <label className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700">
            <input type="checkbox" name="verified" />
            Verified provider
          </label>
          <Button type="submit">Create Provider</Button>
        </form>
      </article>

      <article className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Provider List</h3>
          <p className="text-sm text-gray-500">{providers.length} records</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead className="text-right">Rating</TableHead>
              <TableHead className="text-right">Bookings</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                  No providers found.
                </TableCell>
              </TableRow>
            ) : (
              providers.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell>
                    <p className="font-medium text-gray-900">{provider.userName}</p>
                    <p className="text-xs text-gray-500">{provider.userEmail}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-gray-900">{provider.serviceName}</p>
                    <p className="text-xs text-gray-500">{provider.categoryName}</p>
                  </TableCell>
                  <TableCell>
                    {formatLocation(provider.city, provider.state, provider.country)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        provider.verified
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {provider.verified ? "Yes" : "No"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{provider.rating.toFixed(1)}</TableCell>
                  <TableCell className="text-right">{provider.bookingsCount}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <details>
                        <summary className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-primary hover:text-primary">
                          Edit
                        </summary>
                        <form
                          action={updateProviderAction}
                          className="mt-2 grid min-w-[340px] gap-2 rounded-md border border-gray-200 bg-gray-50 p-3"
                        >
                          <input type="hidden" name="providerId" value={provider.id} />
                          <input
                            name="userName"
                            defaultValue={provider.userName}
                            className="rounded-md border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-primary"
                            required
                          />
                          <input
                            name="userEmail"
                            type="email"
                            defaultValue={provider.userEmail}
                            className="rounded-md border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-primary"
                            required
                          />
                          <input
                            name="phone"
                            defaultValue={provider.phone ?? ""}
                            placeholder="Phone"
                            className="rounded-md border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-primary"
                          />
                          <select
                            name="serviceId"
                            defaultValue={provider.serviceId}
                            className="rounded-md border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-primary"
                            required
                          >
                            {services.map((service) => (
                              <option key={service.id} value={service.id}>
                                {service.name} ({service.categoryName})
                              </option>
                            ))}
                          </select>
                          <input
                            name="profileImage"
                            defaultValue={provider.profileImage ?? ""}
                            placeholder="Profile image URL"
                            className="rounded-md border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-primary"
                          />
                          <input
                            name="imageUrl"
                            defaultValue={provider.imageUrl ?? ""}
                            placeholder="Service image URL"
                            className="rounded-md border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-primary"
                          />
                          <textarea
                            name="bio"
                            defaultValue={provider.bio ?? ""}
                            placeholder="Bio"
                            className="min-h-16 rounded-md border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-primary"
                          />
                          <input
                            name="addressLine1"
                            defaultValue={provider.addressLine1 ?? ""}
                            placeholder="Address"
                            className="rounded-md border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-primary"
                          />
                          <input
                            name="city"
                            defaultValue={provider.city ?? ""}
                            placeholder="City"
                            className="rounded-md border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-primary"
                          />
                          <input
                            name="state"
                            defaultValue={provider.state ?? ""}
                            placeholder="State"
                            className="rounded-md border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-primary"
                          />
                          <input
                            name="country"
                            defaultValue={provider.country ?? "USA"}
                            placeholder="Country"
                            className="rounded-md border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-primary"
                          />
                          <input
                            name="yearsOfExperience"
                            type="number"
                            min="0"
                            step="1"
                            defaultValue={provider.yearsOfExperience ?? ""}
                            placeholder="Years of experience"
                            className="rounded-md border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-primary"
                          />
                          <label className="flex items-center gap-2 rounded-md border border-gray-300 px-2 py-1.5 text-xs text-gray-700">
                            <input
                              type="checkbox"
                              name="verified"
                              defaultChecked={provider.verified}
                            />
                            Verified provider
                          </label>
                          <Button type="submit" size="sm">
                            Save
                          </Button>
                        </form>
                      </details>

                      <form action={deleteProviderAction}>
                        <input type="hidden" name="providerId" value={provider.id} />
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
