"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCity } from "../contexts/CityContext";

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

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const getLinkClassName = (path: string) => {
    const baseClasses = "border-b-2 pb-1 font-medium transition-colors";
    const activeClasses = isTransparent
      ? "text-white border-orange-400"
      : "text-amber-900 border-amber-900";
    const inactiveClasses = isTransparent
      ? "text-white/90 hover:text-white border-transparent hover:border-white/50"
      : "text-gray-700 hover:text-amber-900 border-transparent";

    return isActive(path)
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`;
  };

  return (
    <header
      className={isTransparent ? "" : "bg-[#fdfdf8] border-b border-gray-100"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className={`text-2xl font-bold transition-colors ${
                isTransparent ? "text-white" : "text-amber-900"
              }`}
            >
              Sunbrix
            </Link>
          </div>
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
          <div className="flex items-center">
            {/* City selector moved to the right */}
            {showCitySelector && (
              <button
                onClick={() => setShowCityModal(true)}
                className={`border rounded-lg px-4 py-2 text-sm shadow-sm hover:shadow-md transition-all flex items-center space-x-2 w-32 justify-between ${
                  isTransparent
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
      </div>
    </header>
  );
}
