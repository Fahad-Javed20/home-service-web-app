"use client";

import Link from "next/link";
import { useState } from "react";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";

const servicesLinks = [
  { label: "House Cleaning", href: "/serviceproviders" },
  { label: "Plumbing", href: "/serviceproviders" },
  { label: "Electrical", href: "/serviceproviders" },
  { label: "Painting", href: "/serviceproviders" },
  { label: "Moving and Shifting", href: "/serviceproviders" },
  { label: "Appliance Repair", href: "/serviceproviders" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "How It Works", href: "/" },
  { label: "Services", href: "/serviceproviders" },
  { label: "Contact Us", href: "/contact" },
];

const supportLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Bookings", href: "/my-account" },
  { label: "Login / Signup", href: "/auth?mode=signin" },
];

const providerLinks = [
  { label: "Browse Providers", href: "/serviceproviders" },
  { label: "Admin Dashboard", href: "/admin" },
];

const cityLinks = [
  { label: "New York", href: "/serviceproviders" },
  { label: "Los Angeles", href: "/serviceproviders" },
  { label: "Chicago", href: "/serviceproviders" },
  { label: "Houston", href: "/serviceproviders" },
  { label: "Miami", href: "/serviceproviders" },
  { label: "Seattle", href: "/serviceproviders" },
];

function FooterSection({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div className="lg:w-1/6 md:w-1/2 w-full px-4">
      <h2 className="title-font font-bold text-gray-900 tracking-widest text-xs mb-4 uppercase border-b-2 border-primary inline-block pb-1">
        {title}
      </h2>
      <nav className="list-none mb-10 flex flex-col gap-2.5">
        {links.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-gray-600 hover:text-primary text-[13px] transition-colors duration-200 hover:pl-1 inline-block"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </nav>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="text-gray-600">
      <div className="container px-5 py-20 mx-auto">
        <div className="flex flex-wrap md:text-left text-center -mb-10 -mx-4">
          <div className="lg:w-1/6 md:w-1/2 w-full px-4 mb-10">
            <div className="flex items-center gap-2 mb-4 md:justify-start justify-center">
              <h1 className="font-bold text-gray-900">
                HomeServe<span className="text-primary">Pro</span>
              </h1>
            </div>
            <p className="text-gray-600 text-[13px] leading-relaxed mb-5">
              Your trusted platform for verified home service professionals.
              Quality work, guaranteed.
            </p>
            <div className="flex flex-col gap-2 md:items-start items-center">
              <p className="flex items-center gap-2 text-[12px] text-gray-600">
                <MapPin size={12} className="text-primary shrink-0" /> 123 Main Street, New York
              </p>
              <p className="flex items-center gap-2 text-[12px] text-gray-600">
                <Phone size={12} className="text-primary shrink-0" /> +1 (800) 123-4567
              </p>
              <p className="flex items-center gap-2 text-[12px] text-gray-600">
                <Mail size={12} className="text-primary shrink-0" /> hello@homeservepro.com
              </p>
            </div>
          </div>

          <FooterSection title="Services" links={servicesLinks} />
          <FooterSection title="Company" links={companyLinks} />
          <FooterSection title="Support" links={supportLinks} />
          <FooterSection title="For Providers" links={providerLinks} />
          <FooterSection title="Top Cities" links={cityLinks} />
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="container px-5 py-8 flex flex-wrap mx-auto items-center gap-4">
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
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-gray-100 rounded-lg border border-gray-300 focus:ring-2 focus:bg-transparent focus:ring-purple-200 focus:border-primary text-sm outline-none text-gray-700 py-2 px-3 leading-8 transition-all duration-200"
              />
            </div>
            <button
              onClick={() => email && setSubscribed(true)}
              className="inline-flex text-white bg-primary border-0 py-2 px-6 focus:outline-none hover:bg-purple-700 active:scale-95 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
            <p className="text-gray-500 text-xs md:ml-2 md:mt-0 mt-2 sm:text-left text-center leading-relaxed">
              Get 20% off your first booking.
              <br className="lg:block hidden" />
              No spam, unsubscribe anytime.
            </p>
          </div>

          <span className="inline-flex lg:ml-auto lg:mt-0 mt-4 w-full justify-center md:justify-start md:w-auto gap-2">
            {[
              { icon: <Facebook size={15} />, label: "Facebook" },
              { icon: <Twitter size={15} />, label: "Twitter" },
              { icon: <Instagram size={15} />, label: "Instagram" },
              { icon: <Linkedin size={15} />, label: "LinkedIn" },
            ].map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="w-9 h-9 rounded-lg border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 hover:scale-110 hover:shadow-md"
              >
                {social.icon}
              </a>
            ))}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto py-5 px-5 flex flex-wrap flex-col sm:flex-row items-center">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            Copyright {new Date().getFullYear()}{" "}
            <span className="text-primary font-semibold">HomeServePro</span>. All rights reserved.
          </p>
          <span className="sm:ml-auto sm:mt-0 mt-2 sm:w-auto w-full sm:text-left text-center text-gray-500 text-sm">
            Made with care for homeowners everywhere
          </span>
        </div>
      </div>
    </footer>
  );
}
