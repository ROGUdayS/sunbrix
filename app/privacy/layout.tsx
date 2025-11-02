import type { Metadata } from "next";
import { isPageEnabled } from "@/lib/data-provider";
import { notFound } from "next/navigation";

// Helper function to fetch privacy policy metadata
async function getPrivacyMetadata() {
  try {
    const USE_API_DATA = process.env.NEXT_PUBLIC_USE_API_DATA === "true";
    
    if (USE_API_DATA) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/api/content/privacy-policy`,
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
      const filePath = path.join(process.cwd(), "public/data/privacy-policy.json");
      try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(fileContent);
        return data.metaContent;
      } catch {
        return null;
      }
    }
  } catch (error) {
    console.error("Error fetching privacy policy metadata:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const metaContent = await getPrivacyMetadata();
  
  return {
    title: metaContent?.meta_title || "Privacy Policy - Sunbrix Home Construction",
    description: metaContent?.meta_description || "Read our privacy policy to understand how Sunbrix collects, uses, and protects your personal information.",
    keywords: metaContent?.meta_keywords || "sunbrix privacy policy, data protection, privacy information",
    alternates: {
      canonical: "https://sunbrix.co/privacy",
    },
    openGraph: {
      title: metaContent?.og_title || "Privacy Policy - Sunbrix Home Construction",
      description: metaContent?.og_description || "Read our privacy policy to understand how Sunbrix collects, uses, and protects your personal information.",
      images: [{ url: metaContent?.og_image || "/images/og-image.jpg" }],
      url: "https://sunbrix.co/privacy",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaContent?.twitter_title || "Privacy Policy - Sunbrix Home Construction",
      description: metaContent?.twitter_description || "Read our privacy policy to understand how Sunbrix collects, uses, and protects your personal information.",
      images: [metaContent?.twitter_image || "/images/twitter-image.jpg"],
    },
  };
}

export default async function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if privacy-policy page is enabled
  const pageEnabled = await isPageEnabled("privacy-policy");

  if (!pageEnabled) {
    notFound();
  }

  return <>{children}</>;
}

