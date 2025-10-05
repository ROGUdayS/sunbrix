import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Disable caching completely to ensure fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Fetch company settings from database
    const settings = await prisma.companySettings.findFirst();

    // If no settings found, return default fallback data
    if (!settings) {
      const fallbackSettings = {
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
      };

      return NextResponse.json(
        {
          success: true,
          settings: fallbackSettings,
          _debug: {
            timestamp: new Date().toISOString(),
            source: "fallback",
            message: "No settings found in database, using defaults",
          },
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
            "Cache-Tag": "company-settings",
          },
        }
      );
    }

    // Transform and clean the data for frontend consumption
    const cleanSettings = {
      company_name: settings.company_name,
      contact_email: settings.contact_email,
      contact_phone: settings.contact_phone,
      show_facebook: settings.show_facebook,
      facebook_url: settings.facebook_url,
      show_instagram: settings.show_instagram,
      instagram_url: settings.instagram_url,
      show_google: settings.show_google,
      google_url: settings.google_url,
      show_youtube: settings.show_youtube,
      youtube_url: settings.youtube_url,
      terms_conditions: settings.terms_conditions,
      privacy_policy: settings.privacy_policy,
    };

    return NextResponse.json(
      {
        success: true,
        settings: cleanSettings,
        _debug: {
          timestamp: new Date().toISOString(),
          source: "database",
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
  } catch (error) {
    console.error("[LANDER] Error fetching company settings:", error);

    // Fallback to hardcoded defaults if database fails
    const fallbackSettings = {
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
    };

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
