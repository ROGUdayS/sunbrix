import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [termsContent, termsHeading, termsMeta] = await Promise.all([
      prisma.pageContent.findUnique({
        where: {
          page_type_section_type: {
            page_type: "legal",
            section_type: "terms_conditions",
          },
        },
      }),
      prisma.pageContent.findUnique({
        where: {
          page_type_section_type: {
            page_type: "terms-conditions",
            section_type: "hero_heading",
          },
        },
      }),
      prisma.pageContent.findUnique({
        where: {
          page_type_section_type: {
            page_type: "terms-conditions",
            section_type: "meta",
          },
        },
      }),
    ]);

    // If no content in page_content, check company_settings for migration
    let content = termsContent?.description || "";
    if (!content) {
      const companySettings = await prisma.companySettings.findFirst();
      if (companySettings?.terms_conditions) {
        const migrated = await prisma.pageContent.upsert({
          where: {
            page_type_section_type: {
              page_type: "legal",
              section_type: "terms_conditions",
            },
          },
          update: {
            description: companySettings.terms_conditions,
          },
          create: {
            page_type: "legal",
            section_type: "terms_conditions",
            description: companySettings.terms_conditions,
          },
        });
        content = migrated.description || "";
      }
    }

    return NextResponse.json({
      content,
      heroHeading: termsHeading?.title || "Terms & Conditions",
      metaContent: termsMeta ? {
        meta_title: termsMeta.meta_title || "Terms & Conditions - Sunbrix Home Construction",
        meta_description: termsMeta.meta_description || "Read our terms and conditions to understand the rules and regulations for using the Sunbrix website and services.",
        meta_keywords: termsMeta.meta_keywords || "sunbrix terms, terms and conditions, legal terms, service terms",
        og_title: termsMeta.og_title || "Terms & Conditions - Sunbrix Home Construction",
        og_description: termsMeta.og_description || "Read our terms and conditions to understand the rules and regulations for using the Sunbrix website and services.",
        og_image: termsMeta.og_image || "/images/og-image.jpg",
        twitter_title: termsMeta.twitter_title || "Terms & Conditions - Sunbrix Home Construction",
        twitter_description: termsMeta.twitter_description || "Read our terms and conditions to understand the rules and regulations for using the Sunbrix website and services.",
        twitter_image: termsMeta.twitter_image || "/images/twitter-image.jpg",
      } : undefined,
    });
  } catch (error) {
    console.error("Error fetching terms & conditions:", error);
    return NextResponse.json(
      { error: "Failed to fetch terms & conditions" },
      { status: 500 }
    );
  }
}

