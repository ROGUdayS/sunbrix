import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch published blogs for frontend (simplified)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured"); // filter featured posts
    const limit = searchParams.get("limit"); // limit results

    const where: {
      active: boolean;
      status: string;
      featured?: boolean;
    } = {
      active: true,
      status: "published", // Only show published posts on frontend
    };

    if (featured === "true") {
      where.featured = true;
    }

    const blogPosts = await prisma.blogPost.findMany({
      where,
      orderBy: [
        { featured: "desc" },
        { order_index: "asc" },
        { updated_at: "desc" },
      ],
      take: limit ? parseInt(limit) : undefined,
    });

    // Transform data for frontend
    const transformedPosts = blogPosts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      author: post.author,
      date: post.updated_at.toISOString().split("T")[0],
      image: post.featured_image || "/images/blog-placeholder.jpg",
      tags: post.tags,
      featured: post.featured,
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
