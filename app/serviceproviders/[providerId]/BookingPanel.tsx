import Link from "next/link";
import { getCurrentUser } from "@/backend/auth/session";
import { createBookingAction } from "@/backend/actions/booking";
import { BOOKING_TIME_SLOTS } from "@/backend/services/booking-service";

type BookingPanelProps = {
  providerId: string;
  providerName: string;
  serviceName: string;
  categoryName: string;
  location: string;
  error?: string;
  status?: string;
};

function todayInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildSignInLink(redirectPath: string) {
  const params = new URLSearchParams();
  params.set("mode", "signin");
  params.set("redirect", redirectPath);
  return `/auth?${params.toString()}`;
}

export default async function BookingPanel({
  providerId,
  providerName,
  serviceName,
  categoryName,
  location,
  error,
  status,
}: BookingPanelProps) {
  const authUser = await getCurrentUser();
  const redirectPath = `/serviceproviders/${providerId}`;
  const today = todayInputValue();

  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm h-fit">
      <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">
        Book Appointment
      </p>
      <h2 className="text-xl font-bold text-gray-900">{serviceName}</h2>
      <p className="text-sm text-gray-500 mt-1">{providerName}</p>
      <p className="mt-2 text-xs text-gray-500">
        {categoryName} • {location}
      </p>

      {status === "booking-created" ? (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Booking created successfully.
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {!authUser ? (
        <div className="mt-5 space-y-3">
          <p className="text-sm text-gray-600">
            Sign in to choose date/day and confirm your appointment.
          </p>
          <Link
            href={buildSignInLink(redirectPath)}
            className="inline-flex w-full justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
          >
            Login / Signup
          </Link>
        </div>
      ) : (
        <form action={createBookingAction} className="mt-5 space-y-4">
          <input type="hidden" name="providerId" value={providerId} />
          <input type="hidden" name="redirectPath" value={redirectPath} />

          <div>
            <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700 mb-1.5">
              Select date
            </label>
            <input
              id="bookingDate"
              name="bookingDate"
              type="date"
              min={today}
              defaultValue={today}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700 mb-1.5">
              Select time slot
            </label>
            <select
              id="timeSlot"
              name="timeSlot"
              defaultValue={BOOKING_TIME_SLOTS[0]}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary"
              required
            >
              {BOOKING_TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
          >
            Book Now
          </button>
        </form>
      )}
    </aside>
  );
}
