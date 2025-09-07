import { MetadataRoute } from "next";

interface Project {
  id: string;
  title: string;
  updated_at?: string;
  created_at: string;
}

interface ProjectsResponse {
  projects: Project[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://sunbrix.netlify.app"; // Netlify deployment URL

  // Base pages
  const basePages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/sitemap-page`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
  ];

  // Fetch projects from static data
  let projectPages: MetadataRoute.Sitemap = [];
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const projectsPath = path.join(
      process.cwd(),
      "public",
      "data",
      "projects.json"
    );
    const projectsData = await fs.readFile(projectsPath, "utf-8");
    const data = JSON.parse(projectsData) as ProjectsResponse;

    projectPages = data.projects.map((project: Project) => ({
      url: `${baseUrl}/projects/${project.id}`,
      lastModified: new Date(project.updated_at || project.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error(
      "Error reading projects from static data for sitemap:",
      error
    );
  }

  return [...basePages, ...projectPages];
}
