"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import MarkdownRenderer, { markdownStyles } from "../components/MarkdownRenderer";

export default function PrivacyPage() {
  const [content, setContent] = useState("");
  const [heroHeading, setHeroHeading] = useState("Privacy Policy");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrivacyPolicy() {
      try {
        const USE_API_DATA = process.env.NEXT_PUBLIC_USE_API_DATA === "true";
        
        if (USE_API_DATA) {
          const response = await fetch("/api/content/privacy-policy");
          if (response.ok) {
            const data = await response.json();
            setContent(data.content || getDefaultContent());
            setHeroHeading(data.heroHeading || "Privacy Policy");
          } else {
            setContent(getDefaultContent());
          }
        } else {
          const response = await fetch("/data/privacy-policy.json");
          if (response.ok) {
            const data = await response.json();
            setContent(data.content || getDefaultContent());
            setHeroHeading(data.heroHeading || "Privacy Policy");
          } else {
            setContent(getDefaultContent());
          }
        }
      } catch (error) {
        console.error("Error loading privacy policy:", error);
        setContent(getDefaultContent());
      } finally {
        setLoading(false);
      }
    }
    
    loadPrivacyPolicy();
  }, []);

  function getDefaultContent() {
    return `## 1. Introduction

Sunbrix is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you use our website.

## 2. Information We Collect

- Personal information you provide (such as name, email, phone) when you fill out forms.
- Usage data collected automatically (such as IP address, browser type, pages visited).

## 3. How We Use Your Information

- To respond to your inquiries and provide services.
- To improve our website and user experience.
- To send updates, marketing, or promotional materials (you can opt out at any time).

## 4. Sharing Your Information

We do not sell or rent your personal information. We may share it with trusted partners who assist us in operating our website or providing services, as long as they agree to keep this information confidential.

## 5. Cookies

We use cookies to enhance your experience. You can choose to disable cookies in your browser settings, but some features of the site may not function properly.

## 6. Data Security

We implement reasonable security measures to protect your information. However, no method of transmission over the Internet is 100% secure.

## 7. Changes to This Policy

We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.

## 8. Contact

If you have any questions about this Privacy Policy, please [contact us](/contact).`;
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
