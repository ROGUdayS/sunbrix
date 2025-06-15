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
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to build your dream home? Get in touch with our experts for
            personalized assistance.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm
        title="Get in Touch"
        subtitle="Fill out the form below and our team will get back to you within 24 hours."
      />

      {/* Floating Contact Us Button */}
      <FloatingBookButton />
    </div>
  );
}
