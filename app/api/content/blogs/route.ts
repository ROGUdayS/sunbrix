import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch published blogs for frontend (simplified)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // filter by category slug
    const featured = searchParams.get('featured'); // filter featured posts
    const limit = searchParams.get('limit'); // limit results

    const where: any = {
      active: true,
      status: 'published', // Only show published posts on frontend
    };

    if (category && category !== 'all') {
      where.category = {
        slug: category,
        active: true,
      };
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const blogPosts = await prisma.blogPost.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { order_index: 'asc' },
        { publish_date: 'desc' },
      ],
      take: limit ? parseInt(limit) : undefined,
    });

    // Transform data for frontend
    const transformedPosts = blogPosts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      author: post.author,
      date: post.publish_date.toISOString().split('T')[0],
      image: post.featured_image || "/images/blog-placeholder.jpg",
      tags: post.tags,
      category: post.category.name,
      categorySlug: post.category.slug,
      categoryColor: post.category.color,
      readingTime: post.reading_time,
      featured: post.featured,
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}