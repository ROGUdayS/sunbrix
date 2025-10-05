import { isPageEnabled } from "@/lib/data-provider";
import { notFound } from "next/navigation";

export default async function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if about-us page is enabled
  const pageEnabled = await isPageEnabled("about-us");

  if (!pageEnabled) {
    notFound();
  }

  return <>{children}</>;
}
