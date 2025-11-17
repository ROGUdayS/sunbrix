/**
 * Server-side Data Provider - Abstracts data fetching between API and static JSON modes
 *
 * This module provides a unified interface for data fetching that can switch
 * between API calls (developer mode) and static JSON files (production mode)
 * based on the NEXT_PUBLIC_USE_API_DATA environment variable.
 *
 * NOTE: This is for server-side use only. For client-side use, import from data-provider-client.ts
 */

import { promises as fs } from "fs";
import path from "path";

// Types for our data structures
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
  image_alt_texts?: string[];
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
  quote?: string;
  image?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  active: boolean;
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
  metaContent?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    twitter_title?: string;
    twitter_description?: string;
    twitter_image?: string;
  };
  heroSection?: {
    title: string;
    subtitle: string;
  };
  storySection?: {
    title: string;
    image: string;
    imageAlt?: string;
    image_alt_text?: string;
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
      iconAlt?: string;
    }>;
  };
}

export interface ContactContent {
  metaContent?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    twitter_title?: string;
    twitter_description?: string;
    twitter_image?: string;
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
  alt_text?: string;
}

export interface PageConfigData {
  id: string;
  pageId: string;
  pageName: string;
  enabled: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Configuration
const USE_API_DATA = process.env.NEXT_PUBLIC_USE_API_DATA === "true";
const DATA_DIR = path.join(process.cwd(), "public", "data");

// Helper function to read JSON files in static mode
async function readStaticData<T>(filename: string): Promise<T | null> {
  if (USE_API_DATA) {
    throw new Error("readStaticData should not be called in API mode");
  }

  try {
    const filePath = path.join(DATA_DIR, filename);
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading static data from ${filename}:`, error);
    return null;
  }
}

// Helper function to get the base URL for API calls
function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    // Client-side: use relative URLs to call lander's own API routes
    return "";
  }
  
  // Server-side: use lander's own base URL (not dashboard URL)
  // This allows calling the lander's API routes which may proxy to dashboard or read from DB
  
  // Priority order:
  // 1. Explicitly set API base URL
  // 2. Netlify URL (if available)
  // 3. Vercel URL (if available)
  // 4. Localhost fallback
  
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // Netlify provides DEPLOY_PRIME_URL and URL
  if (process.env.DEPLOY_PRIME_URL) {
    return process.env.DEPLOY_PRIME_URL;
  }
  if (process.env.URL) {
    return process.env.URL;
  }
  
  // Vercel provides VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  
  // Localhost fallback for development
  return "http://localhost:3000";
}

// Helper function to make API calls in API mode with retry logic
async function fetchFromAPI<T>(endpoint: string, retries: number = 2): Promise<T | null> {
  if (!USE_API_DATA) {
    throw new Error("fetchFromAPI should not be called in static mode");
  }

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout (increased for production)
      
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          // Add cache control to prevent stale data
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === "AbortError") {
          throw new Error(`API call timed out after 15 seconds: ${url}`);
        }
        throw fetchError;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      const isLastAttempt = attempt === retries;
      
      if (isLastAttempt) {
        // Log error on final attempt
        console.error(`[DATA-PROVIDER] Error fetching from API ${endpoint} (after ${retries + 1} attempts):`, {
          error: errorMessage,
          endpoint,
          baseUrl,
          url,
          attempts: retries + 1,
          timestamp: new Date().toISOString(),
        });
        return null;
      } else {
        // Log warning and retry
        console.warn(`[DATA-PROVIDER] API call failed (attempt ${attempt + 1}/${retries + 1}), retrying...`, {
          error: errorMessage,
          endpoint,
          url,
        });
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
  
  return null;
}

// Data Provider Functions

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
    const data = await readStaticData<{
      projects: ProjectData[];
      count: number;
    }>("projects.json");
    if (!data) return defaultResult;

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
    const data = await readStaticData<CityData[]>("cities.json");
    if (!data) return [];

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
    const data = await readStaticData<TestimonialData[]>("testimonials.json");
    if (!data) return [];

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
    const data = await readStaticData<MainPageContent>(
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
    const data = await readStaticData<PackageData>("packages.json");
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
    const data = await readStaticData<GalleryImage[]>("gallery.json");
    if (!data) return [];

    // Apply limit
    return data.slice(0, limit);
  }
}

export async function getFAQs(): Promise<any[]> {
  if (USE_API_DATA) {
    const data = await fetchFromAPI<any[]>("/api/content/faqs");
    return data || [];
  } else {
    const data = await readStaticData<any[]>("faqs.json");
    return data || [];
  }
}

export async function getBlogContent(): Promise<any[]> {
  if (USE_API_DATA) {
    const data = await fetchFromAPI<any[]>("/api/content/blogs");
    return data || [];
  } else {
    const data = await readStaticData<any[]>("blogs.json");
    return data || [];
  }
}

export async function getAboutUsContent(): Promise<AboutUsContent> {
  if (USE_API_DATA) {
    const data = await fetchFromAPI<AboutUsContent>("/api/content/about-us");
    return data || {};
  } else {
    const data = await readStaticData<AboutUsContent>("about-us-content.json");
    return data || {};
  }
}

export async function getContactContent(): Promise<ContactContent> {
  if (USE_API_DATA) {
    const data = await fetchFromAPI<ContactContent>("/api/content/contact");
    return data || {};
  } else {
    const data = await readStaticData<ContactContent>("contact-content.json");
    return data || {};
  }
}

export async function getPageConfigs(): Promise<PageConfigData[]> {
  if (USE_API_DATA) {
    const response = await fetchFromAPI<{
      success: boolean;
      data: PageConfigData[];
    }>("/api/page-config");
    return response?.data || [];
  } else {
    const data = await readStaticData<PageConfigData[]>("page-config.json");
    return data || [];
  }
}

export async function isPageEnabled(pageId: string): Promise<boolean> {
  const configs = await getPageConfigs();
  const pageConfig = configs.find((config) => config.pageId === pageId);
  return pageConfig ? pageConfig.enabled : true; // Default to enabled if not found
}

export async function getCompanySettings(): Promise<any> {
  if (USE_API_DATA) {
    const response = await fetchFromAPI<{
      success: boolean;
      settings: any;
    }>("/api/company-settings");
    return response?.settings || {};
  } else {
    const data = await readStaticData<any>("company-settings.json");
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
