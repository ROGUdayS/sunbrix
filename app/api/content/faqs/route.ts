import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch FAQs for frontend
export async function GET(request: NextRequest) {
  try {
    const faqs = await prisma.faq.findMany({
      where: { active: true },
      orderBy: [{ order_index: "asc" }, { created_at: "desc" }],
    });

    // Transform data for frontend
    const transformedFaqs = faqs.map((faq) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      order_index: faq.order_index,
    }));

    return NextResponse.json(transformedFaqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}
