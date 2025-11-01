import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch testimonials page content (hero heading, metadata, etc.)
export async function GET() {
  try {
    const heroHeadingContent = await prisma.pageContent.findUnique({
      where: {
        page_type_section_type: {
          page_type: "testimonials",
          section_type: "hero_heading",
        },
      },
    });

    return NextResponse.json({
      heroHeading: heroHeadingContent?.title || "",
    });
  } catch (error) {
    console.error('Error fetching testimonials page content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials page content' },
      { status: 500 }
    );
  }
}

