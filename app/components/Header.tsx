"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCity } from "../contexts/CityContext";
import { useState, useEffect } from "react";

interface HeaderProps {
  showCitySelector?: boolean;
  isTransparent?: boolean;
}

export default function Header({
  showCitySelector = false,
  isTransparent = false,
}: HeaderProps) {
  const pathname = usePathname();
  const { selectedCity, setShowCityModal } = useCity();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const getLinkClassName = (path: string) => {
    const baseClasses = "border-b-2 pb-1 font-medium transition-colors";
    const activeClasses =
      isTransparent && !isScrolled
        ? "text-white border-orange-400"
        : "text-amber-900 border-amber-900";
    const inactiveClasses =
      isTransparent && !isScrolled
        ? "text-white/90 hover:text-white border-transparent hover:border-white/50"
        : "text-gray-700 hover:text-amber-900 border-transparent";

    return isActive(path)
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`;
  };

  const getMobileLinkClassName = (path: string) => {
    const baseClasses =
      "block px-4 py-3 text-base font-medium transition-all duration-300 rounded-lg mx-2 relative overflow-hidden";
    const activeClasses =
      "text-amber-900 bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300 shadow-md transform scale-105";
    const inactiveClasses =
      "text-gray-700 hover:text-amber-900 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 border-2 border-transparent hover:border-amber-200 hover:shadow-sm hover:transform hover:scale-102";

    return isActive(path)
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent && !isScrolled
          ? "bg-transparent"
          : isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-[#fdfdf8] border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Mobile menu button and Logo */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button - moved to left */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-md transition-colors ${
                isTransparent && !isScrolled
                  ? "text-white hover:bg-white/10"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src={
                  isTransparent && !isScrolled
                    ? "/logos/horizontal-logo/LOGO-WHITE-H.png"
                    : "/logos/horizontal-logo/LOGO-ORIGINAL-H.png"
                }
                alt="Sunbrix"
                width={120}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Center - Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/about" className={getLinkClassName("/about")}>
              About Us
            </Link>
            <Link href="/projects" className={getLinkClassName("/projects")}>
              Gallery
            </Link>
            <button
              onClick={() => {
                if (pathname === "/") {
                  // If on home page, scroll to packages section
                  const packagesSection = document.querySelector(
                    '[data-section="packages"]'
                  );
                  if (packagesSection) {
                    packagesSection.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                } else {
                  // If on other pages, navigate to home page with packages hash
                  window.location.href = "/#packages";
                }
              }}
              className={`border-b-2 pb-1 font-medium transition-colors cursor-pointer ${
                isTransparent && !isScrolled
                  ? "text-white/90 hover:text-white border-transparent hover:border-white/50"
                  : "text-gray-700 hover:text-amber-900 border-transparent"
              }`}
            >
              Services
            </button>
          </nav>

          {/* Right side - City selector (with fixed width to prevent layout shift) */}
          <div className="flex items-center justify-end w-32">
            {showCitySelector && (
              <button
                onClick={() => setShowCityModal(true)}
                className={`border rounded-lg px-4 py-2 text-sm shadow-sm hover:shadow-md transition-all flex items-center space-x-2 w-32 justify-between ${
                  isTransparent && !isScrolled
                    ? "border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 focus:border-white/50"
                    : "border-amber-300 text-amber-700 bg-white focus:border-amber-600"
                }`}
              >
                <span className="truncate">{selectedCity.displayName}</span>
                <svg
                  className="w-4 h-4 flex-shrink-0"
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
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-xl">
            <div className="px-2 pt-4 pb-4 space-y-2">
              <Link
                href="/about"
                className={getMobileLinkClassName("/about")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/projects"
                className={getMobileLinkClassName("/projects")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Gallery
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (pathname === "/") {
                    // If on home page, scroll to packages section
                    const packagesSection = document.querySelector(
                      '[data-section="packages"]'
                    );
                    if (packagesSection) {
                      packagesSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  } else {
                    // If on other pages, navigate to home page with packages hash
                    window.location.href = "/#packages";
                  }
                }}
                className="block px-4 py-3 text-base font-medium transition-all duration-300 text-gray-700 hover:text-amber-900 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 border-2 border-transparent hover:border-amber-200 hover:shadow-sm hover:transform hover:scale-102 rounded-lg mx-2 w-full text-left relative overflow-hidden"
              >
                Services
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
