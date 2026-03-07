import {
  ArrowRight,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  PhoneCall,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { submitContactFormAction } from "@/backend/actions/contact";
import { Button } from "@/components/ui/button";

type ContactPageProps = {
  searchParams: Promise<{
    status?: string;
    error?: string;
  }>;
};

const contactCards = [
  {
    title: "Call Support",
    detail: "+92 21 111 467 377",
    sub: "Mon - Sat, 9:00 AM to 9:00 PM",
    icon: <PhoneCall size={20} />,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-700",
  },
  {
    title: "Email Team",
    detail: "support@homeservepro.pk",
    sub: "Average reply time: under 2 hours",
    icon: <Mail size={20} />,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
  },
  {
    title: "Head Office",
    detail: "Shahrah-e-Faisal, Karachi",
    sub: "Walk-ins by appointment",
    icon: <MapPin size={20} />,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
];

const supportHighlights = [
  "Booking changes and rescheduling",
  "Provider verification and onboarding",
  "Payment, invoice, and refund support",
  "Commercial and recurring service plans",
];

function getStatusMessage(status: string | undefined) {
  if (status === "message-sent") {
    return "Message sent successfully. Our team will contact you shortly.";
  }

  return "";
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const statusMessage = getStatusMessage(params.status);

  return (
    <main className="bg-white">
      <section className="relative mt-8 overflow-hidden rounded-3xl border border-cyan-100 bg-linear-to-br from-cyan-50 via-white to-emerald-50 px-6 py-12 md:px-10">
        <div className="absolute -right-16 -top-14 h-56 w-56 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="relative max-w-4xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/90 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-cyan-700 uppercase">
            <Sparkles size={12} />
            Contact HomeServePro
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-slate-900 md:text-5xl">
            Let&apos;s solve your home
            <br />
            service request fast
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
            Need booking support, provider onboarding help, or business service packages? Send us
            your details and our operations team will get back with a practical solution.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5">
              <ShieldCheck size={13} className="text-emerald-600" />
              Verified support workflows
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5">
              <Clock3 size={13} className="text-cyan-700" />
              Same-day response on priority issues
            </span>
          </div>
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          {contactCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}
              >
                {card.icon}
              </div>
              <h2 className="text-base font-bold text-slate-900">{card.title}</h2>
              <p className="mt-1 text-sm font-semibold text-slate-700">{card.detail}</p>
              <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
            </article>
          ))}

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-[15px] font-bold text-slate-900">Support Hours</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <Clock3 size={14} className="text-primary" />
                Monday - Saturday: 9:00 AM - 9:00 PM
              </p>
              <p className="flex items-center gap-2">
                <Clock3 size={14} className="text-primary" />
                Sunday: 11:00 AM - 5:00 PM
              </p>
              <p className="flex items-center gap-2">
                <MessageSquare size={14} className="text-primary" />
                Live chat available during support hours
              </p>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
              <h4 className="text-sm font-bold text-slate-900">Common Requests</h4>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                {supportHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="absolute -top-14 -right-8 h-40 w-40 rounded-full bg-cyan-100/70 blur-2xl" />
          <div className="absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-emerald-100/70 blur-2xl" />
          <div className="relative">
            <h2 className="text-xl font-extrabold text-slate-900">Send us a message</h2>
            <p className="mt-1 text-sm text-slate-500">
              Share complete details so we can respond with a useful solution, not a generic reply.
            </p>
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

          <form action={submitContactFormAction} className="relative mt-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+92 3XX XXXXXXX"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="How can we help you today?"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Write your message..."
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                required
              />
            </div>

            <Button type="submit" className="w-full rounded-xl py-6 text-sm font-semibold">
              Send Message
              <ArrowRight size={16} />
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
