import { BookingStatus } from "@prisma/client";
import Link from "next/link";
import { requireAuthUser } from "@/lib/server/auth";
import { listBookingsForUser } from "@/lib/services/booking-service";
import { cancelBookingAction, deleteBookingAction } from "./actions";

type MyAccountPageProps = {
  searchParams: Promise<{
    status?: string;
    error?: string;
  }>;
};

function formatDateLabel(value: Date) {
  return value.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function canCancel(status: BookingStatus) {
  return (
    status === BookingStatus.PENDING ||
    status === BookingStatus.CONFIRMED ||
    status === BookingStatus.IN_PROGRESS
  );
}

function canDelete(status: BookingStatus) {
  return status === BookingStatus.CANCELLED || status === BookingStatus.PENDING;
}

function getStatusMessage(status: string | undefined) {
  switch (status) {
    case "booking-created":
      return "Your appointment was booked successfully.";
    case "booking-cancelled":
      return "Booking cancelled successfully.";
    case "booking-deleted":
      return "Booking deleted successfully.";
    default:
      return "";
  }
}

export default async function MyAccountPage({ searchParams }: MyAccountPageProps) {
  const [params, user] = await Promise.all([searchParams, requireAuthUser("/my-account")]);
  const bookings = await listBookingsForUser(user.id);
  const statusMessage = getStatusMessage(params.status);

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="space-y-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
            My Account
          </p>
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          {statusMessage ? (
            <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {statusMessage}
            </p>
          ) : null}
          {params.error ? (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {params.error}
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-gray-900">Booked Services</h2>
            <span className="text-sm text-gray-500">{bookings.length} appointments</span>
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
              <p className="text-sm text-gray-500">No appointments booked yet.</p>
              <Link
                href="/serviceproviders"
                className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
              >
                Browse Services
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                >
                  <p className="text-sm font-semibold text-gray-900">{booking.serviceName}</p>
                  <p className="mt-0.5 text-sm text-gray-600">
                    {booking.providerName} • {booking.categoryName}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">{booking.location}</p>
                  <p className="mt-2 text-sm font-medium text-gray-700">
                    Date: {formatDateLabel(booking.scheduledDate)}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                    {booking.status}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {canCancel(booking.status) ? (
                      <form action={cancelBookingAction}>
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
                        >
                          Cancel Booking
                        </button>
                      </form>
                    ) : null}

                    {canDelete(booking.status) && !booking.hasReview ? (
                      <form action={deleteBookingAction}>
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <button
                          type="submit"
                          className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                        >
                          Delete Booking
                        </button>
                      </form>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
