import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch blog page content for frontend
export async function GET() {
  try {
    let pageContent = await prisma.blogPageContent.findFirst({
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
        page_title: "Blogs & Articles",
        page_subtitle: "Discover expert insights, construction tips, and design inspiration to help you build your dream home with confidence.",
        cta_title: "You Dream. We Deliver.",
        cta_description: "Ready to build your dream home? Schedule a free consultation today and begin the journey of turning your dream into reality.",
        cta_button_text: "Book a Meeting",
        cta_button_link: "/contact",
      };
    }

    return NextResponse.json(pageContent);
  } catch (error) {
    console.error('Error fetching blog page content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog page content' },
      { status: 500 }
    );
  }
}