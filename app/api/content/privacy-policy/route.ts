import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [privacyContent, privacyHeading, privacyMeta] = await Promise.all([
      prisma.pageContent.findUnique({
        where: {
          page_type_section_type: {
            page_type: "legal",
            section_type: "privacy_policy",
          },
        },
      }),
      prisma.pageContent.findUnique({
        where: {
          page_type_section_type: {
            page_type: "privacy-policy",
            section_type: "hero_heading",
          },
        },
      }),
      prisma.pageContent.findUnique({
        where: {
          page_type_section_type: {
            page_type: "privacy-policy",
            section_type: "meta",
          },
        },
      }),
    ]);

    // If no content in page_content, check company_settings for migration
    let content = privacyContent?.description || "";
    if (!content) {
      const companySettings = await prisma.companySettings.findFirst();
      if (companySettings?.privacy_policy) {
        const migrated = await prisma.pageContent.upsert({
          where: {
            page_type_section_type: {
              page_type: "legal",
              section_type: "privacy_policy",
            },
          },
          update: {
            description: companySettings.privacy_policy,
          },
          create: {
            page_type: "legal",
            section_type: "privacy_policy",
            description: companySettings.privacy_policy,
          },
        });
        content = migrated.description || "";
      }
    }

    return NextResponse.json({
      content,
      heroHeading: privacyHeading?.title || "Privacy Policy",
      metaContent: privacyMeta ? {
        meta_title: privacyMeta.meta_title || "Privacy Policy - Sunbrix Home Construction",
        meta_description: privacyMeta.meta_description || "Read our privacy policy to understand how Sunbrix collects, uses, and protects your personal information.",
        meta_keywords: privacyMeta.meta_keywords || "sunbrix privacy policy, data protection, privacy information",
        og_title: privacyMeta.og_title || "Privacy Policy - Sunbrix Home Construction",
        og_description: privacyMeta.og_description || "Read our privacy policy to understand how Sunbrix collects, uses, and protects your personal information.",
        og_image: privacyMeta.og_image || "/images/og-image.jpg",
        twitter_title: privacyMeta.twitter_title || "Privacy Policy - Sunbrix Home Construction",
        twitter_description: privacyMeta.twitter_description || "Read our privacy policy to understand how Sunbrix collects, uses, and protects your personal information.",
        twitter_image: privacyMeta.twitter_image || "/images/twitter-image.jpg",
      } : undefined,
    });
  } catch (error) {
    console.error("Error fetching privacy policy:", error);
    return NextResponse.json(
      { error: "Failed to fetch privacy policy" },
      { status: 500 }
    );
  }
}

