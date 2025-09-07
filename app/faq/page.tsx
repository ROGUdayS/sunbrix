"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import ContactForm from "../components/ContactForm";
import FloatingBookButton from "../components/FloatingBookButton";
import { getFaqs, getFaqContent } from "@/lib/data-provider-client";
import MarkdownRenderer, {
  markdownStyles,
} from "../components/MarkdownRenderer";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface PageContent {
  page_title: string;
  page_subtitle: string;
}

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [allFaqs, setAllFaqs] = useState<FAQItem[]>([]);
  const [pageContent, setPageContent] = useState<PageContent>({
    page_title: "Frequently Asked Questions",
    page_subtitle:
      "Find answers to common questions about Sunbrix, our construction process, materials, and services.",
  });
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    loadFaqData();
  }, []);

  const loadFaqData = async () => {
    try {
      // Load FAQs and page content in parallel using data provider
      const [faqsData, pageData] = await Promise.all([
        getFaqs(),
        getFaqContent(),
      ]);

      // Sort FAQs by order_index to maintain admin-configured order
      const sortedFaqs = (faqsData || []).sort(
        (a: any, b: any) => (a.order_index || 0) - (b.order_index || 0)
      );
      setFaqs(sortedFaqs);
      setAllFaqs(sortedFaqs);

      // Handle pageData - it might be an array, so take the first item or use default
      const pageContentData =
        Array.isArray(pageData) && pageData.length > 0
          ? pageData[0]
          : {
              page_title: "Frequently Asked Questions",
              page_subtitle:
                "Find answers to common questions about Sunbrix, our construction process, materials, and services.",
            };
      setPageContent(pageContentData);
    } catch (error) {
      console.error("Error loading FAQ data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search FAQs
  const filterAndSearchFaqs = () => {
    let filtered = allFaqs;

    // Search by question and answer
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const filteredFAQs = filterAndSearchFaqs();

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
      {/* Inject markdown styles */}
      <style jsx global>
        {markdownStyles}
      </style>

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
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search FAQs by question or answer..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors text-gray-900 placeholder-gray-500"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
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
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No FAQs found
              </h3>
              <p className="text-gray-500">There are no FAQs available yet.</p>
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
                        <MarkdownRenderer content={faq.answer} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm title="Need Personal Assistance?" />

      {/* Floating Contact Us Button */}
      <FloatingBookButton />
    </div>
  );
}
