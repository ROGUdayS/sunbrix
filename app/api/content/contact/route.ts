import { NextResponse } from "next/server";
import { getContactContent } from "@/lib/data-provider";

export async function GET() {
  try {
    const contactContent = await getContactContent();
    return NextResponse.json(contactContent);
  } catch (error) {
    console.error("Error fetching contact content:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact content" },
      { status: 500 }
    );
  }
}
