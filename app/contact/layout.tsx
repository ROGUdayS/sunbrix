import type { Metadata } from "next";
import { getContactContent } from "@/lib/data-provider";

export async function generateMetadata(): Promise<Metadata> {
  const contactContent = await getContactContent();
  const meta = contactContent.metaContent || {};

  return {
    title: meta.meta_title || "Contact Sunbrix - Build Your Dream Home",
    description:
      meta.meta_description ||
      "Get in touch with Sunbrix for premium home construction services. Book a consultation with our experts today.",
    keywords:
      meta.meta_keywords ||
      "contact sunbrix, home construction consultation, build home, construction experts",
    alternates: {
      canonical: "https://sunbrix.co/contact",
    },
    openGraph: {
      title: meta.og_title || "Contact Sunbrix - Build Your Dream Home",
      description:
        meta.og_description ||
        "Reach out to Sunbrix for all your home construction needs. Schedule a consultation with our expert team.",
      images: [{ url: meta.og_image || "/images/og-image.jpg" }],
      url: "https://sunbrix.co/contact",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.twitter_title || "Contact Sunbrix - Build Your Dream Home",
      description:
        meta.twitter_description ||
        "Get in touch with Sunbrix for premium home construction services. Book your consultation today.",
      images: [meta.twitter_image || "/images/twitter-image.jpg"],
    },
  };
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
