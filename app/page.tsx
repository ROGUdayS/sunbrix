"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import ContactForm from "./components/ContactForm";
import FloatingBookButton from "./components/FloatingBookButton";
import ImageModal from "./components/ImageModal";
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

  // Add service type selection state - default to construction
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(
    "construction"
  );

  // Add package carousel state
  const [currentPackage, setCurrentPackage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Touch state for packages carousel
  const [packageTouchStart, setPackageTouchStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [packageTouchEnd, setPackageTouchEnd] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Touch state for gallery carousel
  const [galleryTouchStart, setGalleryTouchStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [galleryTouchEnd, setGalleryTouchEnd] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isGalleryTransitioning, setIsGalleryTransitioning] = useState(false);

  // Touch state for testimonials carousel
  const [testimonialTouchStart, setTestimonialTouchStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [testimonialTouchEnd, setTestimonialTouchEnd] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Modal state for gallery images
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);
  const [modalTitle, setModalTitle] = useState("");

  // Add state for projects to fix hydration issue
  const [projects, setProjects] = useState<
    {
      image: string;
      title: string;
      description: string;
      id: number;
    }[]
  >([]);

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
    if (projects.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    if (projects.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
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
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index);
  };

  // Modal functions for gallery
  const openModal = (
    images: string[],
    title: string,
    startIndex: number = 0
  ) => {
    setModalImages(images);
    setModalTitle(title);
    setModalCurrentIndex(startIndex);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const nextModalImage = () => {
    setModalCurrentIndex((prev) => (prev + 1) % modalImages.length);
  };

  const prevModalImage = () => {
    setModalCurrentIndex(
      (prev) => (prev - 1 + modalImages.length) % modalImages.length
    );
  };

  const goToModalImage = (index: number) => {
    setModalCurrentIndex(index);
  };

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  // Package carousel navigation functions with infinite loop
  const nextPackage = () => {
    if (!selectedServiceType || isTransitioning) return;

    const packageKeys = Object.keys(
      packagesData.packages[
        selectedServiceType as keyof typeof packagesData.packages
      ] || {}
    );

    if (packageKeys.length === 0) return;

    setIsTransitioning(true);
    setCurrentPackage((prev) => prev + 1);
  };

  const prevPackage = () => {
    if (!selectedServiceType || isTransitioning) return;

    const packageKeys = Object.keys(
      packagesData.packages[
        selectedServiceType as keyof typeof packagesData.packages
      ] || {}
    );

    if (packageKeys.length === 0) return;

    setIsTransitioning(true);
    setCurrentPackage((prev) => prev - 1);
  };

  const goToPackage = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPackage(index);
  };

  // Handle infinite loop transitions with smooth reset
  useEffect(() => {
    if (!selectedServiceType || !isTransitioning) return;

    const packageKeys = Object.keys(
      packagesData.packages[
        selectedServiceType as keyof typeof packagesData.packages
      ] || {}
    );

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
    }, 500);

    return () => clearTimeout(timer);
  }, [currentPackage, isTransitioning, selectedServiceType]);

  // Reset carousel when service type changes
  useEffect(() => {
    setCurrentPackage(0);
    setIsTransitioning(false);
  }, [selectedServiceType]);

  // Touch handlers for packages carousel
  const handlePackageTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setPackageTouchStart({ x: touch.clientX, y: touch.clientY });
    setPackageTouchEnd(null);
  };

  const handlePackageTouchMove = (e: React.TouchEvent) => {
    if (!packageTouchStart) return;
    const touch = e.touches[0];
    setPackageTouchEnd({ x: touch.clientX, y: touch.clientY });

    // Calculate horizontal and vertical distances
    const deltaX = Math.abs(packageTouchStart.x - touch.clientX);
    const deltaY = Math.abs(packageTouchStart.y - touch.clientY);

    // Much stricter conditions: horizontal must be at least 2x vertical movement
    // and minimum 30px horizontal movement before preventing scroll
    if (deltaX > deltaY * 2 && deltaX > 30) {
      e.preventDefault();
    }
  };

  const handlePackageTouchEnd = () => {
    if (!packageTouchStart || !packageTouchEnd) return;

    const deltaX = packageTouchStart.x - packageTouchEnd.x;
    const deltaY = Math.abs(packageTouchStart.y - packageTouchEnd.y);

    // Much stricter conditions for triggering swipe:
    // 1. Horizontal movement must be at least 3x vertical movement
    // 2. Minimum 80px horizontal movement
    // 3. Maximum 40px vertical movement allowed
    if (Math.abs(deltaX) > deltaY * 3 && Math.abs(deltaX) > 80 && deltaY < 40) {
      const isLeftSwipe = deltaX > 80;
      const isRightSwipe = deltaX < -80;

      if (isLeftSwipe) {
        nextPackage();
      } else if (isRightSwipe) {
        prevPackage();
      }
    }

    setPackageTouchStart(null);
    setPackageTouchEnd(null);
  };

  // Touch handlers for gallery carousel
  const handleGalleryTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setGalleryTouchStart({ x: touch.clientX, y: touch.clientY });
    setGalleryTouchEnd(null);
  };

  const handleGalleryTouchMove = (e: React.TouchEvent) => {
    if (!galleryTouchStart) return;
    const touch = e.touches[0];
    setGalleryTouchEnd({ x: touch.clientX, y: touch.clientY });

    // Calculate horizontal and vertical distances
    const deltaX = Math.abs(galleryTouchStart.x - touch.clientX);
    const deltaY = Math.abs(galleryTouchStart.y - touch.clientY);

    // Much stricter conditions: horizontal must be at least 2x vertical movement
    // and minimum 30px horizontal movement before preventing scroll
    if (deltaX > deltaY * 2 && deltaX > 30) {
      e.preventDefault();
    }
  };

  const handleGalleryTouchEnd = () => {
    if (!galleryTouchStart || !galleryTouchEnd || isGalleryTransitioning)
      return;

    const deltaX = galleryTouchStart.x - galleryTouchEnd.x;
    const deltaY = Math.abs(galleryTouchStart.y - galleryTouchEnd.y);

    // Much stricter conditions for triggering swipe:
    // 1. Horizontal movement must be at least 3x vertical movement
    // 2. Minimum 80px horizontal movement
    // 3. Maximum 40px vertical movement allowed
    if (Math.abs(deltaX) > deltaY * 3 && Math.abs(deltaX) > 80 && deltaY < 40) {
      setIsGalleryTransitioning(true);

      const isLeftSwipe = deltaX > 80;
      const isRightSwipe = deltaX < -80;

      if (isLeftSwipe) {
        nextSlide();
      } else if (isRightSwipe) {
        prevSlide();
      }

      // Reset transition state after animation completes
      setTimeout(() => {
        setIsGalleryTransitioning(false);
      }, 500);
    }

    setGalleryTouchStart(null);
    setGalleryTouchEnd(null);
  };

  // Touch handlers for testimonials carousel
  const handleTestimonialTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTestimonialTouchStart({ x: touch.clientX, y: touch.clientY });
    setTestimonialTouchEnd(null);
  };

  const handleTestimonialTouchMove = (e: React.TouchEvent) => {
    if (!testimonialTouchStart) return;
    const touch = e.touches[0];
    setTestimonialTouchEnd({ x: touch.clientX, y: touch.clientY });

    // Calculate horizontal and vertical distances
    const deltaX = Math.abs(testimonialTouchStart.x - touch.clientX);
    const deltaY = Math.abs(testimonialTouchStart.y - touch.clientY);

    // Much stricter conditions: horizontal must be at least 2x vertical movement
    // and minimum 30px horizontal movement before preventing scroll
    if (deltaX > deltaY * 2 && deltaX > 30) {
      e.preventDefault();
    }
  };

  const handleTestimonialTouchEnd = () => {
    if (!testimonialTouchStart || !testimonialTouchEnd) return;

    const deltaX = testimonialTouchStart.x - testimonialTouchEnd.x;
    const deltaY = Math.abs(testimonialTouchStart.y - testimonialTouchEnd.y);

    // Much stricter conditions for triggering swipe:
    // 1. Horizontal movement must be at least 3x vertical movement
    // 2. Minimum 80px horizontal movement
    // 3. Maximum 40px vertical movement allowed
    if (Math.abs(deltaX) > deltaY * 3 && Math.abs(deltaX) > 80 && deltaY < 40) {
      const isLeftSwipe = deltaX > 80;
      const isRightSwipe = deltaX < -80;

      if (isLeftSwipe) {
        nextTestimonial();
      } else if (isRightSwipe) {
        prevTestimonial();
      }
    }

    setTestimonialTouchStart(null);
    setTestimonialTouchEnd(null);
  };

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
      <section className="py-8 sm:py-10 lg:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900 mb-4">
              Gallery
            </h2>
          </div>

          {/* Only render carousel if projects are loaded */}
          {projects.length > 0 && (
            <>
              {/* Carousel Container */}
              <div className="relative max-w-6xl mx-auto">
                {/* Main Image Container */}
                <div
                  className="relative overflow-hidden rounded-2xl select-none carousel-container"
                  onTouchStart={handleGalleryTouchStart}
                  onTouchMove={handleGalleryTouchMove}
                  onTouchEnd={handleGalleryTouchEnd}
                >
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {projects.map((project) => (
                      <div key={project.id} className="w-full flex-shrink-0">
                        <div
                          className="relative cursor-pointer"
                          onClick={() =>
                            openModal([project.image], project.title, 0)
                          }
                        >
                          <Image
                            src={project.image}
                            alt={project.title}
                            width={1200}
                            height={600}
                            className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover"
                          />
                          {/* Navigation Arrows for main carousel */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              prevSlide();
                            }}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
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
                            onClick={(e) => {
                              e.stopPropagation();
                              nextSlide();
                            }}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
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
                <div className="text-center mt-4 sm:mt-6 lg:mt-8 px-4">
                  <div className="flex justify-center mb-4">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-4xl mx-auto">
                    {projects[currentSlide]?.description || "Loading..."}
                  </p>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center mt-4 sm:mt-6 lg:mt-8 space-x-2">
                  {projects.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToSlide(index);
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentSlide
                          ? "bg-gray-800"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>

                {/* Explore More Button */}
                <div className="text-center mt-6 sm:mt-8 lg:mt-12">
                  <Link
                    href="/projects"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 inline-block shadow-sm hover:shadow-md"
                  >
                    Explore more projects
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* Loading state while projects are being loaded */}
          {projects.length === 0 && (
            <div className="text-center py-12">
              <div className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl h-[400px] md:h-[500px] lg:h-[600px] mb-6"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mx-auto mb-4"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2 mx-auto"></div>
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
      <section className="py-8 sm:py-10 lg:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 lg:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900 mb-4">
              Packages
            </h2>
            {/* City + Service Type Selector - Responsive Layout */}
            <div className="mt-6 sm:mt-8 space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:items-center lg:gap-4 px-4">
              {/* Left spacer on desktop */}
              <div className="hidden lg:block" />

              {/* Service Type Buttons */}
              <div className="flex justify-center">
                {selectedCity && (
                  <div className="w-full sm:w-auto flex sm:inline-flex justify-center gap-2 sm:gap-2 rounded-lg bg-gray-50 border border-gray-200 p-2">
                    {packagesData.serviceTypes.map((serviceType) => (
                      <button
                        key={serviceType.id}
                        onClick={() => setSelectedServiceType(serviceType.id)}
                        className={`flex-1 sm:flex-none px-4 sm:px-4 py-3 sm:py-2 text-sm sm:text-sm font-medium rounded-md transition ${
                          selectedServiceType === serviceType.id
                            ? "bg-amber-600 text-white shadow"
                            : "text-gray-700 hover:bg-white hover:shadow-sm"
                        }`}
                      >
                        {serviceType.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* City Selection */}
              <div className="flex justify-center lg:justify-end">
                <button
                  onClick={() => setShowCityModal(true)}
                  className="flex items-center space-x-2 rounded-lg border border-amber-300 bg-white px-3 sm:px-4 py-2 text-sm sm:text-base text-amber-700 shadow-sm transition hover:shadow-md"
                >
                  <span>{selectedCity?.displayName || "Select City"}</span>
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
          </div>

          {/* Package Cards - Desktop: All visible, Mobile: Carousel */}
          {selectedCity && selectedServiceType && (
            <>
              {/* Desktop View - All packages visible */}
              <div className="hidden lg:grid lg:grid-cols-3 gap-8">
                {Object.entries(
                  packagesData.packages[
                    selectedServiceType as keyof typeof packagesData.packages
                  ]
                ).map(([packageKey, packageInfo]) => {
                  const currentCityPricing =
                    packageInfo.pricing[
                      selectedCity.id as keyof typeof packageInfo.pricing
                    ];

                  return (
                    <div
                      key={packageKey}
                      className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                        packageInfo.popular
                          ? "ring-2 ring-amber-500 scale-105 z-10"
                          : "border border-gray-100 hover:border-amber-200"
                      }`}
                    >
                      {/* Popular Badge */}
                      {packageInfo.popular && (
                        <div className="absolute -top-0 left-0 right-0">
                          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-2 text-sm font-semibold">
                            ⭐ Most Popular
                          </div>
                        </div>
                      )}

                      {/* Card Content */}
                      <div
                        className={`p-8 ${packageInfo.popular ? "pt-12" : ""}`}
                      >
                        {/* Package Title */}
                        <div className="text-center mb-6">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {packageInfo.title}
                          </h3>

                          {/* Price Display */}
                          <div className="mb-4">
                            <div className="text-4xl font-bold text-amber-600 mb-1">
                              {selectedCity
                                ? currentCityPricing?.price
                                : "X,XXX"}
                            </div>
                            {selectedCity &&
                              !currentCityPricing?.startingAt && (
                                <div className="text-sm text-gray-500">
                                  per sq. ft (Ex GST)
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-100 mb-4"></div>

                        {/* Expandable Sections */}
                        <div className="space-y-2">
                          {Object.entries(packageInfo.sections).map(
                            ([sectionKey, section]) => (
                              <div
                                key={sectionKey}
                                className="border border-gray-100 rounded-lg overflow-hidden"
                              >
                                <button
                                  onClick={() => toggleSection(sectionKey)}
                                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                                >
                                  <span className="font-semibold text-gray-900 text-sm">
                                    {section.title}
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <svg
                                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
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
                                        ? "max-h-96 opacity-100"
                                        : "max-h-0 opacity-0"
                                    }
                                  `}
                                >
                                  <div className="px-4 pb-4 bg-gray-50">
                                    <ul className="space-y-2">
                                      {section.items.map((item, index) => (
                                        <li
                                          key={index}
                                          className="flex items-start text-sm text-gray-700"
                                        >
                                          <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
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
                })}
              </div>

              {/* Mobile/Tablet Carousel View */}
              <div className="lg:hidden relative">
                {(() => {
                  const packageEntries = Object.entries(
                    packagesData.packages[
                      selectedServiceType as keyof typeof packagesData.packages
                    ]
                  );

                  return (
                    <>
                      {/* Carousel Container */}
                      <div
                        className="relative overflow-hidden select-none carousel-container"
                        onTouchStart={handlePackageTouchStart}
                        onTouchMove={handlePackageTouchMove}
                        onTouchEnd={handlePackageTouchEnd}
                      >
                        <div
                          ref={carouselRef}
                          className={`flex transition-transform duration-500 ease-in-out ${
                            !isTransitioning ? "transition-none" : ""
                          }`}
                          style={{
                            transform: `translateX(-${
                              (currentPackage + packageEntries.length) * 100
                            }%)`,
                          }}
                        >
                          {/* Duplicate packages for infinite loop effect */}
                          {/* Previous set for seamless left scrolling */}
                          {packageEntries.map(
                            ([packageKey, packageInfo], index) => {
                              const currentCityPricing =
                                packageInfo.pricing[
                                  selectedCity.id as keyof typeof packageInfo.pricing
                                ];
                              const actualIndex = index - packageEntries.length;

                              return (
                                <div
                                  key={`prev-${packageKey}`}
                                  className={`w-full flex-shrink-0 px-4 ${
                                    actualIndex === currentPackage
                                      ? "z-10"
                                      : "z-0"
                                  }`}
                                >
                                  <div
                                    className={`relative bg-white rounded-2xl shadow-lg transition-all duration-300 overflow-hidden mx-auto ${
                                      packageInfo.popular
                                        ? "ring-2 ring-amber-500"
                                        : "border border-gray-100"
                                    } ${
                                      actualIndex === currentPackage
                                        ? "scale-100 opacity-100 shadow-xl"
                                        : "scale-90 opacity-60 shadow-md"
                                    }`}
                                  >
                                    {/* Package content - same as original */}
                                    {packageInfo.popular && (
                                      <div className="absolute -top-0 left-0 right-0">
                                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-2 text-sm font-semibold">
                                          ⭐ Most Popular
                                        </div>
                                      </div>
                                    )}
                                    <div
                                      className={`p-4 sm:p-6 ${
                                        packageInfo.popular
                                          ? "pt-8 sm:pt-10"
                                          : ""
                                      }`}
                                    >
                                      <div className="text-center mb-4 sm:mb-6">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                          {packageInfo.title}
                                        </h3>
                                        <div className="mb-4">
                                          <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-1">
                                            {selectedCity
                                              ? currentCityPricing?.price
                                              : "X,XXX"}
                                          </div>
                                          {selectedCity &&
                                            !currentCityPricing?.startingAt && (
                                              <div className="text-sm text-gray-500">
                                                per sq. ft (Ex GST)
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                      <div className="border-t border-gray-100 mb-4"></div>
                                      <div className="space-y-2">
                                        {Object.entries(
                                          packageInfo.sections
                                        ).map(([sectionKey, section]) => (
                                          <div
                                            key={sectionKey}
                                            className="border border-gray-100 rounded-lg overflow-hidden"
                                          >
                                            <button
                                              onClick={() =>
                                                toggleSection(sectionKey)
                                              }
                                              className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors"
                                            >
                                              <span className="font-semibold text-gray-900 text-sm">
                                                {section.title}
                                              </span>
                                              <div className="flex items-center space-x-2">
                                                <svg
                                                  className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-200 ${
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
                                                      ? "max-h-96 opacity-100"
                                                      : "max-h-0 opacity-0"
                                                  }
                                                `}
                                            >
                                              <div className="px-3 sm:px-4 pb-3 sm:pb-4 bg-gray-50">
                                                <ul className="space-y-2">
                                                  {section.items.map(
                                                    (item, itemIndex) => (
                                                      <li
                                                        key={itemIndex}
                                                        className="flex items-start text-sm text-gray-700"
                                                      >
                                                        <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
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
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}

                          {/* Current set - main packages */}
                          {packageEntries.map(
                            ([packageKey, packageInfo], index) => {
                              const currentCityPricing =
                                packageInfo.pricing[
                                  selectedCity.id as keyof typeof packageInfo.pricing
                                ];

                              return (
                                <div
                                  key={packageKey}
                                  className={`w-full flex-shrink-0 px-4 ${
                                    index === currentPackage ? "z-10" : "z-0"
                                  }`}
                                >
                                  <div
                                    className={`relative bg-white rounded-2xl shadow-lg transition-all duration-300 overflow-hidden mx-auto ${
                                      packageInfo.popular
                                        ? "ring-2 ring-amber-500"
                                        : "border border-gray-100"
                                    } ${
                                      index === currentPackage
                                        ? "scale-100 opacity-100 shadow-xl"
                                        : "scale-90 opacity-60 shadow-md"
                                    }`}
                                  >
                                    {/* Popular Badge */}
                                    {packageInfo.popular && (
                                      <div className="absolute -top-0 left-0 right-0">
                                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-2 text-sm font-semibold">
                                          ⭐ Most Popular
                                        </div>
                                      </div>
                                    )}

                                    {/* Card Content */}
                                    <div
                                      className={`p-4 sm:p-6 ${
                                        packageInfo.popular
                                          ? "pt-8 sm:pt-10"
                                          : ""
                                      }`}
                                    >
                                      {/* Package Title */}
                                      <div className="text-center mb-4 sm:mb-6">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                          {packageInfo.title}
                                        </h3>

                                        {/* Price Display */}
                                        <div className="mb-4">
                                          <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-1">
                                            {selectedCity
                                              ? currentCityPricing?.price
                                              : "X,XXX"}
                                          </div>
                                          {selectedCity &&
                                            !currentCityPricing?.startingAt && (
                                              <div className="text-sm text-gray-500">
                                                per sq. ft (Ex GST)
                                              </div>
                                            )}
                                        </div>
                                      </div>

                                      {/* Divider */}
                                      <div className="border-t border-gray-100 mb-4"></div>

                                      {/* Expandable Sections */}
                                      <div className="space-y-2">
                                        {Object.entries(
                                          packageInfo.sections
                                        ).map(([sectionKey, section]) => (
                                          <div
                                            key={sectionKey}
                                            className="border border-gray-100 rounded-lg overflow-hidden"
                                          >
                                            <button
                                              onClick={() =>
                                                toggleSection(sectionKey)
                                              }
                                              className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors"
                                            >
                                              <span className="font-semibold text-gray-900 text-sm">
                                                {section.title}
                                              </span>
                                              <div className="flex items-center space-x-2">
                                                <svg
                                                  className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-200 ${
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
                                                    ? "max-h-96 opacity-100"
                                                    : "max-h-0 opacity-0"
                                                }
                                              `}
                                            >
                                              <div className="px-3 sm:px-4 pb-3 sm:pb-4 bg-gray-50">
                                                <ul className="space-y-2">
                                                  {section.items.map(
                                                    (item, itemIndex) => (
                                                      <li
                                                        key={itemIndex}
                                                        className="flex items-start text-sm text-gray-700"
                                                      >
                                                        <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
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
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}

                          {/* Next set for seamless right scrolling */}
                          {packageEntries.map(
                            ([packageKey, packageInfo], index) => {
                              const currentCityPricing =
                                packageInfo.pricing[
                                  selectedCity.id as keyof typeof packageInfo.pricing
                                ];
                              const actualIndex = index + packageEntries.length;

                              return (
                                <div
                                  key={`next-${packageKey}`}
                                  className={`w-full flex-shrink-0 px-4 ${
                                    actualIndex === currentPackage
                                      ? "z-10"
                                      : "z-0"
                                  }`}
                                >
                                  <div
                                    className={`relative bg-white rounded-2xl shadow-lg transition-all duration-300 overflow-hidden mx-auto ${
                                      packageInfo.popular
                                        ? "ring-2 ring-amber-500"
                                        : "border border-gray-100"
                                    } ${
                                      actualIndex === currentPackage
                                        ? "scale-100 opacity-100 shadow-xl"
                                        : "scale-90 opacity-60 shadow-md"
                                    }`}
                                  >
                                    {/* Package content - same as original */}
                                    {packageInfo.popular && (
                                      <div className="absolute -top-0 left-0 right-0">
                                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-2 text-sm font-semibold">
                                          ⭐ Most Popular
                                        </div>
                                      </div>
                                    )}
                                    <div
                                      className={`p-4 sm:p-6 ${
                                        packageInfo.popular
                                          ? "pt-8 sm:pt-10"
                                          : ""
                                      }`}
                                    >
                                      <div className="text-center mb-4 sm:mb-6">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                                          {packageInfo.title}
                                        </h3>
                                        <div className="mb-4">
                                          <div className="text-2xl sm:text-3xl font-bold text-amber-600 mb-1">
                                            {selectedCity
                                              ? currentCityPricing?.price
                                              : "X,XXX"}
                                          </div>
                                          {selectedCity &&
                                            !currentCityPricing?.startingAt && (
                                              <div className="text-sm text-gray-500">
                                                per sq. ft (Ex GST)
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                      <div className="border-t border-gray-100 mb-4"></div>
                                      <div className="space-y-2">
                                        {Object.entries(
                                          packageInfo.sections
                                        ).map(([sectionKey, section]) => (
                                          <div
                                            key={sectionKey}
                                            className="border border-gray-100 rounded-lg overflow-hidden"
                                          >
                                            <button
                                              onClick={() =>
                                                toggleSection(sectionKey)
                                              }
                                              className="w-full flex items-center justify-between p-3 sm:p-4 text-left hover:bg-gray-50 transition-colors"
                                            >
                                              <span className="font-semibold text-gray-900 text-sm">
                                                {section.title}
                                              </span>
                                              <div className="flex items-center space-x-2">
                                                <svg
                                                  className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-200 ${
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
                                                      ? "max-h-96 opacity-100"
                                                      : "max-h-0 opacity-0"
                                                  }
                                                `}
                                            >
                                              <div className="px-3 sm:px-4 pb-3 sm:pb-4 bg-gray-50">
                                                <ul className="space-y-2">
                                                  {section.items.map(
                                                    (item, itemIndex) => (
                                                      <li
                                                        key={itemIndex}
                                                        className="flex items-start text-sm text-gray-700"
                                                      >
                                                        <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
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
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>

                      {/* Navigation Arrows */}
                      <button
                        onClick={prevPackage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-20"
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
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={nextPackage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-20"
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
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>

                      {/* Pagination Dots */}
                      <div className="flex justify-center mt-6 space-x-2">
                        {packageEntries.map((_, index) => {
                          const actualCurrentPackage =
                            ((currentPackage % packageEntries.length) +
                              packageEntries.length) %
                            packageEntries.length;
                          return (
                            <button
                              key={index}
                              onClick={() => goToPackage(index)}
                              className={`w-3 h-3 rounded-full transition-all duration-200 ${
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

          {/* Message when no city or service type is selected */}
          {!selectedCity && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                Please select a city to view available packages
              </div>
            </div>
          )}

          {selectedCity && !selectedServiceType && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">
                Please select a service type to view packages
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Service Timeline - Dynamic based on selected service type */}
      {selectedCity && selectedServiceType && (
        <section className="py-8 sm:py-10 lg:py-12 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8 lg:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-amber-900 mb-4">
                Your{" "}
                {
                  packagesData.serviceTypes.find(
                    (type) => type.id === selectedServiceType
                  )?.name
                }{" "}
                Journey
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
                        src={
                          selectedServiceType === "construction"
                            ? "/icons/consult.png"
                            : selectedServiceType === "architecture"
                            ? "/icons/consult.png"
                            : "/icons/consult.png"
                        }
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
                    {selectedServiceType === "construction"
                      ? "Plan &\nConsult"
                      : selectedServiceType === "architecture"
                      ? "Initial Consultation"
                      : "Design Consultation"}
                  </h3>
                  {/* Hide description on mobile, show on larger screens */}
                  <p className="hidden lg:block text-xs sm:text-xs lg:text-sm text-amber-700 leading-relaxed">
                    {selectedServiceType === "construction"
                      ? "Meet our experts to discuss your vision, budget, and requirements for your dream home."
                      : selectedServiceType === "architecture"
                      ? "Understand your needs, site conditions, and architectural preferences."
                      : "Explore your style preferences, space requirements, and design goals."}
                  </p>
                </div>

                {/* Step 2 */}
                <div className="text-center">
                  <div className="relative mb-3 sm:mb-4 lg:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white border-2 sm:border-4 border-amber-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <Image
                        src={
                          selectedServiceType === "construction"
                            ? "/icons/planning-drawing.png"
                            : selectedServiceType === "architecture"
                            ? "/icons/planning-drawing.png"
                            : "/icons/planning-drawing.png"
                        }
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
                    {selectedServiceType === "construction"
                      ? "Design & Approve"
                      : selectedServiceType === "architecture"
                      ? "Concept Design"
                      : "Space Planning"}
                  </h3>
                  {/* Hide description on mobile, show on larger screens */}
                  <p className="hidden lg:block text-xs sm:text-xs lg:text-sm text-amber-700 leading-relaxed">
                    {selectedServiceType === "construction"
                      ? "Review detailed 3D designs, floor plans, and make final approvals before construction."
                      : selectedServiceType === "architecture"
                      ? "Develop initial concepts, sketches, and architectural layouts for your approval."
                      : "Create detailed layouts, mood boards, and design concepts for your spaces."}
                  </p>
                </div>

                {/* Step 3 */}
                <div className="text-center">
                  <div className="relative mb-3 sm:mb-4 lg:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white border-2 sm:border-4 border-amber-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <Image
                        src={
                          selectedServiceType === "construction"
                            ? "/icons/building-under-construction.png"
                            : selectedServiceType === "architecture"
                            ? "/icons/planning-drawing.png"
                            : "/icons/brick-layering.png"
                        }
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
                    {selectedServiceType === "construction"
                      ? "Build & Monitor"
                      : selectedServiceType === "architecture"
                      ? "Detailed Design"
                      : "Execute & Install"}
                  </h3>
                  {/* Hide description on mobile, show on larger screens */}
                  <p className="hidden lg:block text-xs sm:text-xs lg:text-sm text-amber-700 leading-relaxed">
                    {selectedServiceType === "construction"
                      ? "Professional construction with regular quality checks and progress updates."
                      : selectedServiceType === "architecture"
                      ? "Finalize detailed drawings, specifications, and technical documentation."
                      : "Professional installation of furniture, fixtures, and decorative elements."}
                  </p>
                </div>

                {/* Step 4 */}
                <div className="text-center">
                  <div className="relative mb-3 sm:mb-4 lg:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white border-2 sm:border-4 border-amber-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <Image
                        src={
                          selectedServiceType === "construction"
                            ? "/icons/built-homes.png"
                            : selectedServiceType === "architecture"
                            ? "/icons/delivery-of-buildings.png"
                            : "/icons/built-homes.png"
                        }
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
                    {selectedServiceType === "construction"
                      ? "Handover & Move In"
                      : selectedServiceType === "architecture"
                      ? "Final\nDelivery"
                      : "Final Styling & Handover"}
                  </h3>
                  {/* Hide description on mobile, show on larger screens */}
                  <p className="hidden lg:block text-xs sm:text-xs lg:text-sm text-amber-700 leading-relaxed">
                    {selectedServiceType === "construction"
                      ? "Final inspection, documentation handover, and keys to your dream home."
                      : selectedServiceType === "architecture"
                      ? "Complete architectural package with all drawings and documentation."
                      : "Final touches, styling, and handover of your beautifully designed spaces."}
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
              Happy customer to real stories - Testimonials
            </h2>
            <p className="text-lg sm:text-xl text-amber-800">
              See what our customers have to say.
            </p>
          </div>

          {/* Video Testimonials Carousel */}
          <div className="relative max-w-6xl mx-auto">
            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
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
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 z-10"
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
              <div
                className="relative overflow-hidden rounded-2xl select-none carousel-container"
                onTouchStart={handleTestimonialTouchStart}
                onTouchMove={handleTestimonialTouchMove}
                onTouchEnd={handleTestimonialTouchEnd}
              >
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentTestimonial * 100}%)`,
                  }}
                >
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
                        <div className="p-4 sm:p-6 bg-white">
                          <div className="flex items-center justify-center mb-4">
                            <svg
                              className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                            </svg>
                          </div>
                          <p className="text-gray-700 text-center mb-4 leading-relaxed text-sm sm:text-base">
                            {testimonial.quote}
                          </p>
                          <div className="text-center font-semibold text-amber-900 text-sm sm:text-base">
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
            <div className="hidden md:grid md:grid-cols-3 gap-6 sm:gap-8">
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
                <div className="p-4 sm:p-6 bg-white">
                  <div className="flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-center mb-4 leading-relaxed text-sm sm:text-base">
                    Most people struggle with delays, finances, or contractors.
                    I didn&apos;t face even 1% of that. Sunbrix made my home
                    journey smooth and hassle-free.
                  </p>
                  <div className="text-center font-semibold text-amber-900 text-sm sm:text-base">
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
                <div className="p-4 sm:p-6 bg-white">
                  <div className="flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-center mb-4 leading-relaxed text-sm sm:text-base">
                    Sunbrix&apos;s expert team guided me at every step. Their
                    quality gave me total confidence throughout the journey.
                  </p>
                  <div className="text-center font-semibold text-amber-900 text-sm sm:text-base">
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
                <div className="p-4 sm:p-6 bg-white">
                  <div className="flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 text-center mb-4 leading-relaxed text-sm sm:text-base">
                    Sunbrix Homes exceeded our expectations! The construction
                    quality and timely delivery were remarkable. Truly a dream
                    home.
                  </p>
                  <div className="text-center font-semibold text-amber-900 text-sm sm:text-base">
                    Mr. Hariharasudan
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Pagination Dots */}
            <div className="flex justify-center mt-6 space-x-2 md:hidden">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentTestimonial
                      ? "bg-gray-800"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
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

      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        onClose={closeModal}
        images={modalImages}
        currentIndex={modalCurrentIndex}
        onNext={nextModalImage}
        onPrev={prevModalImage}
        onGoTo={goToModalImage}
        title={modalTitle}
      />
    </div>
  );
}
