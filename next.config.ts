import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30, // 30 seconds for dynamic routes
      static: 300, // 5 minutes for static routes
    },
  },
  images: {
    domains: ["rzkmikgqpkblsjbrmnkw.supabase.co"], // Add domains for external images if needed
    formats: ["image/webp", "image/avif"],
  },
  // Enable compression
  compress: true,
  // Generate static pages for better performance
  output: "standalone",
};

export default nextConfig;
