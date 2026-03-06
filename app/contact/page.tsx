import { Clock3, Mail, MapPin, MessageSquare, PhoneCall } from "lucide-react";
import { submitContactFormAction } from "@/backend/actions/contact";

type ContactPageProps = {
  searchParams: Promise<{
    status?: string;
    error?: string;
  }>;
};

const contactCards = [
  {
    title: "Call Us",
    detail: "+1 (800) 123-4567",
    sub: "Mon - Sat, 8:00 AM to 8:00 PM",
    icon: <PhoneCall size={20} />,
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-700",
  },
  {
    title: "Email Us",
    detail: "hello@homeservepro.com",
    sub: "We usually reply within a few hours",
    icon: <Mail size={20} />,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
  },
  {
    title: "Visit Office",
    detail: "123 Main Street, New York, NY",
    sub: "Walk-ins available during office hours",
    icon: <MapPin size={20} />,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },
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
      <section className="relative mt-8 overflow-hidden rounded-3xl border border-cyan-100 bg-linear-to-r from-cyan-50 via-white to-emerald-50 px-6 py-12 md:px-10">
        <div className="absolute -right-12 -top-10 h-44 w-44 rounded-full bg-cyan-200/40 blur-2xl" />
        <div className="absolute -bottom-16 -left-12 h-52 w-52 rounded-full bg-emerald-200/40 blur-2xl" />
        <div className="relative">
          <p className="text-xs font-semibold tracking-widest text-cyan-700 uppercase">
            Contact HomeServePro
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-slate-900 md:text-5xl">
            Let us help with your next
            <br />
            home service booking
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
            Need support, have a booking issue, or want to join as a service provider?
            Reach out and our team will assist you quickly.
          </p>
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-4">
          {contactCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
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

          <article className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
            <h3 className="text-[15px] font-bold text-slate-900">Support Hours</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                <Clock3 size={14} className="text-primary" />
                Monday - Saturday: 8:00 AM - 8:00 PM
              </p>
              <p className="flex items-center gap-2">
                <Clock3 size={14} className="text-primary" />
                Sunday: 10:00 AM - 4:00 PM
              </p>
              <p className="flex items-center gap-2">
                <MessageSquare size={14} className="text-primary" />
                Live chat available during support hours
              </p>
            </div>
          </article>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-slate-900">Send us a message</h2>
          <p className="mt-1 text-sm text-slate-500">
            Fill the form and our team will get back to you shortly.
          </p>

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

          <form action={submitContactFormAction} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-primary focus:bg-white"
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
                  placeholder="+1 (___) ___-____"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-primary focus:bg-white"
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
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-primary focus:bg-white"
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
                placeholder="How can we help?"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-primary focus:bg-white"
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
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:border-primary focus:bg-white"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
