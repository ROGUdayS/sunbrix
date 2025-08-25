import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Enable caching for better performance
export const revalidate = 300; // Cache for 5 minutes

export async function GET(request: NextRequest) {
  try {
    const timestamp = new Date().toISOString();
    console.log(`[LANDER] 🔄 Fetching packages at ${timestamp}`);

    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");

    // Build query conditions
    const where: Record<string, unknown> = {};

    if (active !== null) {
      where.active = active === "true";
    }

    // Get all active cities with their packages
    console.log(`[LANDER] 📊 Querying database for cities and packages...`);
    const cities = await prisma.city.findMany({
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
    });

    console.log(`[LANDER] 📈 Found ${cities.length} cities with packages`);
    cities.forEach((city) => {
      console.log(
        `[LANDER]   - ${city.name}: ${city.packages.length} packages`
      );
      city.packages.forEach((pkg) => {
        console.log(
          `[LANDER]     - ${pkg.name}: ${
            pkg.sections.length
          } sections, JSON data: ${!!pkg.package_data}`
        );
      });
    });

    // Transform data to match the expected frontend format
    const packages: Record<string, Record<string, unknown>> = {};

    // Process each city's packages
    cities.forEach((city) => {
      city.packages.forEach((pkg) => {
        const packageKey = pkg.name.toLowerCase();

        // Check if we have JSON data, if so use it as the base
        if (pkg.package_data && typeof pkg.package_data === "object") {
          const jsonData = pkg.package_data as Record<string, unknown>;
          console.log(`[LANDER] 📦 Processing ${packageKey} with JSON data:`, {
            hasTitle: !!jsonData.title,
            hasPricing: !!jsonData.pricing,
            hasSections: !!jsonData.sections,
            sectionsCount: jsonData.sections
              ? Object.keys(jsonData.sections as Record<string, unknown>).length
              : 0,
          });

          // Initialize package if it doesn't exist
          if (!packages[packageKey]) {
            packages[packageKey] = {
              title: jsonData.title || pkg.name,
              popular: jsonData.popular || false,
              pricing: {},
              sections: jsonData.sections || {},
              updated_at: pkg.updated_at,
            };
          }

          // Add pricing for this city from JSON data
          if (
            jsonData.pricing &&
            (jsonData.pricing as Record<string, unknown>)[city.id]
          ) {
            (packages[packageKey].pricing as Record<string, unknown>)[city.id] =
              (jsonData.pricing as Record<string, unknown>)[city.id];
            console.log(
              `[LANDER] 💰 Used JSON pricing for ${packageKey}:`,
              (jsonData.pricing as Record<string, unknown>)[city.id]
            );
          } else {
            // Fallback to calculated pricing
            const fallbackPricing = {
              price: `₹ ${Number(pkg.price).toLocaleString()}`,
              startingAt: false,
            };
            (packages[packageKey].pricing as Record<string, unknown>)[city.id] =
              fallbackPricing;
            console.log(
              `[LANDER] 💰 Used fallback pricing for ${packageKey}:`,
              fallbackPricing
            );
          }

          // Use sections from JSON data if available
          if (jsonData.sections) {
            // Instead of overwriting, merge sections intelligently
            // Priority: Use the sections from the package with more recent updates
            const currentSections = packages[packageKey].sections as Record<
              string,
              unknown
            >;
            const newSections = jsonData.sections;

            // If no existing sections, use new ones directly
            if (!currentSections || Object.keys(currentSections).length === 0) {
              packages[packageKey].sections = newSections;
              console.log(
                `[LANDER] 📋 Initial sections for ${packageKey} from ${city.name}:`,
                Object.keys(newSections)
              );
            } else {
              // Compare update timestamps or merge based on city priority
              // For now, prioritize the package with more recent update_at
              const existingPackage = packages[packageKey];
              if (
                pkg.updated_at >
                ((existingPackage.updated_at as Date) || new Date(0))
              ) {
                packages[packageKey].sections = newSections;
                packages[packageKey].updated_at = pkg.updated_at;
                console.log(
                  `[LANDER] 📋 Updated sections for ${packageKey} from ${city.name} (more recent):`,
                  Object.keys(newSections)
                );
              } else {
                console.log(
                  `[LANDER] 📋 Keeping existing sections for ${packageKey} (current is more recent than ${city.name})`
                );
              }
            }
          } else {
            console.log(
              `[LANDER] ⚠️  No sections in JSON data for ${packageKey} from ${city.name}`
            );
          }
        } else {
          // Fallback to relational data transformation (backward compatibility)
          // Initialize package if it doesn't exist
          if (!packages[packageKey]) {
            packages[packageKey] = {
              title: pkg.name,
              popular: false,
              pricing: {},
              sections: {},
              updated_at: pkg.updated_at,
            };
          }

          // Add pricing for this city
          (packages[packageKey].pricing as Record<string, unknown>)[city.id] = {
            price: `₹ ${Number(pkg.price).toLocaleString()}`,
            startingAt: false,
          };

          // Add sections and items for this package from relational data
          pkg.sections.forEach((section) => {
            const sectionKey = section.title.toLowerCase().replace(/\s+/g, "-");

            // Only add section if it doesn't exist or if this package has items for it
            if (
              !(packages[packageKey].sections as Record<string, unknown>)[
                sectionKey
              ] ||
              section.items.length > 0
            ) {
              (packages[packageKey].sections as Record<string, unknown>)[
                sectionKey
              ] = {
                title: section.title,
                items: section.items.map((item) => item.content),
              };
            }
          });
        }
      });
    });

    // Log final package summary
    const finalPackageKeys = Object.keys(packages);
    console.log(`[LANDER] 🎯 Final packages summary:`);
    finalPackageKeys.forEach((key) => {
      const pkg = packages[key];
      const sectionsCount = pkg.sections
        ? Object.keys(pkg.sections as Record<string, unknown>).length
        : 0;
      console.log(`[LANDER]   - ${key}: ${sectionsCount} sections`);
    });

    // Clean up packages object - remove internal fields before returning
    const cleanPackages: Record<string, Record<string, unknown>> = {};
    finalPackageKeys.forEach((key) => {
      const { ...cleanPackage } = packages[key];
      cleanPackages[key] = cleanPackage;
    });

    const responseData = {
      packages: {
        construction: cleanPackages,
      },
      _debug: {
        timestamp: new Date().toISOString(),
        totalPackages: finalPackageKeys.length,
        packagesWithSections: finalPackageKeys.filter((key) => {
          const sectionsCount = cleanPackages[key].sections
            ? Object.keys(
                cleanPackages[key].sections as Record<string, unknown>
              ).length
            : 0;
          return sectionsCount > 0;
        }).length,
      },
    };

    // Return in the expected frontend format
    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "Cache-Tag": "packages",
      },
    });
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
