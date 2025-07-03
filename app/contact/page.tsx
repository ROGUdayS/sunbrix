"use client";

import Header from "../components/Header";
import FloatingBookButton from "../components/FloatingBookButton";
import Image from "next/image";

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#fdfdf8]">
      {/* Header */}
      <Header showCitySelector={false} />

      {/* Hero Section with Video Background and Contact Form */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Motion Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/videos/motion-backgorund.mp4" type="video/mp4" />
            {/* Fallback image if video doesn't load */}
            <Image
              src="/images/motions-background.webp"
              alt="Modern dream home"
              fill
              className="object-cover"
              priority
            />
          </video>
          {/* Dark overlay for better form readability */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Contact Form Overlay */}
        <div className="relative z-10 py-12 sm:py-16 lg:py-20 pt-24 sm:pt-28 lg:pt-32">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Title */}
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6">
                Contact Us
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
                Ready to build your dream home? Get in touch with our experts
                today.
              </p>
            </div>

            {/* Contact Form with Enhanced Styling */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20">
              <form className="space-y-6">
                {/* Full name */}
                <div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full name"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-orange-400 outline-none transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-orange-400 outline-none transition"
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <input
                    type="tel"
                    name="mobileNumber"
                    placeholder="Mobile Number"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-orange-400 outline-none transition"
                  />
                </div>

                {/* City Selection */}
                <div className="relative">
                  <select
                    name="city"
                    className="w-full px-4 py-3 rounded-lg border-2 border-orange-400 bg-white text-orange-600 focus:outline-none appearance-none"
                  >
                    <option value="">Choose City</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="hyderabad">Hyderabad</option>
                    <option value="chennai">Chennai</option>
                    <option value="coimbatore">Coimbatore</option>
                    <option value="others">Others</option>
                  </select>
                  {/* Arrow Icon */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-orange-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* Terms & Conditions checkbox */}
                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="termsConsent"
                      required
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-0.5 flex-shrink-0"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      We agree with Sunbrix{" "}
                      <a
                        href="#"
                        className="text-orange-500 hover:text-orange-600 underline"
                      >
                        Terms & Conditions
                      </a>{" "}
                      by signing into this form
                    </span>
                  </label>
                </div>

                {/* Submit button */}
                <div className="text-center pt-4">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 rounded-full text-lg font-medium bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    Contact Us
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Contact Us Button */}
      <FloatingBookButton />
    </div>
  );
}
