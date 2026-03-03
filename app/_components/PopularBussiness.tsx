import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import type { ServiceProviderCard } from "@/lib/data/providers";
import BookNowButton from "@/app/_components/BookNowButton";

type PopularBusinessProps = {
  providers: ServiceProviderCard[];
};

const categoryColorMap: Record<string, string> = {
  cleaning: "bg-purple-100 text-purple-600",
  repair: "bg-orange-100 text-orange-600",
  plumbing: "bg-cyan-100 text-cyan-700",
  painting: "bg-amber-100 text-amber-700",
  electric: "bg-blue-100 text-blue-700",
};

const fallbackBackgrounds = [
  "#FFF3E0",
  "#FCE4EC",
  "#E3F2FD",
  "#F3E5F5",
  "#E8F5E9",
  "#FFF8E1",
  "#E0F7FA",
];

function getCategoryStyles(categoryName: string) {
  const key = categoryName.toLowerCase();
  return categoryColorMap[key] ?? "bg-gray-100 text-gray-700";
}

export default function PopularBusiness({ providers }: PopularBusinessProps) {
  return (
    <section className="bg-white px-6 py-10 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Popular Business</h2>

      {providers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 py-12 text-center text-sm text-gray-500">
          No providers available yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {providers.map((provider, index) => (
            <div
              key={provider.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
            >
              <div
                className="relative w-full h-37.5 overflow-hidden"
                style={{
                  backgroundColor: fallbackBackgrounds[index % fallbackBackgrounds.length],
                }}
              >
                <Image
                  src={provider.imageUrl ?? "/file.svg"}
                  alt={provider.providerName}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  className={`absolute top-2 left-2 z-10 text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm ${getCategoryStyles(
                    provider.categoryName
                  )}`}
                >
                  {provider.categoryName}
                </span>
              </div>

              <div className="px-3.5 pt-3 pb-3.5">
                <h3 className="text-[14px] font-bold text-gray-900 leading-tight mb-0.5">
                  {provider.serviceName}
                </h3>
                <p className="text-[12px] text-gray-500 mb-1.5">{provider.providerName}</p>
                <div className="flex items-start gap-1 mb-2">
                  <MapPin size={11} className="text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-gray-400 leading-snug">
                    {provider.location}
                  </p>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <Star size={12} className="text-yellow-500 fill-yellow-500" />
                  <p className="text-[11px] text-gray-500">
                    {provider.rating.toFixed(1)} ({provider.totalReviews} reviews)
                  </p>
                </div>

                <BookNowButton
                  providerId={provider.id}
                  className="w-full bg-primary hover:bg-purple-600 active:scale-95 text-white text-[12px] font-semibold py-2 rounded-lg transition-all duration-200"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
