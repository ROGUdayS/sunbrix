import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch testimonials for the frontend
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const where: any = { active: true };
    if (featured === 'true') where.featured = true;

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { order_index: 'asc' },
        { created_at: 'desc' }
      ],
      take: limit,
      select: {
        id: true,
        customer_name: true,
        customer_role: true,
        company: true,
        rating: true,
        testimonial_text: true,
        project_type: true,
        customer_image: true,
        video_url: true,
        video_thumbnail: true,
        featured: true
      }
    });

    // Transform data to match expected frontend format
    const transformedTestimonials = testimonials.map((testimonial, index) => ({
      id: index + 1, // Keep numeric IDs for compatibility
      originalId: testimonial.id,
      name: testimonial.customer_name,
      role: testimonial.customer_role,
      company: testimonial.company,
      rating: testimonial.rating,
      quote: testimonial.testimonial_text,
      testimonial: testimonial.testimonial_text, // Alternative field name
      projectType: testimonial.project_type,
      image: testimonial.customer_image,
      videoUrl: testimonial.video_url,
      videoThumbnail: testimonial.video_thumbnail,
      featured: testimonial.featured
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