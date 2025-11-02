"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import MarkdownRenderer, {
  markdownStyles,
} from "../components/MarkdownRenderer";

export default function TermsPage() {
  const [content, setContent] = useState("");
  const [heroHeading, setHeroHeading] = useState("Terms & Conditions");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTermsConditions() {
      try {
        const USE_API_DATA = process.env.NEXT_PUBLIC_USE_API_DATA === "true";

        if (USE_API_DATA) {
          const response = await fetch("/api/content/terms-conditions");
          if (response.ok) {
            const data = await response.json();
            setContent(data.content || getDefaultContent());
            setHeroHeading(data.heroHeading || "Terms & Conditions");
          } else {
            setContent(getDefaultContent());
          }
        } else {
          const response = await fetch("/data/terms-conditions.json");
          if (response.ok) {
            const data = await response.json();
            setContent(data.content || getDefaultContent());
            setHeroHeading(data.heroHeading || "Terms & Conditions");
          } else {
            setContent(getDefaultContent());
          }
        }
      } catch (error) {
        console.error("Error loading terms & conditions:", error);
        setContent(getDefaultContent());
      } finally {
        setLoading(false);
      }
    }

    loadTermsConditions();
  }, []);

  function getDefaultContent() {
    return `## 1. Acceptance of Terms

By accessing or using the Sunbrix website, you agree to be bound by these Terms & Conditions and all applicable laws. If you do not agree, please do not use our site.

## 2. Use of Website

- You may use this site for lawful purposes only.
- You may not use the site to transmit any harmful, unlawful, or infringing content.
- We reserve the right to restrict or terminate your access at any time.

## 3. Intellectual Property

All content, trademarks, logos, and materials on this site are the property of Sunbrix or its licensors. You may not reproduce, distribute, or use any content without written permission.

## 4. Limitation of Liability

Sunbrix is not liable for any damages arising from your use of this site or any linked third-party sites. All content is provided "as is" without warranties of any kind.

## 5. Changes to Terms

We may update these Terms & Conditions at any time. Continued use of the site constitutes acceptance of the revised terms.

## 6. Governing Law

These Terms & Conditions are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in Bengaluru, India.

## 7. Contact

If you have any questions about these Terms, please [contact us](/contact).`;
  }

  return (
    <div className="min-h-screen bg-[#fdfdf8] flex flex-col">
      <Header />
      <main className="flex-1 py-12 sm:py-16 lg:py-20 pt-24 sm:pt-28 lg:pt-32 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-900 mb-8 text-center">
            {heroHeading}
          </h1>
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10 flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10 text-gray-800 space-y-6 text-base sm:text-lg">
              <style>{markdownStyles}</style>
              <MarkdownRenderer content={content} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
