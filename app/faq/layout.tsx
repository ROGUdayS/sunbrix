import type { Metadata } from "next";
import { isPageEnabled } from "@/lib/data-provider";
import { notFound } from "next/navigation";

// Helper function to fetch FAQ page metadata
async function getFaqMetadata() {
  try {
    const USE_API_DATA = process.env.NEXT_PUBLIC_USE_API_DATA === "true";

    if (USE_API_DATA) {
      // Fetch from API
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
        }/api/content/faqs/page-content`,
        {
          next: { revalidate: 3600 }, // Revalidate every hour
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.metaContent;
      }
    } else {
      // Fetch from static JSON
      const fs = await import("fs/promises");
      const path = await import("path");
      const filePath = path.join(
        process.cwd(),
        "public/data/faqs-content.json"
      );
      try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        const data = JSON.parse(fileContent);
        return data.metaContent;
      } catch {
        return null;
      }
    }
  } catch (error) {
    console.error("Error fetching FAQ metadata:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const metaContent = await getFaqMetadata();

  return {
    title: metaContent?.meta_title || "FAQs - Sunbrix Home Construction",
    description:
      metaContent?.meta_description ||
      "Get answers to frequently asked questions about Sunbrix home construction services, processes, materials, and warranties.",
    keywords:
      metaContent?.meta_keywords ||
      "sunbrix faq, home construction questions, building faq, construction services faq",
    alternates: {
      canonical: "https://sunbrix.co/faq",
    },
    openGraph: {
      title: metaContent?.og_title || "FAQs - Sunbrix Home Construction",
      description:
        metaContent?.og_description ||
        "Get answers to frequently asked questions about Sunbrix home construction services, processes, materials, and warranties.",
      images: [{ url: metaContent?.og_image || "/images/og-image.jpg" }],
      url: "https://sunbrix.co/faq",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaContent?.twitter_title || "FAQs - Sunbrix Home Construction",
      description:
        metaContent?.twitter_description ||
        "Get answers to frequently asked questions about Sunbrix home construction services, processes, materials, and warranties.",
      images: [metaContent?.twitter_image || "/images/twitter-image.jpg"],
    },
  };
}

export default async function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if faqs page is enabled
  const pageEnabled = await isPageEnabled("faqs");

  if (!pageEnabled) {
    notFound();
  }

  return <>{children}</>;
}
