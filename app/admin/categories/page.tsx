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
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/backend/actions/admin-categories";
import { listCategoriesForAdmin } from "@/backend/services/service-admin";

type AdminCategoriesPageProps = {
  searchParams: Promise<{
    status?: string;
    error?: string;
  }>;
};

function getStatusMessage(status: string | undefined) {
  switch (status) {
    case "category-created":
      return "Category created successfully.";
    case "category-updated":
      return "Category updated successfully.";
    case "category-deleted":
      return "Category deleted successfully.";
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

export default async function AdminCategoriesPage({
  searchParams,
}: AdminCategoriesPageProps) {
  const [params, categories] = await Promise.all([
    searchParams,
    listCategoriesForAdmin(),
  ]);

  const statusMessage = getStatusMessage(params.status);

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900">Service Categories</h2>
      <p className="mt-2 text-sm text-gray-500">
        Manage marketplace categories used in service listing and filtering.
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
        <h3 className="text-lg font-bold text-gray-900">Add Category</h3>
        <form action={createCategoryAction} className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            name="name"
            placeholder="Category name"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
            required
          />
          <input
            name="icon"
            placeholder="Icon key (optional)"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <Button type="submit">Create Category</Button>
          <textarea
            name="description"
            placeholder="Description (optional)"
            className="md:col-span-3 min-h-20 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </form>
      </article>

      <article className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Category List</h3>
          <p className="text-sm text-gray-500">{categories.length} records</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Services</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-xs text-gray-500">
                      {category.description ?? "No description"}
                    </p>
                  </TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell className="text-right">{category.servicesCount}</TableCell>
                  <TableCell>{formatDate(category.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <details>
                        <summary className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-primary hover:text-primary">
                          Edit
                        </summary>
                        <form
                          action={updateCategoryAction}
                          className="mt-2 grid min-w-[320px] gap-2 rounded-md border border-gray-200 bg-gray-50 p-3"
                        >
                          <input type="hidden" name="categoryId" value={category.id} />
                          <input
                            name="name"
                            defaultValue={category.name}
                            className="rounded-md border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-primary"
                            required
                          />
                          <input
                            name="icon"
                            placeholder="Icon key"
                            className="rounded-md border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-primary"
                          />
                          <textarea
                            name="description"
                            defaultValue={category.description ?? ""}
                            className="min-h-16 rounded-md border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-primary"
                          />
                          <Button type="submit" size="sm">
                            Save
                          </Button>
                        </form>
                      </details>

                      <form action={deleteCategoryAction}>
                        <input type="hidden" name="categoryId" value={category.id} />
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
