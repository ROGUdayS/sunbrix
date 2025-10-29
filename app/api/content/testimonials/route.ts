import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch testimonials for the frontend
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const where = { active: true };

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [
        { order_index: 'asc' },
        { created_at: 'desc' }
      ],
      take: limit,
      select: {
        id: true,
        customer_name: true,
        testimonial_text: true,
        video_url: true,
        active: true
      }
    });

    // Transform data to match expected frontend format
    const transformedTestimonials = testimonials.map((testimonial, index) => ({
      id: index + 1, // Keep numeric IDs for compatibility
      originalId: testimonial.id,
      name: testimonial.customer_name,
      role: null, // Removed field
      company: null, // Removed field
      rating: 5, // Default rating for compatibility
      quote: testimonial.testimonial_text,
      testimonial: testimonial.testimonial_text, // Alternative field name
      projectType: null, // Removed field
      image: null, // Removed field
      videoUrl: testimonial.video_url || '',
      videoThumbnail: null, // Removed field
      featured: false, // Removed field
      active: testimonial.active
    }));

    // Set cache headers for better performance
    const headers = {
      'Cache-Control': 'public, max-age=600, stale-while-revalidate=120', // 10 minutes cache
    };

    return NextResponse.json(transformedTestimonials, { headers });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}