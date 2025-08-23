import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch gallery images for the frontend
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const where: any = { active: true };
    if (category) where.category = category;
    if (featured === 'true') where.featured = true;

    const galleryImages = await prisma.galleryImage.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { order_index: 'asc' },
        { created_at: 'desc' }
      ],
      take: limit,
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
        featured: true,
        order_index: true
      }
    });

    // Transform data to match expected frontend format
    const transformedImages = galleryImages.map(image => ({
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