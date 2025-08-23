import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch FAQ categories for frontend
export async function GET() {
  try {
    const categories = await prisma.faqCategory.findMany({
      where: { active: true },
      include: {
        _count: {
          select: { 
            faqs: { 
              where: { active: true } 
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
      description: category.description,
      faqCount: category._count.faqs,
    }));

    return NextResponse.json(transformedCategories);
  } catch (error) {
    console.error('Error fetching FAQ categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQ categories' },
      { status: 500 }
    );
  }
}