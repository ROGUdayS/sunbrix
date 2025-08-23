import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch FAQs for frontend
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // filter by category name

    const where: any = {
      active: true,
    };

    if (category && category !== 'All') {
      where.category = {
        name: category,
        active: true,
      };
    }

    const faqs = await prisma.faq.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: [
        { order_index: 'asc' },
        { created_at: 'desc' },
      ],
    });

    // Transform data for frontend
    const transformedFaqs = faqs.map(faq => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category.name,
    }));

    return NextResponse.json(transformedFaqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQs' },
      { status: 500 }
    );
  }
}