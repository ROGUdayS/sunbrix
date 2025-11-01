import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [heroHeadingContent, metaContent] = await Promise.all([
      prisma.pageContent.findUnique({
        where: {
          page_type_section_type: {
            page_type: "projects",
            section_type: "hero_heading",
          },
        },
      }),
      prisma.pageContent.findUnique({
        where: {
          page_type_section_type: {
            page_type: "projects",
            section_type: "meta",
          },
        },
      }),
    ]);

    return NextResponse.json({
      heroHeading: heroHeadingContent?.title || "",
      metaContent: metaContent
        ? {
            meta_title: metaContent.meta_title || "Our Projects - Sunbrix Home Construction",
            meta_description:
              metaContent.meta_description ||
              "Explore our portfolio of beautifully constructed homes. View completed projects, designs, and see the quality craftsmanship that defines Sunbrix.",
            meta_keywords:
              metaContent.meta_keywords ||
              "sunbrix projects, home construction projects, completed homes, construction portfolio, home gallery",
            og_title: metaContent.og_title || "Our Projects - Sunbrix Home Construction",
            og_description:
              metaContent.og_description ||
              "Explore our portfolio of beautifully constructed homes. View completed projects, designs, and see the quality craftsmanship that defines Sunbrix.",
            og_image: metaContent.og_image || "/images/og-image.jpg",
            twitter_title: metaContent.twitter_title || "Our Projects - Sunbrix Home Construction",
            twitter_description:
              metaContent.twitter_description ||
              "Explore our portfolio of beautifully constructed homes. View completed projects, designs, and see the quality craftsmanship that defines Sunbrix.",
            twitter_image: metaContent.twitter_image || "/images/twitter-image.jpg",
          }
        : undefined,
    });
  } catch (error) {
    console.error("Error fetching projects page content:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects page content" },
      { status: 500 }
    );
  }
}

