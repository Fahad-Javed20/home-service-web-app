import Link from "next/link";
import { redirect } from "next/navigation";
import { signInAction, signUpAction } from "./actions";
import { getCurrentUser } from "@/lib/server/auth";

type AuthPageProps = {
  searchParams: Promise<{
    mode?: string;
    redirect?: string;
    error?: string;
  }>;
};

function sanitizeRedirectPath(path: string | null | undefined) {
  if (!path) {
    return "/";
  }

  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }

  return path;
}

function buildModeHref(mode: "signin" | "signup", redirectPath: string) {
  const params = new URLSearchParams();
  params.set("mode", mode);
  params.set("redirect", sanitizeRedirectPath(redirectPath));
  return `/auth?${params.toString()}`;
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;
  const mode = params.mode === "signup" ? "signup" : "signin";
  const redirectPath = sanitizeRedirectPath(params.redirect);
  const error = params.error ?? "";
  const user = await getCurrentUser();

  if (user) {
    redirect(redirectPath);
  }

  return (
    <section className="mx-auto grid min-h-[75vh] max-w-6xl items-center gap-6 px-6 py-14 lg:grid-cols-[1fr_430px]">
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-8 shadow-sm">
        <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">
          HomeServePro Account
        </p>
        <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          {mode === "signin"
            ? "Sign in with your database account credentials to continue booking and account management."
            : "Sign up and your account is stored in database instantly. You can then sign in from any device."}
        </p>
        <div className="mt-5 space-y-2 text-sm text-gray-700">
          <p>- Secure session-based login</p>
          <p>- Booking history in your account</p>
          <p>- Fast redirect back to your selected service</p>
        </div>
      </div>

      <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">
          Account Access
        </p>
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {mode === "signin"
            ? "Enter your registered email and password."
            : "Create your user profile and start booking services."}
        </p>

        <div className="mt-5 grid grid-cols-2 rounded-lg bg-gray-100 p-1">
          <Link
            href={buildModeHref("signin", redirectPath)}
            className={`rounded-md px-3 py-2 text-center text-sm font-semibold transition-colors ${
              mode === "signin" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            }`}
          >
            Sign In
          </Link>
          <Link
            href={buildModeHref("signup", redirectPath)}
            className={`rounded-md px-3 py-2 text-center text-sm font-semibold transition-colors ${
              mode === "signup" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            }`}
          >
            Sign Up
          </Link>
        </div>

        {error ? (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {mode === "signin" ? (
          <form action={signInAction} className="mt-5 space-y-4">
            <input type="hidden" name="redirectPath" value={redirectPath} />
            <div>
              <label htmlFor="signin-email" className="mb-1 block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="signin-email"
                name="email"
                type="email"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="signin-password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="signin-password"
                name="password"
                type="password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
            >
              Sign In
            </button>
          </form>
        ) : (
          <form action={signUpAction} className="mt-5 space-y-4">
            <input type="hidden" name="redirectPath" value={redirectPath} />
            <div>
              <label htmlFor="signup-name" className="mb-1 block text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                id="signup-name"
                name="name"
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="signup-email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="signup-password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
            </div>
            <div>
              <label
                htmlFor="signup-confirm-password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Confirm password
              </label>
              <input
                id="signup-confirm-password"
                name="confirmPassword"
                type="password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="Re-enter password"
                minLength={8}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
            >
              Create Account
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
