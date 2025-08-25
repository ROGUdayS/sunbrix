import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Remove force-dynamic to allow Next.js caching
// export const dynamic = "force-dynamic"; 
export const revalidate = 300; // Cache for 5 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const active = searchParams.get("active");

    // Build query conditions
    const where: {
      active?: boolean;
    } = {};

    if (active !== null) {
      where.active = active === "true";
    }

    // Build query options
    const queryOptions: {
      where: { active?: boolean };
      orderBy: { created_at: "desc" };
      take?: number;
    } = {
      where,
      orderBy: { created_at: "desc" },
    };

    if (limit) {
      queryOptions.take = parseInt(limit);
    }

    const projects = await prisma.project.findMany(queryOptions);

    // Transform the data to match the frontend expectations
    const transformedProjects = projects.map((project) => ({
      id: project.id,
      title: project.title,
      location: project.location,
      year: project.year,
      plotSize: project.plot_size,
      facing: project.facing,
      property_type: project.property_type,
      image: project.images?.[0] || "/images/HomeHeroWebImage.webp",
      images: project.images,
      description: project.description,
      specifications: project.specifications,
      active: project.active,
      created_at: project.created_at,
      updated_at: project.updated_at,
    }));

    return NextResponse.json(
      {
        projects: transformedProjects,
        count: transformedProjects.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          "Cache-Tag": "projects",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
