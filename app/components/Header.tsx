"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useCity } from "../contexts/CityContext";

interface HeaderProps {
  showCitySelector?: boolean;
}

export default function Header({ showCitySelector = false }: HeaderProps) {
  const pathname = usePathname();
  const { selectedCity, setShowCityModal } = useCity();
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowMoreDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const getLinkClassName = (path: string) => {
    return isActive(path)
      ? "text-amber-900 font-medium border-b-2 border-amber-900 pb-1"
      : "text-gray-700 hover:text-amber-900 border-b-2 border-transparent pb-1 font-medium";
  };

  return (
    <header className="bg-[#fdfdf8] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-amber-900">
              JSW ONE HOMES
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/projects" className={getLinkClassName("/projects")}>
              Our projects
            </Link>
            <Link
              href="/how-it-works"
              className={getLinkClassName("/how-it-works")}
            >
              How it works
            </Link>
            <Link
              href="/testimonials"
              className={getLinkClassName("/testimonials")}
            >
              Testimonials
            </Link>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                className="text-gray-700 hover:text-amber-900 border-b-2 border-transparent pb-1 font-medium flex items-center space-x-1"
              >
                <span>More</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    showMoreDropdown ? "rotate-180" : ""
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

              {showMoreDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href="/faq"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-900"
                    onClick={() => setShowMoreDropdown(false)}
                  >
                    FAQs
                  </Link>
                  <Link
                    href="/about"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-900"
                    onClick={() => setShowMoreDropdown(false)}
                  >
                    About us
                  </Link>

                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-amber-900"
                    onClick={() => setShowMoreDropdown(false)}
                  >
                    Contact us
                  </Link>
                </div>
              )}
            </div>
          </nav>
          <div className="flex items-center">
            {/* City selector with consistent spacing */}
            <div className="mr-4">
              {showCitySelector ? (
                <button
                  onClick={() => setShowCityModal(true)}
                  className="border border-amber-300 rounded-lg px-4 py-2 text-sm focus:border-amber-600 text-amber-700 bg-white shadow-sm hover:shadow-md transition-shadow flex items-center space-x-2 w-32 justify-between"
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
              ) : (
                <div className="w-32 h-10"></div>
              )}
            </div>
            <button className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 font-medium">
              Book a meeting
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
