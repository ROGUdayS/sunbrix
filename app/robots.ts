import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://sunbrix.netlify.app"; // Netlify deployment URL

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/thank-you/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
