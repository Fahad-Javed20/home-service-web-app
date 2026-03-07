import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  MapPinHouse,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const milestones = [
  { label: "Bookings Completed", value: "25,000+" },
  { label: "Verified Service Partners", value: "1,200+" },
  { label: "Cities Across Pakistan", value: "35+" },
  { label: "Average Customer Rating", value: "4.8/5" },
];

const values = [
  {
    title: "Strict Partner Verification",
    description:
      "Every provider goes through identity checks, background review, and quality screening before going live.",
    icon: <ShieldCheck size={20} />,
    iconWrap: "bg-cyan-100 text-cyan-700",
  },
  {
    title: "Fast, Reliable Fulfillment",
    description:
      "From same-day plumbing emergencies to scheduled deep cleaning, requests are assigned quickly and clearly.",
    icon: <Clock3 size={20} />,
    iconWrap: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Local Market Understanding",
    description:
      "We tailor services for Pakistani homes and neighborhoods with practical pricing and local support.",
    icon: <MapPinHouse size={20} />,
    iconWrap: "bg-amber-100 text-amber-700",
  },
];

const roadmap = [
  {
    title: "1. Request Received",
    description:
      "Customers select a service, preferred date, and location in a few simple steps.",
  },
  {
    title: "2. Smart Matching",
    description:
      "Nearby qualified providers are ranked using availability, rating, and service relevance.",
  },
  {
    title: "3. Service Delivery",
    description:
      "Providers arrive on schedule, complete the job, and share status updates through the platform.",
  },
  {
    title: "4. Quality Follow-up",
    description:
      "Post-service reviews and support feedback keep standards high across all partner profiles.",
  },
];

export default function AboutUsPage() {
  return (
    <main className="bg-white">
      <section className="relative mt-8 overflow-hidden rounded-3xl border border-cyan-100 bg-linear-to-br from-cyan-50 via-white to-emerald-50 px-6 py-12 md:px-10">
        <div className="absolute -right-20 -top-16 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="absolute -left-16 -bottom-20 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/90 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-cyan-700 uppercase">
              <Sparkles size={12} />
              About HomeServePro Pakistan
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-slate-900 md:text-5xl">
              Modern Home Services,
              <br />
              Built for Real Life
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-600">
              HomeServePro helps families and businesses across Pakistan book trusted cleaning,
              electrical, plumbing, painting, appliance repair, and moving professionals with
              transparent pricing and real-time availability.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="rounded-xl px-5">
                <Link href="/serviceproviders">
                  Explore Providers
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl border-cyan-200 px-5">
                <Link href="/contact">Talk to Support</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-100 bg-white/90 p-6 shadow-lg shadow-cyan-100/40">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <BadgeCheck size={14} />
              Trusted by homeowners nationwide
            </div>
            <h2 className="text-xl font-black text-slate-900">Customer-first from day one</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              We started with one goal: remove uncertainty from home services. Every workflow,
              from provider verification to booking updates, is designed around trust and clarity.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {milestones.slice(0, 2).map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-lg font-black text-slate-900">{item.value}</p>
                  <p className="text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-4">
        {milestones.map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-2xl font-black text-slate-900">{item.value}</p>
            <p className="mt-1 text-xs tracking-wide text-slate-500 uppercase">{item.label}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        {values.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg"
          >
            <div
              className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${item.iconWrap}`}
            >
              {item.icon}
            </div>
            <h3 className="text-base font-extrabold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 mb-6 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-7 md:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
            How We Deliver Quality
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-900">Simple flow, strong execution</h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {roadmap.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-cyan-800">
            <Target size={16} />
            Building Pakistan&apos;s most trusted home services network
          </div>
          <Button asChild variant="outline" className="rounded-lg border-cyan-300 bg-white">
            <Link href="/serviceproviders">Browse Verified Experts</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
