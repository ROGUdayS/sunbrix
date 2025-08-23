import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch FAQ page content for frontend
export async function GET() {
  try {
    let pageContent = await prisma.faqPageContent.findFirst({
      where: { active: true },
      select: {
        page_title: true,
        page_subtitle: true,
        cta_title: true,
        cta_description: true,
        cta_button_text: true,
        cta_button_link: true,
      },
    });

    // If no content exists, return defaults
    if (!pageContent) {
      pageContent = {
        page_title: "Frequently Asked Questions",
        page_subtitle: "Find answers to common questions about Sunbrix, our construction process, materials, and services.",
        cta_title: "Still Have Questions?",
        cta_description: "Contact us for personalized assistance and detailed information",
        cta_button_text: "Contact Us",
        cta_button_link: "/contact",
      };
    }

    return NextResponse.json(pageContent);
  } catch (error) {
    console.error('Error fetching FAQ page content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQ page content' },
      { status: 500 }
    );
  }
}