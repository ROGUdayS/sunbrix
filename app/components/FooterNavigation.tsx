"use client";

import Link from "next/link";
import { usePageConfigs } from "../hooks/usePageConfigs";

export default function FooterNavigation() {
  const { isPageEnabled } = usePageConfigs();

  return (
    <>
      {/* Company Section */}
      <div className="lg:col-span-4">
        <h3 className="text-xl font-semibold mb-6 text-white">Company</h3>
        <ul className="space-y-4 text-base text-gray-300">
          {isPageEnabled("about-us") && (
            <li>
              <Link
                href="/about"
                className="hover:text-white transition-colors"
              >
                About Us
              </Link>
            </li>
          )}
          <li>
            <Link
              href="/projects"
              className="hover:text-white transition-colors"
            >
              Gallery
            </Link>
          </li>
          {isPageEnabled("testimonials") && (
            <li>
              <Link
                href="/testimonials"
                className="hover:text-white transition-colors"
              >
                Testimonials
              </Link>
            </li>
          )}
          <li>
            <Link
              href="/contact"
              className="hover:text-white transition-colors"
            >
              Contact us
            </Link>
          </li>
          {isPageEnabled("faqs") && (
            <li>
              <Link href="/faq" className="hover:text-white transition-colors">
                FAQs
              </Link>
            </li>
          )}
          {isPageEnabled("blogs-articles") && (
            <li>
              <Link
                href="/blogs"
                className="hover:text-white transition-colors"
              >
                Blogs & Articles
              </Link>
            </li>
          )}
          <li>
            <Link
              href="/sitemap-page"
              className="hover:text-white transition-colors"
            >
              Sitemap
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
