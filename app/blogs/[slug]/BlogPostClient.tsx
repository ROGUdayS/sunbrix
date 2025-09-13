"use client";

import { useState, useEffect, useCallback } from "react";
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
}

export default function BlogPostClient({ slug }: { slug: string }) {
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBlogPost = useCallback(async () => {
    try {
      const response = await fetch(`/api/content/blogs/${slug}`);

      if (response.ok) {
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
              .filter((p: RelatedPost) => p.slug !== slug)
              .slice(0, 3);
            setRelatedPosts(filtered);
          }
        }
      } else if (response.status === 404) {
        notFound();
      } else {
        throw new Error("Failed to fetch blog post");
      }
    } catch (error) {
      console.error("Error loading blog post:", error);
      notFound();
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadBlogPost();
  }, [slug, loadBlogPost]);

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
      <nav className="pt-24 sm:pt-28 lg:pt-32 pb-4 sm:pb-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile: Back button + title */}
          <div className="sm:hidden">
            <div className="flex items-center space-x-3 mb-2">
              <Link
                href="/blogs"
                className="flex items-center text-orange-600 hover:text-orange-700 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-1"
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
                Back to Blogs
              </Link>
            </div>
          </div>

          {/* Desktop: Full breadcrumb */}
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
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
            <span className="text-gray-900 font-medium line-clamp-1">
              {blogPost.title}
            </span>
          </div>
        </div>
      </nav>

      {/* Article Header */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {blogPost.title}
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed font-medium mb-6">
              {blogPost.excerpt}
            </p>

            <div className="flex items-center text-sm text-gray-500 mb-8">
              <span>By {blogPost.author}</span>
              <span className="mx-2">•</span>
              <time dateTime={blogPost.date}>{formatDate(blogPost.date)}</time>
            </div>
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

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Share this article
              </span>
              <div className="flex items-center space-x-2">
                {/* Twitter */}
                <button
                  onClick={() => {
                    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      blogPost.title
                    )}&url=${encodeURIComponent(window.location.href)}`;
                    window.open(twitterUrl, "_blank");
                  }}
                  className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors duration-200"
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

                {/* LinkedIn */}
                <button
                  onClick={() => {
                    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      window.location.href
                    )}`;
                    window.open(linkedinUrl, "_blank");
                  }}
                  className="p-2 text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors duration-200"
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

                {/* Facebook */}
                <button
                  onClick={() => {
                    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      window.location.href
                    )}`;
                    window.open(facebookUrl, "_blank");
                  }}
                  className="p-2 text-gray-500 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-200"
                  title="Share on Facebook"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={() => {
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
                      `${blogPost.title} - ${window.location.href}`
                    )}`;
                    window.open(whatsappUrl, "_blank");
                  }}
                  className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors duration-200"
                  title="Share on WhatsApp"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                </button>

                {/* Copy Link */}
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    } catch (err) {
                      console.error("Failed to copy: ", err);
                      const textArea = document.createElement("textarea");
                      textArea.value = window.location.href;
                      document.body.appendChild(textArea);
                      textArea.select();
                      document.execCommand("copy");
                      document.body.removeChild(textArea);
                      alert("Link copied to clipboard!");
                    }
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  title="Copy Link"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
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
                    <div className="flex items-center justify-end">
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
