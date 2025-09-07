import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch main page content for the frontend
export async function GET() {
  try {
    const [
      demoVideoContent,
      galleryImages,
      heroStats,
      commitmentSection,
      gallerySection,
      packagesSection,
      testimonialsSection,
      metaContent,
    ] = await Promise.all([
      prisma.pageContent.findUnique({
        where: {
          page_type_section_type: {
            page_type: "main",
            section_type: "demo_video",
          },
        },
      }),
      prisma.galleryImage.findMany({
        where: { active: true },
        orderBy: [{ order_index: "asc" }, { created_at: "desc" }],
        select: {
          id: true,
          image_url: true,
          quote: true,
          order_index: true,
        },
      }),
      prisma.pageContent.findUnique({
        where: {
          page_type_section_type: {
            page_type: "main",
            section_type: "hero_stats",
          },
        },
      }),
      prisma.pageContent.findUnique({
        where: {
          page_type_section_type: {
            page_type: "main",
            section_type: "commitment_quality",
          },
        },
      }),
      prisma.pageContent.findUnique({
        where: {
          page_type_section_type: {
            page_type: "main",
            section_type: "gallery",
          },
        },
      }),
      prisma.pageContent.findUnique({
        where: {
          page_type_section_type: {
            page_type: "main",
            section_type: "packages",
          },
        },
      }),
      prisma.pageContent.findUnique({
        where: {
          page_type_section_type: {
            page_type: "main",
            section_type: "testimonials",
          },
        },
      }),
      prisma.pageContent.findUnique({
        where: {
          page_type_section_type: {
            page_type: "main",
            section_type: "meta",
          },
        },
      }),
    ]);

    // Transform the data to match expected frontend format
    const response = {
      demoVideoUrl:
        demoVideoContent?.demo_video_url || "/videos/video_demo.mp4",
      galleryImages: galleryImages.map((image) => ({
        id: image.id,
        image: image.image_url,
        image_url: image.image_url, // Keep both for compatibility
        quote: image.quote,
        order_index: image.order_index,
      })),
      heroStats: heroStats?.content_data || [
        { value: "25", label: "Years" },
        { value: "100+", label: "Homes" },
        { value: "100%", label: "Transparent" },
        { value: "100%", label: "On-Time" },
      ],
      commitmentSection: {
        title: commitmentSection?.title || "Our Commitment to Quality",
        description:
          commitmentSection?.description ||
          "At Sunbrix, quality isn't a feature, it's the foundation of everything we do. For over 20 years, we've crafted homes that last and function with purpose, building each one with care in every corner and meaning in every brick laid.",
        features: commitmentSection?.content_data || [
          {
            icon: "/icons/commitment-to-quality/Design & Strength.svg",
            title: "Design & Strength",
            description:
              "At Sunbrix, we build and designs, using time tested practices.",
          },
          {
            icon: "/icons/commitment-to-quality/20 Year Warranty.svg",
            title: "20 year warranty",
            description:
              "At Sunbrix, we proudly offer a 20 year warranty on our homes.",
          },
          {
            icon: "/icons/commitment-to-quality/On time Delivery.svg",
            title: "100% On time delivery",
            description:
              "The past 20 years, Sunbrix has never delayed a single project.",
          },
          {
            icon: "/icons/commitment-to-quality/High quality materials.svg",
            title: "High quality materials",
            description:
              "At Sunbrix, Using the best quality materials is simply the norm.",
          },
        ],
      },
      gallerySection: {
        title: gallerySection?.title || "Gallery",
      },
      packagesSection: {
        title: packagesSection?.title || "Packages",
      },
      testimonialsSection: {
        title: testimonialsSection?.title || "Testimonials",
        subtitle:
          testimonialsSection?.subtitle ||
          "See what our customers have to say.",
      },
      metaContent: {
        meta_title:
          metaContent?.meta_title ||
          "Sunbrix - Premium Home Construction Services",
        meta_description:
          metaContent?.meta_description ||
          "Transform your dream home into reality with Sunbrix. Premium construction services, transparent pricing, and 20-year warranty. Get your free quote today!",
        meta_keywords:
          metaContent?.meta_keywords ||
          "home construction, building contractors, house builders, construction services, premium homes",
        og_title:
          metaContent?.og_title ||
          "Sunbrix - Premium Home Construction Services",
        og_description:
          metaContent?.og_description ||
          "Transform your dream home into reality with Sunbrix. Premium construction services, transparent pricing, and 20-year warranty.",
        og_image: metaContent?.og_image || "/images/og-image.jpg",
        twitter_title:
          metaContent?.twitter_title ||
          "Sunbrix - Premium Home Construction Services",
        twitter_description:
          metaContent?.twitter_description ||
          "Transform your dream home into reality with Sunbrix. Premium construction services, transparent pricing, and 20-year warranty.",
        twitter_image:
          metaContent?.twitter_image || "/images/twitter-image.jpg",
      },
    };

    // Set cache headers for better performance
    const headers = {
      "Cache-Control": "no-cache, no-store, must-revalidate", // Disable caching for development
    };

    return NextResponse.json(response, { headers });
  } catch (error) {
    console.error("Error fetching main page content:", error);
    return NextResponse.json(
      { error: "Failed to fetch main page content" },
      { status: 500 }
    );
  }
}
