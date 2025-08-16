import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 300; // Revalidate every 5 minutes
export const fetchCache = "force-cache";

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
    const cities = (await prisma.city.findMany({
      where: { active: true },
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
    })) as any[];

    // Transform data to match the expected frontend format
    const packages: Record<string, Record<string, unknown>> = {};

    // First, collect all unique sections from all packages to ensure consistency
    const allSections = new Set<string>();
    cities.forEach((city: any) => {
      city.packages.forEach((pkg: any) => {
        pkg.sections.forEach((section: any) => {
          allSections.add(section.title);
        });
      });
    });

    cities.forEach((city: any) => {
      city.packages.forEach((pkg: any) => {
        const packageKey = pkg.name.toLowerCase();

        // Initialize package if it doesn't exist
        if (!packages[packageKey]) {
          packages[packageKey] = {
            title: pkg.name,
            popular: false,
            pricing: {},
            sections: {},
          };

          // Initialize all sections for this package
          allSections.forEach((sectionTitle) => {
            const sectionKey = sectionTitle.toLowerCase().replace(/\s+/g, "-");
            packages[packageKey].sections[sectionKey] = {
              title: sectionTitle,
              items: [],
            };
          });
        }

        // Add pricing for this city
        packages[packageKey].pricing[city.id] = {
          price: `₹ ${pkg.price.toLocaleString()}`,
          startingAt: false,
        };

        // Add items to sections for this package
        pkg.sections.forEach((section: any) => {
          const sectionKey = section.title.toLowerCase().replace(/\s+/g, "-");
          if (packages[packageKey].sections[sectionKey]) {
            packages[packageKey].sections[sectionKey].items = section.items.map(
              (item: any) => item.content
            );
          }
        });
      });
    });

    // Return in the expected frontend format
    return NextResponse.json(
      {
        packages: {
          construction: packages,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          "Cache-Tag": "packages",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching packages:", error);

    // Fallback to static data if database fails
    try {
      const packagesData = await import("@/data/packages.json");
      return NextResponse.json(packagesData.default, {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          "Cache-Tag": "packages",
        },
      });
    } catch (fallbackError) {
      console.error("Fallback data also failed:", fallbackError);
      return NextResponse.json(
        { packages: { construction: {} } },
        { status: 500 }
      );
    }
  }
}
