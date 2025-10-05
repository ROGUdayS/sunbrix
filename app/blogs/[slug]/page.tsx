import type { Metadata } from "next";
import { getBlogBySlug } from "@/lib/data-provider-client";
import BlogPostClient from "./BlogPostClient";

// Fetch blog post data server-side for SEO using data provider
async function getBlogPost(slug: string) {
  try {
    // Use the data provider which respects static/API mode
    const blogPost = await getBlogBySlug(slug);
    return blogPost;
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
