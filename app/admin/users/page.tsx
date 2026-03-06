import { UserRole } from "@prisma/client";
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
  deleteUserAction,
  updateUserAction,
} from "@/backend/actions/admin-users";
import { listUsersForAdmin } from "@/backend/services/user-admin";

type AdminUsersPageProps = {
  searchParams: Promise<{
    status?: string;
    error?: string;
  }>;
};

function getStatusMessage(status: string | undefined) {
  switch (status) {
    case "user-updated":
      return "User updated successfully.";
    case "user-deleted":
      return "User deleted successfully.";
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

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const [params, users] = await Promise.all([searchParams, listUsersForAdmin()]);
  const statusMessage = getStatusMessage(params.status);

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900">Users</h2>
      <p className="mt-2 text-sm text-gray-500">
        Manage user roles, account status, and lifecycle.
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
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">User Directory</h3>
          <p className="text-sm text-gray-500">{users.length} records</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Bookings</TableHead>
              <TableHead className="text-right">Reviews</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        user.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {user.isActive ? "Active" : "Disabled"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{user.bookingsCount}</TableCell>
                  <TableCell className="text-right">{user.reviewsCount}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <details>
                        <summary className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-primary hover:text-primary">
                          Edit
                        </summary>
                        <form
                          action={updateUserAction}
                          className="mt-2 grid min-w-[280px] gap-2 rounded-md border border-gray-200 bg-gray-50 p-3"
                        >
                          <input type="hidden" name="userId" value={user.id} />
                          <select
                            name="role"
                            defaultValue={user.role}
                            className="rounded-md border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-primary"
                          >
                            {Object.values(UserRole).map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                          <label className="flex items-center gap-2 rounded-md border border-gray-300 px-2 py-1.5 text-xs text-gray-700">
                            <input type="checkbox" name="isActive" defaultChecked={user.isActive} />
                            Account is active
                          </label>
                          <Button type="submit" size="sm">
                            Save
                          </Button>
                        </form>
                      </details>

                      {user.role !== UserRole.ADMIN ? (
                        <form action={deleteUserAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </form>
                      ) : null}
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
