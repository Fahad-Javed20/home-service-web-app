import Image from "next/image";
import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/backend/queries/home";

type TestimonialsProps = {
  testimonials: Testimonial[];
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">
            Happy Customers
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">What People Say</h2>
          <p className="text-gray-400 mt-2 text-[15px]">
            Trusted by thousands of homeowners across the country
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 py-12 text-center text-sm text-gray-500">
            No customer testimonials available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-[#F8F7FF] rounded-2xl p-6 border border-purple-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col gap-4"
              >
                <Quote size={24} className="text-primary opacity-30" />

                <div className="flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, index) => (
                    <Star
                      key={index}
                      size={14}
                      className="text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-gray-600 text-[13px] leading-relaxed flex-1">
                  &quot;{testimonial.text}&quot;
                </p>

                <div className="flex items-center gap-3 pt-2 border-t border-purple-100">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-purple-100 text-primary text-xs font-bold flex items-center justify-center">
                    {testimonial.avatar ? (
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      getInitials(testimonial.name)
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-[11px] text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
