import type { Metadata } from "next";
import { isPageEnabled } from "@/lib/data-provider";
import { notFound } from "next/navigation";

// Helper function to fetch testimonials metadata
async function getTestimonialsMetadata() {
  try {
    const USE_API_DATA = process.env.NEXT_PUBLIC_USE_API_DATA === "true";
    
    if (USE_API_DATA) {
      // Fetch from API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/api/content/testimonials`, {
        next: { revalidate: 3600 } // Revalidate every hour
      });
      if (response.ok) {
        const data = await response.json();
        return data.metaContent;
      }
    } else {
      // Fetch from static JSON (we'll need to create this file)
      const fs = await import('fs/promises');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'public/data/testimonials-content.json');
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        return data.metaContent;
      } catch {
        return null;
      }
    }
  } catch (error) {
    console.error('Error fetching testimonials metadata:', error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const metaContent = await getTestimonialsMetadata();
  
  return {
    title: metaContent?.meta_title || "Customer Testimonials - Sunbrix Home Construction",
    description: metaContent?.meta_description || "Read what our customers say about their home building experience with Sunbrix. Real reviews from satisfied homeowners.",
    keywords: metaContent?.meta_keywords || "sunbrix testimonials, customer reviews, home construction reviews, building testimonials",
    alternates: {
      canonical: "https://sunbrix.co/testimonials",
    },
    openGraph: {
      title: metaContent?.og_title || "Customer Testimonials - Sunbrix Home Construction",
      description: metaContent?.og_description || "Read what our customers say about their home building experience with Sunbrix. Real reviews from satisfied homeowners.",
      images: [{ url: metaContent?.og_image || "/images/og-image.jpg" }],
      url: "https://sunbrix.co/testimonials",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaContent?.twitter_title || "Customer Testimonials - Sunbrix Home Construction",
      description: metaContent?.twitter_description || "Read what our customers say about their home building experience with Sunbrix. Real reviews from satisfied homeowners.",
      images: [metaContent?.twitter_image || "/images/twitter-image.jpg"],
    },
  };
}

export default async function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if testimonials page is enabled
  const pageEnabled = await isPageEnabled("testimonials");

  if (!pageEnabled) {
    notFound();
  }

  return <>{children}</>;
}
