"use client";

import Header from "../components/Header";
import ContactForm from "../components/ContactForm";
import FloatingBookButton from "../components/FloatingBookButton";

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#fdfdf8]">
      {/* Header */}
      <Header showCitySelector={false} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-12 sm:py-16 lg:py-20 pt-24 sm:pt-28 lg:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Contact Us
          </h1>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm title="Contact Us" />

      {/* Floating Contact Us Button */}
      <FloatingBookButton />
    </div>
  );
}
