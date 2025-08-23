import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch main page content for the frontend (simplified)
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
        orderBy: [{ featured: 'desc' }, { order_index: 'asc' }, { created_at: 'desc' }],
        select: {
          id: true,
          title: true,
          description: true,
          image_url: true,
          thumbnail_url: true,
          alt_text: true,
          category: true,
          project_type: true,
          location: true,
          featured: true
        }
      })
    ]);

    // Transform the data to match expected frontend format
    const response = {
      demoVideoUrl: demoVideoContent?.demo_video_url || "/videos/video_demo.mp4",
      galleryImages: galleryImages.map(image => ({
        id: image.id,
        title: image.title,
        description: image.description,
        image: image.image_url,
        thumbnail: image.thumbnail_url || image.image_url,
        alt: image.alt_text || image.title,
        category: image.category,
        projectType: image.project_type,
        location: image.location,
        featured: image.featured
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