import Link from "next/link";
import { BookingStatus, UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { requireAuthUser } from "@/backend/auth/session";
import { getDashboardPathByRole } from "@/backend/auth/role-routes";
import { listBookingsForUser } from "@/backend/services/booking-service";

function formatDate(value: Date) {
  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function UserDashboardPage() {
  const user = await requireAuthUser("/dashboard");

  if (user.role !== UserRole.USER) {
    redirect(getDashboardPathByRole(user.role));
  }

  const bookings = await listBookingsForUser(user.id);
  const upcoming = bookings.filter(
    (booking) =>
      booking.status === BookingStatus.PENDING ||
      booking.status === BookingStatus.CONFIRMED ||
      booking.status === BookingStatus.IN_PROGRESS
  );

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
          User Dashboard
        </p>
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {user.name}</h1>
        <p className="mt-1 text-sm text-slate-600">{user.email}</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total Bookings</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{bookings.length}</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Upcoming</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{upcoming.length}</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Completed</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {bookings.filter((booking) => booking.status === BookingStatus.COMPLETED).length}
            </p>
          </article>
        </div>
      </div>

      <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Bookings</h2>
          <Link
            href="/my-account"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-primary hover:text-primary"
          >
            Manage All
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <p className="text-sm text-slate-500">No bookings yet.</p>
            <Link
              href="/serviceproviders"
              className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 6).map((booking) => (
              <article
                key={booking.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {booking.serviceName} • {booking.providerName}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {formatDate(booking.bookingDate)} • {booking.timeSlot}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                  {booking.status}
                </p>
              </article>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
