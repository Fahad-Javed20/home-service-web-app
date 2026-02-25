import { useState } from "react";
import { Search } from "lucide-react";
import {
  FaBroom,
  FaWrench,
  FaTruck,
  FaBolt,
} from "react-icons/fa";
import {
  GiPaintRoller,
  GiWarpPipe,
} from "react-icons/gi";

const services = [
  { label: "Cleaning",  icon: <FaBroom  size={28} />, color: "#a855f7" },
  { label: "Repair",    icon: <FaWrench size={28} />, color: "#f97316" },
  { label: "Painting",  icon: <GiPaintRoller size={30} />, color: "#f59e0b" },
  { label: "Shifting",  icon: <FaTruck  size={28} />, color: "#ef4444" },
  { label: "Plumbing",  icon: <GiWarpPipe size={30} />, color: "#f97316" },
  { label: "Electric",  icon: <FaBolt   size={28} />, color: "#3b82f6" },
];

export default function HeroSection() {
  const [query, setQuery] = useState("");

  return (
    <section className="flex flex-col items-center justify-center bg-white px-6 py-14">

      {/* ── Heading ── */}
      <h1 className="text-[2.6rem] font-extrabold text-center text-gray-900 leading-tight mb-2">
        Find Home{" "}
        <span className="text-primary">Service/Repair</span>
        <br />
        Near You
      </h1>

      {/* ── Subtitle ── */}
      <p className="text-gray-400 text-[15px] mt-1 mb-7">
        Explore Best Home Service &amp; Repair near you
      </p>

      {/* ── Search Bar ── */}
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

      {/* ── Service Cards ── */}
      <div className="flex flex-row flex-wrap justify-center gap-3">
        {services.map((service) => (
          <div
            key={service.label}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl cursor-pointer group hover:shadow-md hover:scale-105 transition-all duration-200"
            style={{
              backgroundColor: "#EDE9FE",
              width: 108,
              height: 90,
            }}
          >
            <span style={{ color: service.color }} className="group-hover:scale-110 transition-transform duration-200">
              {service.icon}
            </span>
            <span className="text-[12px] font-semibold text-gray-500 group-hover:text-primary transition-colors leading-none">
              {service.label}
            </span>
          </div>
        ))}
      </div>

    </section>
  );
}