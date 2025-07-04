"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { scrollToContactForm } from "../utils/scrollToContactForm";

export default function FloatingBookButton() {
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [isContactFormVisible, setIsContactFormVisible] = useState(false);
  const pathname = usePathname();
  const isMainPage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (isMainPage) {
        // On main page, always show the button (visible even on hero section)
        setShowFloatingButton(true);
      } else {
        // On other pages, show button immediately
        setShowFloatingButton(true);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMainPage]);

  // Intersection Observer to detect when contact form is visible
  useEffect(() => {
    const contactForm = document.getElementById("contact-form");
    if (!contactForm) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsContactFormVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the contact form is visible
        rootMargin: "0px 0px -50px 0px", // Add some margin to trigger slightly before
      }
    );

    observer.observe(contactForm);

    return () => {
      observer.unobserve(contactForm);
    };
  }, []);

  // Don't show the button if it shouldn't be shown or if contact form is visible
  if (!showFloatingButton || isContactFormVisible) return null;

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50">
      <button
        onClick={scrollToContactForm}
        className="w-full sm:w-auto bg-amber-600 text-white px-6 py-3 rounded-full sm:rounded-full shadow-lg hover:bg-amber-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center sm:justify-start space-x-2"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
        <span className="font-medium">Contact Us</span>
      </button>
    </div>
  );
}
