import { Award, Clock3, ShieldCheck, Sparkles, Target, Users } from "lucide-react";

const values = [
  {
    title: "Verified Professionals",
    description:
      "Every service partner is screened for quality, professionalism, and trust.",
    icon: <ShieldCheck size={22} />,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-700",
  },
  {
    title: "Fast Response",
    description:
      "Quick booking and rapid service assignment for urgent home requirements.",
    icon: <Clock3 size={22} />,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
  },
  {
    title: "Quality First",
    description:
      "We focus on service quality and customer satisfaction in every booking.",
    icon: <Award size={22} />,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
];

const milestones = [
  { label: "Customers Served", value: "10,000+" },
  { label: "Verified Providers", value: "500+" },
  { label: "Cities Covered", value: "50+" },
  { label: "Average Rating", value: "4.9/5" },
];

export default function AboutUsPage() {
  return (
    <main className="bg-white">
      <section className="relative mt-8 overflow-hidden rounded-3xl border border-cyan-100 bg-linear-to-br from-cyan-50 via-white to-emerald-50 px-6 py-14 md:px-10">
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-cyan-200/40 blur-2xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-emerald-200/40 blur-2xl" />

        <div className="relative max-w-4xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-xs font-semibold tracking-widest text-cyan-700 uppercase">
            <Sparkles size={12} />
            About HomeServePro
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-slate-900 md:text-5xl">
            Reliable Home Services,
            <br />
            Built Around Trust
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-600">
            HomeServePro connects homeowners with trusted local professionals for
            cleaning, repairs, plumbing, painting, electrical, and moving services.
            We combine simple booking with verified providers to make home care stress-free.
          </p>
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
            <Target size={22} />
          </div>
          <h2 className="mb-2 text-xl font-bold text-slate-900">Our Mission</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            To make dependable home services accessible for every household through
            transparent pricing, fast availability, and high-quality provider standards.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Users size={22} />
          </div>
          <h2 className="mb-2 text-xl font-bold text-slate-900">Our Vision</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            To become the most trusted home service platform by delivering consistent
            quality and creating long-term relationships between customers and providers.
          </p>
        </article>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {values.map((value) => (
          <article
            key={value.title}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <div
              className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${value.iconBg} ${value.iconColor}`}
            >
              {value.icon}
            </div>
            <h3 className="mb-2 text-base font-bold text-slate-900">{value.title}</h3>
            <p className="text-[13px] leading-relaxed text-slate-500">{value.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-12 mb-6 rounded-3xl border border-slate-100 bg-slate-50 p-6 md:p-8">
        <h2 className="text-2xl font-black text-slate-900">Our Impact So Far</h2>
        <p className="mt-2 text-sm text-slate-500">
          Built with a customer-first approach and powered by verified local talent.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.label}
              className="rounded-xl border border-slate-200 bg-white px-4 py-5 text-center"
            >
              <p className="text-2xl font-black text-slate-900">{milestone.value}</p>
              <p className="mt-1 text-xs text-slate-500">{milestone.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
