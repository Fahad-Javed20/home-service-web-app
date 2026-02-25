import { Search, CalendarCheck, Sparkles } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: <Search size={28} />,
    title: "Search Service",
    desc: "Browse through hundreds of verified home service professionals in your area.",
    color: "text-primary",
    bg: "bg-purple-50",
    border: "border-purple-200",
    iconBg: "bg-primary",
  },
  {
    step: "02",
    icon: <CalendarCheck size={28} />,
    title: "Book Appointment",
    desc: "Choose your preferred date and time. Instant confirmation, no waiting around.",
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
    iconBg: "bg-orange-500",
  },
  {
    step: "03",
    icon: <Sparkles size={28} />,
    title: "Get It Done",
    desc: "A verified professional arrives at your door and gets the job done perfectly.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    iconBg: "bg-emerald-500",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Simple Process</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">How It Works</h2>
          <p className="text-gray-400 mt-2 text-[15px]">Get your home service done in 3 easy steps</p>
        </div>

        {/* Steps */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-[18%] right-[18%] h-0.5 bg-gray-100 z-0" />

          {steps.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center w-full md:w-1/3 group">
              {/* Icon circle */}
              <div className={`${s.iconBg} text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform duration-200`}>
                {s.icon}
              </div>
              {/* Step number */}
              <span className={`text-xs font-bold tracking-widest ${s.color} mb-1`}>STEP {s.step}</span>
              <h3 className="text-[16px] font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-gray-400 text-[13px] leading-relaxed max-w-55">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}