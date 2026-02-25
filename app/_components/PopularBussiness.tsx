import Image from "next/image";
import { MapPin } from "lucide-react";

const businesses = [
  {
    id: 1,
    name: "House Cleaning",
    provider: "Jenny Wilson",
    address: "123 North Park Ave, New York",
    category: "Cleaning",
    categoryColor: "bg-purple-100 text-purple-600",
    image:
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=220&fit=crop&crop=top",
    bgColor: "#FFF3E0",
  },
  {
    id: 2,
    name: "Washing Cloths",
    provider: "Diana Potter",
    address: "234 Turner Street, New York",
    category: "Cleaning",
    categoryColor: "bg-purple-100 text-purple-600",
    image:
      "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2FzaGluZyUyMG1hY2hpbmV8ZW58MHx8MHx8fDA%3D",
    bgColor: "#FCE4EC",
  },
  {
    id: 3,
    name: "House Repairing",
    provider: "Richelle Corn",
    address: "445 N Fern Drive, New York",
    category: "Repair",
    categoryColor: "bg-orange-100 text-orange-600",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=220&fit=crop&crop=top",
    bgColor: "#E3F2FD",
  },
  {
    id: 4,
    name: "Bathroom Cleaning",
    provider: "Sherry Wilson",
    address: "124 N Front Street, NC",
    category: "Cleaning",
    categoryColor: "bg-purple-100 text-purple-600",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmF0aHJvb218ZW58MHx8MHx8fDA%3D",
    bgColor: "#F3E5F5",
  },
  {
    id: 5,
    name: "Floor Cleaning",
    provider: "Betty Hill",
    address: "5400 Loop, MI",
    category: "Cleaning",
    categoryColor: "bg-purple-100 text-purple-600",
    image:
      "https://images.unsplash.com/photo-1718152421680-d1580e843cc9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGNsZWFuaW5nfGVufDB8fDB8fHww",
    bgColor: "#E8F5E9",
  },
  {
    id: 6,
    name: "Garage Cleaning",
    provider: "Harry Bruce",
    address: "546 North Street, Chicago",
    category: "Cleaning",
    categoryColor: "bg-purple-100 text-purple-600",
    image:
      "https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2xlYW5pbmclMjBzZXJ2aWNlfGVufDB8fDB8fHww",
    bgColor: "#FFF8E1",
  },
  {
    id: 7,
    name: "Bathroom Cleaning",
    provider: "Bruce Brown",
    address: "414 South Street, Chicago",
    category: "Cleaning",
    categoryColor: "bg-purple-100 text-purple-600",
    image:
      "https://images.unsplash.com/photo-1642755623141-23b3cb4284aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGJhdGhyb29tfGVufDB8fDB8fHww",
    bgColor: "#E0F7FA",
  },
];

export default function PopularBusiness() {
  return (
    <section className="bg-white px-6 py-10 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Popular Business</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {businesses.map((biz) => (
          <div
            key={biz.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
          >
            {/* Image Area using Next.js Image */}
            <div
              className="relative w-full h-37.5 overflow-hidden"
              style={{ backgroundColor: biz.bgColor }}
            >
              <Image
                src={biz.image}
                alt={biz.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
              {/* Category Badge */}
              <span
                className={`absolute top-2 left-2 z-10 text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${biz.categoryColor} shadow-sm`}
              >
                {biz.category}
              </span>
            </div>

            {/* Card Body */}
            <div className="px-3.5 pt-3 pb-3.5">
              <h3 className="text-[14px] font-bold text-gray-900 leading-tight mb-0.5">
                {biz.name}
              </h3>
              <p className="text-[12px] text-gray-500 mb-1.5">{biz.provider}</p>
              <div className="flex items-start gap-1 mb-3">
                <MapPin size={11} className="text-gray-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-gray-400 leading-snug">
                  {biz.address}
                </p>
              </div>

              <button className="w-full bg-primary hover:bg-purple-600 active:scale-95 text-white text-[12px] font-semibold py-2 rounded-lg transition-all duration-200">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
