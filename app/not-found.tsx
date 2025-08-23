"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "./components/Header";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fdfdf8]">
      {/* Header */}
      <Header />

      {/* 404 Content */}
      <section className="py-12 sm:py-16 lg:py-20 pt-24 sm:pt-28 lg:pt-32 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* 404 Number */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-bold text-amber-600 leading-none">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
              Oops! The page you&apos;re looking for doesn&apos;t exist. It
              might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Illustration */}
          <div className="mb-8 sm:mb-12">
            <div className="w-48 h-48 sm:w-64 sm:h-64 mx-auto relative">
              <Image
                src="/icons/construction-journey/building-under-construction.svg"
                alt="Construction Icon"
                fill
                className="object-contain opacity-20"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 sm:mb-12">
            <Link
              href="/"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Go Home</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
