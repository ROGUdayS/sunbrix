"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import ContactForm from "./components/ContactForm";
import FloatingBookButton from "./components/FloatingBookButton";

import { useCity } from "./contexts/CityContext";
import packagesData from "../data/packages.json";
import projectsData from "../data/projects.json";

interface ProjectData {
  id: string;
  title: string;
  location: string;
  plotSize: string;
  facing: string;
  image: string;
  images?: string[];
  description: string;
  specifications: {
    bedrooms: number;
  };
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  // City context is used by the Header component and CityModal
  const { selectedCity, setShowCityModal } = useCity();

  // Add accordion state for packages - simplified to track which section is open
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Add package carousel state
  const [currentPackage, setCurrentPackage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Add state for projects to fix hydration issue
  const [projects, setProjects] = useState<
    {
      image: string;
      title: string;
      description: string;
      id: number;
    }[]
  >([]);

  // Add gallery transition state
  const [isGalleryTransitioning, setIsGalleryTransitioning] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Add testimonial transition state
  const [isTestimonialTransitioning, setIsTestimonialTransitioning] =
    useState(false);
  const testimonialRef = useRef<HTMLDivElement>(null);

  // Add video ref for auto-play functionality
  const videoRef = useRef<HTMLVideoElement>(null);

  // Project gallery data - get random images from project data
  const getAllProjectImages = () => {
    const allImages: {
      image: string;
      title: string;
      description: string;
      id: number;
    }[] = [];

    // Collect all images from all projects
    projectsData.projects.forEach(
      (project: ProjectData, projectIndex: number) => {
        if (project.images && project.images.length > 0) {
          project.images.forEach((image: string, imageIndex: number) => {
            allImages.push({
              id: projectIndex * 100 + imageIndex, // Unique ID
              image: image,
              title: project.title,
              description: project.description,
            });
          });
        } else {
          // Fallback to main image if no images array
          allImages.push({
            id: projectIndex * 100,
            image: project.image,
            title: project.title,
            description: project.description,
          });
        }
      }
    );

    return allImages;
  };

  // Shuffle array function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize projects on client side to avoid hydration mismatch
  useEffect(() => {
    const allImages = getAllProjectImages();
    const shuffledProjects = shuffleArray(allImages).slice(0, 6);
    setProjects(shuffledProjects);
  }, []);

  // Handle hash navigation for packages section
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#packages") {
      // Small delay to ensure the page is fully rendered
      setTimeout(() => {
        const packagesSection = document.querySelector(
          '[data-section="packages"]'
        );
        if (packagesSection) {
          packagesSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  }, []);

  // Auto-play video when in view, pause when out of view
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video is in view, play it
            video.play().catch((error) => {
              console.log("Auto-play was prevented:", error);
            });
          } else {
            // Video is out of view, pause it
            video.pause();
          }
        });
      },
      {
        threshold: 0.5, // Play when 50% of video is visible
        rootMargin: "0px 0px -100px 0px", // Add some margin to trigger earlier
      }
    );

    observer.observe(video);

    // Cleanup observer on component unmount
    return () => {
      observer.unobserve(video);
    };
  }, []);

  const nextSlide = () => {
    if (projects.length === 0 || isGalleryTransitioning) return;
    setIsGalleryTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (projects.length === 0 || isGalleryTransitioning) return;
    setIsGalleryTransitioning(true);
    setCurrentSlide((prev) => prev - 1);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      videoUrl: "https://www.youtube.com/embed/r-thd4PJKBw?si=Mm_R8V6mJWvUAEYk",
      quote:
        "Most people struggle with delays, finances, or contractors. I didn&apos;t face even 1% of that. Sunbrix made my home journey smooth and hassle-free.",
      name: "Mr. Suryanarayanan Karthikeyan",
    },
    {
      id: 2,
      videoUrl: "https://www.youtube.com/embed/r-thd4PJKBw?si=Mm_R8V6mJWvUAEYk",
      quote:
        "Sunbrix&apos;s expert team guided me at every step. Their quality gave me total confidence throughout the journey.",
      name: "Mr. Gururaj Naik",
    },
    {
      id: 3,
      videoUrl: "https://www.youtube.com/embed/r-thd4PJKBw?si=Mm_R8V6mJWvUAEYk",
      quote:
        "Sunbrix Homes exceeded our expectations! The construction quality and timely delivery were remarkable. Truly a dream home.",
      name: "Mr. Hariharasudan",
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
    setCurrentTestimonial(index);
  };

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  // Package carousel navigation functions with infinite loop
  const nextPackage = () => {
    if (isTransitioning) return;

    const packageKeys = Object.keys(packagesData.packages.construction || {});

    if (packageKeys.length === 0) return;

    setIsTransitioning(true);
    setCurrentPackage((prev) => prev + 1);
  };

  const prevPackage = () => {
    if (isTransitioning) return;

    const packageKeys = Object.keys(packagesData.packages.construction || {});

    if (packageKeys.length === 0) return;

    setIsTransitioning(true);
    setCurrentPackage((prev) => prev - 1);
  };

  // Touch/swipe handlers for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleTouchEnd = (type: "gallery" | "package" | "testimonial") => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (type === "gallery") {
      if (isLeftSwipe && projects.length > 0) {
        nextSlide();
      }
      if (isRightSwipe && projects.length > 0) {
        prevSlide();
      }
    } else if (type === "package") {
      if (isLeftSwipe) {
        nextPackage();
      }
      if (isRightSwipe) {
        prevPackage();
      }
    } else if (type === "testimonial") {
      if (isLeftSwipe) {
        nextTestimonial();
      }
      if (isRightSwipe) {
        prevTestimonial();
      }
    }

    setIsDragging(false);
  };

  const goToPackage = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPackage(index);
  };

  // Handle infinite loop transitions with smooth reset
  useEffect(() => {
    if (!isTransitioning) return;

    const packageKeys = Object.keys(packagesData.packages.construction || {});

    const totalPackages = packageKeys.length;
    if (totalPackages === 0) return;

    const timer = setTimeout(() => {
      // Handle infinite loop reset without animation
      if (currentPackage >= totalPackages) {
        if (carouselRef.current) {
          carouselRef.current.style.transition = "none";
          setCurrentPackage(0);
          // Force reflow and restore transition
          setTimeout(() => {
            if (carouselRef.current) {
              carouselRef.current.style.transition = "";
            }
          }, 50);
        }
      } else if (currentPackage < 0) {
        if (carouselRef.current) {
          carouselRef.current.style.transition = "none";
          setCurrentPackage(totalPackages - 1);
          // Force reflow and restore transition
          setTimeout(() => {
            if (carouselRef.current) {
              carouselRef.current.style.transition = "";
            }
          }, 50);
        }
      }
      setIsTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentPackage, isTransitioning]);

  // Handle infinite loop transitions for gallery
  useEffect(() => {
    if (!isGalleryTransitioning || projects.length === 0) return;

    const timer = setTimeout(() => {
      // Handle infinite loop reset without animation
      if (currentSlide >= projects.length) {
        if (galleryRef.current) {
          galleryRef.current.style.transition = "none";
          setCurrentSlide(0);
          // Force reflow and restore transition
          setTimeout(() => {
            if (galleryRef.current) {
              galleryRef.current.style.transition = "";
            }
          }, 50);
        }
      } else if (currentSlide < 0) {
        if (galleryRef.current) {
          galleryRef.current.style.transition = "none";
          setCurrentSlide(projects.length - 1);
          // Force reflow and restore transition
          setTimeout(() => {
            if (galleryRef.current) {
              galleryRef.current.style.transition = "";
            }
          }, 50);
        }
      }
      setIsGalleryTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentSlide, isGalleryTransitioning, projects.length]);

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
  }, [currentTestimonial, isTestimonialTransitioning]);

  return (
    <div className="min-h-screen bg-[#fdfdf8]">
      {/* Header - Now handled by the Header component itself */}
      <Header showCitySelector={true} isTransparent={true} />

      {/* Hero Section with Motion Background */}
      <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
        {/* Motion Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/videos/motion-backgorund.mp4" type="video/mp4" />
            {/* Fallback image if video doesn't load */}
            <Image
              src="/images/motions-background.webp"
              alt="Modern dream home"
              fill
              className="object-cover"
              priority
            />
          </video>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Hero Content - Positioned at bottom */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white pb-16 sm:pb-20">
          {/* Key Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-4 border border-white/20">
              <div className="text-2xl sm:text-2xl lg:text-3xl font-bold text-orange-400 mb-1">
                25
              </div>
              <div className="text-sm sm:text-sm lg:text-base font-medium">
                Years
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-4 border border-white/20">
              <div className="text-2xl sm:text-2xl lg:text-3xl font-bold text-orange-400 mb-1">
                100+
              </div>
              <div className="text-sm sm:text-sm lg:text-base font-medium">
                Homes
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-4 border border-white/20">
              <div className="text-2xl sm:text-2xl lg:text-3xl font-bold text-orange-400 mb-1">
                100%
              </div>
              <div className="text-sm sm:text-sm lg:text-base font-medium">
                Transparent
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-4 border border-white/20">
              <div className="text-2xl sm:text-2xl lg:text-3xl font-bold text-orange-400 mb-1">
                100%
              </div>
              <div className="text-sm sm:text-sm lg:text-base font-medium">
                On-Time
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
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
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Our Commitment to Quality */}
      <section className="py-8 sm:py-10 lg:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900 mb-4">
              Our Commitment to Quality
            </h2>
            <p className="text-lg sm:text-xl text-amber-800 mb-6 sm:mb-8 lg:mb-10">
              We are committed to building your dream home with the highest
              quality materials and workmanship.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              <div className="text-center">
                <div className="bg-amber-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-amber-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-lg lg:text-xl font-semibold text-amber-900 mb-2">
                  Designs matching vision
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-amber-700">
                  Functional layouts that are unique to your lifestyle.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-amber-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-amber-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-lg lg:text-xl font-semibold text-amber-900 mb-2">
                  High-quality materials
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-amber-700">
                  No compromises. Only certified-grade materials.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-amber-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-amber-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-lg lg:text-xl font-semibold text-amber-900 mb-2">
                  Price transparency
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-amber-700">
                  Clear pricing with no surprises, just peace of mind.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-amber-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-amber-800"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-lg lg:text-xl font-semibold text-amber-900 mb-2">
                  On-time delivery
                </h3>
                <p className="text-xs sm:text-sm lg:text-base text-amber-700">
                  From planning to handover, our turnkey model stays on
                  schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Gallery */}
      <section className="py-6 sm:py-8 lg:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-900 mb-2 sm:mb-3">
              Gallery
            </h2>
          </div>

          {/* Only render carousel if projects are loaded */}
          {projects.length > 0 && (
            <>
              {/* Carousel Container with Side Previews */}
              <div className="relative max-w-7xl mx-auto">
                {/* Gallery with Side Previews */}
                <div className="flex items-center justify-center gap-4 lg:gap-6">
                  {/* Previous Image Preview - Show right edge only */}
                  <div className="hidden lg:block flex-shrink-0 relative">
                    <div
                      className="relative w-16 lg:w-20 xl:w-24 h-[400px] xl:h-[480px] overflow-hidden cursor-pointer opacity-60 hover:opacity-80 transition-opacity duration-300 rounded-l-xl"
                      onClick={prevSlide}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={
                            projects[
                              (currentSlide - 1 + projects.length) %
                                projects.length
                            ]?.image
                          }
                          alt="Previous"
                          fill
                          className="object-cover object-right"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white opacity-70"
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
                      </div>
                    </div>
                  </div>

                  {/* Main Image Container */}
                  <div className="relative overflow-hidden select-none carousel-container flex-1 max-w-3xl lg:max-w-4xl rounded-xl lg:rounded-none">
                    <div
                      ref={galleryRef}
                      className={`flex transition-transform duration-300 ease-out ${
                        isDragging ? "transition-none" : ""
                      }`}
                      style={{
                        transform: `translateX(-${
                          (currentSlide + projects.length) * 100
                        }%)`,
                        touchAction: "pan-y",
                      }}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={() => handleTouchEnd("gallery")}
                    >
                      {/* Previous set for seamless left scrolling */}
                      {projects.map((project) => (
                        <div
                          key={`prev-${project.id}`}
                          className="w-full flex-shrink-0"
                        >
                          <div className="relative">
                            <Image
                              src={project.image}
                              alt={project.title}
                              width={900}
                              height={600}
                              className="w-full h-[240px] sm:h-[280px] md:h-[320px] lg:h-[400px] xl:h-[480px] object-cover"
                            />
                          </div>
                        </div>
                      ))}

                      {/* Current set - main projects */}
                      {projects.map((project) => (
                        <div key={project.id} className="w-full flex-shrink-0">
                          <div className="relative">
                            <Image
                              src={project.image}
                              alt={project.title}
                              width={900}
                              height={600}
                              className="w-full h-[240px] sm:h-[280px] md:h-[320px] lg:h-[400px] xl:h-[480px] object-cover"
                            />
                          </div>
                        </div>
                      ))}

                      {/* Next set for seamless right scrolling */}
                      {projects.map((project) => (
                        <div
                          key={`next-${project.id}`}
                          className="w-full flex-shrink-0"
                        >
                          <div className="relative">
                            <Image
                              src={project.image}
                              alt={project.title}
                              width={900}
                              height={600}
                              className="w-full h-[240px] sm:h-[280px] md:h-[320px] lg:h-[400px] xl:h-[480px] object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Image Preview - Show left edge only */}
                  <div className="hidden lg:block flex-shrink-0 relative">
                    <div
                      className="relative w-16 lg:w-20 xl:w-24 h-[400px] xl:h-[480px] overflow-hidden cursor-pointer opacity-60 hover:opacity-80 transition-opacity duration-300 rounded-r-xl"
                      onClick={nextSlide}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={
                            projects[(currentSlide + 1) % projects.length]
                              ?.image
                          }
                          alt="Next"
                          fill
                          className="object-cover object-left"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white opacity-70"
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
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Description */}
                <div className="text-center mt-3 sm:mt-4 lg:mt-5 px-4">
                  <div className="flex justify-center mb-2 sm:mb-3">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
                    {projects[
                      ((currentSlide % projects.length) + projects.length) %
                        projects.length
                    ]?.description || "Loading..."}
                  </p>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center mt-3 sm:mt-4 lg:mt-5 space-x-2">
                  {projects.map((_, index) => {
                    const actualCurrentSlide =
                      ((currentSlide % projects.length) + projects.length) %
                      projects.length;
                    return (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          goToSlide(index);
                        }}
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
                          index === actualCurrentSlide
                            ? "bg-gray-800"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Explore More Button */}
                <div className="text-center mt-4 sm:mt-6 lg:mt-8">
                  <Link
                    href="/projects"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 inline-block shadow-sm hover:shadow-md"
                  >
                    Explore more projects
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* Loading state while projects are being loaded */}
          {projects.length === 0 && (
            <div className="text-center py-8">
              <div className="animate-pulse max-w-5xl mx-auto">
                <div className="bg-gray-200 rounded-xl h-[240px] sm:h-[280px] md:h-[320px] lg:h-[360px] mb-4"></div>
                <div className="bg-gray-200 h-3 rounded w-3/4 mx-auto mb-3"></div>
                <div className="bg-gray-200 h-3 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Build Your Dream Home CTA */}
      <section className="py-8 sm:py-10 lg:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Video Container */}
          <div className="relative max-w-6xl mx-auto">
            <div className="relative bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl overflow-hidden shadow-xl">
              {/* Video Element */}
              <video
                ref={videoRef}
                className="w-full h-auto rounded-2xl"
                controls
                muted
                poster="/images/video-poster.jpg" // You can add a poster image if you have one
                preload="metadata"
                playsInline
              >
                <source src="/videos/video_demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section
        className="py-6 sm:py-8 lg:py-10 bg-white"
        data-section="packages"
        id="packages"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-900 mb-3">
              Packages
            </h2>
          </div>

          {/* Package Cards - Desktop: All visible, Mobile: Carousel */}
          {selectedCity && (
            <>
              {/* Desktop View - All packages visible */}
              <div className="hidden lg:grid lg:grid-cols-3 gap-4 lg:gap-6">
                {Object.entries(packagesData.packages.construction).map(
                  ([packageKey, packageInfo]) => {
                    const currentCityPricing =
                      packageInfo.pricing[
                        selectedCity.id as keyof typeof packageInfo.pricing
                      ];

                    return (
                      <div
                        key={packageKey}
                        className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-amber-200"
                      >
                        {/* Card Content */}
                        <div className="p-4 lg:p-5">
                          {/* Package Title */}
                          <div className="text-center mb-4">
                            <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
                              {packageInfo.title}
                            </h3>

                            {/* Price Display */}
                            <div className="mb-3">
                              <div className="text-2xl lg:text-3xl font-bold text-amber-600 mb-1">
                                {selectedCity
                                  ? currentCityPricing?.price
                                  : "X,XXX"}
                              </div>
                              {selectedCity &&
                                !currentCityPricing?.startingAt && (
                                  <div className="text-xs text-gray-500">
                                    per sq. ft (Ex GST)
                                  </div>
                                )}
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="border-t border-gray-100 mb-3"></div>

                          {/* Expandable Sections */}
                          <div className="space-y-1.5">
                            {Object.entries(packageInfo.sections).map(
                              ([sectionKey, section]) => (
                                <div
                                  key={sectionKey}
                                  className="border border-gray-100 rounded-md overflow-hidden"
                                >
                                  <button
                                    onClick={() => toggleSection(sectionKey)}
                                    className="w-full flex items-center justify-between p-2.5 lg:p-3 text-left hover:bg-gray-50 transition-colors"
                                  >
                                    <span className="font-semibold text-gray-900 text-xs lg:text-sm">
                                      {section.title}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      <svg
                                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                          expandedSection === sectionKey
                                            ? "rotate-180"
                                            : ""
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
                                    </div>
                                  </button>

                                  <div
                                    className={`
                                    transition-all duration-300 ease-in-out overflow-hidden
                                    ${
                                      expandedSection === sectionKey
                                        ? "max-h-64 opacity-100"
                                        : "max-h-0 opacity-0"
                                    }
                                  `}
                                  >
                                    <div className="px-2.5 lg:px-3 pb-2.5 lg:pb-3 bg-gray-50">
                                      <ul className="space-y-1.5">
                                        {section.items.map((item, index) => (
                                          <li
                                            key={index}
                                            className="flex items-start text-xs lg:text-sm text-gray-700"
                                          >
                                            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
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
                      </div>
                    );
                  }
                )}
              </div>

              {/* Mobile/Tablet Carousel View */}
              <div className="lg:hidden relative">
                {(() => {
                  const packageEntries = Object.entries(
                    packagesData.packages.construction
                  );

                  return (
                    <>
                      {/* Carousel Container */}
                      <div className="relative overflow-hidden carousel-container">
                        <div
                          ref={carouselRef}
                          className={`flex transition-transform duration-300 ease-out ${
                            isDragging ? "transition-none" : ""
                          }`}
                          style={{
                            transform: `translateX(-${
                              (currentPackage + packageEntries.length) * 100
                            }%)`,
                            touchAction: "pan-y",
                          }}
                          onTouchStart={handleTouchStart}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={() => handleTouchEnd("package")}
                        >
                          {/* Duplicate packages for infinite loop effect */}
                          {/* Previous set for seamless left scrolling */}
                          {packageEntries.map(([packageKey, packageInfo]) => {
                            const currentCityPricing =
                              packageInfo.pricing[
                                selectedCity.id as keyof typeof packageInfo.pricing
                              ];

                            return (
                              <div
                                key={`prev-${packageKey}`}
                                className="w-full flex-shrink-0 px-1 sm:px-3"
                              >
                                <div className="relative bg-white rounded-xl shadow-lg overflow-hidden mx-auto border border-gray-100">
                                  {/* Package content - same as original */}
                                  <div className="p-3 sm:p-4">
                                    <div className="text-center mb-3 sm:mb-4">
                                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                                        {packageInfo.title}
                                      </h3>
                                      <div className="mb-3">
                                        <div className="text-xl sm:text-2xl font-bold text-amber-600 mb-1">
                                          {selectedCity
                                            ? currentCityPricing?.price
                                            : "X,XXX"}
                                        </div>
                                        {selectedCity &&
                                          !currentCityPricing?.startingAt && (
                                            <div className="text-xs text-gray-500">
                                              per sq. ft (Ex GST)
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                    <div className="border-t border-gray-100 mb-3"></div>
                                    <div className="space-y-1.5">
                                      {Object.entries(packageInfo.sections).map(
                                        ([sectionKey, section]) => (
                                          <div
                                            key={sectionKey}
                                            className="border border-gray-100 rounded-md overflow-hidden"
                                          >
                                            <button
                                              onClick={() =>
                                                toggleSection(sectionKey)
                                              }
                                              className="w-full flex items-center justify-between p-2.5 sm:p-3 text-left hover:bg-gray-50 transition-colors"
                                            >
                                              <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                                                {section.title}
                                              </span>
                                              <div className="flex items-center space-x-2">
                                                <svg
                                                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                                    expandedSection ===
                                                    sectionKey
                                                      ? "rotate-180"
                                                      : ""
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
                                              </div>
                                            </button>
                                            <div
                                              className={`
                                                  transition-all duration-300 ease-in-out overflow-hidden
                                                  ${
                                                    expandedSection ===
                                                    sectionKey
                                                      ? "max-h-48 opacity-100"
                                                      : "max-h-0 opacity-0"
                                                  }
                                                `}
                                            >
                                              <div className="px-2.5 sm:px-3 pb-2.5 sm:pb-3 bg-gray-50">
                                                <ul className="space-y-1.5">
                                                  {section.items.map(
                                                    (item, itemIndex) => (
                                                      <li
                                                        key={itemIndex}
                                                        className="flex items-start text-xs sm:text-sm text-gray-700"
                                                      >
                                                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                                                        <span className="leading-relaxed">
                                                          {item}
                                                        </span>
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {/* Current set - main packages */}
                          {packageEntries.map(([packageKey, packageInfo]) => {
                            const currentCityPricing =
                              packageInfo.pricing[
                                selectedCity.id as keyof typeof packageInfo.pricing
                              ];

                            return (
                              <div
                                key={packageKey}
                                className="w-full flex-shrink-0 px-1 sm:px-3"
                              >
                                <div className="relative bg-white rounded-xl shadow-lg overflow-hidden mx-auto border border-gray-100">
                                  {/* Card Content */}
                                  <div className="p-3 sm:p-4">
                                    {/* Package Title */}
                                    <div className="text-center mb-3 sm:mb-4">
                                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                                        {packageInfo.title}
                                      </h3>

                                      {/* Price Display */}
                                      <div className="mb-3">
                                        <div className="text-xl sm:text-2xl font-bold text-amber-600 mb-1">
                                          {selectedCity
                                            ? currentCityPricing?.price
                                            : "X,XXX"}
                                        </div>
                                        {selectedCity &&
                                          !currentCityPricing?.startingAt && (
                                            <div className="text-xs text-gray-500">
                                              per sq. ft (Ex GST)
                                            </div>
                                          )}
                                      </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-100 mb-3"></div>

                                    {/* Expandable Sections */}
                                    <div className="space-y-1.5">
                                      {Object.entries(packageInfo.sections).map(
                                        ([sectionKey, section]) => (
                                          <div
                                            key={sectionKey}
                                            className="border border-gray-100 rounded-md overflow-hidden"
                                          >
                                            <button
                                              onClick={() =>
                                                toggleSection(sectionKey)
                                              }
                                              className="w-full flex items-center justify-between p-2.5 sm:p-3 text-left hover:bg-gray-50 transition-colors"
                                            >
                                              <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                                                {section.title}
                                              </span>
                                              <div className="flex items-center space-x-2">
                                                <svg
                                                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                                    expandedSection ===
                                                    sectionKey
                                                      ? "rotate-180"
                                                      : ""
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
                                              </div>
                                            </button>

                                            <div
                                              className={`
                                                transition-all duration-300 ease-in-out overflow-hidden
                                                ${
                                                  expandedSection === sectionKey
                                                    ? "max-h-48 opacity-100"
                                                    : "max-h-0 opacity-0"
                                                }
                                              `}
                                            >
                                              <div className="px-2.5 sm:px-3 pb-2.5 sm:pb-3 bg-gray-50">
                                                <ul className="space-y-1.5">
                                                  {section.items.map(
                                                    (item, itemIndex) => (
                                                      <li
                                                        key={itemIndex}
                                                        className="flex items-start text-xs sm:text-sm text-gray-700"
                                                      >
                                                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                                                        <span className="leading-relaxed">
                                                          {item}
                                                        </span>
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {/* Next set for seamless right scrolling */}
                          {packageEntries.map(([packageKey, packageInfo]) => {
                            const currentCityPricing =
                              packageInfo.pricing[
                                selectedCity.id as keyof typeof packageInfo.pricing
                              ];

                            return (
                              <div
                                key={`next-${packageKey}`}
                                className="w-full flex-shrink-0 px-1 sm:px-3"
                              >
                                <div className="relative bg-white rounded-xl shadow-lg overflow-hidden mx-auto border border-gray-100">
                                  {/* Package content - same as original */}
                                  <div className="p-3 sm:p-4">
                                    <div className="text-center mb-3 sm:mb-4">
                                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                                        {packageInfo.title}
                                      </h3>
                                      <div className="mb-3">
                                        <div className="text-xl sm:text-2xl font-bold text-amber-600 mb-1">
                                          {selectedCity
                                            ? currentCityPricing?.price
                                            : "X,XXX"}
                                        </div>
                                        {selectedCity &&
                                          !currentCityPricing?.startingAt && (
                                            <div className="text-xs text-gray-500">
                                              per sq. ft (Ex GST)
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                    <div className="border-t border-gray-100 mb-3"></div>
                                    <div className="space-y-1.5">
                                      {Object.entries(packageInfo.sections).map(
                                        ([sectionKey, section]) => (
                                          <div
                                            key={sectionKey}
                                            className="border border-gray-100 rounded-md overflow-hidden"
                                          >
                                            <button
                                              onClick={() =>
                                                toggleSection(sectionKey)
                                              }
                                              className="w-full flex items-center justify-between p-2.5 sm:p-3 text-left hover:bg-gray-50 transition-colors"
                                            >
                                              <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                                                {section.title}
                                              </span>
                                              <div className="flex items-center space-x-2">
                                                <svg
                                                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                                                    expandedSection ===
                                                    sectionKey
                                                      ? "rotate-180"
                                                      : ""
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
                                              </div>
                                            </button>
                                            <div
                                              className={`
                                                  transition-all duration-300 ease-in-out overflow-hidden
                                                  ${
                                                    expandedSection ===
                                                    sectionKey
                                                      ? "max-h-48 opacity-100"
                                                      : "max-h-0 opacity-0"
                                                  }
                                                `}
                                            >
                                              <div className="px-2.5 sm:px-3 pb-2.5 sm:pb-3 bg-gray-50">
                                                <ul className="space-y-1.5">
                                                  {section.items.map(
                                                    (item, itemIndex) => (
                                                      <li
                                                        key={itemIndex}
                                                        className="flex items-start text-xs sm:text-sm text-gray-700"
                                                      >
                                                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                                                        <span className="leading-relaxed">
                                                          {item}
                                                        </span>
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Pagination Dots */}
                      <div className="flex justify-center mt-4 space-x-1.5">
                        {packageEntries.map((_, index) => {
                          const actualCurrentPackage =
                            ((currentPackage % packageEntries.length) +
                              packageEntries.length) %
                            packageEntries.length;
                          return (
                            <button
                              key={index}
                              onClick={() => goToPackage(index)}
                              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                                index === actualCurrentPackage
                                  ? "bg-amber-600"
                                  : "bg-gray-300 hover:bg-gray-400"
                              }`}
                            />
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>
            </>
          )}

          {/* Message when no city is selected */}
          {!selectedCity && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                Please select a city from the navigation to view available
                packages
              </div>
              <button
                onClick={() => setShowCityModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Select City
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Service Timeline - Construction only */}
      {selectedCity && (
        <section className="py-8 sm:py-10 lg:py-12 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8 lg:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-4">
                Your Construction Journey
              </h2>
              <p className="text-base sm:text-lg text-amber-800">
                Follow our streamlined process from start to finish
              </p>
            </div>

            {/* Timeline Steps */}
            <div className="relative">
              {/* Connecting Line - Mobile: Horizontal line, Desktop: Complex line */}
              <div className="absolute top-6 sm:top-8 lg:top-20 left-0 right-0 h-0.5 lg:h-1">
                {/* Mobile/Tablet: Simple horizontal line */}
                <div className="lg:hidden flex items-center h-full mx-8 sm:mx-12">
                  <div className="flex-1 bg-gradient-to-r from-amber-400 to-orange-400 h-0.5 rounded-full"></div>
                </div>

                {/* Desktop: Complex connecting line */}
                <div className="hidden lg:flex justify-between items-center h-full max-w-5xl mx-auto px-16">
                  <div className="flex-1 bg-gradient-to-r from-amber-400 to-orange-400 h-1 rounded-full"></div>
                  <div className="w-8"></div>
                  <div className="flex-1 bg-gradient-to-r from-amber-400 to-orange-400 h-1 rounded-full"></div>
                  <div className="w-8"></div>
                  <div className="flex-1 bg-gradient-to-r from-amber-400 to-orange-400 h-1 rounded-full"></div>
                </div>
              </div>

              {/* Timeline Steps Grid - Mobile: Single row, Desktop: 4 columns */}
              <div className="grid grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-12">
                {/* Step 1 */}
                <div className="text-center">
                  <div className="relative mb-3 sm:mb-4 lg:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white border-2 sm:border-4 border-amber-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <Image
                        src="/icons/consult.png"
                        alt="Planning"
                        width={24}
                        height={24}
                        className="object-contain sm:w-8 sm:h-8 lg:w-10 lg:h-10"
                      />
                    </div>
                    <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-1 sm:px-2 lg:px-3 py-0.5 sm:py-1 rounded-full">
                      1
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-sm lg:text-lg font-bold text-amber-900 mb-1 sm:mb-2 whitespace-pre-line">
                    Plan & Consult
                  </h3>
                  {/* Hide description on mobile, show on larger screens */}
                  <p className="hidden lg:block text-xs sm:text-xs lg:text-sm text-amber-700 leading-relaxed">
                    Meet our experts to discuss your vision, budget, and
                    requirements for your dream home.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="text-center">
                  <div className="relative mb-3 sm:mb-4 lg:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white border-2 sm:border-4 border-amber-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <Image
                        src="/icons/planning-drawing.png"
                        alt="Design"
                        width={24}
                        height={24}
                        className="object-contain sm:w-8 sm:h-8 lg:w-10 lg:h-10"
                      />
                    </div>
                    <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-1 sm:px-2 lg:px-3 py-0.5 sm:py-1 rounded-full">
                      2
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-sm lg:text-lg font-bold text-amber-900 mb-1 sm:mb-2">
                    Design & Approve
                  </h3>
                  {/* Hide description on mobile, show on larger screens */}
                  <p className="hidden lg:block text-xs sm:text-xs lg:text-sm text-amber-700 leading-relaxed">
                    Review detailed 3D designs, floor plans, and make final
                    approvals before construction.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="text-center">
                  <div className="relative mb-3 sm:mb-4 lg:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white border-2 sm:border-4 border-amber-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <Image
                        src="/icons/building-under-construction.png"
                        alt="Build/Execute"
                        width={24}
                        height={24}
                        className="object-contain sm:w-8 sm:h-8 lg:w-10 lg:h-10"
                      />
                    </div>
                    <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-1 sm:px-2 lg:px-3 py-0.5 sm:py-1 rounded-full">
                      3
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-sm lg:text-lg font-bold text-amber-900 mb-1 sm:mb-2">
                    Build & Monitor
                  </h3>
                  {/* Hide description on mobile, show on larger screens */}
                  <p className="hidden lg:block text-xs sm:text-xs lg:text-sm text-amber-700 leading-relaxed">
                    Professional construction with regular quality checks and
                    progress updates.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="text-center">
                  <div className="relative mb-3 sm:mb-4 lg:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white border-2 sm:border-4 border-amber-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <Image
                        src="/icons/built-homes.png"
                        alt="Complete"
                        width={24}
                        height={24}
                        className="object-contain sm:w-8 sm:h-8 lg:w-10 lg:h-10"
                      />
                    </div>
                    <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-1 sm:px-2 lg:px-3 py-0.5 sm:py-1 rounded-full">
                      4
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-sm lg:text-lg font-bold text-amber-900 mb-1 sm:mb-2 whitespace-pre-line">
                    Handover & Move In
                  </h3>
                  {/* Hide description on mobile, show on larger screens */}
                  <p className="hidden lg:block text-xs sm:text-xs lg:text-sm text-amber-700 leading-relaxed">
                    Final inspection, documentation handover, and keys to your
                    dream home.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bank Approval Section */}
      <section id="bank-approval" className="py-8 sm:py-10 lg:py-12 bg-white">
        <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900 mb-4">
              Banks
            </h2>
            <p className="text-lg sm:text-xl text-amber-800">
              Easy Home Construction Loans
            </p>
          </div>

          <div className="flex justify-center items-center gap-4 sm:gap-8 lg:gap-12">
            <div className="w-24 h-12 sm:w-32 sm:h-16 lg:w-40 lg:h-20 relative flex-shrink-0">
              <Image
                src="/banks-icons/hdfc.png"
                alt="HDFC Bank"
                fill
                className="object-contain"
              />
            </div>
            <div className="w-24 h-12 sm:w-32 sm:h-16 lg:w-40 lg:h-20 relative flex-shrink-0">
              <Image
                src="/banks-icons/icici.png"
                alt="ICICI Bank"
                fill
                className="object-contain"
              />
            </div>
            <div className="w-24 h-12 sm:w-32 sm:h-16 lg:w-40 lg:h-20 relative flex-shrink-0">
              <Image
                src="/banks-icons/sbi.png"
                alt="SBI Bank"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 sm:py-10 lg:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900 mb-4">
              Testimonials
            </h2>
            <p className="text-lg sm:text-xl text-amber-800">
              See what our customers have to say.
            </p>
          </div>

          {/* Video Testimonials Carousel */}
          <div className="relative max-w-6xl mx-auto">
            {/* Navigation Arrows - Desktop only */}
            <button
              onClick={prevTestimonial}
              className="hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
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
              onClick={nextTestimonial}
              className="hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
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

            {/* Video Testimonials - Single testimonial on mobile, 3 columns on desktop */}
            <div className="block md:hidden">
              {/* Mobile: Single testimonial carousel */}
              <div className="relative overflow-hidden rounded-2xl carousel-container">
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
                  onTouchEnd={() => handleTouchEnd("testimonial")}
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
                          <div className="text-center font-semibold text-amber-900 text-sm sm:text-base mt-4">
                            {testimonial.name}
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
                          <div className="text-center font-semibold text-amber-900 text-sm sm:text-base mt-4">
                            {testimonial.name}
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
                          <div className="text-center font-semibold text-amber-900 text-sm sm:text-base mt-4">
                            {testimonial.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop: All testimonials visible */}
            <div className="hidden md:grid md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {/* Video Testimonial 1 */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl overflow-hidden shadow-lg border border-orange-100 flex flex-col">
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
                <div className="p-4 sm:p-6 bg-white flex flex-col flex-grow">
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
                    Most people struggle with delays, finances, or contractors.
                    I didn&apos;t face even 1% of that. Sunbrix made my home
                    journey smooth and hassle-free.
                  </p>
                  <div className="text-center font-semibold text-amber-900 text-sm sm:text-base mt-4">
                    Mr. Suryanarayanan Karthikeyan
                  </div>
                </div>
              </div>

              {/* Video Testimonial 2 */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl overflow-hidden shadow-lg border border-orange-100 flex flex-col">
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
                <div className="p-4 sm:p-6 bg-white flex flex-col flex-grow">
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
                    Sunbrix&apos;s expert team guided me at every step. Their
                    quality gave me total confidence throughout the journey.
                  </p>
                  <div className="text-center font-semibold text-amber-900 text-sm sm:text-base mt-4">
                    Mr. Gururaj Naik
                  </div>
                </div>
              </div>

              {/* Video Testimonial 3 */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl overflow-hidden shadow-lg border border-orange-100 flex flex-col">
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
                <div className="p-4 sm:p-6 bg-white flex flex-col flex-grow">
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
                    Sunbrix Homes exceeded our expectations! The construction
                    quality and timely delivery were remarkable. Truly a dream
                    home.
                  </p>
                  <div className="text-center font-semibold text-amber-900 text-sm sm:text-base mt-4">
                    Mr. Hariharasudan
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Pagination Dots */}
            <div className="flex justify-center mt-6 space-x-2 md:hidden">
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

            {/* Desktop Pagination Dots */}
            <div className="hidden md:flex justify-center mt-8 space-x-2">
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

      {/* Floating Contact Us Button */}
      <FloatingBookButton />
    </div>
  );
}
