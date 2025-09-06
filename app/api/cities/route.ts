import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // Always fetch fresh data from database

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");

    // Build query conditions
    const where: Record<string, unknown> = {};

    if (active !== null) {
      where.active = active === "true";
    }

    // Get all active cities (basic info only)
    const cities = await prisma.city.findMany({
      where,
      select: {
        id: true,
        name: true,
        display_order: true,
        active: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: { display_order: "asc" },
    });

    return NextResponse.json(cities, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json(
      { error: "Failed to fetch cities" },
      { status: 500 }
    );
  }
}
