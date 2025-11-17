import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Disable caching completely to ensure fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Default fallback settings
const getFallbackSettings = () => ({
  company_name: "SUNBRIX Constructions",
  contact_email: "sunbrix.co@gmail.com",
  contact_phone: "+91 8867920940",
  show_facebook: false,
  facebook_url: null,
  show_instagram: false,
  instagram_url: null,
  show_google: false,
  google_url: null,
  show_youtube: false,
  youtube_url: null,
  terms_conditions: null,
  privacy_policy: null,
});

export async function GET() {
  try {
    // Check if we should use API data or static files
    const useApiData = process.env.NEXT_PUBLIC_USE_API_DATA === "true";

    if (useApiData) {
      // Fetch from dashboard API
      const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL;
      if (!dashboardUrl) {
        console.error("[LANDER] NEXT_PUBLIC_DASHBOARD_URL not configured");
        throw new Error("Dashboard URL not configured");
      }

      // Create AbortController for timeout (15 seconds for production)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const response = await fetch(`${dashboardUrl}/api/company-settings`, {
          signal: controller.signal,
          cache: "no-store", // Always fetch fresh data
          headers: {
            "Content-Type": "application/json",
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(
            `Dashboard API responded with status: ${response.status}`
          );
        }

        const data = await response.json();

        // Handle both response formats: { success: true, settings: {...} } or direct settings
        const settings = data.settings || data;

        // Transform and clean the data for frontend consumption
        const cleanSettings = {
          company_name: settings.company_name || getFallbackSettings().company_name,
          contact_email: settings.contact_email || getFallbackSettings().contact_email,
          contact_phone: settings.contact_phone || getFallbackSettings().contact_phone,
          show_facebook: settings.show_facebook ?? false,
          facebook_url: settings.facebook_url || null,
          show_instagram: settings.show_instagram ?? false,
          instagram_url: settings.instagram_url || null,
          show_google: settings.show_google ?? false,
          google_url: settings.google_url || null,
          show_youtube: settings.show_youtube ?? false,
          youtube_url: settings.youtube_url || null,
          terms_conditions: settings.terms_conditions || null,
          privacy_policy: settings.privacy_policy || null,
        };

        return NextResponse.json(
          {
            success: true,
            settings: cleanSettings,
            _debug: {
              timestamp: new Date().toISOString(),
              source: "dashboard_api",
              updated_at: settings.updated_at,
            },
          },
          {
            headers: {
              "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
              "Cache-Tag": "company-settings",
            },
          }
        );
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        // If it's a timeout error, log it specifically
        if (fetchError.name === "AbortError") {
          console.error("[LANDER] Timeout fetching company settings from dashboard API (15s)");
          throw new Error("Request timeout: Dashboard API did not respond in time");
        }
        throw fetchError;
      }
    } else {
      // Load from static JSON file
      const filePath = path.join(
        process.cwd(),
        "public",
        "data",
        "company-settings.json"
      );
      
      try {
        const fileContents = await fs.readFile(filePath, "utf8");
        const data = JSON.parse(fileContents);
        
        // Handle both direct settings object and wrapped format
        const settings = data.settings || data;

        return NextResponse.json(
          {
            success: true,
            settings: settings,
            _debug: {
              timestamp: new Date().toISOString(),
              source: "static_file",
            },
          },
          {
            headers: {
              "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
              "Cache-Tag": "company-settings",
            },
          }
        );
      } catch (fileError) {
        console.error("[LANDER] Error reading static company settings file:", fileError);
        // Fall through to fallback
      }
    }
  } catch (error) {
    console.error("[LANDER] Error fetching company settings:", error);

    // Fallback to hardcoded defaults if everything fails
    const fallbackSettings = getFallbackSettings();

    return NextResponse.json(
      {
        success: true,
        settings: fallbackSettings,
        _debug: {
          timestamp: new Date().toISOString(),
          source: "error_fallback",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      },
      {
        status: 200, // Still return 200 with fallback data
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300", // Shorter cache on error
          "Cache-Tag": "company-settings",
        },
      }
    );
  }
}
