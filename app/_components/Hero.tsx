'use client';
import { useState } from "react";
import { Search } from "lucide-react";

const services = [
  {
    label: "Cleaning",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
        <path d="M20 4C20 4 12 10 12 20C12 24.4 14.6 28.2 18 30.4V36H22V30.4C25.4 28.2 28 24.4 28 20C28 10 20 4 20 4Z" fill="#a855f7" opacity="0.15"/>
        <path d="M20 6C20 6 13 11.5 13 20C13 24.1 15.3 27.6 18.5 29.6V35H21.5V29.6C24.7 27.6 27 24.1 27 20C27 11.5 20 6 20 6Z" stroke="#a855f7" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M17 22C17 22 18 20 20 20C22 20 23 22 23 22" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M20 6V20" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15 14L20 17" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M25 14L20 17" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    color: "from-violet-100 to-purple-50",
  },
  {
    label: "Repair",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
        <path d="M28 8C25.2 8 23 10.2 23 13C23 13.7 23.15 14.36 23.4 14.96L10 28.4C9.4 29 9.4 30 10 30.6L10.6 31.2C11.2 31.8 12.2 31.8 12.8 31.2L26.2 17.8C26.8 18.05 27.46 18.2 28 18.2C30.8 18.2 33 16 33 13.2C33 12.6 32.88 12.02 32.66 11.5L29.5 14.66L27.34 14.66L25.34 12.66L25.34 10.5L28.5 7.34C28.34 7.12 28.18 7 28 8Z" fill="#f97316" opacity="0.15"/>
        <path d="M28 7C25.2 7 23 9.2 23 12C23 12.7 23.15 13.36 23.4 13.96L10 27.4C9.4 28 9.4 29 10 29.6L11.4 31C12 31.6 13 31.6 13.6 31L27 17.6C27.6 17.85 28.26 18 28.8 18C31.6 18 33.8 15.8 33.8 13C33.8 12.4 33.68 11.82 33.46 11.3L30.3 14.46L28.14 14.46L26.14 12.46L26.14 10.3L29.3 7.14C28.88 7.05 28.44 7 28 7Z" stroke="#f97316" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="12" cy="29" r="1.5" fill="#f97316"/>
      </svg>
    ),
    color: "from-orange-100 to-amber-50",
  },
  {
    label: "Painting",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
        <rect x="8" y="8" width="18" height="4" rx="2" fill="#ec4899" opacity="0.2"/>
        <rect x="8" y="8" width="18" height="4" rx="2" stroke="#ec4899" strokeWidth="1.5"/>
        <path d="M14 12V28C14 29.1 14.9 30 16 30H18C19.1 30 20 29.1 20 28V12" stroke="#ec4899" strokeWidth="1.5"/>
        <path d="M25 12V18C25 18 28 18 28 21C28 24 25 24 25 24V28" stroke="#ec4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="25" cy="30" r="2" fill="#ec4899" opacity="0.6"/>
        <circle cx="25" cy="30" r="2" stroke="#ec4899" strokeWidth="1.2"/>
      </svg>
    ),
    color: "from-pink-100 to-rose-50",
  },
  {
    label: "Shifting",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
        <rect x="6" y="14" width="22" height="14" rx="2" fill="#ef4444" opacity="0.15"/>
        <rect x="6" y="14" width="22" height="14" rx="2" stroke="#ef4444" strokeWidth="1.5"/>
        <path d="M28 18H32L35 24V28H28V18Z" fill="#ef4444" opacity="0.15" stroke="#ef4444" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="12" cy="30" r="2.5" fill="white" stroke="#ef4444" strokeWidth="1.5"/>
        <circle cx="30" cy="30" r="2.5" fill="white" stroke="#ef4444" strokeWidth="1.5"/>
        <path d="M10 18H20" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 22H16" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    color: "from-red-100 to-orange-50",
  },
  {
    label: "Plumbing",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
        <path d="M14 8H18V16H26V20H18V28H22V32H14V8Z" fill="#06b6d4" opacity="0.15"/>
        <path d="M14 8H18V16H26V20H18V28H22V32H14V8Z" stroke="#06b6d4" strokeWidth="1.5" strokeLinejoin="round"/>
        <rect x="24" y="16" width="6" height="4" rx="1" fill="#06b6d4" opacity="0.3" stroke="#06b6d4" strokeWidth="1.2"/>
        <path d="M10 20H14" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 6V8" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 32V34" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    color: "from-cyan-100 to-sky-50",
  },
  {
    label: "Electric",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
        <path d="M22 7L11 22H20L18 33L29 18H20L22 7Z" fill="#eab308" opacity="0.2"/>
        <path d="M22 7L11 22H20L18 33L29 18H20L22 7Z" stroke="#eab308" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      </svg>
    ),
    color: "from-yellow-100 to-amber-50",
  },
];

export default function HeroSection() {
  const [query, setQuery] = useState("");

  return (
    <section className="min-h-105 flex flex-col items-center justify-center bg-white px-4 py-16">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center text-gray-900 leading-tight mb-3">
        Find Home{" "}
        <span className="text-primary">Service/Repair</span>
        <br />
        Near You
      </h1>

      {/* Subtitle */}
      <p className="text-gray-500 text-base mb-6">
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
            className={`flex flex-col items-center gap-3 bg-linear-to-br ${service.color} hover:scale-105 hover:shadow-md transition-all duration-200 rounded-2xl px-7 py-6 w-32 cursor-pointer group border border-white shadow-sm`}
          >
            <div className="flex items-center justify-center">
              {service.icon}
            </div>
            <span className="text-xs text-gray-600 font-semibold group-hover:text-primary transition-colors">
              {service.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}