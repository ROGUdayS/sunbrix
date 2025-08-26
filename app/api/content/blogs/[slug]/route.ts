import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch individual blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const blogPost = await prisma.blogPost.findFirst({
      where: {
        slug: slug,
        active: true,
        status: 'published', // Only show published posts on frontend
      },
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
    });

    if (!blogPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Transform data for frontend
    const transformedPost = {
      id: blogPost.id,
      title: blogPost.title,
      slug: blogPost.slug,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      author: blogPost.author,
      date: blogPost.publish_date.toISOString().split('T')[0],
      image: blogPost.featured_image || "/images/blog-placeholder.jpg",
      tags: blogPost.tags,
      category: blogPost.category.name,
      categorySlug: blogPost.category.slug,
      categoryColor: blogPost.category.color,
      readingTime: blogPost.reading_time,
      featured: blogPost.featured,
      metaTitle: blogPost.meta_title,
      metaDescription: blogPost.meta_description,
    };

    return NextResponse.json(transformedPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}