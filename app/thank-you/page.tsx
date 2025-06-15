"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "../components/Header";

export default function ThankYou() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Redirect to home page after 10 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfdf8]">
      {/* Header */}
      <Header showCitySelector={false} />

      {/* Thank You Content */}
      <section className="py-20 pt-32 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Thank You Message */}
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Thank You!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Your form has been submitted successfully. Our team will get back to
            you within 24 hours.
          </p>

          {/* What's Next */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What happens next?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  We&apos;ll Call You
                </h3>
                <p className="text-sm text-gray-600">
                  Our expert will contact you within 24 hours to discuss your
                  project
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Schedule Meeting
                </h3>
                <p className="text-sm text-gray-600">
                  We&apos;ll schedule a convenient time for a detailed
                  consultation
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Start Building
                </h3>
                <p className="text-sm text-gray-600">
                  Begin your dream home construction journey with Sunbrix
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Need immediate assistance?
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
              <a
                href="mailto:support.homes@jswone.in"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                support.homes@jswone.in
              </a>
              <a
                href="tel:+917208055527"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                +91 72080 55527
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
            <Link
              href="/"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md"
            >
              Back to Home
            </Link>
            <Link
              href="/projects"
              className="bg-white hover:bg-gray-50 text-orange-600 border-2 border-orange-500 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              View Our Projects
            </Link>
          </div>

          {/* Auto Redirect Notice */}
          <p className="text-sm text-gray-500">
            You will be automatically redirected to the home page in{" "}
            <span className="font-semibold text-orange-600">{countdown}</span>{" "}
            seconds
          </p>
        </div>
      </section>
    </div>
  );
}
