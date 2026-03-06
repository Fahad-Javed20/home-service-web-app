import Link from "next/link";
import { redirect } from "next/navigation";
import { signInAction, signUpAction } from "@/backend/actions/auth";
import { getCurrentUser } from "@/backend/auth/session";
import {
  getDashboardPathByRole,
  normalizeRedirectPath,
} from "@/backend/auth/role-routes";

type AuthPageProps = {
  searchParams: Promise<{
    mode?: string;
    redirect?: string;
    error?: string;
  }>;
};

function buildModeHref(mode: "signin" | "signup", redirectPath: string) {
  const params = new URLSearchParams();
  params.set("mode", mode);
  params.set("redirect", normalizeRedirectPath(redirectPath));
  return `/auth?${params.toString()}`;
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;
  const mode = params.mode === "signup" ? "signup" : "signin";
  const redirectPath = normalizeRedirectPath(params.redirect);
  const error = params.error ?? "";
  const user = await getCurrentUser();

  if (user) {
    const targetPath =
      redirectPath !== "/" ? redirectPath : getDashboardPathByRole(user.role);
    redirect(targetPath);
  }

  return (
    <section className="mx-auto grid min-h-[78vh] max-w-6xl items-center gap-6 px-6 py-12 lg:grid-cols-[1.05fr_440px]">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-br from-sky-50 via-white to-emerald-50 p-8 shadow-sm md:p-10">
        <div className="absolute -right-20 -top-16 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />

        <div className="relative space-y-5">
          <p className="text-xs font-semibold tracking-widest uppercase text-sky-700">
            Secure Account Access
          </p>
          <h1 className="text-3xl font-black leading-tight text-slate-900 md:text-4xl">
            {mode === "signin" ? "Welcome Back to HomeServePro" : "Create Your HomeServePro Account"}
          </h1>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            {mode === "signin"
              ? "Sign in to manage bookings, track service progress, and continue where you left off."
              : "Sign up as a customer or service provider. Your credentials are stored securely and verified at sign in."}
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            <article className="rounded-xl border border-white/70 bg-white/90 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Security</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">Hashed Passwords</p>
            </article>
            <article className="rounded-xl border border-white/70 bg-white/90 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Routing</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">Role-Based Dashboards</p>
            </article>
            <article className="rounded-xl border border-white/70 bg-white/90 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Flow</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">Server Action Forms</p>
            </article>
          </div>
        </div>
      </div>

      <div className="w-full rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">
          Account Portal
        </p>
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {mode === "signin"
            ? "Use your registered email and password."
            : "Create your account in less than a minute."}
        </p>

        <div className="mt-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <Link
            href={buildModeHref("signin", redirectPath)}
            className={`rounded-lg px-3 py-2 text-center text-sm font-semibold transition-colors ${
              mode === "signin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            Sign In
          </Link>
          <Link
            href={buildModeHref("signup", redirectPath)}
            className={`rounded-lg px-3 py-2 text-center text-sm font-semibold transition-colors ${
              mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary"
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary"
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary"
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="signup-account-type"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Account type
              </label>
              <select
                id="signup-account-type"
                name="accountType"
                defaultValue="user"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="user">Customer</option>
                <option value="provider">Service Provider</option>
              </select>
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary"
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-primary"
                placeholder="Re-enter password"
                minLength={8}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
            >
              Create Account
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
