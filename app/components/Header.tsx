"use client";

import Link from "next/link";
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
      "block px-3 py-2 text-base font-medium transition-colors";
    const activeClasses = "text-amber-900 bg-amber-50";
    const inactiveClasses =
      "text-gray-700 hover:text-amber-900 hover:bg-gray-50";

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
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className={`text-2xl font-bold transition-colors ${
                isTransparent && !isScrolled ? "text-white" : "text-amber-900"
              }`}
            >
              Sunbrix
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/projects" className={getLinkClassName("/projects")}>
              Gallery
            </Link>
            <Link
              href="/testimonials"
              className={getLinkClassName("/testimonials")}
            >
              Testimonials
            </Link>
            <Link href="/faq" className={getLinkClassName("/faq")}>
              FAQs
            </Link>
            <Link href="/about" className={getLinkClassName("/about")}>
              About us
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {/* City selector */}
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

            {/* Mobile menu button */}
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
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/projects"
                className={getMobileLinkClassName("/projects")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Gallery
              </Link>
              <Link
                href="/testimonials"
                className={getMobileLinkClassName("/testimonials")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="/faq"
                className={getMobileLinkClassName("/faq")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQs
              </Link>
              <Link
                href="/about"
                className={getMobileLinkClassName("/about")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About us
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
