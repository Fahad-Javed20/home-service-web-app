import { CheckCircle, MapPin, Star, Users } from "lucide-react";
import type { HomeStats } from "@/backend/queries/home";

type StatsBannerProps = {
  stats: HomeStats;
};

export default function StatsBanner({ stats }: StatsBannerProps) {
  const items = [
    {
      icon: <CheckCircle size={28} />,
      value: stats.completedServices,
      label: "Services Completed",
      iconBg: "bg-purple-100",
      iconColor: "text-primary",
    },
    {
      icon: <Users size={28} />,
      value: stats.verifiedProviders,
      label: "Verified Providers",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-500",
    },
    {
      icon: <MapPin size={28} />,
      value: stats.citiesCovered,
      label: "Cities Covered",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-500",
    },
    {
      icon: <Star size={28} />,
      value: stats.averageRating,
      label: "Average Rating",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-500",
    },
  ];

  return (
    <section
      className="py-14 px-6"
      style={{
        background:
          "linear-gradient(135deg, #faf5ff 0%, #f0fdf4 40%, #eff6ff 70%, #fff7ed 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-gray-400 text-xs font-semibold tracking-[4px] uppercase mb-10">
          Trusted by thousands nationwide
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.label}
              className="bg-white/70 backdrop-blur-sm border border-white rounded-2xl px-6 py-7 flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
            >
              <div
                className={`${item.iconBg} ${item.iconColor} w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
              >
                {item.icon}
              </div>

              <p className="text-gray-900 text-3xl font-extrabold leading-tight tracking-tight">
                {item.value}
              </p>

              <div className="w-8 h-0.5 bg-primary rounded-full opacity-40" />

              <p className="text-gray-500 text-[13px] font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
