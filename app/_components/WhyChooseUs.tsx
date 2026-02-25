import { ShieldCheck, Clock, CreditCard, HeadphonesIcon } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck size={26} />,
    title: "Verified Professionals",
    desc: "Every service provider is background-checked, licensed, and rated by real customers.",
    iconBg: "bg-purple-100",
    iconColor: "text-primary",
  },
  {
    icon: <Clock size={26} />,
    title: "Instant Booking",
    desc: "Book in under 60 seconds. Same-day appointments available in most areas.",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    icon: <CreditCard size={26} />,
    title: "Secure Payments",
    desc: "Pay safely online. No cash needed. Full refund if you're not satisfied.",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-500",
  },
  {
    icon: <HeadphonesIcon size={26} />,
    title: "24/7 Support",
    desc: "Our support team is always available to help you before, during, and after service.",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#F8F7FF] py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Our Promise</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Why Choose Us</h2>
          <p className="text-gray-400 mt-2 text-[15px]">We make home services easy, safe, and reliable</p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group flex flex-col items-start gap-4"
            >
              <div className={`${f.iconBg} ${f.iconColor} w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                {f.icon}
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-gray-400 text-[13px] leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}