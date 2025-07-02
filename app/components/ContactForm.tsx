"use client";

import Link from "next/link";
import { useState } from "react";
import { useCity } from "../contexts/CityContext";
import citiesData from "../../data/cities.json";

interface ContactFormProps {
  title?: string;
}

interface FormData {
  fullName: string;
  email: string;
  mobileNumber: string;
  city: string;
  timeline: string;
  plotOwnership: string;
  whatsappConsent: boolean;
  privacyConsent: boolean;
}

export default function ContactForm({
  title = "Contact Us",
}: ContactFormProps) {
  const { selectedCity, setSelectedCity } = useCity();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    mobileNumber: "",
    city: selectedCity.displayName || "",
    timeline: "",
    plotOwnership: "",
    whatsappConsent: false,
    privacyConsent: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Get the selected city name from the context
      const selectedCityData = citiesData.cities.find(
        (city) => city.id === selectedCity.id
      );
      const cityName =
        selectedCityData?.displayName ||
        selectedCity.displayName ||
        "Not specified";

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
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Full name / Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-orange-400 outline-none transition"
                />
              </div>
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
            </div>

            {/* Row 2: Mobile Number / Choose City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mobile Number */}
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

              {/* Choose City */}
              <div className="relative">
                <select
                  value={selectedCity.id}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-orange-400 bg-white text-orange-600 focus:outline-none appearance-none"
                >
                  <option disabled value="Choose City">
                    Choose City
                  </option>
                  {citiesData.cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.displayName}
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
            </div>

            {/* Row 3: Start timeline / Plot ownership radios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* I want to start construction in */}
              <div className="relative">
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:border-transparent focus:ring-2 focus:ring-orange-400 outline-none appearance-none"
                >
                  <option disabled value="">
                    I want to start construction in
                  </option>
                  <option value="0-3 months">0-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6-12 months">6-12 months</option>
                  <option value="more than 12 months">
                    More than 12 months
                  </option>
                  <option value="not sure">Not sure</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
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

              {/* Do you own a plot of land? */}
              <div className="flex items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Do you own a plot of land?
                  </span>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="plotOwnership"
                        value="yes"
                        checked={formData.plotOwnership === "yes"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="plotOwnership"
                        value="no"
                        checked={formData.plotOwnership === "no"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4: WhatsApp checkbox / Privacy checkbox */}
            <div className="space-y-3">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="whatsappConsent"
                  checked={formData.whatsappConsent}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-0.5 flex-shrink-0"
                />
                <span className="ml-3 text-sm text-gray-700">
                  I agree to receive WhatsApp notifications for communication
                  purposes.
                </span>
              </label>

              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="privacyConsent"
                  checked={formData.privacyConsent}
                  onChange={handleInputChange}
                  required
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-0.5 flex-shrink-0"
                />
                <span className="ml-3 text-sm text-gray-700">
                  By signing this form you agree to Sunbrix&apos;s{" "}
                  <Link
                    href="#"
                    className="text-orange-500 hover:text-orange-600 underline"
                  >
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="text-orange-500 hover:text-orange-600 underline"
                  >
                    Terms & Conditions
                  </Link>
                </span>
              </label>
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
