import type { Metadata } from "next";
import { headers } from "next/headers";
import BlogPostClient from "./BlogPostClient";

// Fetch blog post data server-side for SEO
async function getBlogPost(slug: string) {
  try {
    // Build base URL from request headers to support any host/port
    const h = await headers();
    const host = h.get("host") || "localhost:3000";
    const protocol =
      h.get("x-forwarded-proto") ||
      (process.env.NODE_ENV === "production" ? "https" : "http");
    const baseUrl = `${protocol}://${host}`;

    const response = await fetch(`${baseUrl}/api/content/blogs/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blogPost = await getBlogPost(slug);

  if (!blogPost) {
    return {
      title: "Blog Post Not Found | Sunbrix",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: blogPost.metaTitle || `${blogPost.title} | Sunbrix`,
    description: blogPost.metaDescription || blogPost.excerpt,
    keywords: blogPost.tags.join(", "),
    authors: [{ name: blogPost.author }],
    openGraph: {
      title: blogPost.title,
      description: blogPost.excerpt,
      type: "article",
      publishedTime: blogPost.date,
      authors: [blogPost.author],
      images: [
        {
          url: blogPost.image || "/images/blog-placeholder.jpg",
          width: 1200,
          height: 630,
          alt: blogPost.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blogPost.title,
      description: blogPost.excerpt,
      images: [blogPost.image || "/images/blog-placeholder.jpg"],
    },
    alternates: {
      canonical: `/blogs/${slug}`,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogPostClient slug={slug} />;
}
