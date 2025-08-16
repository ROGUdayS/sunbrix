import { createClient } from "./supabase/client";

// Storage bucket name for project images
export const PROJECT_IMAGES_BUCKET = "project-images";

// Get Supabase client for storage operations
export function getStorageClient() {
  return createClient();
}

// Upload project image to Supabase Storage
export async function uploadProjectImage(
  file: File,
  projectId: string
): Promise<{ url?: string; error?: string }> {
  try {
    const supabase = getStorageClient();

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${projectId}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(PROJECT_IMAGES_BUCKET)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return { error: `Upload failed: ${error.message}` };
    }

    // Get public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from(PROJECT_IMAGES_BUCKET).getPublicUrl(fileName);

    return { url: publicUrl };
  } catch (error) {
    console.error("Unexpected upload error:", error);
    return { error: "Unexpected error during upload" };
  }
}

// Delete project image from Supabase Storage
export async function deleteProjectImage(
  imageUrl: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = getStorageClient();

    // Extract file path from URL
    const urlParts = imageUrl.split(`/${PROJECT_IMAGES_BUCKET}/`);
    if (urlParts.length < 2) {
      return { error: "Invalid image URL format" };
    }

    const filePath = urlParts[1];

    // Delete file from storage
    const { error } = await supabase.storage
      .from(PROJECT_IMAGES_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error("Delete error:", error);
      return { error: `Delete failed: ${error.message}` };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected delete error:", error);
    return { error: "Unexpected error during deletion" };
  }
}

// Get all images for a specific project
export async function getProjectImages(
  projectId: string
): Promise<{ images?: string[]; error?: string }> {
  try {
    const supabase = getStorageClient();

    // List all files in the project folder
    const { data, error } = await supabase.storage
      .from(PROJECT_IMAGES_BUCKET)
      .list(projectId, {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error("List error:", error);
      return { error: `Failed to fetch images: ${error.message}` };
    }

    // Generate public URLs for all images
    const imageUrls = data.map((file) => {
      const {
        data: { publicUrl },
      } = supabase.storage
        .from(PROJECT_IMAGES_BUCKET)
        .getPublicUrl(`${projectId}/${file.name}`);
      return publicUrl;
    });

    return { images: imageUrls };
  } catch (error) {
    console.error("Unexpected list error:", error);
    return { error: "Unexpected error while fetching images" };
  }
}

// Validate file before upload
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Check file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPEG, PNG, and WebP images are allowed",
    };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return { valid: false, error: "File size must be less than 5MB" };
  }

  return { valid: true };
}

// Generate optimized image URL with transformations
export function getOptimizedImageUrl(
  imageUrl: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
  }
): string {
  if (!options) return imageUrl;

  try {
    const url = new URL(imageUrl);
    const { width, height, quality } = options;

    // Add Supabase image transformation parameters
    if (width) url.searchParams.set("width", width.toString());
    if (height) url.searchParams.set("height", height.toString());
    if (quality) url.searchParams.set("quality", quality.toString());

    return url.toString();
  } catch (error) {
    // If URL parsing fails, return original
    return imageUrl;
  }
}
