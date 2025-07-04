"use client";

import { useState } from "react";
import Header from "../components/Header";
import ContactForm from "../components/ContactForm";
import FloatingBookButton from "../components/FloatingBookButton";
import Link from "next/link";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  slug: string;
}

export default function Blogs() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Sustainability",
    "Construction",
    "Design",
    "Materials",
    "Technology",
  ];

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title:
        "How to design a home that maximises natural light and ventilation",
      excerpt:
        "From cross-ventilation to skylights and passive cooling—build a home that breathes. Practical tips from Sunbrix for individual homebuilders.",
      category: "Construction",
      date: "Dec 30, 2024",
      image: "/images/blog-ventilation.jpg",
      slug: "natural-light-ventilation",
    },
    {
      id: 2,
      title: "Understanding the benefits of steel in modern home construction",
      excerpt:
        "Discover why steel is a smart choice for modern home building in India. Learn how it enhances strength, speed, design flexibility, and sustainability.",
      category: "Construction",
      date: "Dec 25, 2024",
      image: "/images/blog-steel.jpg",
      slug: "steel-construction-benefits",
    },
    {
      id: 3,
      title: "Demystifying turnkey home construction: why it's a game-changer",
      excerpt:
        "Explore the turnkey construction process planning, approvals, interiors, and handover managed by a single provider like Sunbrix.",
      category: "Construction",
      date: "Dec 20, 2024",
      image: "/images/blog-turnkey.jpg",
      slug: "turnkey-construction",
    },
    {
      id: 4,
      title: "Why quality building materials matter for your home?",
      excerpt:
        "High-quality materials improve durability, safety, energy efficiency, and resale value. Learn why smart choices in materials protect your investment.",
      category: "Materials",
      date: "Dec 15, 2024",
      image: "/images/blog-materials.jpg",
      slug: "quality-building-materials",
    },
    {
      id: 5,
      title:
        "Seven reasons to get expert support for your home-building materials",
      excerpt:
        "Struggling with material choices for your home? Discover 7 reasons expert guidance ensures durability, cost-efficiency, and comfort in Indian home construction.",
      category: "Materials",
      date: "Dec 10, 2024",
      image: "/images/blog-expert-support.jpg",
      slug: "expert-material-support",
    },
    {
      id: 6,
      title:
        "How to design your dream home: key considerations before you start",
      excerpt:
        "Create a space that fits your lifestyle. Learn how to prioritise your family's needs, select the right plot, and budget realistically for your dream home.",
      category: "Design",
      date: "Dec 5, 2024",
      image: "/images/blog-dream-home.jpg",
      slug: "design-dream-home",
    },
    {
      id: 7,
      title:
        "Customising home designs: tips for creating a home that suits your lifestyle",
      excerpt:
        "Custom home design goes beyond looks. Discover how Sunbrix helps you create a house that supports your habits, future needs, and family routines—without compromise.",
      category: "Design",
      date: "Nov 30, 2024",
      image: "/images/blog-custom-design.jpg",
      slug: "custom-home-designs",
    },
    {
      id: 8,
      title:
        "Building a sustainable home: materials and techniques you should consider",
      excerpt:
        "Learn about eco-friendly materials and techniques for building a sustainable home. Discover how to create an energy-efficient, environmentally conscious living space.",
      category: "Sustainability",
      date: "Nov 25, 2024",
      image: "/images/blog-sustainable.jpg",
      slug: "sustainable-home-building",
    },
    {
      id: 9,
      title:
        "Smart home technology: integrating modern solutions in construction",
      excerpt:
        "Explore how smart home technology can be integrated during construction for enhanced comfort, security, and energy efficiency.",
      category: "Technology",
      date: "Nov 20, 2024",
      image: "/images/blog-smart-home.jpg",
      slug: "smart-home-technology",
    },
  ];

  const filteredPosts =
    selectedCategory === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#fdfdf8]">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 pt-24 sm:pt-28 lg:pt-32 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Blogs & Articles
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover expert insights, construction tips, and design
              inspiration to help you build your dream home with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
                  >
                    Read more
                    <svg
                      className="w-4 h-4 ml-1"
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
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            You Dream. We Deliver.
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Ready to build your dream home? Schedule a free consultation today
            and begin the journey of turning your dream into reality.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Book a Meeting
          </Link>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm title="Get Expert Guidance" />

      {/* Floating Contact Us Button */}
      <FloatingBookButton />
    </div>
  );
}
