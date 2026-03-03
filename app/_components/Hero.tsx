'use client';

import { useState } from "react";
import { Search } from "lucide-react";
import { FaBolt, FaBroom, FaTruck, FaWrench } from "react-icons/fa";
import { GiPaintRoller, GiWarpPipe } from "react-icons/gi";
import Link from "next/link";
import type { HeroCategory } from "@/lib/data/home";

type HeroSectionProps = {
  categories: HeroCategory[];
};

const categoryIconMap = {
  cleaning: <FaBroom size={28} />,
  repair: <FaWrench size={28} />,
  painting: <GiPaintRoller size={30} />,
  shifting: <FaTruck size={28} />,
  moving: <FaTruck size={28} />,
  plumbing: <GiWarpPipe size={30} />,
  electric: <FaBolt size={28} />,
  electrical: <FaBolt size={28} />,
} as const;

const categoryColorMap = {
  cleaning: "#a855f7",
  repair: "#f97316",
  painting: "#f59e0b",
  shifting: "#ef4444",
  moving: "#ef4444",
  plumbing: "#f97316",
  electric: "#3b82f6",
  electrical: "#3b82f6",
} as const;

const fallbackColors = ["#a855f7", "#f97316", "#f59e0b", "#ef4444", "#3b82f6"];

function normalizeLabel(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function getCategoryVisual(category: HeroCategory, index: number) {
  const iconKey = normalizeLabel(category.icon);
  const labelKey = normalizeLabel(category.name);

  const resolvedIcon =
    categoryIconMap[iconKey as keyof typeof categoryIconMap] ??
    categoryIconMap[labelKey as keyof typeof categoryIconMap] ??
    <Search size={28} />;

  const resolvedColor =
    categoryColorMap[iconKey as keyof typeof categoryColorMap] ??
    categoryColorMap[labelKey as keyof typeof categoryColorMap] ??
    fallbackColors[index % fallbackColors.length];

  return {
    icon: resolvedIcon,
    color: resolvedColor,
  };
}

export default function HeroSection({ categories }: HeroSectionProps) {
  const [query, setQuery] = useState("");

  return (
    <section className="flex flex-col items-center justify-center bg-white px-6 py-14">
      <h1 className="text-[2.6rem] font-bold text-center text-gray-900 leading-tight mb-2">
        Find Home <span className="text-primary">Service/Repair</span>
        <br />
        Near You
      </h1>

      <p className="text-gray-400 text-[15px] mt-1 mb-7">
        Explore Best Home Service &amp; Repair near you
      </p>

      <div className="flex items-center w-full max-w-100 bg-white border border-gray-200 rounded-full shadow-sm mb-10 pr-1">
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 pl-5 pr-2 py-3 text-sm text-gray-500 outline-none bg-transparent placeholder-gray-400 rounded-full"
        />
        <button className="bg-primary hover:bg-purple-600 transition-colors rounded-full p-2.5 m-0.75 flex items-center justify-center">
          <Search className="w-4 h-4 text-white" />
        </button>
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-gray-500">No service categories available yet.</p>
      ) : (
        <div className="flex flex-row flex-wrap justify-center gap-3">
          {categories.map((category, index) => {
            const visual = getCategoryVisual(category, index);

            return (
              <Link
                key={category.id}
                href={`/serviceproviders?category=${category.id}`}
                className="block"
              >
                <div
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl cursor-pointer group hover:shadow-md hover:scale-105 transition-all duration-200"
                  style={{
                    backgroundColor: "#EDE9FE",
                    width: 150,
                    height: 110,
                  }}
                >
                  <span
                    style={{ color: visual.color }}
                    className="group-hover:scale-110 transition-transform duration-200"
                  >
                    {visual.icon}
                  </span>
                  <span className="text-[12px] font-semibold text-gray-500 group-hover:text-primary transition-colors leading-none">
                    {category.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
