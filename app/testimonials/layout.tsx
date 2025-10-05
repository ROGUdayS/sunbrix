import { isPageEnabled } from "@/lib/data-provider";
import { notFound } from "next/navigation";

export default async function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if testimonials page is enabled
  const pageEnabled = await isPageEnabled("testimonials");

  if (!pageEnabled) {
    notFound();
  }

  return <>{children}</>;
}
