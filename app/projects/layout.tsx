import type { Metadata } from "next";
import { isPageEnabled } from "@/lib/data-provider";
import { notFound } from "next/navigation";

// Helper function to fetch projects metadata
async function getProjectsMetadata() {
  try {
    const USE_API_DATA = process.env.NEXT_PUBLIC_USE_API_DATA === "true";

    if (USE_API_DATA) {
      // Fetch from API
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
        }/api/content/projects`,
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
        "public/data/projects-content.json"
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
    console.error("Error fetching projects metadata:", error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const metaContent = await getProjectsMetadata();

  return {
    title: metaContent?.meta_title || "Our Projects - Sunbrix Home Construction",
    description:
      metaContent?.meta_description ||
      "Explore our portfolio of beautifully constructed homes. View completed projects, designs, and see the quality craftsmanship that defines Sunbrix.",
    keywords:
      metaContent?.meta_keywords ||
      "sunbrix projects, home construction projects, completed homes, construction portfolio, home gallery",
    alternates: {
      canonical: "https://sunbrix.co/projects",
    },
    openGraph: {
      title: metaContent?.og_title || "Our Projects - Sunbrix Home Construction",
      description:
        metaContent?.og_description ||
        "Explore our portfolio of beautifully constructed homes. View completed projects, designs, and see the quality craftsmanship that defines Sunbrix.",
      images: [{ url: metaContent?.og_image || "/images/og-image.jpg" }],
      url: "https://sunbrix.co/projects",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaContent?.twitter_title || "Our Projects - Sunbrix Home Construction",
      description:
        metaContent?.twitter_description ||
        "Explore our portfolio of beautifully constructed homes. View completed projects, designs, and see the quality craftsmanship that defines Sunbrix.",
      images: [metaContent?.twitter_image || "/images/twitter-image.jpg"],
    },
  };
}

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if projects page is enabled
  const pageEnabled = await isPageEnabled("projects");

  if (!pageEnabled) {
    notFound();
  }

  return <>{children}</>;
}

