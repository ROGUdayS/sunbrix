/* eslint-disable react/no-unescaped-entities */
"use client";

import Header from "../components/Header";
import ContactForm from "../components/ContactForm";
import FloatingBookButton from "../components/FloatingBookButton";
import Image from "next/image";

export default function About() {
  return (
    <div className="min-h-screen bg-[#fdfdf8]">
      {/* Header */}
      <Header showCitySelector={false} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-12 sm:py-16 lg:py-20 pt-24 sm:pt-28 lg:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            About Sunbrix
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Building dreams with trust, quality, and innovation. We're here to
            make your home-building journey seamless and stress-free.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Our Story
              </h2>
              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                Sunbrix was launched in 2021 as part of the Sunbrix Group, a
                leading name in steel, cement, energy, and other core sectors.
                We recognized that building a home shouldn't be a stressful
                experience filled with uncertainty and delays.
              </p>
              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                Our mission is simple: to offer independent homeowners a
                hassle-free home-building experience with complete transparency,
                quality materials, and trusted professionals. We believe that
                building your dream home should put you firmly in control.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                With the backing of Sunbrix Group's decades of expertise in
                construction materials and our commitment to innovation, we're
                reshaping the future of independent homebuilding - one dream
                home at a time.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                <Image
                  src="/images/HomeHeroWebImage.webp"
                  alt="Sunbrix construction site"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Quality */}
            <div className="text-center">
              <div className="bg-orange-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Quality First
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                We use only certified-grade materials and work with trusted
                professionals to ensure the highest standards.
              </p>
            </div>

            {/* Transparency */}
            <div className="text-center">
              <div className="bg-orange-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Transparency
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                Clear pricing, regular updates, and no hidden surprises. You'll
                know exactly what to expect at every step.
              </p>
            </div>

            {/* Innovation */}
            <div className="text-center">
              <div className="bg-orange-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Innovation
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                We leverage technology and modern construction methods to
                deliver better homes faster and more efficiently.
              </p>
            </div>

            {/* Customer Focus */}
            <div className="text-center">
              <div className="bg-orange-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                Customer Focus
              </h3>
              <p className="text-sm sm:text-base text-gray-700">
                Your vision is our priority. We work closely with you to ensure
                your dream home becomes reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Makes Us Different
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              The Sunbrix advantage in home construction
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Sunbrix Group Heritage */}
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="bg-orange-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                  <path
                    fillRule="evenodd"
                    d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Sunbrix Group Heritage
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Backed by Sunbrix Group's decades of expertise in steel, cement,
                and construction materials. We bring industrial-grade quality to
                residential construction.
              </p>
            </div>

            {/* End-to-End Service */}
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="bg-orange-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Complete Turnkey Solution
              </h3>
              <p className="text-gray-700 leading-relaxed">
                From design to handover, we manage every aspect of your home
                construction. One point of contact, complete peace of mind.
              </p>
            </div>

            {/* Quality Assurance */}
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="bg-orange-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Rigorous Quality Control
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Multiple quality checkpoints, regular site inspections, and
                comprehensive warranties ensure your home meets the highest
                standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Our Commitment to You
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            We understand that building a home is one of life's biggest
            investments. That's why we're committed to making the process
            transparent, efficient, and stress-free. With Sunbrix, you're not
            just building a house - you're creating a foundation for your
            family's future.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                1 Year
              </div>
              <p className="text-gray-700">Workmanship Warranty</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                5 Years
              </div>
              <p className="text-gray-700">Structural Warranty</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                100%
              </div>
              <p className="text-gray-700">Transparency Promise</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm title="Ready to Build Your Dream Home?" />

      {/* Floating Contact Us Button */}
      <FloatingBookButton />
    </div>
  );
}
