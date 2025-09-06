"use client";

import Header from "../components/Header";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ProjectData {
  id: string;
  title: string;
  location: string;
  year: string;
  plotSize: string;
  facing: string;
  property_type: string;
  image: string;
  images: string[];
  description: string;
  specifications: any;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface SitemapSection {
  title: string;
  description: string;
  pages: {
    title: string;
    url: string;
    description?: string;
  }[];
}

export default function SitemapPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/data/projects.json");
        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const sitemapSections: SitemapSection[] = [
    {
      title: "Main Pages",
      description: "Core pages of our website",
      pages: [
        {
          title: "Home",
          url: "/",
          description: "Welcome to Sunbrix - Your trusted construction partner",
        },
        {
          title: "About Us",
          url: "/about",
          description: "Learn about our company, mission, and values",
        },
        {
          title: "Contact",
          url: "/contact",
          description:
            "Get in touch with our team for inquiries and consultations",
        },
      ],
    },
    {
      title: "Services & Projects",
      description: "Explore our services and completed projects",
      pages: [
        {
          title: "Gallery",
          url: "/projects",
          description:
            "Browse our portfolio of completed construction projects",
        },
        {
          title: "Testimonials",
          url: "/testimonials",
          description: "Read what our satisfied customers have to say",
        },
        {
          title: "FAQs",
          url: "/faq",
          description: "Find answers to frequently asked questions",
        },
      ],
    },
    {
      title: "Content & Resources",
      description: "Educational content and resources",
      pages: [
        {
          title: "Blogs & Articles",
          url: "/blogs",
          description: "Read our latest articles and construction insights",
        },
      ],
    },
    {
      title: "Legal",
      description: "Important legal information and policies",
      pages: [
        {
          title: "Terms & Conditions",
          url: "/terms",
          description: "Our terms of service and conditions",
        },
        {
          title: "Privacy Policy",
          url: "/privacy",
          description: "How we protect and handle your personal information",
        },
      ],
    },
  ];

  // Add dynamic project pages
  if (projects.length > 0) {
    const projectPages = projects.map((project) => ({
      title: project.title,
      url: `/projects/${project.id}`,
      description: `View details of ${project.title}`,
    }));

    sitemapSections.push({
      title: "Individual Projects",
      description: "Detailed pages for each completed project",
      pages: projectPages,
    });
  }

  return (
    <div className="min-h-screen bg-[#fdfdf8]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <section className="py-12 sm:py-16 lg:py-20 pt-24 sm:pt-28 lg:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Sitemap
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Navigate through all pages of our website. Find everything you
              need about Sunbrix construction services and projects.
            </p>
          </div>

          {/* Sitemap Sections */}
          <div className="space-y-12">
            {sitemapSections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                {/* Section Header */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-200">
                  <h2 className="text-2xl font-bold text-amber-900">
                    {section.title}
                  </h2>
                  <p className="text-amber-700 mt-1">{section.description}</p>
                </div>

                {/* Section Pages */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.pages.map((page, pageIndex) => (
                      <Link
                        key={pageIndex}
                        href={page.url}
                        className="group block p-4 rounded-lg border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all duration-300 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors duration-300">
                            <svg
                              className="w-4 h-4 text-amber-600"
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
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-900 transition-colors duration-300">
                              {page.title}
                            </h3>
                            {page.description && (
                              <p className="text-sm text-gray-600 mt-1 group-hover:text-amber-700 transition-colors duration-300">
                                {page.description}
                              </p>
                            )}
                            <div className="text-xs text-amber-600 mt-2 font-medium">
                              {page.url}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
              <h3 className="text-2xl font-bold text-amber-900 mb-4">
                Need Help Finding Something?
              </h3>
              <p className="text-amber-700 mb-6 max-w-2xl mx-auto">
                Can&apos;t find what you&apos;re looking for? Our team is here
                to help you navigate our website and find the information you
                need.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
