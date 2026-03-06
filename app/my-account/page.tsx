import { BookingStatus, UserRole } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAuthUser } from "@/backend/auth/session";
import { getDashboardPathByRole } from "@/backend/auth/role-routes";
import { listBookingsForUser } from "@/backend/services/booking-service";
import {
  cancelBookingAction,
  deleteBookingAction,
} from "@/backend/actions/account-bookings";
import { createReviewAction } from "@/backend/actions/reviews";

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
    case "review-created":
      return "Thank you. Your review has been submitted.";
    default:
      return "";
  }
}

export default async function MyAccountPage({ searchParams }: MyAccountPageProps) {
  const [params, user] = await Promise.all([searchParams, requireAuthUser("/my-account")]);

  if (user.role !== UserRole.USER) {
    redirect(getDashboardPathByRole(user.role));
  }

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
                    Date: {formatDateLabel(booking.bookingDate)}
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-700">Time: {booking.timeSlot}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
                    {booking.status} • {booking.paymentStatus}
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

                    {booking.status === BookingStatus.COMPLETED && !booking.hasReview ? (
                      <details>
                        <summary className="cursor-pointer rounded-lg border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100">
                          Add Review
                        </summary>
                        <form
                          action={createReviewAction}
                          className="mt-2 grid min-w-[280px] gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3"
                        >
                          <input type="hidden" name="bookingId" value={booking.id} />
                          <select
                            name="rating"
                            defaultValue="5"
                            className="rounded-md border border-blue-200 px-2 py-1.5 text-xs outline-none focus:border-primary"
                          >
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Good</option>
                            <option value="3">3 - Average</option>
                            <option value="2">2 - Poor</option>
                            <option value="1">1 - Bad</option>
                          </select>
                          <textarea
                            name="comment"
                            placeholder="Share your experience (optional)"
                            className="min-h-16 rounded-md border border-blue-200 px-2 py-1.5 text-xs outline-none focus:border-primary"
                          />
                          <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                          >
                            Submit Review
                          </button>
                        </form>
                      </details>
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
