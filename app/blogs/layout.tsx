import { isPageEnabled } from "@/lib/data-provider";
import { notFound } from "next/navigation";

export default async function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if blogs-articles page is enabled
  const pageEnabled = await isPageEnabled("blogs-articles");

  if (!pageEnabled) {
    notFound();
  }

  return <>{children}</>;
}
