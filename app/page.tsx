/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Header from "./components/Header";
import ContactForm from "./components/ContactForm";
import FloatingBookButton from "./components/FloatingBookButton";
import { useCity } from "./contexts/CityContext";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  // City context is used by the Header component and CityModal
  const { setShowCityModal } = useCity();

  // Add accordion state for packages - simplified to track which section is open
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Project gallery data
  const projects = [
    {
      id: 1,
      image: "/images/HomeHeroWebImage.webp",
      title: "Modern Contemporary Home",
      description:
        "A warm, welcoming home that wraps around a peaceful courtyard—perfect for natural light, fresh air, and chill vibes. The layout feels cozy but open, with a sleek capsule lift adding a modern touch and easy access between floors. It's comfort, style, and convenience all in one neat bundle!",
    },
    {
      id: 2,
      image: "/images/HomeHeroWebImage.webp",
      title: "Elegant Villa Design",
      description:
        "It's a modern, minimal, thoughtfully designed home that blends practicality and style. This home keeps it classy with open spaces, natural light, and a soft, elegant vibe throughout. It's all about clean design, calm energy, and comfy living but low on maintenance and super livable.",
    },
    {
      id: 3,
      image: "/images/HomeHeroWebImage.webp",
      title: "Luxury Family Home",
      description:
        "A sophisticated family home featuring premium materials and thoughtful design. Every detail has been carefully considered to create a space that's both beautiful and functional for modern family living.",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  // Package data structure - updated without emojis
  const packageData = {
    standard: {
      title: "Standard",
      price: "₹ ****",
      popular: false,
      sections: {
        design: {
          title: "Design",
          items: [
            "Digital plot and contour survey",
            "2D floor plan & 3D Elevation",
            "GFC -Good for construction drawings (Section,Elevation, architectural drawings, cross section, details etc.)",
            "RCC drawings",
            "Electrical & Plumbing drawings",
          ],
        },
        structure: {
          title: "Structure",
          items: [
            "Sunbrix OPC 53, Sunbrix Max super PPC",
            "Sunbrix Neo Steel 550D",
            "10.5' Ceiling Height",
            "2' elevated Plinth level",
          ],
        },
        flooring: {
          title: "Flooring and dado",
          items: [
            "2' X 2' Vetrified tiles",
            "Granite for Staircase",
            "Kitchen countertop",
          ],
        },
        doors: {
          title: "Door and windows",
          items: ["Standard wooden doors", "UPVC windows", "Basic hardware"],
        },
        plumbing: {
          title: "Plumbing accessories",
          items: [
            "Basic fixtures",
            "Standard fittings",
            "Essential accessories",
          ],
        },
        painting: {
          title: "Painting",
          items: [
            "Interior wall painting",
            "Exterior wall painting",
            "Standard finish",
          ],
        },
        electrical: {
          title: "Electrical",
          items: ["Basic wiring", "Standard switches", "Essential points"],
        },
        plumbingSystem: {
          title: "Plumbing",
          items: [
            "Basic plumbing system",
            "Standard pipes",
            "Essential connections",
          ],
        },
        railing: {
          title: "Railing and handrails",
          items: ["Standard railing", "Basic handrails", "Safety features"],
        },
      },
    },
    premium: {
      title: "Premium",
      price: "₹ ****",
      popular: true,
      sections: {
        design: {
          title: "Design",
          items: [
            "Digital plot and contour survey",
            "2D floor plan & 3D Elevation",
            "GFC -Good for construction drawings (Section,Elevation, architectural drawings, cross section, details etc.)",
            "RCC drawings",
            "Electrical & Plumbing drawings",
          ],
        },
        structure: {
          title: "Structure",
          items: [
            "Sunbrix OPC 53, Sunbrix Max super PPC",
            "Sunbrix Neo Steel 550D",
            "10.5' Ceiling Height",
            "2' elevated Plinth level",
          ],
        },
        flooring: {
          title: "Flooring and dado",
          items: [
            "4' X 2' Premium Vetrified tiles",
            "Jaguar Continental series",
            "Wall mounted EWC",
          ],
        },
        doors: {
          title: "Door and windows",
          items: [
            "Premium wooden doors",
            "UPVC windows with grills",
            "Quality hardware",
          ],
        },
        plumbing: {
          title: "Plumbing accessories",
          items: [
            "Premium fixtures",
            "Quality fittings",
            "Enhanced accessories",
          ],
        },
        painting: {
          title: "Painting",
          items: [
            "Premium interior painting",
            "Weather-resistant exterior",
            "Smooth finish",
          ],
        },
        electrical: {
          title: "Electrical",
          items: ["Premium wiring", "Modular switches", "Additional points"],
        },
        plumbingSystem: {
          title: "Plumbing",
          items: [
            "Premium plumbing system",
            "Quality pipes",
            "Enhanced connections",
          ],
        },
        railing: {
          title: "Railing and handrails",
          items: ["Premium railing", "Designer handrails", "Enhanced safety"],
        },
      },
    },
    luxury: {
      title: "Luxury",
      price: "₹ ****",
      popular: false,
      sections: {
        design: {
          title: "Design",
          items: [
            "Digital plot and contour survey",
            "2D floor plan & 3D Elevation",
            "GFC -Good for construction drawings (Section,Elevation, architectural drawings, cross section, details etc.)",
            "RCC drawings",
            "Electrical & Plumbing drawings",
          ],
        },
        structure: {
          title: "Structure",
          items: [
            "Sunbrix OPC 53, Sunbrix Max super PPC",
            "Sunbrix Neo Steel 550D",
            "10.5' Ceiling Height",
            "2' elevated Plinth level",
          ],
        },
        flooring: {
          title: "Flooring and dado",
          items: [
            "6' X 4' Marble flooring",
            "Jaguar Premium series",
            "Toughened glass railing",
          ],
        },
        doors: {
          title: "Door and windows",
          items: [
            "Luxury wooden doors",
            "Premium UPVC windows",
            "Designer hardware",
          ],
        },
        plumbing: {
          title: "Plumbing accessories",
          items: [
            "Luxury fixtures",
            "Premium fittings",
            "Designer accessories",
          ],
        },
        painting: {
          title: "Painting",
          items: [
            "Luxury interior painting",
            "Premium exterior finish",
            "Designer textures",
          ],
        },
        electrical: {
          title: "Electrical",
          items: [
            "Premium wiring system",
            "Designer switches",
            "Smart home ready",
          ],
        },
        plumbingSystem: {
          title: "Plumbing",
          items: [
            "Luxury plumbing system",
            "Premium pipes",
            "Designer connections",
          ],
        },
        railing: {
          title: "Railing and handrails",
          items: [
            "Designer railing",
            "Luxury handrails",
            "Premium safety features",
          ],
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#fdfdf8]">
      {/* Header */}
      <Header showCitySelector={true} />

      {/* Hero Section */}
      <section className="bg-[#fdfdf8] flex items-center min-h-[calc(100vh-4rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
          {/* Left: Text */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center lg:pr-12">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight text-left">
              Building homes Since 1999
            </h1>
            <p className="text-lg text-gray-500 mb-10 text-left">
              Build your dream home hassle-free
              <br className="hidden lg:block" /> with Sunbrix.
            </p>

            {/* Key Features Grid */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              {/* Designs Matching Vision */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-5 h-5 text-amber-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Designs Matching Vision
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Functional layouts unique to your lifestyle
                  </p>
                </div>
              </div>

              {/* High-Quality Materials */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-5 h-5 text-amber-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    High-Quality Materials
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Only certified-grade materials, no compromises
                  </p>
                </div>
              </div>

              {/* Price Transparency */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-5 h-5 text-amber-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Price Transparency
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Clear pricing with no surprises
                  </p>
                </div>
              </div>

              {/* On-Time Delivery */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-5 h-5 text-amber-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    On-Time Delivery
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Turnkey model that stays on schedule
                  </p>
                </div>
              </div>
            </div>

            <button className="bg-orange-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors shadow-md text-left w-fit">
              Book a meeting
            </button>
          </div>

          {/* Right: Image */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100 w-full max-w-xl">
              <Image
                src="/images/HomeHeroWebImage.webp"
                alt="Modern dream home with contemporary architecture"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Sunbrix */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">
              Why Sunbrix
            </h2>
            <p className="text-xl text-amber-800 mb-16">
              You build your dream home once. Build it right with Sunbrix.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-amber-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-2">
                  Designs matching vision
                </h3>
                <p className="text-amber-700">
                  Functional layouts that are unique to your lifestyle.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-amber-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-2">
                  High-quality materials
                </h3>
                <p className="text-amber-700">
                  No compromises. Only certified-grade materials.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-amber-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-2">
                  Price transparency
                </h3>
                <p className="text-amber-700">
                  Clear pricing with no surprises, just peace of mind.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-amber-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-2">
                  On-time delivery
                </h3>
                <p className="text-amber-700">
                  From planning to handover, our turnkey model stays on
                  schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Gallery */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our project gallery
            </h2>
            <p className="text-lg text-gray-600">
              Discover homes built with care, quality, and attention to detail.
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative max-w-6xl mx-auto">
            {/* Main Image Container */}
            <div className="relative overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {projects.map((project) => (
                  <div key={project.id} className="w-full flex-shrink-0">
                    <div className="relative">
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={1200}
                        height={600}
                        className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover"
                      />
                      {/* Navigation Arrows */}
                      <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Description */}
            <div className="text-center mt-8 px-4">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed max-w-4xl mx-auto">
                {projects[currentSlide].description}
              </p>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide
                      ? "bg-gray-800"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            {/* Explore More Button */}
            <div className="text-center mt-12">
              <Link
                href="/projects"
                className="border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-900 hover:text-white transition-colors duration-200 inline-block"
              >
                Explore more projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Build Your Dream Home CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Build your dream home
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Choose your layout, customise the details and receive a
              transparent quote.
            </p>
          </div>

          {/* Video Container */}
          <div className="relative max-w-6xl mx-auto">
            <div className="relative bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl overflow-hidden shadow-xl">
              {/* Video Element */}
              <video
                className="w-full h-auto rounded-2xl"
                controls
                poster="/images/video-poster.jpg" // You can add a poster image if you have one
                preload="metadata"
              >
                <source src="/videos/video_demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Optional: Custom play button overlay (if you want to style it differently) */}
              {/* <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-white/90 hover:bg-white text-orange-500 rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div> */}
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="text-center mt-12">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md">
              Book a meeting
            </button>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">Packages</h2>
            <p className="text-xl text-amber-800">
              Discover the package that fits your needs.
            </p>
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowCityModal(true)}
                className="border border-amber-300 rounded-lg px-4 py-3 focus:border-amber-600 text-amber-700 bg-white shadow-sm hover:shadow-md transition-shadow flex items-center space-x-2"
              >
                <span>Select City</span>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(packageData).map(([packageKey, packageInfo]) => (
              <div
                key={packageKey}
                className={`bg-gray-50 rounded-lg p-6 relative ${
                  packageInfo.popular
                    ? "border-2 border-amber-600"
                    : "border border-gray-200"
                }`}
              >
                {packageInfo.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white px-4 py-1 rounded-full text-sm">
                    Popular
                  </div>
                )}

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {packageInfo.title}
                </h3>
                <div className="text-3xl font-bold text-gray-800 mb-6">
                  {packageInfo.price}
                  <span className="text-sm text-gray-600">
                    {" "}
                    per sq. ft (Ex GST)
                  </span>
                </div>

                <div className="space-y-1">
                  {Object.entries(packageInfo.sections).map(
                    ([sectionKey, section]) => (
                      <div
                        key={sectionKey}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <button
                          onClick={() => toggleSection(sectionKey)}
                          className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-100 transition-colors rounded px-2"
                        >
                          <span className="font-medium text-gray-900 text-sm">
                            {section.title}
                          </span>
                          <svg
                            className={`w-4 h-4 text-gray-600 transition-transform ${
                              expandedSection === sectionKey ? "rotate-180" : ""
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>

                        <div
                          className={`
                            transition-all duration-300 ease-in-out overflow-hidden
                            ${
                              expandedSection === sectionKey
                                ? "max-h-96 opacity-100"
                                : "max-h-0 opacity-0"
                            }
                          `}
                        >
                          <div className="pb-3 px-2">
                            <ul className="text-xs text-gray-600 space-y-1">
                              {section.items.map((item, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-gray-400 mr-2 mt-1">
                                    •
                                  </span>
                                  <span className="leading-relaxed">
                                    {item}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Building Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              A glimpse into our building process
            </h2>
            <p className="text-xl text-gray-600">
              Explore our step-by-step process of building your dream home.
            </p>
          </div>

          {/* Process Steps with Connecting Lines */}
          <div className="relative">
            {/* Dotted connecting line - hidden on mobile */}
            <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5">
              <div className="flex justify-between items-center h-full max-w-5xl mx-auto px-20">
                <div className="flex-1 border-t-2 border-dotted border-gray-300"></div>
                <div className="w-8"></div>
                <div className="flex-1 border-t-2 border-dotted border-gray-300"></div>
                <div className="w-8"></div>
                <div className="flex-1 border-t-2 border-dotted border-gray-300"></div>
              </div>
            </div>

            {/* Process Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {/* Step 1: Meet our experts */}
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-white border-2 border-gray-900 rounded-lg flex items-center justify-center mx-auto shadow-sm">
                    {/* Handshake Icon */}
                    <svg
                      className="w-8 h-8 text-gray-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Meet our experts
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Discuss your ideas and goals. We'll help plan your budget and
                  design preferences.
                </p>
              </div>

              {/* Step 2: Design your custom home */}
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-white border-2 border-gray-900 rounded-lg flex items-center justify-center mx-auto shadow-sm">
                    {/* House Design Icon */}
                    <svg
                      className="w-8 h-8 text-gray-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Design your custom home
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  See detailed 3D renderings that let you visualise your home
                  before construction begins.
                </p>
              </div>

              {/* Step 3: Track the construction */}
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-white border-2 border-gray-900 rounded-lg flex items-center justify-center mx-auto shadow-sm">
                    {/* Clipboard/Checklist Icon */}
                    <svg
                      className="w-8 h-8 text-gray-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Track the construction
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Stay informed with regular updates on progress and quality
                  checks at every stage.
                </p>
              </div>

              {/* Step 4: Move in to your home */}
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-white border-2 border-gray-900 rounded-lg flex items-center justify-center mx-auto shadow-sm">
                    {/* Key/Home Icon */}
                    <svg
                      className="w-8 h-8 text-gray-900"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Move in to your home
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  A pre-delivery inspection ensures everything is in place
                  before handover.
                </p>
              </div>
            </div>
          </div>

          {/* View Details Button */}
          <div className="text-center mt-12">
            <button className="border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-900 hover:text-white transition-colors duration-200">
              View details
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Happy customers, real stories
            </h2>
            <p className="text-xl text-gray-600">
              Don't believe us? See what our customers have to say.
            </p>
          </div>

          {/* Video Testimonials Carousel */}
          <div className="relative max-w-6xl mx-auto">
            {/* Navigation Arrows */}
            <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Video Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Video Testimonial 1 */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl overflow-hidden shadow-lg border border-orange-100">
                <div className="relative aspect-video bg-gray-900 rounded-t-2xl overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/r-thd4PJKBw?si=Mm_R8V6mJWvUAEYk"
                    title="Customer Testimonial 1"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-orange-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-center mb-4 leading-relaxed">
                    Most people struggle with delays, finances, or contractors.
                    I didn't face even 1% of that. Sunbrix made my home journey
                    smooth and hassle-free.
                  </p>
                  <div className="text-center font-semibold text-gray-900">
                    Mr. Suryanarayanan Karthikeyan
                  </div>
                </div>
              </div>

              {/* Video Testimonial 2 */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl overflow-hidden shadow-lg border border-orange-100">
                <div className="relative aspect-video bg-gray-900 rounded-t-2xl overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/r-thd4PJKBw?si=Mm_R8V6mJWvUAEYk"
                    title="Customer Testimonial 2"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-orange-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-center mb-4 leading-relaxed">
                    Sunbrix's expert team guided me at every step. Their quality
                    gave me total confidence throughout the journey.
                  </p>
                  <div className="text-center font-semibold text-gray-900">
                    Mr. Gururaj Naik
                  </div>
                </div>
              </div>

              {/* Video Testimonial 3 */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl overflow-hidden shadow-lg border border-orange-100">
                <div className="relative aspect-video bg-gray-900 rounded-t-2xl overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/r-thd4PJKBw?si=Mm_R8V6mJWvUAEYk"
                    title="Customer Testimonial 3"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-6 bg-white">
                  <div className="flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-orange-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-center mb-4 leading-relaxed">
                    Sunbrix Homes exceeded our expectations! The construction
                    quality and timely delivery were remarkable. Truly a dream
                    home.
                  </p>
                  <div className="text-center font-semibold text-gray-900">
                    Mr. Hariharasudan
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              <button className="w-3 h-3 rounded-full bg-gray-800"></button>
              <button className="w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400"></button>
              <button className="w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400"></button>
              <button className="w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400"></button>
              <button className="w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400"></button>
              <button className="w-3 h-3 rounded-full bg-gray-300 hover:bg-gray-400"></button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand Section - Takes up 5 columns */}
            <div className="lg:col-span-5">
              <div className="text-3xl font-bold mb-6">Sunbrix</div>
              <p className="text-gray-300 mb-8 text-base leading-relaxed max-w-md">
                Browse ideas, explore options and book a meeting with our expert
                consultants to finalise your design.
              </p>
              <div className="space-y-3 mb-8">
                <div className="text-base font-semibold text-white">
                  Get in touch
                </div>
                <div className="text-base text-orange-400">
                  support.homes@jswone.in
                </div>
                <div className="text-base text-orange-400">+91 72080 55527</div>
              </div>
              {/* Social Media Icons */}
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 2.567-1.645 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z.017.017" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Company Section - Takes up 4 columns */}
            <div className="lg:col-span-4">
              <h3 className="text-xl font-semibold mb-6 text-white">Company</h3>
              <ul className="space-y-4 text-base text-gray-300">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How it works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects"
                    className="hover:text-white transition-colors"
                  >
                    Our projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/testimonials"
                    className="hover:text-white transition-colors"
                  >
                    Testimonials
                  </Link>
                </li>

                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-white transition-colors"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Section - Takes up 3 columns */}
            <div className="lg:col-span-3">
              <h3 className="text-xl font-semibold mb-6 text-white">Legal</h3>
              <ul className="space-y-4 text-base text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Book a Meeting Button */}
      <FloatingBookButton />
    </div>
  );
}
