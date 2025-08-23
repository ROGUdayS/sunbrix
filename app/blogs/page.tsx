"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import ContactForm from "../components/ContactForm";
import FloatingBookButton from "../components/FloatingBookButton";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  tags: string[];
  category: string;
  categorySlug: string;
  categoryColor: string;
  readingTime: number;
  featured: boolean;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  postCount: number;
}

interface PageContent {
  page_title: string;
  page_subtitle: string;
  cta_title: string;
  cta_description: string;
  cta_button_text: string;
  cta_button_link: string;
}

export default function Blogs() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [allBlogPosts, setAllBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [pageContent, setPageContent] = useState<PageContent>({
    page_title: "Blogs & Articles",
    page_subtitle: "Discover expert insights, construction tips, and design inspiration to help you build your dream home with confidence.",
    cta_title: "You Dream. We Deliver.",
    cta_description: "Ready to build your dream home? Schedule a free consultation today and begin the journey of turning your dream into reality.",
    cta_button_text: "Book a Meeting",
    cta_button_link: "/contact",
  });
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    loadBlogData();
  }, []);

  const loadBlogData = async () => {
    try {
      // Load blog posts, categories, and page content in parallel
      const [blogPostsResponse, categoriesResponse, pageContentResponse] = await Promise.all([
        fetch('/api/content/blogs'),
        fetch('/api/content/blogs/categories'),
        fetch('/api/content/blogs/page-content'),
      ]);

      if (blogPostsResponse.ok) {
        const blogPostsData = await blogPostsResponse.json();
        setBlogPosts(blogPostsData);
        setAllBlogPosts(blogPostsData);
      }

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      }

      if (pageContentResponse.ok) {
        const pageData = await pageContentResponse.json();
        setPageContent(pageData);
      }
    } catch (error) {
      console.error('Error loading blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search posts
  const filterAndSearchPosts = () => {
    let filtered = allBlogPosts;
    
    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }
    
    // Search by title, excerpt, content, and tags
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        post.author.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  const filteredPosts = filterAndSearchPosts();
  const allCategories = ["All", ...categories.map(cat => cat.name)];
  
  // Pagination
  const postsPerPage = 9;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfdf8]">
        <Header />
        <div className="flex items-center justify-center h-64 pt-32">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfdf8]">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 pt-24 sm:pt-28 lg:pt-32 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              {pageContent.page_title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {pageContent.page_subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Search and Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="flex justify-center mb-8">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search blogs by title, content, tags, or author..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
                {category !== "All" && (
                  <span className="ml-1 text-xs opacity-75">
                    ({categories.find(cat => cat.name === category)?.postCount || 0})
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {/* Search Results Info */}
          {searchQuery && (
            <div className="text-center mt-4 text-sm text-gray-600">
              Showing {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for "{searchQuery}"
            </div>
          )}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
              <p className="text-gray-500">
                {selectedCategory === "All" 
                  ? "There are no published blog posts yet." 
                  : `No blog posts found in the "${selectedCategory}" category.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
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
                          <span 
                            className="text-sm font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full"
                            style={{ backgroundColor: `${post.categoryColor}20`, color: post.categoryColor }}
                          >
                            {post.category}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readingTime} min read</span>
                        {post.author && (
                          <>
                            <span>•</span>
                            <span>{post.author}</span>
                          </>
                        )}
                      </div>
                      {post.featured && (
                        <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span 
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{ backgroundColor: `${post.categoryColor}20`, color: post.categoryColor }}
                      >
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
                        )}
                      </div>
                    )}
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
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current page
                const shouldShow = 
                  page === 1 || 
                  page === totalPages || 
                  (page >= currentPage - 1 && page <= currentPage + 1);
                
                if (!shouldShow && page === 2 && currentPage > 4) {
                  return <span key={page} className="px-2 text-gray-400">...</span>;
                }
                
                if (!shouldShow && page === totalPages - 1 && currentPage < totalPages - 3) {
                  return <span key={page} className="px-2 text-gray-400">...</span>;
                }
                
                if (!shouldShow) return null;

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-orange-500 text-white shadow-lg"
                        : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}

          {/* Results Summary */}
          {filteredPosts.length > 0 && (
            <div className="text-center mt-6 text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredPosts.length)} of {filteredPosts.length} articles
              {searchQuery && ` for "${searchQuery}"`}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            {pageContent.cta_title}
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {pageContent.cta_description}
          </p>
          <Link
            href={pageContent.cta_button_link}
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            {pageContent.cta_button_text}
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