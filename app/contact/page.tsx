import { Clock3, Mail, MapPin, MessageSquare, PhoneCall } from "lucide-react";

const contactCards = [
  {
    title: "Call Us",
    detail: "+1 (800) 123-4567",
    sub: "Mon - Sat, 8:00 AM to 8:00 PM",
    icon: <PhoneCall size={20} />,
    iconBg: "bg-purple-100",
    iconColor: "text-primary",
  },
  {
    title: "Email Us",
    detail: "hello@homeservepro.com",
    sub: "We usually reply within a few hours",
    icon: <Mail size={20} />,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Visit Office",
    detail: "123 Main Street, New York, NY",
    sub: "Walk-ins available during office hours",
    icon: <MapPin size={20} />,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

export default function ContactPage() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden rounded-3xl border border-purple-100 bg-gradient-to-r from-purple-50 via-white to-indigo-50 px-6 md:px-10 py-12 mt-8">
        <div className="absolute -right-12 -top-10 w-44 h-44 bg-purple-200/40 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-primary text-xs font-semibold tracking-widest uppercase">
            Contact HomeServePro
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 leading-tight">
            Let us help with your next
            <br />
            home service booking
          </h1>
          <p className="text-gray-600 text-sm mt-4 max-w-2xl leading-relaxed">
            Need support, have a booking issue, or want to join as a service provider?
            Reach out and our team will assist you quickly.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 mt-10">
        <div className="space-y-4">
          {contactCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div
                className={`w-11 h-11 rounded-xl ${card.iconBg} ${card.iconColor} flex items-center justify-center mb-4`}
              >
                {card.icon}
              </div>
              <h2 className="text-[16px] font-bold text-gray-900">{card.title}</h2>
              <p className="text-sm font-semibold text-gray-700 mt-1">{card.detail}</p>
              <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
            </article>
          ))}

          <article className="rounded-2xl border border-gray-100 bg-[#F8F7FF] p-5">
            <h3 className="text-[15px] font-bold text-gray-900">Support Hours</h3>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
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

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-extrabold text-gray-900">Send us a message</h2>
          <p className="text-sm text-gray-500 mt-1">
            Fill the form and our team will get back to you shortly.
          </p>

          <form className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-primary focus:bg-white"
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (___) ___-____"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-primary focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-primary focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="subject" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="How can we help?"
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-primary focus:bg-white"
              />
            </div>

            <div>
              <label htmlFor="message" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Write your message..."
                className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-primary focus:bg-white resize-none"
              />
            </div>

            <button
              type="button"
              className="w-full rounded-xl bg-primary hover:bg-purple-700 text-white font-semibold text-sm py-3 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
