"use client";

import Image from "next/image";
import Header from "../components/Header";
import ContactForm from "../components/ContactForm";
import FloatingBookButton from "../components/FloatingBookButton";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#fdfdf8]">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-20 pt-32 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              How it works
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Expertly built homes, from concept to completion in approximately
              14 months.
            </p>
          </div>

          {/* Hero Image */}
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/how-it-works.webp"
                alt="How it works - Building process"
                width={1200}
                height={300}
                className="w-full h-[300px] md:h-[300px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Building Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our building process at glance
            </h2>
            <p className="text-lg text-gray-600">
              Explore our step-by-step process of building your dream home.
            </p>
          </div>

          {/* Process Steps */}
          <div className="space-y-8">
            {/* Step 1: Contact Us */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-amber-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Contact Us
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Schedule a session to learn about us and our process.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Do your research */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-amber-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Do your research
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Explore reference sites, get a preliminary quote, and review
                    our contracts.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Begin design */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-amber-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
                      <path d="M6 8h8v2H6V8zm0 4h8v2H6v-2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Begin design
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Make the design phase payment to begin crafting your dream
                    home with your architect.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4: Pre-Construction */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-amber-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Pre-Construction
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Make the pre-construction payment and leave the rest to us -
                    while we finalise designs, conduct soil tests, provide final
                    quotations and project plans, arrange contractor meetings,
                    and complete legal formalities.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 5: Construction */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-amber-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Construction
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Track progress through weekly updates, scheduled meetings
                    and detailed reports.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 6: Handover and Housewarming */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-amber-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Handover and Housewarming
                  </h3>
                  <p className="text-gray-600 text-lg">
                    From dream to reality - enjoy a seamless handover with
                    one-year defect liability support, a structural stability
                    certificate and a five-year structural warranty for
                    worry-free ownership.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm />

      {/* Floating Contact Us Button */}
      <FloatingBookButton />
    </div>
  );
}
