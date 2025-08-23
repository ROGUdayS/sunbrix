"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Header from "../../components/Header";
import ContactForm from "../../components/ContactForm";
import FloatingBookButton from "../../components/FloatingBookButton";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  tags: string[];
  category: string;
  categorySlug: string;
  categoryColor: string;
  readingTime: number;
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  readingTime: number;
}

export default function BlogPostClient({ slug }: { slug: string }) {
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogPost();
  }, [slug]);

  const loadBlogPost = async () => {
    try {
      const response = await fetch(`/api/content/blogs/${slug}`);

      if (!response.ok) {
        if (response.status === 404) {
          notFound();
        }
        throw new Error("Failed to fetch blog post");
      }

      const post = await response.json();
      setBlogPost(post);

      // Load related posts
      if (post.categorySlug) {
        const relatedResponse = await fetch(
          `/api/content/blogs?category=${post.categorySlug}&limit=3`
        );
        if (relatedResponse.ok) {
          const allPosts = await relatedResponse.json();
          const filtered = allPosts
            .filter((p: any) => p.slug !== slug)
            .slice(0, 3);
          setRelatedPosts(filtered);
        }
      }
    } catch (error) {
      console.error("Error loading blog post:", error);
      notFound();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatContent = (content: string) => {
    return content.split("\n").map((paragraph, index) => {
      if (paragraph.trim() === "") return null;

      // Handle headings
      if (paragraph.startsWith("# ")) {
        return (
          <h2
            key={index}
            className="text-2xl font-bold text-gray-900 mt-8 mb-4"
          >
            {paragraph.substring(2)}
          </h2>
        );
      }
      if (paragraph.startsWith("## ")) {
        return (
          <h3
            key={index}
            className="text-xl font-semibold text-gray-900 mt-6 mb-3"
          >
            {paragraph.substring(3)}
          </h3>
        );
      }

      // Handle lists
      if (paragraph.startsWith("- ")) {
        return (
          <li key={index} className="ml-6 mb-2">
            {paragraph.substring(2)}
          </li>
        );
      }

      // Regular paragraph
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-4">
          {paragraph}
        </p>
      );
    });
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

  if (!blogPost) {
    notFound();
  }

  // Generate structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blogPost.title,
    description: blogPost.excerpt,
    image: blogPost.image,
    author: {
      "@type": "Organization",
      name: blogPost.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Sunbrix",
      logo: {
        "@type": "ImageObject",
        url: "https://sunbrix.com/logos/horizontal-logo/LOGO-ORIGINAL-H.svg",
      },
    },
    datePublished: blogPost.date,
    dateModified: blogPost.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://sunbrix.com/blogs/${blogPost.slug}`,
    },
    keywords: blogPost.tags.join(", "),
    articleSection: blogPost.category,
    wordCount: blogPost.content.split(" ").length,
    timeRequired: `PT${blogPost.readingTime}M`,
  };

  return (
    <div className="min-h-screen bg-[#fdfdf8]">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Header */}
      <Header />

      {/* Breadcrumb */}
      <nav className="pt-24 sm:pt-28 lg:pt-32 pb-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600 transition-colors">
              Home
            </Link>
            <span>•</span>
            <Link
              href="/blogs"
              className="hover:text-orange-600 transition-colors"
            >
              Blogs
            </Link>
            <span>•</span>
            <span className="text-gray-900 font-medium">{blogPost.title}</span>
          </div>
        </div>
      </nav>

      {/* Article Header */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <span
                className="text-sm font-medium px-3 py-1 rounded-full"
                style={{
                  backgroundColor: `${blogPost.categoryColor}20`,
                  color: blogPost.categoryColor,
                }}
              >
                {blogPost.category}
              </span>
              {blogPost.featured && (
                <span className="text-sm font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {blogPost.title}
            </h1>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
              <div className="flex items-center space-x-4">
                <span>By {blogPost.author}</span>
                <span>•</span>
                <time dateTime={blogPost.date}>
                  {formatDate(blogPost.date)}
                </time>
                <span>•</span>
                <span>{blogPost.readingTime} min read</span>
              </div>

              {/* Social Share Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    navigator.share?.({
                      title: blogPost.title,
                      text: blogPost.excerpt,
                      url: window.location.href,
                    }) || navigator.clipboard.writeText(window.location.href);
                  }}
                  className="text-gray-500 hover:text-orange-600 transition-colors"
                  title="Share this article"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                </button>
              </div>
            </div>

            <p className="text-xl text-gray-600 leading-relaxed font-medium">
              {blogPost.excerpt}
            </p>
          </header>

          {/* Featured Image */}
          {blogPost.image && (
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
              <img
                src={blogPost.image}
                alt={blogPost.title}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed space-y-6">
              {formatContent(blogPost.content)}
            </div>
          </div>

          {/* Tags */}
          {blogPost.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blogPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Article Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <Link
                href="/blogs"
                className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors"
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
                Back to All Posts
              </Link>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Share this article:
                </span>
                <button
                  onClick={() => {
                    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      blogPost.title
                    )}&url=${encodeURIComponent(window.location.href)}`;
                    window.open(twitterUrl, "_blank");
                  }}
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                  title="Share on Twitter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      window.location.href
                    )}`;
                    window.open(linkedinUrl, "_blank");
                  }}
                  className="text-blue-700 hover:text-blue-800 transition-colors"
                  title="Share on LinkedIn"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image || "/images/blog-placeholder.jpg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-3 mb-3 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {post.readingTime} min read
                      </span>
                      <Link
                        href={`/blogs/${post.slug}`}
                        className="text-orange-600 hover:text-orange-700 font-medium transition-colors duration-200"
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Ready to Build Your Dream Home?
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Get expert guidance and personalized consultation for your
            construction project.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Get Started Today
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
