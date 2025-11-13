import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Disable caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Helper function to detect device type
function getDeviceType(userAgent: string | null): string {
  if (!userAgent) return "unknown";
  const ua = userAgent.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return "mobile";
  return "desktop";
}

// Helper function to get browser name
function getBrowser(userAgent: string | null): string {
  if (!userAgent) return "unknown";
  const ua = userAgent.toLowerCase();
  if (ua.includes("chrome") && !ua.includes("edg")) return "Chrome";
  if (ua.includes("firefox")) return "Firefox";
  if (ua.includes("safari") && !ua.includes("chrome")) return "Safari";
  if (ua.includes("edg")) return "Edge";
  if (ua.includes("opera") || ua.includes("opr")) return "Opera";
  return "unknown";
}

// Helper function to get OS
function getOS(userAgent: string | null): string {
  if (!userAgent) return "unknown";
  const ua = userAgent.toLowerCase();
  if (ua.includes("windows")) return "Windows";
  if (ua.includes("mac")) return "macOS";
  if (ua.includes("linux")) return "Linux";
  if (ua.includes("android")) return "Android";
  if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad")) return "iOS";
  return "unknown";
}

export async function POST(request: NextRequest) {
  try {
    // Handle both JSON and Blob (from sendBeacon) requests
    let body: any;
    const contentType = request.headers.get("content-type");
    
    if (contentType?.includes("application/json")) {
      body = await request.json();
    } else {
      // Handle Blob from sendBeacon
      const blob = await request.blob();
      const text = await blob.text();
      body = JSON.parse(text);
    }
    
    const {
      event_type,
      page_path,
      page_title,
      referrer,
      user_agent,
      screen_width,
      screen_height,
      language,
      country,
      city,
      session_id,
      user_id,
      event_data,
      duration,
    } = body;

    // Validate required fields
    if (!event_type) {
      return NextResponse.json(
        { error: "event_type is required" },
        { status: 400 }
      );
    }

    // Check if tracking is enabled via environment variable
    const trackingUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!trackingUrl) {
      return NextResponse.json(
        { error: "Analytics tracking is not configured" },
        { status: 500 }
      );
    }

    // Get current URL from request (may not be available for sendBeacon)
    const currentUrl = request.headers.get("referer") || request.headers.get("origin") || "";
    
    // Only track if the request is from the configured tracking URL
    // Allow requests without referer (e.g., from sendBeacon) but validate if present
    if (currentUrl && !currentUrl.startsWith(trackingUrl.replace(/\/$/, ""))) {
      return NextResponse.json(
        { error: "Tracking URL mismatch" },
        { status: 403 }
      );
    }

    // Process device information
    const device_type = getDeviceType(user_agent);
    const browser = getBrowser(user_agent);
    const os = getOS(user_agent);

    // Insert analytics event using Prisma (bypasses PostgREST schema cache issues)
    try {
      const data = await prisma.analytics.create({
        data: {
          event_type,
          page_path: page_path || null,
          page_title: page_title || null,
          referrer: referrer || null,
          user_agent: user_agent || null,
          device_type,
          browser,
          os,
          screen_width: screen_width || null,
          screen_height: screen_height || null,
          language: language || null,
          country: country || null,
          city: city || null,
          session_id: session_id || null,
          user_id: user_id || null,
          event_data: event_data || null,
          duration: duration || null,
        },
      });

      return NextResponse.json({
        success: true,
        data,
      });
    } catch (error: any) {
      console.error("Error inserting analytics:", error);
      return NextResponse.json(
        { error: "Failed to track analytics event", details: error.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to check if tracking is enabled
export async function GET() {
  const trackingUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return NextResponse.json({
    enabled: !!trackingUrl,
    tracking_url: trackingUrl || null,
  });
}

