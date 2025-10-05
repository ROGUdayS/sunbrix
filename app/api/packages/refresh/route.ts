import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    // Revalidate all package-related cache
    revalidateTag("packages");
    revalidateTag("cities");
    revalidatePath("/api/packages");
    revalidatePath("/");

    // Also make a fresh call to packages API to verify data
    const packagesResponse = await fetch(
      `${request.url.replace("/refresh", "")}?bypass_cache=true`,
      {
        cache: "no-store",
      }
    );

    let packagesData = null;
    if (packagesResponse.ok) {
      packagesData = await packagesResponse.json();
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: "Cache cleared and data refreshed",
      packagesCount: packagesData?._debug?.totalPackages || 0,
      packagesWithSections: packagesData?._debug?.packagesWithSections || 0,
    });
  } catch (error) {
    console.error("[REFRESH] Error during manual refresh:", error);
    return NextResponse.json(
      {
        error: "Failed to refresh data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
