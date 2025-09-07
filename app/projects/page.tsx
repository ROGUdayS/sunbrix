"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import ContactForm from "../components/ContactForm";
import FloatingBookButton from "../components/FloatingBookButton";
import ImageModal from "../components/ImageModal";
import { getProjects, ProjectData } from "@/lib/data-provider-client";

interface Project extends ProjectData {
  yearBuilt: string;
  bhk: string;
  siteDimension: string;
  residential: string;
}

export default function ProjectGallery() {
  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);
  const [modalTitle, setModalTitle] = useState("");

  // Fetch projects using data provider
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);

        const data = await getProjects(true);

        if (data && data.projects) {
          // Transform projects to match expected format
          const transformedProjects = data.projects.map(
            (project: ProjectData) => ({
              ...project,
              yearBuilt:
                project.year ||
                new Date(project.created_at).getFullYear().toString(),
              bhk: `${project.specifications?.bedrooms || 2}BHK`,
              siteDimension: project.plotSize,
              residential: project.property_type || "Residential",
            })
          );

          setProjects(transformedProjects);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load projects"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const allProjects = projects;

  // Pagination logic
  const projectsPerPage = 6;
  const totalPages = Math.ceil(allProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = allProjects.slice(startIndex, endIndex);

  // Modal functions
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

  // Function to get directional arrow based on facing direction
  const getDirectionalArrow = (facing: string) => {
    const direction = facing.toLowerCase();

    if (direction.includes("north")) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v10.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z"
            clipRule="evenodd"
            transform="rotate(180 10 10)"
          />
        </svg>
      );
    } else if (direction.includes("south")) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v10.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (direction.includes("east")) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3 10a1 1 0 011-1h10.586L12.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (direction.includes("west")) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M17 10a1 1 0 01-1 1H5.414l2.293 2.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H16a1 1 0 011 1z"
            clipRule="evenodd"
          />
        </svg>
      );
    } else if (
      direction.includes("northeast") ||
      direction.includes("north-east")
    ) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
            transform="rotate(-45 10 10)"
          />
        </svg>
      );
    } else if (
      direction.includes("northwest") ||
      direction.includes("north-west")
    ) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
            transform="rotate(45 10 10)"
          />
        </svg>
      );
    } else if (
      direction.includes("southeast") ||
      direction.includes("south-east")
    ) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
            transform="rotate(-135 10 10)"
          />
        </svg>
      );
    } else if (
      direction.includes("southwest") ||
      direction.includes("south-west")
    ) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
            transform="rotate(135 10 10)"
          />
        </svg>
      );
    } else {
      // Default compass icon for unknown directions
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6s.792.193 1.264.979L14 10l-2.736 3.021C10.792 13.807 10.304 14 10 14s-.792-.193-1.264-.979L6 10l2.736-3.021z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdf8]">
      {/* Header */}
      <Header showCitySelector={true} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-20 sm:pt-24">
        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Gallery
          </h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-600 font-medium">Failed to load projects</p>
            <p className="text-sm text-red-500 mt-1">{error}</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
            {currentProjects.map((project: Project) => {
              // Create array of images - use multiple images if available, otherwise use main image
              const projectImages =
                project.images && project.images.length > 0
                  ? project.images
                  : [project.image];
              const currentIndex = 0; // Always show first image since auto-cycling is removed

              return (
                <div
                  key={project.id}
                  className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  {/* Project Photo with Carousel */}
                  <div
                    className="relative cursor-pointer"
                    onClick={() =>
                      openModal(projectImages, project.title, currentIndex)
                    }
                  >
                    {projectImages[currentIndex] && (
                      <Image
                        src={projectImages[currentIndex]}
                        alt={project.title}
                        width={500}
                        height={320}
                        className="w-full h-48 sm:h-56 lg:h-64 object-cover"
                      />
                    )}

                    {/* Location overlay */}
                    <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2 flex items-center space-x-1 sm:space-x-2">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        {project.location}, {project.yearBuilt}
                      </span>
                    </div>

                    {/* Image indicators - Only show if more than 1 image */}
                    {projectImages.length > 1 && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        {projectImages.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index === currentIndex
                                ? "bg-white"
                                : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-4 sm:p-6">
                    {/* Project Name */}
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Overview - Single Line Design */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium text-gray-800">
                          {project.siteDimension}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 text-gray-600">
                        {getDirectionalArrow(project.facing)}
                        <span className="font-medium text-gray-800">
                          {project.facing}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 text-gray-600">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        <span className="font-medium text-gray-800">
                          {project.bhk}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 text-gray-600">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" />
                        </svg>
                        <span className="font-medium text-gray-800">
                          {project.residential}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination - Only show if more than 6 projects */}
        {allProjects.length > projectsPerPage && (
          <div className="flex justify-center items-center space-x-2">
            <button
              className={`px-3 py-2 text-gray-500 hover:text-gray-700 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded ${
                  currentPage === page
                    ? "bg-amber-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              className={`px-3 py-2 text-gray-500 hover:text-gray-700 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Show results count */}
        <div className="text-center text-gray-600 mt-4">
          Showing {currentProjects.length} of {allProjects.length} projects
        </div>
      </div>

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
