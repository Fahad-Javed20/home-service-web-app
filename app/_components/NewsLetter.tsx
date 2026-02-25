'use client';
import { Mail } from "lucide-react";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (email) setSubmitted(true);
  };

  return (
    <section className="bg-white py-14 px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icon */}
        <div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Mail size={26} className="text-primary" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
          Get 20% Off Your First Booking
        </h2>
        <p className="text-gray-400 text-[14px] mb-7">
          Subscribe to our newsletter and receive exclusive deals, tips, and service updates straight to your inbox.
        </p>

        {!submitted ? (
          <div className="flex items-center max-w-md mx-auto bg-white border border-gray-200 rounded-full shadow-sm overflow-hidden pr-1">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 pl-5 pr-3 py-3 text-sm text-gray-600 outline-none bg-transparent placeholder-gray-400"
            />
            <button
              onClick={handleSubmit}
              className="bg-primary hover:bg-purple-600 text-white text-[13px] font-semibold px-5 py-2.5 rounded-full m-[3px] transition-colors"
            >
              Subscribe
            </button>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 text-[14px] font-semibold px-6 py-3 rounded-full inline-block">
            🎉 You are in! Check your inbox for your 20% off code.
          </div>
        )}

        <p className="text-gray-300 text-[11px] mt-4">No spam, ever. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}