import { isPageEnabled } from "@/lib/data-provider";
import { notFound } from "next/navigation";

export default async function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if faqs page is enabled
  const pageEnabled = await isPageEnabled("faqs");

  if (!pageEnabled) {
    notFound();
  }

  return <>{children}</>;
}
