"use client";

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { use } from "react";
import projectsData from "../../../data/projects.json";
import Header from "../../components/Header";
import ContactForm from "../../components/ContactForm";

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

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { id } = use(params);
  const project = projectsData.projects.find((p: Project) => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fdfdf8]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Back to projects */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center text-amber-600 hover:text-amber-700 transition-colors font-medium"
          >
            <svg
              className="w-4 h-4 mr-2"
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
            Back to projects
          </Link>
        </div>

        {/* Project Title */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            {project.title}
          </h1>
        </div>

        {/* Hero Image */}
        <div className="mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={project.heroImage}
                alt={project.title}
                width={1200}
                height={600}
                className="w-full h-[600px] object-cover"
              />
            </div>
          </div>
        </div>

        {/* Home Configuration */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Home Configuration
            </h2>
            <p className="text-gray-600">
              Essential details about this project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Location */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mb-4">
                  <svg
                    className="w-7 h-7 text-amber-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Location
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {project.location}
                </p>
              </div>
            </div>

            {/* Plot Dimensions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mb-4">
                  <svg
                    className="w-7 h-7 text-amber-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Plot Size
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {project.plotSize}
                </p>
              </div>
            </div>

            {/* Budget */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mb-4">
                  <svg
                    className="w-7 h-7 text-amber-600"
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
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Budget</p>
                <p className="text-lg font-bold text-amber-700">
                  {project.budget}
                </p>
              </div>
            </div>

            {/* Floors */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mb-4">
                  <svg
                    className="w-7 h-7 text-amber-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">Floors</p>
                <p className="text-lg font-bold text-gray-900">
                  {project.floors}
                </p>
              </div>
            </div>

            {/* Road Facing */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mb-4">
                  <svg
                    className="w-7 h-7 text-amber-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Road Facing
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {project.facing}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Specifications
            </h2>
            <p className="text-gray-600">Detailed project specifications</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {project.specifications.totalArea}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Total Area
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {project.specifications.builtUpArea}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Built-up Area
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {project.specifications.bedrooms}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Bedrooms
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {project.specifications.bathrooms}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Bathrooms
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {project.specifications.parking}
                </div>
                <div className="text-sm font-medium text-gray-600">Parking</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {project.specifications.garden}
                </div>
                <div className="text-sm font-medium text-gray-600">Garden</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <ContactForm
        title="Building homes Since 1999"
        subtitle="Ready to build your dream home? Schedule a free consultation to start your journey today!"
      />
    </div>
  );
}
