import { BookingStatus, Weekday } from "@prisma/client";
import { notFound } from "next/navigation";
import { requireProviderUser } from "@/backend/auth/session";
import { BOOKING_TIME_SLOTS } from "@/backend/services/booking-service";
import { getProviderDashboardData } from "@/backend/services/provider-dashboard";
import {
  removeAvailabilitySlotAction,
  updateProviderBookingStatusAction,
  upsertAvailabilitySlotAction,
} from "@/backend/actions/provider-actions";

type ProviderDashboardPageProps = {
  searchParams: Promise<{
    status?: string;
    error?: string;
  }>;
};

function formatDate(value: Date) {
  return value.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const daysOrder: Weekday[] = [
  Weekday.MONDAY,
  Weekday.TUESDAY,
  Weekday.WEDNESDAY,
  Weekday.THURSDAY,
  Weekday.FRIDAY,
  Weekday.SATURDAY,
  Weekday.SUNDAY,
];

function getStatusMessage(status: string | undefined) {
  switch (status) {
    case "availability-updated":
      return "Availability slot saved.";
    case "availability-removed":
      return "Availability slot removed.";
    case "booking-updated":
      return "Booking status updated.";
    default:
      return "";
  }
}

export default async function ProviderDashboardPage({
  searchParams,
}: ProviderDashboardPageProps) {
  const [params, user] = await Promise.all([
    searchParams,
    requireProviderUser("/providers/dashboard"),
  ]);

  const dashboard = await getProviderDashboardData(user.id);
  if (!dashboard) {
    notFound();
  }

  const statusMessage = getStatusMessage(params.status);

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
          Provider Dashboard
        </p>
        <h1 className="text-2xl font-bold text-slate-900">{dashboard.providerName}</h1>
        <p className="mt-1 text-sm text-slate-600">
          Approval: <span className="font-semibold">{dashboard.approvalStatus}</span>
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Rating</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{dashboard.rating.toFixed(1)}</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Reviews</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{dashboard.totalReviews}</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Completed Jobs</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{dashboard.jobsCompleted}</p>
          </article>
        </div>

        {statusMessage ? (
          <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {statusMessage}
          </p>
        ) : null}
        {params.error ? (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {params.error}
          </p>
        ) : null}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_370px]">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Upcoming Bookings</h2>
            <span className="text-sm text-slate-500">{dashboard.upcomingBookings.length} items</span>
          </div>

          {dashboard.upcomingBookings.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              No upcoming bookings.
            </p>
          ) : (
            <div className="space-y-3">
              {dashboard.upcomingBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {booking.serviceName} - {booking.customerName}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {formatDate(booking.bookingDate)} • {booking.timeSlot}
                  </p>
                  {booking.notes ? (
                    <p className="mt-1 text-xs text-slate-500">{booking.notes}</p>
                  ) : null}
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-amber-700">
                    {booking.status}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {booking.status === BookingStatus.PENDING ? (
                      <>
                        <form action={updateProviderBookingStatusAction}>
                          <input type="hidden" name="bookingId" value={booking.id} />
                          <input type="hidden" name="status" value={BookingStatus.CONFIRMED} />
                          <button
                            type="submit"
                            className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                          >
                            Accept
                          </button>
                        </form>

                        <form action={updateProviderBookingStatusAction}>
                          <input type="hidden" name="bookingId" value={booking.id} />
                          <input type="hidden" name="status" value={BookingStatus.REJECTED} />
                          <button
                            type="submit"
                            className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                          >
                            Reject
                          </button>
                        </form>
                      </>
                    ) : null}

                    {booking.status === BookingStatus.CONFIRMED ? (
                      <form action={updateProviderBookingStatusAction}>
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <input type="hidden" name="status" value={BookingStatus.COMPLETED} />
                        <button
                          type="submit"
                          className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                        >
                          Mark Completed
                        </button>
                      </form>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>

        <div className="space-y-6">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Set Availability</h2>
            <form action={upsertAvailabilitySlotAction} className="mt-4 space-y-3">
              <div>
                <label htmlFor="dayOfWeek" className="mb-1 block text-sm font-medium text-slate-700">
                  Day
                </label>
                <select
                  id="dayOfWeek"
                  name="dayOfWeek"
                  defaultValue={Weekday.MONDAY}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-primary"
                >
                  {daysOrder.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="timeSlot" className="mb-1 block text-sm font-medium text-slate-700">
                  Time Slot
                </label>
                <select
                  id="timeSlot"
                  name="timeSlot"
                  defaultValue={BOOKING_TIME_SLOTS[0]}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-primary"
                >
                  {BOOKING_TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" name="isAvailable" defaultChecked />
                Slot is available
              </label>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
              >
                Save Slot
              </button>
            </form>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Current Availability</h2>
            {dashboard.availabilitySlots.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No slots configured yet.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {dashboard.availabilitySlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {slot.dayOfWeek} • {slot.timeSlot}
                      </p>
                      <p className="text-xs text-slate-500">
                        {slot.isAvailable ? "Available" : "Unavailable"}
                      </p>
                    </div>
                    <form action={removeAvailabilitySlotAction}>
                      <input type="hidden" name="slotId" value={slot.id} />
                      <button
                        type="submit"
                        className="rounded-md border border-rose-300 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
