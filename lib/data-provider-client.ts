/**
 * Client-side Data Provider - Handles data fetching for browser environments
 *
 * This module provides client-side data fetching that works in the browser.
 * It only handles API calls and static file fetching via HTTP requests.
 */

// Types for our data structures (re-export from main provider)
export interface ProjectData {
  id: string;
  title: string;
  location: string;
  year: string;
  plotSize: string;
  facing: string;
  property_type: string;
  image: string;
  images?: string[];
  description: string;
  specifications: {
    bedrooms: number;
  };
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CityData {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TestimonialData {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  quote?: string; // Add quote field for compatibility
  image?: string;
  active: boolean;
  [key: string]: any; // Allow additional properties for flexibility
}

export interface MainPageContent {
  demoVideoUrl?: string;
  galleryImages?: any[];
  heroStats?: any;
  commitmentSection?: any;
  gallerySection?: any;
  packagesSection?: any;
  testimonialsSection?: any;
}

export interface AboutUsContent {
  heroSection?: {
    title: string;
    subtitle: string;
  };
  storySection?: {
    title: string;
    image: string;
    paragraphs: string[];
  };
  valuesSection?: {
    title: string;
    subtitle: string;
    values: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
    }>;
  };
}

export interface PackageData {
  [cityName: string]: {
    [packageName: string]: any;
  };
}

export interface GalleryImage {
  id: string;
  image: string;
  image_url: string;
  quote: string;
  order_index: number;
}

// Configuration
const USE_API_DATA = process.env.NEXT_PUBLIC_USE_API_DATA === "true";

// Helper function to make API calls
async function fetchFromAPI<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from API ${endpoint}:`, error);
    return null;
  }
}

// Helper function to fetch static JSON files via HTTP
async function fetchStaticData<T>(filename: string): Promise<T | null> {
  try {
    const response = await fetch(`/data/${filename}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch static data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error reading static data from ${filename}:`, error);
    return null;
  }
}

// Client-side Data Provider Functions

export async function getProjects(
  active: boolean = true
): Promise<{ projects: ProjectData[]; count: number }> {
  const defaultResult = { projects: [], count: 0 };

  if (USE_API_DATA) {
    const data = await fetchFromAPI<{ projects: ProjectData[]; count: number }>(
      `/api/projects?active=${active}`
    );
    return data || defaultResult;
  } else {
    const data = await fetchStaticData<{
      projects: ProjectData[];
      count: number;
    }>("projects.json");
    if (!data || !Array.isArray(data.projects)) return defaultResult;

    // Sort by display_order (ascending) to match dashboard order
    const sortedProjects = data.projects.sort(
      (a: any, b: any) => (a.display_order || 999) - (b.display_order || 999)
    );

    // Filter by active status if needed
    if (active) {
      const filteredProjects = sortedProjects.filter((p) => p.active);
      return { projects: filteredProjects, count: filteredProjects.length };
    }

    return {
      projects: sortedProjects,
      count: data.count || sortedProjects.length,
    };
  }
}

export async function getCities(active: boolean = true): Promise<CityData[]> {
  if (USE_API_DATA) {
    const data = await fetchFromAPI<CityData[]>(`/api/cities?active=${active}`);
    return data || [];
  } else {
    const data = await fetchStaticData<CityData[]>("cities.json");
    if (!data || !Array.isArray(data)) return [];

    // Sort by display_order (ascending) to match dashboard order
    const sortedCities = data.sort(
      (a: any, b: any) => (a.display_order || 999) - (b.display_order || 999)
    );

    // Filter by active status if needed
    return active ? sortedCities.filter((c) => c.active) : sortedCities;
  }
}

export async function getTestimonials(): Promise<TestimonialData[]> {
  if (USE_API_DATA) {
    const data = await fetchFromAPI<TestimonialData[]>(
      "/api/content/testimonials"
    );
    return data || [];
  } else {
    const data = await fetchStaticData<TestimonialData[]>("testimonials.json");
    if (!data || !Array.isArray(data)) return [];

    // Sort by order_index (ascending) to match dashboard order
    const sortedTestimonials = data.sort(
      (a: any, b: any) => (a.order_index || 999) - (b.order_index || 999)
    );

    return sortedTestimonials;
  }
}

export async function getMainPageContent(): Promise<MainPageContent> {
  if (USE_API_DATA) {
    const data = await fetchFromAPI<MainPageContent>("/api/content/main-page");
    return data || {};
  } else {
    const data = await fetchStaticData<MainPageContent>(
      "main-page-content.json"
    );
    return data || {};
  }
}

export async function getPackages(
  active: boolean = true
): Promise<PackageData> {
  if (USE_API_DATA) {
    const data = await fetchFromAPI<PackageData>(
      `/api/packages?active=${active}`
    );
    return data || {};
  } else {
    const data = await fetchStaticData<PackageData>("packages.json");
    return data || {};
  }
}

export async function getGalleryImages(
  limit: number = 50
): Promise<GalleryImage[]> {
  if (USE_API_DATA) {
    const data = await fetchFromAPI<GalleryImage[]>(
      `/api/content/gallery?limit=${limit}`
    );
    return data || [];
  } else {
    const data = await fetchStaticData<GalleryImage[]>("gallery.json");
    if (!data || !Array.isArray(data)) return [];

    // Sort by order_index (ascending) to match dashboard order
    const sortedImages = data.sort(
      (a: any, b: any) => (a.order_index || 999) - (b.order_index || 999)
    );

    // Apply limit
    return sortedImages.slice(0, limit);
  }
}

export async function getFAQs(): Promise<any[]> {
  if (USE_API_DATA) {
    const data = await fetchFromAPI<any[]>("/api/content/faqs");
    return data || [];
  } else {
    const data = await fetchStaticData<any[]>("faqs.json");
    if (!data || !Array.isArray(data)) return [];

    // Sort by order_index (ascending) to match dashboard order
    const sortedFaqs = data.sort(
      (a: any, b: any) => (a.order_index || 999) - (b.order_index || 999)
    );

    return sortedFaqs;
  }
}

export async function getBlogs(): Promise<any[]> {
  if (USE_API_DATA) {
    const data = await fetchFromAPI<any[]>("/api/content/blogs");
    return data || [];
  } else {
    const data = await fetchStaticData<any[]>("blogs.json");
    if (!data || !Array.isArray(data)) return [];

    // Sort by order_index (ascending) to match dashboard order
    const sortedBlogs = data.sort(
      (a: any, b: any) => (a.order_index || 999) - (b.order_index || 999)
    );

    return sortedBlogs;
  }
}

export async function getBlogContent(): Promise<any> {
  if (USE_API_DATA) {
    const data = await fetchFromAPI<any>("/api/content/blogs/page-content");
    return data || {};
  } else {
    const data = await fetchStaticData<any>("main-page-content.json");
    return data?.blogsSection || {};
  }
}

export async function getFaqs(): Promise<any[]> {
  if (USE_API_DATA) {
    const data = await fetchFromAPI<any[]>("/api/content/faqs");
    return data || [];
  } else {
    const data = await fetchStaticData<any[]>("faqs.json");
    return data || [];
  }
}

export async function getFaqContent(): Promise<any[]> {
  if (USE_API_DATA) {
    const data = await fetchFromAPI<any[]>("/api/content/faqs/page-content");
    return data || [];
  } else {
    const data = await fetchStaticData<any>("main-page-content.json");
    return data?.faqs || [];
  }
}

export async function getAboutUsContent(): Promise<AboutUsContent> {
  if (USE_API_DATA) {
    const data = await fetchFromAPI<AboutUsContent>("/api/content/about-us");
    return data || {};
  } else {
    const data = await fetchStaticData<AboutUsContent>("about-us-content.json");
    return data || {};
  }
}

// Utility function to check current mode
export function isUsingAPIData(): boolean {
  return USE_API_DATA;
}

// Utility function for client-side usage
export function getDataMode(): "api" | "static" {
  return USE_API_DATA ? "api" : "static";
}
