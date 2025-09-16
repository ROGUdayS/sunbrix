-- Add alt text columns to existing tables
-- This migration adds alt_text fields to image-related tables

-- Add image_alt_texts array to projects table
ALTER TABLE projects ADD COLUMN image_alt_texts TEXT[] DEFAULT '{}';

-- Add alt_text to gallery_images table
ALTER TABLE gallery_images ADD COLUMN alt_text VARCHAR(500);

-- Add alt text fields to testimonials table
ALTER TABLE testimonials ADD COLUMN customer_image_alt_text VARCHAR(500);
ALTER TABLE testimonials ADD COLUMN video_thumbnail_alt_text VARCHAR(500);

-- Add alt text field to blog_posts table
ALTER TABLE blog_posts ADD COLUMN featured_image_alt_text VARCHAR(500);

-- Update existing records to have default alt text based on existing data
UPDATE gallery_images 
SET alt_text = COALESCE(quote, 'Gallery image')
WHERE alt_text IS NULL;

UPDATE testimonials 
SET customer_image_alt_text = CONCAT(customer_name, ' - Customer photo')
WHERE customer_image IS NOT NULL AND customer_image_alt_text IS NULL;

UPDATE testimonials 
SET video_thumbnail_alt_text = CONCAT(customer_name, ' - Video thumbnail')
WHERE video_thumbnail IS NOT NULL AND video_thumbnail_alt_text IS NULL;

UPDATE blog_posts 
SET featured_image_alt_text = CONCAT(title, ' - Featured image')
WHERE featured_image IS NOT NULL AND featured_image_alt_text IS NULL;

-- Update projects to have default alt text for existing images
UPDATE projects 
SET image_alt_texts = ARRAY(
  SELECT CONCAT(title, ' - Image ', generate_series(1, array_length(images, 1)))
  FROM unnest(images) WITH ORDINALITY AS t(img, idx)
)
WHERE array_length(images, 1) > 0 AND array_length(image_alt_texts, 1) IS NULL;
