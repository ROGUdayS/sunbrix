/**
 * Script to ensure all existing images have alt text
 * This script should be run after the database migration to add default alt text to existing images
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function ensureAltText() {
  console.log("Starting alt text migration...");

  try {
    // Update projects with missing alt text
    const projects = await prisma.project.findMany({
      where: {
        OR: [{ image_alt_texts: { isEmpty: true } }, { image_alt_texts: null }],
      },
    });

    console.log(`Found ${projects.length} projects without alt text`);

    for (const project of projects) {
      if (project.images && project.images.length > 0) {
        const altTexts = project.images.map(
          (_, index) => `${project.title} - Image ${index + 1}`
        );

        await prisma.project.update({
          where: { id: project.id },
          data: { image_alt_texts: altTexts },
        });

        console.log(`Updated project: ${project.title}`);
      }
    }

    // Update gallery images with missing alt text
    const galleryImages = await prisma.galleryImage.findMany({
      where: {
        OR: [{ alt_text: null }, { alt_text: "" }],
      },
    });

    console.log(
      `Found ${galleryImages.length} gallery images without alt text`
    );

    for (const image of galleryImages) {
      const altText = image.quote || `Gallery image ${image.order_index + 1}`;

      await prisma.galleryImage.update({
        where: { id: image.id },
        data: { alt_text: altText },
      });

      console.log(`Updated gallery image: ${image.id}`);
    }

    // Update testimonials with missing alt text
    const testimonials = await prisma.testimonial.findMany({
      where: {
        OR: [
          { customer_image: { not: null }, customer_image_alt_text: null },
          { customer_image: { not: null }, customer_image_alt_text: "" },
          { video_thumbnail: { not: null }, video_thumbnail_alt_text: null },
          { video_thumbnail: { not: null }, video_thumbnail_alt_text: "" },
        ],
      },
    });

    console.log(
      `Found ${testimonials.length} testimonials with missing alt text`
    );

    for (const testimonial of testimonials) {
      const updates: any = {};

      if (testimonial.customer_image && !testimonial.customer_image_alt_text) {
        updates.customer_image_alt_text = `${testimonial.customer_name} - Customer photo`;
      }

      if (
        testimonial.video_thumbnail &&
        !testimonial.video_thumbnail_alt_text
      ) {
        updates.video_thumbnail_alt_text = `${testimonial.customer_name} - Video thumbnail`;
      }

      if (Object.keys(updates).length > 0) {
        await prisma.testimonial.update({
          where: { id: testimonial.id },
          data: updates,
        });

        console.log(`Updated testimonial: ${testimonial.customer_name}`);
      }
    }

    // Update blog posts with missing alt text
    const blogPosts = await prisma.blogPost.findMany({
      where: {
        AND: [
          { featured_image: { not: null } },
          {
            OR: [
              { featured_image_alt_text: null },
              { featured_image_alt_text: "" },
            ],
          },
        ],
      },
    });

    console.log(`Found ${blogPosts.length} blog posts with missing alt text`);

    for (const post of blogPosts) {
      const altText = `${post.title} - Featured image`;

      await prisma.blogPost.update({
        where: { id: post.id },
        data: { featured_image_alt_text: altText },
      });

      console.log(`Updated blog post: ${post.title}`);
    }

    console.log("Alt text migration completed successfully!");
  } catch (error) {
    console.error("Error during alt text migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
ensureAltText();
