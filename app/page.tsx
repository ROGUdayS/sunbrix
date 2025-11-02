"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import Header from "./components/Header";
import ContactForm from "./components/ContactForm";
import FloatingBookButton from "./components/FloatingBookButton";

import { useCity } from "./contexts/CityContext";
import {
  getProjects,
  getPackages,
  getMainPageContent,
  getTestimonials,
  ProjectData,
  getDataMode,
} from "@/lib/data-provider-client";
import { usePageConfigs } from "./hooks/usePageConfigs";
import DataModeIndicator from "./components/DataModeIndicator";

// ProjectData is now imported from data-provider

// Helper functions for YouTube URL handling
const isYouTubeUrl = (url: string): boolean => {
  return url.includes("youtube.com") || url.includes("youtu.be");
};

const convertToEmbedUrl = (url: string): string => {
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes("youtube.com/embed/")) {
    return url; // Already in embed format
  }
  return url; // Return original if not YouTube
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  // City context is used by the Header component and CityModal
  const { selectedCity, setShowCityModal } = useCity();

  // Page configuration hook for conditional rendering
  const { isPageEnabled } = usePageConfigs();

  // Add accordion state for packages - simplified to track which section is open
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Add package carousel state
  const [currentPackage, setCurrentPackage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Add state for projects and packages
  const [projects, setProjects] = useState<
    {
      image: string;
      title: string;
      description: string;
      id: number;
      quote?: string;
    }[]
  >([]);

  const [packagesData, setPackagesData] = useState<{
    packages: Record<string, Record<string, unknown>>;
  }>({
    packages: {},
  });

  const [projectsData, setProjectsData] = useState<{
    projects: ProjectData[];
  }>({
    projects: [],
  });

  // Dynamic content state (simplified)
  const [demoVideoUrl, setDemoVideoUrl] = useState<string>(
    "/videos/video_demo.mp4"
  );
  const [heroHeading, setHeroHeading] = useState<string>("");
  const [dynamicTestimonials, setDynamicTestimonials] = useState<
    {
      id: string;
      name: string;
      location: string;
      rating: number;
      review: string;
      quote?: string;
      image?: string;
      videoUrl?: string;
      videoThumbnail?: string;
      active: boolean;
    }[]
  >([]);
  const [dynamicGalleryImages, setDynamicGalleryImages] = useState<
    {
      id?: string;
      image?: string;
      image_url?: string;
      quote?: string;
      altText?: string;
    }[]
  >([]);

  // New dynamic content states
  const [heroStats, setHeroStats] = useState([
    { value: "25", label: "Years" },
    { value: "100+", label: "Homes" },
    { value: "100%", label: "Transparent" },
    { value: "100%", label: "On-Time" },
  ]);

  const [commitmentSection, setCommitmentSection] = useState({
    title: "Our Commitment to Quality",
    description:
      "At Sunbrix, quality isn't a feature, it's the foundation of everything we do. For over 20 years, we've crafted homes that last and function with purpose, building each one with care in every corner and meaning in every brick laid.",
    features: [
      {
        icon: "/icons/commitment-to-quality/Design & Strength.svg",
        title: "Design & Strength",
        description:
          "At Sunbrix, we build and designs, using time tested practices.",
      },
      {
        icon: "/icons/commitment-to-quality/20 Year Warranty.svg",
        title: "20 year warranty",
        description:
          "At Sunbrix, we proudly offer a 20 year warranty on our homes.",
      },
      {
        icon: "/icons/commitment-to-quality/On time Delivery.svg",
        title: "100% On time delivery",
        description:
          "The past 20 years, Sunbrix has never delayed a single project.",
      },
      {
        icon: "/icons/commitment-to-quality/High quality materials.svg",
        title: "High quality materials",
        description:
          "At Sunbrix, Using the best quality materials is simply the norm.",
      },
    ],
  });

  const [gallerySection, setGallerySection] = useState({
    title: "Gallery",
  });

  const [packagesSection, setPackagesSection] = useState({
    title: "Packages",
  });

  const [testimonialsSection, setTestimonialsSection] = useState({
    title: "Testimonials",
    subtitle: "See what our customers have to say.",
  });

  // Add gallery transition state
  const [isGalleryTransitioning, setIsGalleryTransitioning] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Add testimonial transition state
  const [isTestimonialTransitioning, setIsTestimonialTransitioning] =
    useState(false);
  const testimonialRef = useRef<HTMLDivElement>(null);

  // Add video ref for auto-play functionality
  const videoRef = useRef<HTMLVideoElement>(null);

  // Shuffle array function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize projects and packages using data provider
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch projects
        const projectsResult = await getProjects(true);
        if (projectsResult && projectsResult.projects) {
          // Create gallery images from projects
          const allImages: {
            image: string;
            title: string;
            description: string;
            id: number;
            quote?: string;
            altText?: string;
          }[] = [];
          projectsResult.projects.forEach(
            (project: ProjectData, projectIndex: number) => {
              if (project.images && project.images.length > 0) {
                project.images.forEach((image: string, imageIndex: number) => {
                  allImages.push({
                    image,
                    title: project.title,
                    description: project.description,
                    id: projectIndex * 100 + imageIndex,
                    altText:
                      project.image_alt_texts?.[imageIndex] || project.title,
                  });
                });
              } else if (project.image) {
                allImages.push({
                  image: project.image,
                  title: project.title,
                  description: project.description,
                  id: projectIndex * 100,
                  altText: project.image_alt_texts?.[0] || project.title,
                });
              }
            }
          );

          const shuffledProjects = shuffleArray(allImages).slice(0, 6);
          setProjects(shuffledProjects);
          setProjectsData({ projects: projectsResult.projects });
        }

        // Fetch packages
        const packagesResult = await getPackages(true);
        if (packagesResult) {
          setPackagesData({ packages: packagesResult });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to empty data
        setProjects([]);
        setPackagesData({ packages: {} });
        setProjectsData({ projects: [] });
      }
    }

    fetchData();
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

  // Fetch dynamic content using data provider
  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch main page content (demo video + gallery + all sections)
        const content = await getMainPageContent();
        if (content) {
          setDemoVideoUrl(content.demoVideoUrl || "/videos/video_demo.mp4");
          setHeroHeading(content.heroHeading || "");
          // Map alt_text to altText for consistency
          const galleryImagesWithAlt = (content.galleryImages || []).map(
            (img: any) => ({
              ...img,
              altText:
                img.alt_text || img.altText || img.quote || "Gallery image",
            })
          );
          setDynamicGalleryImages(galleryImagesWithAlt);
          // Ensure heroStats is always an array
          setHeroStats(
            Array.isArray(content.heroStats) ? content.heroStats : heroStats
          );
          // Ensure commitmentSection has features array
          const updatedCommitmentSection =
            content.commitmentSection || commitmentSection;
          if (
            updatedCommitmentSection &&
            !Array.isArray(updatedCommitmentSection.features)
          ) {
            updatedCommitmentSection.features = commitmentSection.features;
          }
          setCommitmentSection(updatedCommitmentSection);
          setGallerySection(content.gallerySection || gallerySection);
          setPackagesSection(content.packagesSection || packagesSection);
          setTestimonialsSection(
            content.testimonialsSection || testimonialsSection
          );
        }

        // Fetch testimonials
        const testimonials = await getTestimonials();
        if (testimonials) {
          setDynamicTestimonials(testimonials);
        }
      } catch (error) {
        console.error("Error fetching dynamic content:", error);
        // Keep using static data if API fails
      }
    };

    fetchContent();
  }, []);

  const nextSlide = () => {
    if (dynamicGalleryImages.length === 0 || isGalleryTransitioning) return;
    setIsGalleryTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (dynamicGalleryImages.length === 0 || isGalleryTransitioning) return;
    setIsGalleryTransitioning(true);
    setCurrentSlide((prev) => prev - 1);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Testimonial data
  // Only show dynamic testimonials from database/JSON - no hardcoded fallbacks
  // If there are no testimonials, the section will be hidden via isPageEnabled check
  const testimonials =
    dynamicTestimonials.length > 0
      ? dynamicTestimonials.map((testimonial) => ({
          id: testimonial.id,
          videoUrl: testimonial.videoUrl || "", // Use videoUrl from data source
          quote: testimonial.review || testimonial.quote || "",
          name: testimonial.name,
        }))
      : []; // No testimonials = section will be hidden

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

  // Bank logos data and mobile carousel state (3 logos per slide)
  const bankLogos = [
    { src: "/icons/banks-icons/HDFC.svg", alt: "HDFC Bank" },
    { src: "/icons/banks-icons/ICICI.svg", alt: "ICICI Bank" },
    { src: "/icons/banks-icons/SBI.svg", alt: "SBI Bank" },
    { src: "/icons/banks-icons/Axis.svg", alt: "Axis Bank" },
    { src: "/icons/banks-icons/BOB.svg", alt: "Bank of Baroda" },
    { src: "/icons/banks-icons/First%20Bank.svg", alt: "First Bank" },
    { src: "/icons/banks-icons/Tata%20Capital.svg", alt: "Tata Capital" },
  ];
  const bankSlides = bankLogos.length
    ? Array.from({ length: bankLogos.length }, (_, i) => [
        bankLogos[i % bankLogos.length],
        bankLogos[(i + 1) % bankLogos.length],
        bankLogos[(i + 2) % bankLogos.length],
      ])
    : [];
  const [currentBankSlide, setCurrentBankSlide] = useState(0);
  const [isBankTransitioning, setIsBankTransitioning] = useState(false);
  const bankRef = useRef<HTMLDivElement | null>(null);
  // bank-specific touch state to avoid shaking other carousels
  const [bankTouchStart, setBankTouchStart] = useState<number | null>(null);
  const [bankTouchEnd, setBankTouchEnd] = useState<number | null>(null);
  const [isBankDragging, setIsBankDragging] = useState(false);

  // testimonial-specific touch state to avoid shaking
  const [testimonialTouchStart, setTestimonialTouchStart] = useState<
    number | null
  >(null);
  const [testimonialTouchEnd, setTestimonialTouchEnd] = useState<number | null>(
    null
  );
  const [isTestimonialDragging, setIsTestimonialDragging] = useState(false);
  const [testimonialDragOffset, setTestimonialDragOffset] = useState(0);

  const testimonialHandleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setTestimonialTouchEnd(null);
    setTestimonialTouchStart(e.targetTouches[0].clientX);
    setIsTestimonialDragging(false);
    setTestimonialDragOffset(0);
  };

  const testimonialHandleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!testimonialTouchStart) return;

    const currentX = e.targetTouches[0].clientX;
    const deltaX = currentX - testimonialTouchStart;

    setTestimonialTouchEnd(currentX);
    if (Math.abs(deltaX) > 10) {
      setIsTestimonialDragging(true);
      setTestimonialDragOffset(deltaX);
      e.preventDefault();
    }
  };

  const testimonialHandleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!testimonialTouchStart || !testimonialTouchEnd) {
      setIsTestimonialDragging(false);
      setTestimonialDragOffset(0);
      return;
    }

    const distance = testimonialTouchStart - testimonialTouchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextTestimonial();
    else if (isRightSwipe) prevTestimonial();

    setIsTestimonialDragging(false);
    setTestimonialDragOffset(0);
  };

  const nextBank = (step: number = 1) => {
    if (isBankTransitioning) return;
    if (bankSlides.length === 0) return;
    setIsBankTransitioning(true);
    setCurrentBankSlide((prev) => prev + step);
  };

  const prevBank = (step: number = 1) => {
    if (isBankTransitioning) return;
    if (bankSlides.length === 0) return;
    setIsBankTransitioning(true);
    setCurrentBankSlide((prev) => prev - step);
  };

  const bankHandleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setBankTouchEnd(null);
    setBankTouchStart(e.targetTouches[0].clientX);
    setIsBankDragging(true);
    if (bankRef.current) {
      bankRef.current.style.transition = "none";
    }
  };

  const bankHandleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!bankTouchStart) return;

    const currentX = e.targetTouches[0].clientX;
    const deltaX = currentX - bankTouchStart;

    setBankTouchEnd(currentX);

    if (Math.abs(deltaX) > 10) {
      if (bankRef.current) {
        bankRef.current.style.transform = `translate3d(calc(-${
          (currentBankSlide + bankSlides.length) * 100
        }% + ${deltaX}px), 0, 0)`;
      }
      e.preventDefault();
    }
  };

  const bankHandleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!bankTouchStart || !bankTouchEnd) {
      setIsBankDragging(false);
      if (bankRef.current) {
        bankRef.current.style.transition = "";
        bankRef.current.style.transform = `translate3d(calc(-${
          (currentBankSlide + bankSlides.length) * 100
        }% + 0px), 0, 0)`;
      }
      return;
    }

    const distance = bankTouchStart - bankTouchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    const containerWidth =
      bankRef.current?.parentElement?.clientWidth || window.innerWidth;
    const longSwipeThreshold = containerWidth * 0.5;
    const absDistance = Math.abs(distance);

    if (bankRef.current) {
      bankRef.current.style.transition = "";
    }
    if (isLeftSwipe) {
      nextBank(absDistance >= longSwipeThreshold ? 3 : 1);
    } else if (isRightSwipe) {
      prevBank(absDistance >= longSwipeThreshold ? 3 : 1);
    }

    setIsBankDragging(false);
    // base transform will update on next render via style below
  };

  // Package carousel navigation functions with infinite loop
  const nextPackage = () => {
    if (isTransitioning) return;

    const packageKeys = Object.keys(getFilteredPackages());

    if (packageKeys.length === 0) return;

    setIsTransitioning(true);
    setCurrentPackage((prev) => prev + 1);
  };

  const prevPackage = () => {
    if (isTransitioning) return;

    const packageKeys = Object.keys(getFilteredPackages());

    if (packageKeys.length === 0) return;

    setIsTransitioning(true);
    setCurrentPackage((prev) => prev - 1);
  };

  // Touch/swipe handlers for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const currentX = e.targetTouches[0].clientX;
    const deltaX = currentX - touchStart;

    setTouchEnd(currentX);

    // Calculate horizontal movement
    const absDeltaX = Math.abs(deltaX);

    // If there's significant horizontal movement, prevent vertical scroll and track drag
    if (absDeltaX > 10) {
      setIsDragging(true);
      setDragOffset(deltaX);
      e.preventDefault();
    }
  };

  const handleTouchEnd = (
    type: "gallery" | "package" | "testimonial" | "bank"
  ) => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    // Reset drag offset
    setDragOffset(0);

    if (type === "gallery") {
      if (isLeftSwipe && dynamicGalleryImages.length > 0) {
        nextSlide();
      }
      if (isRightSwipe && dynamicGalleryImages.length > 0) {
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
    } else if (type === "bank") {
      const containerWidth =
        bankRef.current?.parentElement?.clientWidth || window.innerWidth;
      const longSwipeThreshold = containerWidth * 0.5; // treat as full scroll
      const absDistance = Math.abs(distance);
      if (isLeftSwipe) {
        // short swipe -> move by 1 icon; long swipe -> move by 3 icons (next non-overlapping set)
        nextBank(absDistance >= longSwipeThreshold ? 3 : 1);
      }
      if (isRightSwipe) {
        prevBank(absDistance >= longSwipeThreshold ? 3 : 1);
      }
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  const goToPackage = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPackage(index);
  };

  // Handle infinite loop transitions with smooth reset
  useEffect(() => {
    if (!isTransitioning) return;

    const packageKeys = Object.keys(getFilteredPackages());

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
  }, [currentPackage, isTransitioning, selectedCity]);

  // Handle infinite loop transitions for gallery
  useEffect(() => {
    if (!isGalleryTransitioning || dynamicGalleryImages.length === 0) return;

    const timer = setTimeout(() => {
      // Handle infinite loop reset without animation
      if (currentSlide >= dynamicGalleryImages.length) {
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
          setCurrentSlide(dynamicGalleryImages.length - 1);
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
  }, [currentSlide, isGalleryTransitioning, dynamicGalleryImages.length]);

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

  // Handle infinite loop transitions for bank carousel (mobile)
  useEffect(() => {
    if (!isBankTransitioning) return;

    const totalSlides = bankSlides.length;
    if (totalSlides === 0) return;

    const timer = setTimeout(() => {
      if (currentBankSlide >= totalSlides || currentBankSlide < 0) {
        const normalized =
          ((currentBankSlide % totalSlides) + totalSlides) % totalSlides;
        if (bankRef.current) {
          bankRef.current.style.transition = "none";
          setCurrentBankSlide(normalized);
          setTimeout(() => {
            if (bankRef.current) bankRef.current.style.transition = "";
          }, 50);
        }
      }
      setIsBankTransitioning(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentBankSlide, isBankTransitioning, bankSlides.length]);

  // Helper function to get packages filtered by selected city
  const getFilteredPackages = useCallback(() => {
    if (!packagesData?.packages || !selectedCity) {
      return {};
    }

    const allPackages = packagesData.packages;
    const filteredPackages: Record<string, unknown> = {};

    Object.entries(allPackages).forEach(([packageKey, packageInfo]) => {
      // Check if this package has pricing for the selected city
      const pkg = packageInfo as {
        pricing?: Record<string, unknown>;
        title?: string;
        popular?: boolean;
        sections?: Record<string, { title: string; items: string[] }>;
      };
      if (pkg.pricing && pkg.pricing[selectedCity.id]) {
        // Only include packages that have valid pricing for this city
        filteredPackages[packageKey] = packageInfo;
      }
    });

    return filteredPackages;
  }, [packagesData, selectedCity]);

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
          {/* Main Headline - H1 for SEO */}
          {heroHeading && (
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 sm:mb-10 lg:mb-12 drop-shadow-lg">
              {heroHeading}
            </h1>
          )}

          {/* Key Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8 max-w-4xl mx-auto">
            {heroStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-4 border border-white/20"
              >
                <div className="text-2xl sm:text-2xl lg:text-3xl font-bold text-orange-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-sm lg:text-base font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
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
              {commitmentSection.title}
            </h2>
            <p className="text-lg sm:text-xl text-amber-800 mb-6 sm:mb-8 lg:mb-10">
              {commitmentSection.description}
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {commitmentSection.features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mx-auto mb-3 sm:mb-4">
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={80}
                      height={80}
                      className="w-16 h-16 sm:w-20 sm:h-20"
                    />
                  </div>
                  <h3 className="text-sm sm:text-lg lg:text-xl font-semibold text-amber-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-amber-700">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project Gallery - Only show if projects page is enabled */}
      {isPageEnabled("projects") && (
        <section className="py-6 sm:py-8 lg:py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-4 sm:mb-6 lg:mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-900 mb-2 sm:mb-3">
                {gallerySection.title}
              </h2>
            </div>

            {/* Only render carousel if gallery images are loaded */}
            {dynamicGalleryImages.length > 0 && (
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
                              dynamicGalleryImages[
                                (currentSlide -
                                  1 +
                                  dynamicGalleryImages.length) %
                                  dynamicGalleryImages.length
                              ]?.image_url ||
                              dynamicGalleryImages[
                                (currentSlide -
                                  1 +
                                  dynamicGalleryImages.length) %
                                  dynamicGalleryImages.length
                              ]?.image ||
                              ""
                            }
                            alt={
                              dynamicGalleryImages[
                                (currentSlide -
                                  1 +
                                  dynamicGalleryImages.length) %
                                  dynamicGalleryImages.length
                              ]?.quote || "Previous image"
                            }
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
                          transform: `translateX(calc(-${
                            (currentSlide + dynamicGalleryImages.length) * 100
                          }% + ${dragOffset}px))`,
                          touchAction: "pan-y",
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={() => handleTouchEnd("gallery")}
                      >
                        {/* Previous set for seamless left scrolling */}
                        {dynamicGalleryImages.map((image, index) => (
                          <div
                            key={`prev-${image.id || index}`}
                            className="w-full flex-shrink-0"
                          >
                            <div className="relative">
                              {(image.image_url || image.image) && (
                                <Image
                                  src={image.image_url || image.image}
                                  alt={
                                    image.altText ||
                                    image.quote ||
                                    "Gallery image"
                                  }
                                  width={900}
                                  height={600}
                                  className="w-full h-[240px] sm:h-[280px] md:h-[320px] lg:h-[400px] xl:h-[480px] object-cover"
                                />
                              )}
                              {/* Quote overlay */}
                              {/* {image.quote && (
                              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                                <div className="text-center max-w-2xl">
                                  <blockquote className="text-white text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold leading-relaxed">
                                    &ldquo;{image.quote}&rdquo;
                                  </blockquote>
                                </div>
                              </div>
                            )} */}
                            </div>
                          </div>
                        ))}

                        {/* Current set - main gallery images */}
                        {dynamicGalleryImages.map((image, index) => (
                          <div
                            key={image.id || index}
                            className="w-full flex-shrink-0"
                          >
                            <div className="relative">
                              {(image.image_url || image.image) && (
                                <Image
                                  src={image.image_url || image.image}
                                  alt={
                                    image.altText ||
                                    image.quote ||
                                    "Gallery image"
                                  }
                                  width={900}
                                  height={600}
                                  className="w-full h-[240px] sm:h-[280px] md:h-[320px] lg:h-[400px] xl:h-[480px] object-cover"
                                />
                              )}
                              {/* Quote overlay
                            {image.quote && (
                              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                                <div className="text-center max-w-2xl">
                                  <blockquote className="text-white text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold leading-relaxed">
                                    &ldquo;{image.quote}&rdquo;
                                  </blockquote>
                                </div>
                              </div>
                            )} */}
                            </div>
                          </div>
                        ))}

                        {/* Next set for seamless right scrolling */}
                        {dynamicGalleryImages.map((image, index) => (
                          <div
                            key={`next-${image.id || index}`}
                            className="w-full flex-shrink-0"
                          >
                            <div className="relative">
                              {(image.image_url || image.image) && (
                                <Image
                                  src={image.image_url || image.image}
                                  alt={
                                    image.altText ||
                                    image.quote ||
                                    "Gallery image"
                                  }
                                  width={900}
                                  height={600}
                                  className="w-full h-[240px] sm:h-[280px] md:h-[320px] lg:h-[400px] xl:h-[480px] object-cover"
                                />
                              )}
                              {/* Quote overlay */}
                              {/* {image.quote && (
                              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                                <div className="text-center max-w-2xl">
                                  <blockquote className="text-white text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold leading-relaxed">
                                    &ldquo;{image.quote}&rdquo;
                                  </blockquote>
                                </div>
                              </div>
                            )} */}
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
                              dynamicGalleryImages[
                                (currentSlide + 1) % dynamicGalleryImages.length
                              ]?.image_url ||
                              dynamicGalleryImages[
                                (currentSlide + 1) % dynamicGalleryImages.length
                              ]?.image ||
                              ""
                            }
                            alt={
                              dynamicGalleryImages[
                                (currentSlide + 1) % dynamicGalleryImages.length
                              ]?.quote || "Next image"
                            }
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
                      {dynamicGalleryImages[
                        ((currentSlide % dynamicGalleryImages.length) +
                          dynamicGalleryImages.length) %
                          dynamicGalleryImages.length
                      ]?.quote || "Loading..."}
                    </p>
                  </div>

                  {/* Pagination Dots */}
                  <div className="flex justify-center mt-3 sm:mt-4 lg:mt-5 space-x-2">
                    {dynamicGalleryImages.map((_, index) => {
                      const actualCurrentSlide =
                        ((currentSlide % dynamicGalleryImages.length) +
                          dynamicGalleryImages.length) %
                        dynamicGalleryImages.length;
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
                      Explore Gallery
                    </Link>
                  </div>
                </div>
              </>
            )}

            {/* Loading state while gallery images are being loaded */}
            {dynamicGalleryImages.length === 0 && (
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
      )}

      {/* Build Your Dream Home CTA */}
      <section className="py-8 sm:py-10 lg:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Video Container */}
          <div className="relative max-w-6xl mx-auto">
            <div className="relative bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl overflow-hidden shadow-xl">
              {/* Video Element - Conditional rendering for YouTube vs direct video */}
              {isYouTubeUrl(demoVideoUrl) ? (
                <div className="aspect-video w-full">
                  <iframe
                    className="w-full h-full rounded-2xl"
                    src={convertToEmbedUrl(demoVideoUrl)}
                    title="Build Your Dream Home Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  className="w-full h-auto rounded-2xl"
                  controls
                  muted
                  poster="/images/video-poster.jpg"
                  preload="metadata"
                  playsInline
                >
                  <source src={demoVideoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
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
              {packagesSection.title}
            </h2>
          </div>

          {/* Package Cards - Desktop: All visible, Mobile: Carousel */}
          {selectedCity && (
            <>
              {/* Desktop View - All packages visible */}
              <div className="hidden lg:grid lg:grid-cols-3 gap-4 lg:gap-6">
                {Object.entries(getFilteredPackages()).map(
                  ([packageKey, packageInfo]) => {
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
                              {(packageInfo as any).title}
                            </h3>

                            {/* Price Display */}
                            <div className="mb-3">
                              <div className="text-2xl lg:text-3xl font-bold text-amber-600 mb-1">
                                {selectedCity &&
                                (packageInfo as any).pricing &&
                                (packageInfo as any).pricing[selectedCity.id]
                                  ? (packageInfo as any).pricing[
                                      selectedCity.id
                                    ].price
                                  : "X,XXX"}
                              </div>
                              <div className="text-xs text-gray-500">
                                per sq. ft (Ex GST)
                              </div>
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="border-t border-gray-100 mb-3"></div>

                          {/* Expandable Sections */}
                          <div className="space-y-1.5">
                            {Object.entries(
                              (packageInfo as any).sections || {}
                            ).map(([sectionKey, section]) => (
                              <div
                                key={sectionKey}
                                className="border border-gray-100 rounded-md overflow-hidden"
                              >
                                <button
                                  onClick={() => toggleSection(sectionKey)}
                                  className="w-full flex items-center justify-between p-2.5 lg:p-3 text-left hover:bg-gray-50 transition-colors"
                                >
                                  <span className="font-semibold text-gray-900 text-xs lg:text-sm">
                                    {(section as any).title}
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
                                      {(section as any).items.map(
                                        (item: string, index: number) => (
                                          <li
                                            key={index}
                                            className="flex items-start text-xs lg:text-sm text-gray-700"
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
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {/* Mobile/Tablet Carousel View with Instagram-style previews */}
              <div className="lg:hidden relative">
                {(() => {
                  const packageEntries = Object.entries(getFilteredPackages());

                  return (
                    <>
                      {/* Carousel Container with Side Previews */}
                      <div className="relative max-w-7xl mx-auto">
                        {/* Packages with Side Previews */}
                        <div className="flex items-center justify-center gap-2 sm:gap-3">
                          {/* Previous Package Preview - Show right edge only */}
                          <div className="hidden sm:block flex-shrink-0 relative">
                            <div
                              className="relative w-12 sm:w-16 h-[400px] sm:h-[480px] overflow-hidden cursor-pointer opacity-60 hover:opacity-80 transition-opacity duration-300 rounded-l-lg"
                              onClick={prevPackage}
                            >
                              <div className="relative w-full h-full">
                                {(() => {
                                  const prevPackageIndex =
                                    (currentPackage -
                                      1 +
                                      packageEntries.length) %
                                    packageEntries.length;
                                  const packageEntry =
                                    packageEntries[prevPackageIndex];
                                  if (!packageEntry) return null;
                                  const [, packageInfo] = packageEntry;
                                  const currentCityPricing = ((
                                    packageInfo as any
                                  ).pricing || {})[selectedCity.id];

                                  return (
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 h-full">
                                      <div className="p-2 sm:p-3">
                                        <div className="text-center mb-2">
                                          <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 truncate">
                                            {(packageInfo as any).title}
                                          </h3>
                                          <div className="text-sm sm:text-base font-bold text-amber-600">
                                            {selectedCity
                                              ? currentCityPricing?.price
                                              : "X,XXX"}
                                          </div>
                                        </div>
                                        <div className="border-t border-gray-100 mb-2"></div>
                                        <div className="space-y-1">
                                          {Object.entries(
                                            (packageInfo as any).sections || {}
                                          )
                                            .slice(0, 2)
                                            .map(([sectionKey, section]) => (
                                              <div
                                                key={sectionKey}
                                                className="border border-gray-100 rounded overflow-hidden"
                                              >
                                                <div className="p-1.5 sm:p-2 text-left">
                                                  <span className="font-semibold text-gray-900 text-xs">
                                                    {(section as any).title}
                                                  </span>
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                              <div className="absolute inset-0 bg-black/10"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-white opacity-70"
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

                          {/* Main Package Container */}
                          <div className="relative overflow-hidden select-none carousel-container flex-1 max-w-sm sm:max-w-md">
                            <div
                              ref={carouselRef}
                              className={`flex transition-transform duration-300 ease-out ${
                                isDragging ? "transition-none" : ""
                              }`}
                              style={{
                                transform: `translateX(calc(-${
                                  (currentPackage + packageEntries.length) * 100
                                }% + ${dragOffset}px))`,
                                touchAction: "pan-y",
                              }}
                              onTouchStart={handleTouchStart}
                              onTouchMove={handleTouchMove}
                              onTouchEnd={() => handleTouchEnd("package")}
                            >
                              {/* Duplicate packages for infinite loop effect */}
                              {/* Previous set for seamless left scrolling */}
                              {packageEntries.map(
                                ([packageKey, packageInfo]) => {
                                  const currentCityPricing = ((
                                    packageInfo as any
                                  ).pricing || {})[selectedCity.id];

                                  return (
                                    <div
                                      key={`prev-${packageKey}`}
                                      className="w-full flex-shrink-0 px-1 sm:px-2"
                                    >
                                      <div className="relative bg-white rounded-xl shadow-lg overflow-hidden mx-auto border border-gray-100">
                                        {/* Package content - same as original */}
                                        <div className="p-3 sm:p-4">
                                          <div className="text-center mb-3 sm:mb-4">
                                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                                              {(packageInfo as any).title}
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
                                            {Object.entries(
                                              (packageInfo as any).sections
                                            ).map(([sectionKey, section]) => (
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
                                                    {(section as any).title}
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
                                                      {(
                                                        section as any
                                                      ).items.map(
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
                                ([packageKey, packageInfo]) => {
                                  const currentCityPricing = ((
                                    packageInfo as any
                                  ).pricing || {})[selectedCity.id];

                                  return (
                                    <div
                                      key={packageKey}
                                      className="w-full flex-shrink-0 px-1 sm:px-2"
                                    >
                                      <div className="relative bg-white rounded-xl shadow-lg overflow-hidden mx-auto border border-gray-100">
                                        {/* Card Content */}
                                        <div className="p-3 sm:p-4">
                                          {/* Package Title */}
                                          <div className="text-center mb-3 sm:mb-4">
                                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                                              {(packageInfo as any).title}
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
                                            {Object.entries(
                                              (packageInfo as any).sections
                                            ).map(([sectionKey, section]) => (
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
                                                    {(section as any).title}
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
                                                      {(
                                                        section as any
                                                      ).items.map(
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
                                ([packageKey, packageInfo]) => {
                                  const currentCityPricing = ((
                                    packageInfo as any
                                  ).pricing || {})[selectedCity.id];

                                  return (
                                    <div
                                      key={`next-${packageKey}`}
                                      className="w-full flex-shrink-0 px-1 sm:px-2"
                                    >
                                      <div className="relative bg-white rounded-xl shadow-lg overflow-hidden mx-auto border border-gray-100">
                                        {/* Package content - same as original */}
                                        <div className="p-3 sm:p-4">
                                          <div className="text-center mb-3 sm:mb-4">
                                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                                              {(packageInfo as any).title}
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
                                            {Object.entries(
                                              (packageInfo as any).sections
                                            ).map(([sectionKey, section]) => (
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
                                                    {(section as any).title}
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
                                                      {(
                                                        section as any
                                                      ).items.map(
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

                          {/* Next Package Preview - Show left edge only */}
                          <div className="hidden sm:block flex-shrink-0 relative">
                            <div
                              className="relative w-12 sm:w-16 h-[400px] sm:h-[480px] overflow-hidden cursor-pointer opacity-60 hover:opacity-80 transition-opacity duration-300 rounded-r-lg"
                              onClick={nextPackage}
                            >
                              <div className="relative w-full h-full">
                                {(() => {
                                  const nextPackageIndex =
                                    (currentPackage + 1) %
                                    packageEntries.length;
                                  const nextPackageEntry =
                                    packageEntries[nextPackageIndex];
                                  if (!nextPackageEntry) return null;
                                  const [, packageInfo] = nextPackageEntry;
                                  const currentCityPricing = ((
                                    packageInfo as any
                                  ).pricing || {})[selectedCity.id];

                                  return (
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 h-full">
                                      <div className="p-2 sm:p-3">
                                        <div className="text-center mb-2">
                                          <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 truncate">
                                            {(packageInfo as any).title}
                                          </h3>
                                          <div className="text-sm sm:text-base font-bold text-amber-600">
                                            {selectedCity
                                              ? currentCityPricing?.price
                                              : "X,XXX"}
                                          </div>
                                        </div>
                                        <div className="border-t border-gray-100 mb-2"></div>
                                        <div className="space-y-1">
                                          {Object.entries(
                                            (packageInfo as any).sections || {}
                                          )
                                            .slice(0, 2)
                                            .map(([sectionKey, section]) => (
                                              <div
                                                key={sectionKey}
                                                className="border border-gray-100 rounded overflow-hidden"
                                              >
                                                <div className="p-1.5 sm:p-2 text-left">
                                                  <span className="font-semibold text-gray-900 text-xs">
                                                    {(section as any).title}
                                                  </span>
                                                </div>
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                              <div className="absolute inset-0 bg-black/10"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-white opacity-70"
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
                        src="/icons/construction-journey/consult.svg"
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
                        src="/icons/construction-journey/planning-drawing.svg"
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
                        src="/icons/construction-journey/building-under-construction.svg"
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
                        src="/icons/construction-journey/built-homes.svg"
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

          {/* Mobile: seamless looping carousel (3 icons per slide) */}
          <div className="md:hidden relative overflow-hidden rounded-lg">
            <div
              ref={bankRef}
              className={`flex transition-transform duration-300 ease-out ${
                isBankDragging ? "transition-none" : ""
              }`}
              style={{
                ...(isBankDragging
                  ? {}
                  : {
                      transform: `translate3d(calc(-${
                        (currentBankSlide + bankSlides.length) * 100
                      }% + 0px), 0, 0)`,
                    }),
                touchAction: "pan-y",
                willChange: "transform",
              }}
              onTouchStart={bankHandleTouchStart}
              onTouchMove={bankHandleTouchMove}
              onTouchEnd={bankHandleTouchEnd}
            >
              {/* previous set for seamless left scroll */}
              {bankSlides.map((slide, i) => (
                <div key={`prev-${i}`} className="w-full flex-shrink-0">
                  <div className="flex justify-center items-center gap-6">
                    {slide.map((bank) => (
                      <div
                        key={`prev-${bank.alt}`}
                        className="w-24 h-12 relative"
                      >
                        <Image
                          src={bank.src}
                          alt={bank.alt}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {/* current set */}
              {bankSlides.map((slide, i) => (
                <div key={`cur-${i}`} className="w-full flex-shrink-0">
                  <div className="flex justify-center items-center gap-6">
                    {slide.map((bank) => (
                      <div
                        key={`cur-${bank.alt}`}
                        className="w-24 h-12 relative"
                      >
                        <Image
                          src={bank.src}
                          alt={bank.alt}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {/* next set for seamless right scroll */}
              {bankSlides.map((slide, i) => (
                <div key={`next-${i}`} className="w-full flex-shrink-0">
                  <div className="flex justify-center items-center gap-6">
                    {slide.map((bank) => (
                      <div
                        key={`next-${bank.alt}`}
                        className="w-24 h-12 relative"
                      >
                        <Image
                          src={bank.src}
                          alt={bank.alt}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Mobile Pagination Dots for bank carousel */}
            <div className="flex justify-center mt-4 space-x-2">
              {bankSlides.map((_, index) => {
                const actualCurrentBank =
                  ((currentBankSlide % bankSlides.length) + bankSlides.length) %
                  bankSlides.length;
                return (
                  <button
                    key={`bank-dot-${index}`}
                    onClick={() => setCurrentBankSlide(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                      index === actualCurrentBank
                        ? "bg-gray-800"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to bank slide ${index + 1}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Desktop: static logos list */}
          <div className="hidden md:flex justify-center items-center gap-2 md:gap-3 lg:gap-4 xl:gap-6 2xl:gap-8 flex-wrap">
            {bankLogos.map((bank) => (
              <div
                key={`desk-${bank.alt}`}
                className="w-20 h-10 md:w-24 md:h-12 lg:w-28 lg:h-14 xl:w-32 xl:h-16 2xl:w-40 2xl:h-20 relative flex-shrink min-w-16 min-h-8"
              >
                <Image
                  src={bank.src}
                  alt={bank.alt}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {isPageEnabled("testimonials") && testimonials.length > 0 && (
        <section className="py-8 sm:py-10 lg:py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8 lg:mb-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-900 mb-4">
                {testimonialsSection.title}
              </h2>
              <p className="text-lg sm:text-xl text-amber-800">
                {testimonialsSection.subtitle}
              </p>
            </div>

            {/* Video Testimonials Carousel */}
            <div className="relative max-w-6xl mx-auto">
              {/* Navigation Arrows - Desktop only, hidden if 3 or fewer testimonials */}
              {testimonials.length > 3 && (
                <>
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
                </>
              )}

              {/* Video Testimonials - Single testimonial on mobile, 3 columns on desktop */}
              {testimonials.length > 1 && (
                <div className="block md:hidden">
                  {/* Mobile: Single testimonial carousel */}
                  <div className="relative overflow-hidden rounded-2xl carousel-container">
                    <div
                      ref={testimonialRef}
                      className={`flex transition-transform duration-300 ease-out ${
                        isTestimonialDragging ? "transition-none" : ""
                      }`}
                      style={{
                        transform: `translate3d(calc(-${
                          (currentTestimonial + testimonials.length) * 100
                        }% + ${testimonialDragOffset}px), 0, 0)`,
                        touchAction: "pan-y",
                        willChange: "transform",
                      }}
                      onTouchStart={testimonialHandleTouchStart}
                      onTouchMove={testimonialHandleTouchMove}
                      onTouchEnd={testimonialHandleTouchEnd}
                    >
                      {/* Previous set for seamless left scrolling */}
                      {testimonials.map((testimonial) => (
                        <div
                          key={`prev-${testimonial.id}`}
                          className="w-full flex-shrink-0"
                        >
                          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl overflow-hidden shadow-lg border border-orange-100 mx-4">
                            <div className="relative aspect-video bg-gray-900 rounded-t-2xl overflow-hidden">
                              {testimonial.videoUrl && (
                                <iframe
                                  className="w-full h-full"
                                  src={testimonial.videoUrl}
                                  title={`Customer Testimonial ${testimonial.id}`}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                ></iframe>
                              )}
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
                        <div
                          key={testimonial.id}
                          className="w-full flex-shrink-0"
                        >
                          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl overflow-hidden shadow-lg border border-orange-100 mx-4">
                            <div className="relative aspect-video bg-gray-900 rounded-t-2xl overflow-hidden">
                              {testimonial.videoUrl && (
                                <iframe
                                  className="w-full h-full"
                                  src={testimonial.videoUrl}
                                  title={`Customer Testimonial ${testimonial.id}`}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                ></iframe>
                              )}
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
                              {testimonial.videoUrl && (
                                <iframe
                                  className="w-full h-full"
                                  src={testimonial.videoUrl}
                                  title={`Customer Testimonial ${testimonial.id}`}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                ></iframe>
                              )}
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
              )}

              {/* Single Testimonial - Centered */}
              {testimonials.length === 1 && (
                <div className="flex justify-center">
                  <div className="max-w-md w-full">
                    {testimonials.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl overflow-hidden shadow-lg border border-orange-100 flex flex-col"
                      >
                        <div className="relative aspect-video bg-gray-900 rounded-t-2xl overflow-hidden">
                          {testimonial.videoUrl && (
                            <iframe
                              className="w-full h-full"
                              src={testimonial.videoUrl}
                              title={`Customer Testimonial`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            ></iframe>
                          )}
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
                            {testimonial.quote}
                          </p>
                          <div className="text-center font-semibold text-amber-900 text-sm sm:text-base mt-4">
                            {testimonial.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Desktop: All testimonials visible */}
              {testimonials.length > 1 && (
                <div
                  className={`hidden md:grid gap-6 sm:gap-8 items-stretch ${
                    testimonials.length === 2
                      ? "md:grid-cols-2 max-w-4xl mx-auto"
                      : "md:grid-cols-3"
                  }`}
                >
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={testimonial.id}
                      className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl overflow-hidden shadow-lg border border-orange-100 flex flex-col"
                    >
                      <div className="relative aspect-video bg-gray-900 rounded-t-2xl overflow-hidden">
                        {testimonial.videoUrl && (
                          <iframe
                            className="w-full h-full"
                            src={testimonial.videoUrl}
                            title={`Customer Testimonial ${index + 1}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          ></iframe>
                        )}
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
                          {testimonial.quote}
                        </p>
                        <div className="text-center font-semibold text-amber-900 text-sm sm:text-base mt-4">
                          {testimonial.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mobile Pagination Dots - Only show if more than 1 testimonial */}
              {testimonials.length > 1 && (
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
              )}

              {/* Desktop Pagination Dots - Remove this section since desktop shows all testimonials */}
            </div>
          </div>
        </section>
      )}

      {/* Contact Form */}
      <ContactForm sourcePage="Home Page" />

      {/* Floating Contact Us Button */}
      <FloatingBookButton />

      {/* Data Mode Indicator (development only) */}
      <DataModeIndicator />
    </div>
  );
}
