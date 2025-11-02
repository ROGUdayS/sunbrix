import type { Metadata } from "next";
import { isPageEnabled } from "@/lib/data-provider";
import { notFound } from "next/navigation";

// Helper function to fetch blogs page metadata
async function getBlogsMetadata() {
  try {
    const USE_API_DATA = process.env.NEXT_PUBLIC_USE_API_DATA === "true";
    
    if (USE_API_DATA) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/api/content/blogs/page-content`,
        {
          next: { revalidate: 3600 },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.metaContent;
      }
    } else {
      const fs = await import("fs/promises");
      const path = await import("path");
      const filePath = path.join(process.cwd(), "public/data/blogs-content.json");
      try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(fileContent);
        return data.metaContent;
      } catch {
        return null;
      }
    }
  } catch (error) {
    console.error("Error fetching blogs metadata:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const metaContent = await getBlogsMetadata();
  
  return {
    title: metaContent?.meta_title || "Blogs & Articles - Sunbrix Home Construction",
    description: metaContent?.meta_description || "Discover expert insights, construction tips, and design inspiration to help you build your dream home with confidence.",
    keywords: metaContent?.meta_keywords || "sunbrix blog, construction tips, home building articles, design inspiration",
    alternates: {
      canonical: "https://sunbrix.co/blogs",
    },
    openGraph: {
      title: metaContent?.og_title || "Blogs & Articles - Sunbrix Home Construction",
      description: metaContent?.og_description || "Discover expert insights, construction tips, and design inspiration to help you build your dream home with confidence.",
      images: [{ url: metaContent?.og_image || "/images/og-image.jpg" }],
      url: "https://sunbrix.co/blogs",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaContent?.twitter_title || "Blogs & Articles - Sunbrix Home Construction",
      description: metaContent?.twitter_description || "Discover expert insights, construction tips, and design inspiration to help you build your dream home with confidence.",
      images: [metaContent?.twitter_image || "/images/twitter-image.jpg"],
    },
  };
}

export default async function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if blogs-articles page is enabled
  const pageEnabled = await isPageEnabled("blogs-articles");

  if (!pageEnabled) {
    notFound();
  }

  return <>{children}</>;
}
