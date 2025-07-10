"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";
import FloatingBookButton from "../components/FloatingBookButton";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fdfdf8] flex flex-col">
      <Header />
      <main className="flex-1 py-12 sm:py-16 lg:py-20 pt-24 sm:pt-28 lg:pt-32 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-900 mb-8 text-center">
            Privacy Policy
          </h1>
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10 text-gray-800 space-y-6 text-base sm:text-lg">
            <section>
              <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
              <p>
                Sunbrix is committed to protecting your privacy. This policy
                explains how we collect, use, and safeguard your information
                when you use our website.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">
                2. Information We Collect
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Personal information you provide (such as name, email, phone)
                  when you fill out forms.
                </li>
                <li>
                  Usage data collected automatically (such as IP address,
                  browser type, pages visited).
                </li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">
                3. How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To respond to your inquiries and provide services.</li>
                <li>To improve our website and user experience.</li>
                <li>
                  To send updates, marketing, or promotional materials (you can
                  opt out at any time).
                </li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">
                4. Sharing Your Information
              </h2>
              <p>
                We do not sell or rent your personal information. We may share
                it with trusted partners who assist us in operating our website
                or providing services, as long as they agree to keep this
                information confidential.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">5. Cookies</h2>
              <p>
                We use cookies to enhance your experience. You can choose to
                disable cookies in your browser settings, but some features of
                the site may not function properly.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">6. Data Security</h2>
              <p>
                We implement reasonable security measures to protect your
                information. However, no method of transmission over the
                Internet is 100% secure.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">
                7. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. Changes
                will be posted on this page with an updated effective date.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">8. Contact</h2>
              <p>
                If you have any questions about this Privacy Policy, please{" "}
                <Link
                  href="/contact"
                  className="text-amber-600 hover:underline"
                >
                  contact us
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
