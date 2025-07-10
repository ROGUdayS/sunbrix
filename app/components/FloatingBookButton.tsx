"use client";

import { useState, useEffect } from "react";
import { scrollToContactForm } from "../utils/scrollToContactForm";

export default function FloatingBookButton() {
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [isContactFormVisible, setIsContactFormVisible] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  // const isMainPage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingButton(true); // Always show unless hidden by intersection
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for contact form and footer
  useEffect(() => {
    const contactForm = document.getElementById("contact-form");
    const footer = document.querySelector("footer");

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === contactForm) {
            setIsContactFormVisible(entry.isIntersecting);
          }
          if (entry.target === footer) {
            setIsFooterVisible(entry.isIntersecting);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );
    if (contactForm) observer.observe(contactForm);
    if (footer) observer.observe(footer);
    return () => {
      if (contactForm) observer.unobserve(contactForm);
      if (footer) observer.unobserve(footer);
    };
  }, []);

  // Hide if contact form or footer is visible
  if (!showFloatingButton || isContactFormVisible || isFooterVisible)
    return null;

  return (
    <div className="fixed bottom-8 sm:bottom-10 left-4 right-4 sm:left-auto sm:right-6 z-50">
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
