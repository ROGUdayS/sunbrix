"use client";

import Header from "../components/Header";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fdfdf8] flex flex-col">
      <Header />
      <main className="flex-1 py-12 sm:py-16 lg:py-20 pt-24 sm:pt-28 lg:pt-32 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-900 mb-8 text-center">
            Terms &amp; Conditions
          </h1>
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10 text-gray-800 space-y-6 text-base sm:text-lg">
            <section>
              <h2 className="text-xl font-semibold mb-2">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using the Sunbrix website, you agree to be bound
                by these Terms &amp; Conditions and all applicable laws. If you
                do not agree, please do not use our site.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">2. Use of Website</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You may use this site for lawful purposes only.</li>
                <li>
                  You may not use the site to transmit any harmful, unlawful, or
                  infringing content.
                </li>
                <li>
                  We reserve the right to restrict or terminate your access at
                  any time.
                </li>
              </ul>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">
                3. Intellectual Property
              </h2>
              <p>
                All content, trademarks, logos, and materials on this site are
                the property of Sunbrix or its licensors. You may not reproduce,
                distribute, or use any content without written permission.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">
                4. Limitation of Liability
              </h2>
              <p>
                Sunbrix is not liable for any damages arising from your use of
                this site or any linked third-party sites. All content is
                provided &quot;as is&quot; without warranties of any kind.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">
                5. Changes to Terms
              </h2>
              <p>
                We may update these Terms &amp; Conditions at any time.
                Continued use of the site constitutes acceptance of the revised
                terms.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">6. Governing Law</h2>
              <p>
                These Terms &amp; Conditions are governed by the laws of India.
                Any disputes will be subject to the exclusive jurisdiction of
                the courts in Bengaluru, India.
              </p>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-2">7. Contact</h2>
              <p>
                If you have any questions about these Terms, please{" "}
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
    </div>
  );
}
