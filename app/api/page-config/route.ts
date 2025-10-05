import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    // Check if we should use API data or static files
    const useApiData = process.env.NEXT_PUBLIC_USE_API_DATA === "true";

    if (useApiData) {
      // Fetch from dashboard API (Supabase)
      const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL;
      if (!dashboardUrl) {
        throw new Error("Dashboard URL not configured");
      }

      const response = await fetch(`${dashboardUrl}/api/page-config`, {
        cache: "no-store", // Always fetch fresh data
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Dashboard API responded with status: ${response.status}`
        );
      }

      const pageConfigs = await response.json();

      return NextResponse.json({
        success: true,
        data: pageConfigs,
        source: "api",
      });
    } else {
      // Load from static JSON file
      const filePath = path.join(
        process.cwd(),
        "public",
        "data",
        "page-config.json"
      );
      const fileContents = await fs.readFile(filePath, "utf8");
      const pageConfigs = JSON.parse(fileContents);

      return NextResponse.json({
        success: true,
        data: pageConfigs,
        source: "static",
      });
    }
  } catch (error) {
    console.error("Error fetching page config:", error);

    // Return default configuration as fallback
    const defaultConfig = [
      { pageId: "main-page", pageName: "Main Page", enabled: true },
      { pageId: "about-us", pageName: "About Us", enabled: true },
      { pageId: "testimonials", pageName: "Testimonials", enabled: true },
      { pageId: "faqs", pageName: "FAQs", enabled: true },
      { pageId: "blogs-articles", pageName: "Blogs & Articles", enabled: true },
    ];

    return NextResponse.json({
      success: true,
      data: defaultConfig,
      source: "fallback",
    });
  }
}
