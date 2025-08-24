import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch blog categories for frontend
export async function GET() {
  try {
    const categories = await prisma.blogCategory.findMany({
      where: { active: true },
      include: {
        _count: {
          select: { 
            blog_posts: { 
              where: { 
                active: true, 
                status: 'published' 
              } 
            } 
          },
        },
      },
      orderBy: [
        { order_index: 'asc' },
        { created_at: 'desc' },
      ],
    });

    // Transform data for frontend
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      postCount: category._count.blog_posts,
    }));

    return NextResponse.json(transformedCategories);
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog categories' },
      { status: 500 }
    );
  }
}