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

    // Get all active cities with their packages
    const cities = await prisma.city.findMany({
      where,
      include: {
        packages: {
          where: { active: true },
          include: {
            sections: {
              where: { active: true },
              orderBy: { order: "asc" },
              include: {
                items: {
                  where: { active: true },
                  orderBy: { order: "asc" },
                },
              },
            },
          },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
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

    // Fallback to static data if database fails
    try {
      const citiesData = await import("@/data/cities.json");
      return NextResponse.json(citiesData.default, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    } catch (fallbackError) {
      console.error("Fallback data also failed:", fallbackError);
      return NextResponse.json(
        { error: "Failed to fetch cities" },
        { status: 500 }
      );
    }
  }
}
