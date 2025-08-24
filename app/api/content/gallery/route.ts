import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch simplified gallery images (image + quote only) for the frontend
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const where = { active: true };

    const galleryImages = await prisma.galleryImage.findMany({
      where,
      orderBy: [
        { order_index: 'asc' },
        { created_at: 'desc' }
      ],
      take: limit,
      select: {
        id: true,
        image_url: true,
        quote: true,
        order_index: true
      }
    });

    // Transform data to match expected frontend format
    const transformedImages = galleryImages.map(image => ({
      id: image.id,
      image: image.image_url,
      image_url: image.image_url, // Keep both for compatibility
      quote: image.quote,
      order_index: image.order_index
    }));

    // Set cache headers for better performance
    const headers = {
      'Cache-Control': 'public, max-age=600, stale-while-revalidate=120', // 10 minutes cache
    };

    return NextResponse.json(transformedImages, { headers });
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}