import Image from "next/image";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Sarah Johnson",
    role: "Homeowner, New York",
    rating: 5,
    text: "Absolutely fantastic service! The cleaner arrived on time, was super professional, and left my apartment spotless. Will definitely book again.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Michael Chen",
    role: "Apartment Owner, Chicago",
    rating: 5,
    text: "The plumber fixed the leak in under an hour. Very transparent about pricing with no hidden fees. Exactly what I needed.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Emily Rodriguez",
    role: "Tenant, Los Angeles",
    rating: 5,
    text: "I love how easy it is to book. Found a painter, scheduled for the next day, and the results were beyond my expectations!",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">Happy Customers</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">What People Say</h2>
          <p className="text-gray-400 mt-2 text-[15px]">Trusted by thousands of homeowners across the country</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-[#F8F7FF] rounded-2xl p-6 border border-purple-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col gap-4"
            >
              {/* Quote icon */}
              <Quote size={24} className="text-primary opacity-30" />

              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Review text */}
              <p className="text-gray-600 text-[13px] leading-relaxed flex-1">&quot;{r.text}&quot;</p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 pt-2 border-t border-purple-100">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <Image src={r.avatar} alt={r.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-gray-900">{r.name}</p>
                  <p className="text-[11px] text-gray-400">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}