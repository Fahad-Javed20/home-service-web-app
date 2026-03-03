import { Award, Clock3, ShieldCheck, Sparkles, Target, Users } from "lucide-react";

const values = [
  {
    title: "Verified Professionals",
    description:
      "Every service partner is screened for quality, professionalism, and trust.",
    icon: <ShieldCheck size={22} />,
    iconBg: "bg-purple-100",
    iconColor: "text-primary",
  },
  {
    title: "Fast Response",
    description:
      "Quick booking and rapid service assignment for urgent home requirements.",
    icon: <Clock3 size={22} />,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Quality First",
    description:
      "We focus on service quality and customer satisfaction in every booking.",
    icon: <Award size={22} />,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
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
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 via-white to-indigo-50 border border-purple-100 px-6 md:px-10 py-14 mt-8">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-purple-200/40 blur-2xl" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-blue-200/40 blur-2xl" />

        <div className="relative max-w-4xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-3 py-1 text-xs font-semibold text-primary tracking-widest uppercase">
            <Sparkles size={12} />
            About HomeServePro
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-4 leading-tight">
            Reliable Home Services,
            <br />
            Built Around Trust
          </h1>
          <p className="text-gray-600 text-[15px] mt-5 max-w-2xl leading-relaxed">
            HomeServePro connects homeowners with trusted local professionals for
            cleaning, repairs, plumbing, painting, electrical, and shifting services.
            We combine simple booking with verified providers to make home care stress-free.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-primary flex items-center justify-center mb-4">
            <Target size={22} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            To make dependable home services accessible for every household through
            transparent pricing, fast availability, and high-quality provider standards.
          </p>
        </article>

        <article className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
            <Users size={22} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Our Vision</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            To become the most trusted home service platform by delivering consistent
            quality and creating long-term relationships between customers and providers.
          </p>
        </article>
      </section>

      <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        {values.map((value) => (
          <article
            key={value.title}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div
              className={`w-11 h-11 rounded-xl ${value.iconBg} ${value.iconColor} flex items-center justify-center mb-4`}
            >
              {value.icon}
            </div>
            <h3 className="text-[16px] font-bold text-gray-900 mb-2">{value.title}</h3>
            <p className="text-gray-500 text-[13px] leading-relaxed">{value.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-12 mb-6 rounded-3xl border border-gray-100 bg-[#F8F7FF] p-6 md:p-8">
        <h2 className="text-2xl font-extrabold text-gray-900">Our Impact So Far</h2>
        <p className="text-gray-500 text-sm mt-2">
          Built with a customer-first approach and powered by verified local talent.
        </p>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.label}
              className="rounded-xl border border-purple-100 bg-white px-4 py-5 text-center"
            >
              <p className="text-2xl font-extrabold text-gray-900">{milestone.value}</p>
              <p className="text-xs text-gray-500 mt-1">{milestone.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
