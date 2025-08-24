import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch main page content for the frontend (gallery with quotes only)
export async function GET() {
  try {
    const [demoVideoContent, galleryImages] = await Promise.all([
      prisma.pageContent.findUnique({
        where: { 
          page_type_section_type: { page_type: "main", section_type: "demo_video" },
        },
        select: {
          demo_video_url: true
        }
      }),
      prisma.galleryImage.findMany({
        where: { active: true },
        orderBy: [{ order_index: 'asc' }, { created_at: 'desc' }],
        select: {
          id: true,
          image_url: true,
          quote: true,
          order_index: true
        }
      })
    ]);

    // Transform the data to match expected frontend format
    const response = {
      demoVideoUrl: demoVideoContent?.demo_video_url || "/videos/video_demo.mp4",
      galleryImages: galleryImages.map(image => ({
        id: image.id,
        image: image.image_url,
        image_url: image.image_url, // Keep both for compatibility
        quote: image.quote,
        order_index: image.order_index
      }))
    };

    // Set cache headers for better performance
    const headers = {
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=60', // 5 minutes cache
    };

    return NextResponse.json(response, { headers });
  } catch (error) {
    console.error('Error fetching main page content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch main page content' },
      { status: 500 }
    );
  }
}