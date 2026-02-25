import { useState } from "react";
import { Search } from "lucide-react";

const services = [
  {
    label: "Cleaning",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <circle cx="24" cy="24" r="20" fill="#EDE9FE" />
        <text x="24" y="30" textAnchor="middle" fontSize="20">🧹</text>
      </svg>
    ),
  },
  {
    label: "Repair",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <circle cx="24" cy="24" r="20" fill="#EDE9FE" />
        <text x="24" y="30" textAnchor="middle" fontSize="20">🔧</text>
      </svg>
    ),
  },
  {
    label: "Painting",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <circle cx="24" cy="24" r="20" fill="#EDE9FE" />
        <text x="24" y="30" textAnchor="middle" fontSize="20">🖌️</text>
      </svg>
    ),
  },
  {
    label: "Shifting",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <circle cx="24" cy="24" r="20" fill="#EDE9FE" />
        <text x="24" y="30" textAnchor="middle" fontSize="20">🚚</text>
      </svg>
    ),
  },
  {
    label: "Plumbing",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <circle cx="24" cy="24" r="20" fill="#EDE9FE" />
        <text x="24" y="30" textAnchor="middle" fontSize="20">🔩</text>
      </svg>
    ),
  },
  {
    label: "Electric",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <circle cx="24" cy="24" r="20" fill="#EDE9FE" />
        <text x="24" y="30" textAnchor="middle" fontSize="20">⚡</text>
      </svg>
    ),
  },
];

export default function HeroSection() {
  const [query, setQuery] = useState("");

  return (
    <section className="min-h-[420px] flex flex-col items-center justify-center bg-white px-4 py-16">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center text-gray-900 leading-tight mb-3">
        Find Home{" "}
        <span className="text-primary">Service/Repair</span>
        <br />
        Near You
      </h1>

      {/* Subtitle */}
      <p className="text-gray-500 text-sm mb-6">
        Explore Best Home Service &amp; Repair near you
      </p>

      {/* Search Bar */}
      <div className="flex items-center w-full max-w-md bg-white border border-gray-200 rounded-full shadow-sm overflow-hidden mb-10">
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-5 py-3 text-sm text-gray-700 outline-none bg-transparent"
        />
        <button className="bg-primary hover:bg-purple-600 transition-colors m-1 rounded-full p-2.5">
          <Search className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Service Categories */}
      <div className="flex flex-wrap justify-center gap-4">
        {services.map((service) => (
          <button
            key={service.label}
            className="flex flex-col items-center gap-2 bg-purple-50 hover:bg-purple-100 transition-colors rounded-2xl px-5 py-4 w-24 cursor-pointer group"
          >
            <div className="text-3xl">{service.icon}</div>
            <span className="text-xs text-gray-600 font-medium group-hover:text-primary transition-colors">
              {service.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}