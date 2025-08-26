"use client";

import Link from "next/link";
import { useState } from "react";
import { useCity } from "../contexts/CityContext";

interface ContactFormProps {
  title?: string;
}

interface FormData {
  fullName: string;
  email: string;
  mobileNumber: string;
  city: string;
}

export default function ContactForm({
  title = "Contact Us",
}: ContactFormProps) {
  const { selectedCity, cities, setSelectedCity, loading } = useCity();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    mobileNumber: "",
    city: selectedCity?.name || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Get the selected city name from the context
      const cityName = selectedCity?.name || "Not specified";

      const submitData = {
        ...formData,
        city: cityName,
      };

      console.log("Submitting form data:", {
        ...submitData,
        mobileNumber: "[REDACTED]",
      });

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        // Redirect to thank you page on successful submission
        window.location.href = "/thank-you";
      } else {
        const errorData = await response.json();
        setSubmitMessage(
          `Error: ${errorData.error || "Failed to submit form"}`
        );
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitMessage("Error: Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render if cities are still loading
  if (loading || !selectedCity) {
    return (
      <section id="contact-form" className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">{title}</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading cities...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact-form" className="py-8 sm:py-12 lg:py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">{title}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          {submitMessage && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                submitMessage.startsWith("Error")
                  ? "bg-red-50 border border-red-200 text-red-700"
                  : "bg-green-50 border border-green-200 text-green-700"
              }`}
            >
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Full Name */}
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-orange-400 outline-none transition"
              />
            </div>

            {/* Row 2: Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-orange-400 outline-none transition"
              />
            </div>

            {/* Row 3: Mobile Number */}
            <div>
              <input
                type="tel"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-orange-400 outline-none transition"
              />
            </div>

            {/* Row 4: Choose City (Preselected) */}
            <div className="relative">
              <select
                value={selectedCity.id}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-orange-400 bg-white text-orange-600 focus:outline-none appearance-none"
              >
                <option disabled value="Choose City">
                  Choose City
                </option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
              {/* Arrow Icon (right edge) */}
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

            {/* Row 5: Terms & Conditions text */}
            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                We agree with Sunbrix{" "}
                <Link
                  href="#"
                  className="text-orange-500 hover:text-orange-600 underline"
                >
                  Terms & Conditions
                </Link>{" "}
                by signing into this form
              </p>
            </div>

            {/* Submit button */}
            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-full text-lg font-medium transition-colors ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-orange-400 hover:bg-orange-500 text-white"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Contact Us"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
