"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import projectsData from "../../data/projects.json";
import Header from "../components/Header";
import ContactForm from "../components/ContactForm";
import FloatingBookButton from "../components/FloatingBookButton";

interface Project {
  id: string;
  title: string;
  location: string;
  floors: string;
  plotSize: string;
  facing: string;
  budget: string;
  image: string;
  heroImage: string;
  description: string;
  features: string[];
  specifications: {
    totalArea: string;
    builtUpArea: string;
    bedrooms: number;
    bathrooms: number;
    parking: string;
    garden: string;
  };
}

export default function ProjectGallery() {
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedFloors, setSelectedFloors] = useState("All Floors");
  const [selectedPlotSize, setSelectedPlotSize] = useState("All Plot Sizes");
  const [currentPage, setCurrentPage] = useState(1);

  const cities = [
    "All Cities",
    "Bellary",
    "Bengaluru",
    "Bhubaneswar",
    "Chennai",
    "Indore",
    "Kochi",
    "Raipur",
  ];
  const floors = ["All Floors", "G+1", "G+2", "G+3"];
  const plotSizes = [
    "All Plot Sizes",
    "30x40 sq. ft",
    "30x50 sq. ft",
    "40x50 sq. ft",
    "40x60 sq. ft",
  ];

  // Import project data from JSON
  const allProjects = projectsData.projects;

  // Filter projects based on selected filters
  const filteredProjects = allProjects.filter((project: Project) => {
    const cityMatch =
      selectedCity === "All Cities" || project.location === selectedCity;
    const floorsMatch =
      selectedFloors === "All Floors" || project.floors === selectedFloors;
    const plotSizeMatch =
      selectedPlotSize === "All Plot Sizes" ||
      project.plotSize === selectedPlotSize;

    return cityMatch && floorsMatch && plotSizeMatch;
  });

  // Pagination logic
  const projectsPerPage = 6;
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const resetPagination = () => {
    setCurrentPage(1);
  };

  const handleFloorsChange = (floors: string) => {
    setSelectedFloors(floors);
    resetPagination();
  };

  const handlePlotSizeChange = (plotSize: string) => {
    setSelectedPlotSize(plotSize);
    resetPagination();
  };

  return (
    <div className="min-h-screen bg-[#fdfdf8]">
      {/* Header */}
      <Header showCitySelector={true} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Project gallery
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Filter</h2>
                <span className="text-sm text-gray-500">Filters</span>
              </div>

              {/* Cities Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Cities
                </h3>
                <div className="space-y-2">
                  {cities.map((city) => (
                    <label key={city} className="flex items-center">
                      <input
                        type="radio"
                        name="city"
                        value={city}
                        checked={selectedCity === city}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                      />
                      <span className="ml-3 text-gray-700">{city}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Floors Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Floors
                </h3>
                <div className="space-y-2">
                  {floors.map((floor) => (
                    <label key={floor} className="flex items-center">
                      <input
                        type="radio"
                        name="floors"
                        value={floor}
                        checked={selectedFloors === floor}
                        onChange={(e) => handleFloorsChange(e.target.value)}
                        className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                      />
                      <span className="ml-3 text-gray-700">{floor}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Plot Dimensions Filter */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Plot dimensions
                </h3>
                <div className="space-y-2">
                  {plotSizes.map((size) => (
                    <label key={size} className="flex items-center">
                      <input
                        type="radio"
                        name="plotSize"
                        value={size}
                        checked={selectedPlotSize === size}
                        onChange={(e) => handlePlotSizeChange(e.target.value)}
                        className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                      />
                      <span className="ml-3 text-gray-700">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {currentProjects.map((project: Project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow block"
                >
                  <div className="relative">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={500}
                      height={320}
                      className="w-full h-64 object-cover"
                    />
                    {/* Location overlay on image */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center space-x-2">
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">
                        {project.location}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {project.title}
                    </h3>
                    {/* Single row for all details */}
                    <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-1">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                        <span>{project.floors}</span>
                      </div>
                      <div className="flex items-center space-x-1">
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
                        <span>{project.plotSize}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{project.facing}</span>
                      </div>
                      <div className="flex items-center space-x-1 font-semibold text-amber-700">
                        <svg
                          className="w-4 h-4 text-amber-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{project.budget}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination - Only show if more than 6 projects */}
            {filteredProjects.length > projectsPerPage && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  className={`px-3 py-2 text-gray-500 hover:text-gray-700 ${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
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
                  )
                )}

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
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
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
              Showing {currentProjects.length} of {filteredProjects.length}{" "}
              projects
              {filteredProjects.length !== allProjects.length && (
                <span className="text-amber-600"> (filtered)</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <ContactForm />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-5">
              <div className="text-3xl font-bold mb-6">Sunbrix</div>
              <p className="text-gray-300 mb-8 text-base leading-relaxed max-w-md">
                Browse ideas, explore options and book a meeting with our expert
                consultants to finalise your design.
              </p>
              <div className="space-y-3 mb-8">
                <div className="text-base font-semibold text-white">
                  Get in touch
                </div>
                <div className="text-base text-orange-400">
                  support.homes@jswone.in
                </div>
                <div className="text-base text-orange-400">+91 72080 55527</div>
              </div>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4">
              <h3 className="text-xl font-semibold mb-6 text-white">Company</h3>
              <ul className="space-y-4 text-base text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How it works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects"
                    className="hover:text-white transition-colors"
                  >
                    Our projects
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blogs & articles
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h3 className="text-xl font-semibold mb-6 text-white">Legal</h3>
              <ul className="space-y-4 text-base text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Contact Us Button */}
      <FloatingBookButton />
    </div>
  );
}
