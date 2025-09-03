import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch FAQs for frontend
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category'); // filter by category name

    const where: {
      active: boolean;
      category?: { name: string; active: boolean };
    } = {
      active: true,
    };

    if (category && category !== 'All') {
      where.category = {
        name: category,
        active: true,
      };
    }

    // Temporary fix: Use raw query to handle null category_id values
    // until database schema is properly updated
    const faqs = await prisma.$queryRaw`
      SELECT id, question, answer, category_id, order_index, active, created_at, updated_at
      FROM faqs 
      WHERE active = true
      ORDER BY order_index ASC, created_at DESC
    `;

    // Transform data for frontend - simplified without category for now
    const transformedFaqs = (faqs as any[]).map((faq: any) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      order_index: faq.order_index,
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