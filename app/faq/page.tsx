"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import ContactForm from "../components/ContactForm";
import FloatingBookButton from "../components/FloatingBookButton";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQCategory {
  id: string;
  name: string;
  description: string;
  faqCount: number;
}

interface PageContent {
  page_title: string;
  page_subtitle: string;
  cta_title: string;
  cta_description: string;
  cta_button_text: string;
  cta_button_link: string;
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [allFaqs, setAllFaqs] = useState<FAQItem[]>([]);
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [pageContent, setPageContent] = useState<PageContent>({
    page_title: "Frequently Asked Questions",
    page_subtitle: "Find answers to common questions about Sunbrix, our construction process, materials, and services.",
    cta_title: "Still Have Questions?",
    cta_description: "Contact us for personalized assistance and detailed information",
    cta_button_text: "Contact Us",
    cta_button_link: "/contact",
  });
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    loadFaqData();
  }, []);

  const loadFaqData = async () => {
    try {
      // Load FAQs, categories, and page content in parallel
      const [faqsResponse, categoriesResponse, pageContentResponse] = await Promise.all([
        fetch('/api/content/faqs'),
        fetch('/api/content/faqs/categories'),
        fetch('/api/content/faqs/page-content'),
      ]);

      if (faqsResponse.ok) {
        const faqsData = await faqsResponse.json();
        setFaqs(faqsData);
        setAllFaqs(faqsData);
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
      console.error('Error loading FAQ data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search FAQs
  const filterAndSearchFaqs = () => {
    let filtered = allFaqs;
    
    // Filter by category
    if (activeCategory !== "All") {
      filtered = filtered.filter((faq) => faq.category === activeCategory);
    }
    
    // Search by question and answer
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  const filteredFAQs = filterAndSearchFaqs();
  const allCategories = ["All", ...categories.map(cat => cat.name)];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            {pageContent.page_title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            {pageContent.page_subtitle}
          </p>
        </div>
      </section>

      {/* Search and Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                placeholder="Search FAQs by question or answer..."
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
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
                {category !== "All" && (
                  <span className="ml-1 text-xs opacity-75">
                    ({categories.find(cat => cat.name === category)?.faqCount || 0})
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {/* Search Results Info */}
          {searchQuery && (
            <div className="text-center mt-4 text-sm text-gray-600">
              Showing {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} for "{searchQuery}"
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
              <p className="text-gray-500">
                {activeCategory === "All" 
                  ? "There are no FAQs available yet." 
                  : `No FAQs found in the "${activeCategory}" category.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      <div className="flex items-center mt-2">
                        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                          expandedFAQ === faq.id ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-6 pb-4 border-t border-gray-100">
                      <div className="pt-4 text-gray-700 leading-relaxed">
                        {faq.answer.split('\n').map((paragraph, index) => (
                          <p key={index} className={index > 0 ? "mt-4" : ""}>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      {faqs.length > 0 && (
        <section className="py-12 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {faqs.length}
                </div>
                <div className="text-sm text-gray-600">Total FAQs</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-amber-600 mb-1">
                  {categories.length}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {Math.round(faqs.reduce((acc, faq) => acc + faq.answer.length, 0) / faqs.length / 10)}s
                </div>
                <div className="text-sm text-gray-600">Avg Read Time</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  24/7
                </div>
                <div className="text-sm text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            {pageContent.cta_title}
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            {pageContent.cta_description}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href={pageContent.cta_button_link}
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              {pageContent.cta_button_text}
            </a>
            <a
              href="tel:+918023404080"
              className="inline-block bg-white hover:bg-gray-50 text-orange-600 border-2 border-orange-500 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm title="Need Personal Assistance?" />

      {/* Floating Contact Us Button */}
      <FloatingBookButton />
    </div>
  );
}