"use client";

import Image from "next/image";
import { useEffect } from "react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onGoTo?: (index: number) => void;
  title: string;
}

export default function ImageModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNext,
  onPrev,
  onGoTo,
  title,
}: ImageModalProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle arrow key navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowLeft") {
        onPrev();
      } else if (e.key === "ArrowRight") {
        onNext();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, onNext, onPrev]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 max-w-7xl max-h-[90vh] mx-4 sm:mx-8">
        {/* Image Container */}
        <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl">
          <div className="relative">
            <Image
              src={images[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[90vh] object-contain"
              priority
            />

            {/* Close Button - Overlay on image */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 hover:scale-110 z-20"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Title and Counter - Overlay on image */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white rounded-lg px-3 py-2">
              <h3 className="text-lg font-semibold">{title}</h3>
              {images.length > 1 && (
                <p className="text-sm opacity-90">
                  {currentIndex + 1} of {images.length}
                </p>
              )}
            </div>

            {/* Navigation Arrows - Only show if more than 1 image */}
            {images.length > 1 && (
              <>
                <button
                  onClick={onPrev}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
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
                  onClick={onNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
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

                {/* Thumbnail Indicators - Bottom overlay */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (onGoTo) {
                          onGoTo(index);
                        } else {
                          // Fallback navigation
                          const diff = index - currentIndex;
                          if (diff > 0) {
                            for (let i = 0; i < diff; i++) onNext();
                          } else if (diff < 0) {
                            for (let i = 0; i < Math.abs(diff); i++) onPrev();
                          }
                        }
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentIndex
                          ? "bg-white shadow-lg"
                          : "bg-white/50 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
