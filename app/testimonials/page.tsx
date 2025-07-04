"use client";

import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import ContactForm from "../components/ContactForm";
import FloatingBookButton from "../components/FloatingBookButton";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  quote: string;
  videoUrl: string;
}

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isTestimonialTransitioning, setIsTestimonialTransitioning] =
    useState(false);
  const testimonialRef = useRef<HTMLDivElement>(null);

  // Touch/swipe handlers for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Mr. Suryanarayanan Karthikeyan",
      location: "",
      quote:
        "Most people struggle with delays, finances, or contractors. I didn't face even 1% of that. Sunbrix made my home journey smooth and hassle-free.",
      videoUrl: "https://www.youtube.com/embed/r-thd4PJKBw?si=Mm_R8V6mJWvUAEYk",
    },
    {
      id: 2,
      name: "Mr. Gururaj Naik",
      location: "Hyderabad",
      quote:
        "Sunbrix's expert team guided me at every step. Their quality gave me total confidence throughout the journey.",
      videoUrl: "https://www.youtube.com/embed/r-thd4PJKBw?si=Mm_R8V6mJWvUAEYk",
    },
    {
      id: 3,
      name: "Mr. Hariharasudan",
      location: "Coimbatore",
      quote:
        "Sunbrix Homes exceeded our expectations! The construction quality and timely delivery were remarkable. Truly a dream home.",
      videoUrl: "https://www.youtube.com/embed/r-thd4PJKBw?si=Mm_R8V6mJWvUAEYk",
    },
    {
      id: 4,
      name: "Mr. Radhakrishna",
      location: "Bengaluru",
      quote:
        "Sunbrix made my dream home a hassle-free reality - clear costs, quality build, and service you can trust.",
      videoUrl: "https://www.youtube.com/embed/r-thd4PJKBw?si=Mm_R8V6mJWvUAEYk",
    },
    {
      id: 5,
      name: "Mr. RP Sharma",
      location: "Others",
      quote:
        "Sunbrix's holistic support was reassuring. Their team patiently guided me from design to execution.",
      videoUrl: "https://www.youtube.com/embed/r-thd4PJKBw?si=Mm_R8V6mJWvUAEYk",
    },
    {
      id: 6,
      name: "Mr. Santosh",
      location: "Bengaluru",
      quote:
        "With Sunbrix, we didn't just build a home - we gained trust, care, and peace of mind.",
      videoUrl: "https://www.youtube.com/embed/r-thd4PJKBw?si=Mm_R8V6mJWvUAEYk",
    },
  ];

  const nextTestimonial = () => {
    if (isTestimonialTransitioning) return;
    setIsTestimonialTransitioning(true);
    setCurrentTestimonial((prev) => prev + 1);
  };

  const prevTestimonial = () => {
    if (isTestimonialTransitioning) return;
    setIsTestimonialTransitioning(true);
    setCurrentTestimonial((prev) => prev - 1);
  };

  const goToTestimonial = (index: number) => {
    if (isTestimonialTransitioning) return;
    setIsTestimonialTransitioning(true);
    setCurrentTestimonial(index);
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const currentX = e.targetTouches[0].clientX;
    setTouchEnd(currentX);

    // Calculate horizontal movement
    const deltaX = Math.abs(currentX - touchStart);

    // If there's significant horizontal movement, prevent vertical scroll
    if (deltaX > 10) {
      setIsDragging(true);
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextTestimonial();
    }
    if (isRightSwipe) {
      prevTestimonial();
    }

    setIsDragging(false);
  };

  // Handle infinite loop transitions for testimonials
  useEffect(() => {
    if (!isTestimonialTransitioning) return;

    const timer = setTimeout(() => {
      // Handle infinite loop reset without animation
      if (currentTestimonial >= testimonials.length) {
        if (testimonialRef.current) {
          testimonialRef.current.style.transition = "none";
          setCurrentTestimonial(0);
          // Force reflow and restore transition
          setTimeout(() => {
            if (testimonialRef.current) {
              testimonialRef.current.style.transition = "";
            }
          }, 50);
        }
      } else if (currentTestimonial < 0) {
        if (testimonialRef.current) {
          testimonialRef.current.style.transition = "none";
          setCurrentTestimonial(testimonials.length - 1);
          // Force reflow and restore transition
          setTimeout(() => {
            if (testimonialRef.current) {
              testimonialRef.current.style.transition = "";
            }
          }, 50);
        }
      }
      setIsTestimonialTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentTestimonial, isTestimonialTransitioning, testimonials.length]);

  return (
    <div className="min-h-screen bg-[#fdfdf8]">
      {/* Header */}
      <Header />

      {/* Featured Video Testimonial */}
      <section className="py-12 sm:py-16 lg:py-20 pt-24 sm:pt-28 lg:pt-32 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Testimonials
            </h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop View - Single large testimonial */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Navigation Arrows */}
              <button
                onClick={prevTestimonial}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
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
                onClick={nextTestimonial}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 rounded-full p-2 sm:p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
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

              {/* Video Container */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-orange-100">
                <div className="relative aspect-video bg-gray-900 rounded-t-xl sm:rounded-t-2xl overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src={
                      testimonials[
                        ((currentTestimonial % testimonials.length) +
                          testimonials.length) %
                          testimonials.length
                      ].videoUrl
                    }
                    title={`Customer Testimonial - ${
                      testimonials[
                        ((currentTestimonial % testimonials.length) +
                          testimonials.length) %
                          testimonials.length
                      ].name
                    }`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-4 sm:p-6 lg:p-8 bg-white">
                  <div className="flex items-center justify-center mb-4 sm:mb-6">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-center mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base lg:text-lg">
                    {
                      testimonials[
                        ((currentTestimonial % testimonials.length) +
                          testimonials.length) %
                          testimonials.length
                      ].quote
                    }
                  </p>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 text-base sm:text-lg">
                      {
                        testimonials[
                          ((currentTestimonial % testimonials.length) +
                            testimonials.length) %
                            testimonials.length
                        ].name
                      }
                    </div>
                    {testimonials[
                      ((currentTestimonial % testimonials.length) +
                        testimonials.length) %
                        testimonials.length
                    ].location && (
                      <div className="text-gray-600 mt-1 text-sm sm:text-base">
                        {
                          testimonials[
                            ((currentTestimonial % testimonials.length) +
                              testimonials.length) %
                              testimonials.length
                          ].location
                        }
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View - Sliding testimonials */}
          <div className="md:hidden">
            <div className="relative overflow-hidden carousel-container">
              <div
                ref={testimonialRef}
                className={`flex transition-transform duration-300 ease-out ${
                  isDragging ? "transition-none" : ""
                }`}
                style={{
                  transform: `translateX(-${
                    (currentTestimonial + testimonials.length) * 100
                  }%)`,
                  touchAction: "pan-y",
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Previous set for seamless left scrolling */}
                {testimonials.map((testimonial) => (
                  <div
                    key={`prev-${testimonial.id}`}
                    className="w-full flex-shrink-0"
                  >
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl overflow-hidden shadow-lg border border-orange-100 mx-4">
                      <div className="relative aspect-video bg-gray-900 rounded-t-2xl overflow-hidden">
                        <iframe
                          className="w-full h-full"
                          src={testimonial.videoUrl}
                          title={`Customer Testimonial ${testimonial.id}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="p-4 sm:p-6 bg-white flex flex-col h-48">
                        <div className="flex items-center justify-center mb-4">
                          <svg
                            className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                          </svg>
                        </div>
                        <p className="text-gray-700 text-center leading-relaxed text-sm sm:text-base flex-grow">
                          {testimonial.quote}
                        </p>
                        <div className="text-center mt-4">
                          <div className="font-semibold text-amber-900 text-sm sm:text-base">
                            {testimonial.name}
                          </div>
                          {testimonial.location && (
                            <div className="text-gray-600 mt-1 text-xs sm:text-sm">
                              {testimonial.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Current set - main testimonials */}
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0">
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl overflow-hidden shadow-lg border border-orange-100 mx-4">
                      <div className="relative aspect-video bg-gray-900 rounded-t-2xl overflow-hidden">
                        <iframe
                          className="w-full h-full"
                          src={testimonial.videoUrl}
                          title={`Customer Testimonial ${testimonial.id}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="p-4 sm:p-6 bg-white flex flex-col h-48">
                        <div className="flex items-center justify-center mb-4">
                          <svg
                            className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                          </svg>
                        </div>
                        <p className="text-gray-700 text-center leading-relaxed text-sm sm:text-base flex-grow">
                          {testimonial.quote}
                        </p>
                        <div className="text-center mt-4">
                          <div className="font-semibold text-amber-900 text-sm sm:text-base">
                            {testimonial.name}
                          </div>
                          {testimonial.location && (
                            <div className="text-gray-600 mt-1 text-xs sm:text-sm">
                              {testimonial.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Next set for seamless right scrolling */}
                {testimonials.map((testimonial) => (
                  <div
                    key={`next-${testimonial.id}`}
                    className="w-full flex-shrink-0"
                  >
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl overflow-hidden shadow-lg border border-orange-100 mx-4">
                      <div className="relative aspect-video bg-gray-900 rounded-t-2xl overflow-hidden">
                        <iframe
                          className="w-full h-full"
                          src={testimonial.videoUrl}
                          title={`Customer Testimonial ${testimonial.id}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="p-4 sm:p-6 bg-white flex flex-col h-48">
                        <div className="flex items-center justify-center mb-4">
                          <svg
                            className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                          </svg>
                        </div>
                        <p className="text-gray-700 text-center leading-relaxed text-sm sm:text-base flex-grow">
                          {testimonial.quote}
                        </p>
                        <div className="text-center mt-4">
                          <div className="font-semibold text-amber-900 text-sm sm:text-base">
                            {testimonial.name}
                          </div>
                          {testimonial.location && (
                            <div className="text-gray-600 mt-1 text-xs sm:text-sm">
                              {testimonial.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => {
              const actualCurrentTestimonial =
                ((currentTestimonial % testimonials.length) +
                  testimonials.length) %
                testimonials.length;
              return (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === actualCurrentTestimonial
                      ? "bg-gray-800"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm title="Contact Us" />

      {/* Floating Contact Us Button */}
      <FloatingBookButton />
    </div>
  );
}
