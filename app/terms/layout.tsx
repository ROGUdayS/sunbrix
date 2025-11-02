import type { Metadata } from "next";
import { isPageEnabled } from "@/lib/data-provider";
import { notFound } from "next/navigation";

// Helper function to fetch terms & conditions metadata
async function getTermsMetadata() {
  try {
    const USE_API_DATA = process.env.NEXT_PUBLIC_USE_API_DATA === "true";
    
    if (USE_API_DATA) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/api/content/terms-conditions`,
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
      const filePath = path.join(process.cwd(), "public/data/terms-conditions.json");
      try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(fileContent);
        return data.metaContent;
      } catch {
        return null;
      }
    }
  } catch (error) {
    console.error("Error fetching terms & conditions metadata:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const metaContent = await getTermsMetadata();
  
  return {
    title: metaContent?.meta_title || "Terms & Conditions - Sunbrix Home Construction",
    description: metaContent?.meta_description || "Read our terms and conditions to understand the rules and regulations for using the Sunbrix website and services.",
    keywords: metaContent?.meta_keywords || "sunbrix terms, terms and conditions, legal terms, service terms",
    alternates: {
      canonical: "https://sunbrix.co/terms",
    },
    openGraph: {
      title: metaContent?.og_title || "Terms & Conditions - Sunbrix Home Construction",
      description: metaContent?.og_description || "Read our terms and conditions to understand the rules and regulations for using the Sunbrix website and services.",
      images: [{ url: metaContent?.og_image || "/images/og-image.jpg" }],
      url: "https://sunbrix.co/terms",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaContent?.twitter_title || "Terms & Conditions - Sunbrix Home Construction",
      description: metaContent?.twitter_description || "Read our terms and conditions to understand the rules and regulations for using the Sunbrix website and services.",
      images: [metaContent?.twitter_image || "/images/twitter-image.jpg"],
    },
  };
}

export default async function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if terms-conditions page is enabled
  const pageEnabled = await isPageEnabled("terms-conditions");

  if (!pageEnabled) {
    notFound();
  }

  return <>{children}</>;
}

