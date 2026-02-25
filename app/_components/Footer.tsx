"use client";
import { useState } from "react";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="text-gray-600 body-font">

      {/* Main Links Grid */}
      <div className="container px-5 py-20 mx-auto">
        <div className="flex flex-wrap md:text-left text-center -mb-10 -mx-4">

          {/* Brand col */}
          <div className="lg:w-1/6 md:w-1/2 w-full px-4 mb-10">
            <div className="flex items-center gap-2 mb-4 md:justify-start justify-center">
              <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-extrabold text-xs">HS</span>
              </div>
              <span className="text-gray-900 font-extrabold text-[15px] tracking-tight">HomeServePro</span>
            </div>
            <p className="text-gray-600 text-[13px] leading-relaxed mb-5">
              Your trusted platform for verified home service professionals. Quality work, guaranteed.
            </p>
            {/* Contact info */}
            <div className="flex flex-col gap-2 md:items-start items-center">
              <div className="flex items-center gap-2 text-[12px] text-gray-600 hover:text-primary transition-colors cursor-pointer">
                <MapPin size={12} className="text-primary shrink-0" /> 123 Main Street, New York
              </div>
              <div className="flex items-center gap-2 text-[12px] text-gray-600 hover:text-primary transition-colors cursor-pointer">
                <Phone size={12} className="text-primary shrink-0" /> +1 (800) 123-4567
              </div>
              <div className="flex items-center gap-2 text-[12px] text-gray-600 hover:text-primary transition-colors cursor-pointer">
                <Mail size={12} className="text-primary shrink-0" /> hello@homeservepro.com
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="lg:w-1/6 md:w-1/2 w-full px-4">
            <h2 className="title-font font-bold text-gray-900 tracking-widest text-xs mb-4 uppercase border-b-2 border-primary inline-block pb-1">
              Services
            </h2>
            <nav className="list-none mb-10 flex flex-col gap-2.5">
              {["House Cleaning", "Plumbing", "Electrical", "Painting", "Moving & Shifting", "Appliance Repair"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 hover:text-primary text-[13px] transition-colors duration-200 hover:pl-1 inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div className="lg:w-1/6 md:w-1/2 w-full px-4">
            <h2 className="title-font font-bold text-gray-900 tracking-widest text-xs mb-4 uppercase border-b-2 border-primary inline-block pb-1">
              Company
            </h2>
            <nav className="list-none mb-10 flex flex-col gap-2.5">
              {["About Us", "How It Works", "Pricing", "Blog", "Careers", "Press"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 hover:text-primary text-[13px] transition-colors duration-200 hover:pl-1 inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </nav>
          </div>

          {/* Support */}
          <div className="lg:w-1/6 md:w-1/2 w-full px-4">
            <h2 className="title-font font-bold text-gray-900 tracking-widest text-xs mb-4 uppercase border-b-2 border-primary inline-block pb-1">
              Support
            </h2>
            <nav className="list-none mb-10 flex flex-col gap-2.5">
              {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service", "Cookie Policy", "Sitemap"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 hover:text-primary text-[13px] transition-colors duration-200 hover:pl-1 inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </nav>
          </div>

          {/* For Providers */}
          <div className="lg:w-1/6 md:w-1/2 w-full px-4">
            <h2 className="title-font font-bold text-gray-900 tracking-widest text-xs mb-4 uppercase border-b-2 border-primary inline-block pb-1">
              For Providers
            </h2>
            <nav className="list-none mb-10 flex flex-col gap-2.5">
              {["Join as Provider", "Provider Login", "Dashboard", "Earnings", "Provider Support", "Guidelines"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 hover:text-primary text-[13px] transition-colors duration-200 hover:pl-1 inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </nav>
          </div>

          {/* Top Cities */}
          <div className="lg:w-1/6 md:w-1/2 w-full px-4">
            <h2 className="title-font font-bold text-gray-900 tracking-widest text-xs mb-4 uppercase border-b-2 border-primary inline-block pb-1">
              Top Cities
            </h2>
            <nav className="list-none mb-10 flex flex-col gap-2.5">
              {["New York", "Los Angeles", "Chicago", "Houston", "Miami", "Seattle"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 hover:text-primary text-[13px] transition-colors duration-200 hover:pl-1 inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </nav>
          </div>

        </div>
      </div>

      {/* Newsletter + Social */}
      <div className="border-t border-gray-200">
        <div className="container px-5 py-8 flex flex-wrap mx-auto items-center gap-4">

          {/* Newsletter */}
          <div className="flex md:flex-nowrap flex-wrap justify-center items-end md:justify-start gap-3">
            <div className="relative sm:w-64 w-40">
              <label htmlFor="footer-email" className="leading-7 text-sm text-gray-600 font-medium">
                Subscribe to our newsletter
              </label>
              <input
                type="email"
                id="footer-email"
                name="footer-email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-purple-200 focus:border-primary text-sm outline-none text-gray-700 py-2 px-3 leading-8 transition-all duration-200"
              />
            </div>
            <button
              onClick={() => email && setSubscribed(true)}
              className="inline-flex text-white bg-primary border-0 py-2 px-6 focus:outline-none hover:bg-purple-700 active:scale-95 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {subscribed ? "✓ Subscribed!" : "Subscribe"}
            </button>
            <p className="text-gray-500 text-xs md:ml-2 md:mt-0 mt-2 sm:text-left text-center leading-relaxed">
              Get 20% off your first booking.
              <br className="lg:block hidden" />
              No spam, unsubscribe anytime.
            </p>
          </div>

          {/* Social Icons */}
          <span className="inline-flex lg:ml-auto lg:mt-0 mt-4 w-full justify-center md:justify-start md:w-auto gap-2">
            {[
              { icon: <Facebook size={15} />, label: "Facebook" },
              { icon: <Twitter size={15} />,  label: "Twitter"  },
              { icon: <Instagram size={15} />, label: "Instagram" },
              { icon: <Linkedin size={15} />,  label: "LinkedIn"  },
            ].map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="w-9 h-9 rounded-lg border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 hover:scale-110 hover:shadow-md"
              >
                {s.icon}
              </a>
            ))}
          </span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto py-5 px-5 flex flex-wrap flex-col sm:flex-row items-center">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            © {new Date().getFullYear()}{" "}
            <span className="text-primary font-semibold">HomeServePro</span>
            . All rights reserved.
          </p>
          <span className="sm:ml-auto sm:mt-0 mt-2 sm:w-auto w-full sm:text-left text-center text-gray-500 text-sm">
            Made with ❤️ for homeowners everywhere
          </span>
        </div>
      </div>

    </footer>
  );
}