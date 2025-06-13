/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Header from "../components/Header";
import ContactForm from "../components/ContactForm";
import FloatingBookButton from "../components/FloatingBookButton";
import Link from "next/link";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const categories = [
    "All",
    "Sunbrix",
    "Material procurement",
    "Construction",
    "Design",
  ];

  const faqData: FAQItem[] = [
    {
      id: "1",
      question: "Since how long has Sunbrix been in the construction business?",
      answer:
        "Sunbrix was launched in 2021 to offer independent homeowners a hassle-free home-building experience.",
      category: "Sunbrix",
    },
    {
      id: "2",
      question: "How long does it take to construct a residential project?",
      answer:
        "The duration of residential construction varies depending on the size and complexity of the project. The tentative timelines are 9 months for a ground floor unit, 11 months for a ground-plus-one unit, and 13 months for a ground-plus-two unit.",
      category: "Construction",
    },
    {
      id: "3",
      question: "Does Sunbrix undertake home designing services?",
      answer:
        "Yes, we offer a premium design service through a carefully vetted pool of empanelled architects.",
      category: "Design",
    },
    {
      id: "4",
      question: "Does Sunbrix undertake home interior services?",
      answer:
        "No, we do not currently offer home interior services. However, we continue to improve our offerings and progressively expand our affiliate service partnerships.",
      category: "Sunbrix",
    },
    {
      id: "5",
      question: "Does Sunbrix undertake any commercial projects?",
      answer:
        "No, we do not undertake commercial or semi-commercial projects. Our focus is firmly on shaping the future of independent homebuilding - one dream home at a time.",
      category: "Sunbrix",
    },
    {
      id: "6",
      question: "Does Sunbrix assist in getting government approvals & loans?",
      answer:
        "Yes, we assist with loans and financial support through our affiliate partners. However, customers are required to obtain government approvals independently.",
      category: "Sunbrix",
    },
    {
      id: "7",
      question: "Does Sunbrix offer any construction warranties?",
      answer:
        "Yes, for all homes handed over, our contractors provide a one-year workmanship warranty and a five-year structural warranty. All contractor partners are carefully selected through a stringent, end-to-end onboarding process.",
      category: "Construction",
    },
    {
      id: "8",
      question:
        "Does Sunbrix provide any protection against delays in completion of the project?",
      answer:
        "Yes, the contract includes delay penalty clauses to safeguard the customer against inadvertent delays by the contractor.",
      category: "Construction",
    },
    {
      id: "9",
      question:
        "Will I get to choose the materials that are planned to be used in my project?",
      answer:
        "Yes. While steel, cement, RMC and paints are provided by Sunbrix, all other materials can be selected by customers from the product assortments of our affiliate partners, who offer them at discounted prices. The material budgets considered for the project are detailed in the quotations and agreements to simplify shortlisting and selection.",
      category: "Material procurement",
    },
    {
      id: "10",
      question:
        "Can I change any project specifications, after signing the agreement?",
      answer:
        "Yes. All feasible changes can be identified and incorporated into the project plan during the design and construction process. The additional cost of these changes will be borne by the customer.",
      category: "Construction",
    },
    {
      id: "11",
      question: "Is it mandatory to purchase all materials through Sunbrix?",
      answer:
        "For core materials such as TMT steel and cement, we use only Sunbrix products to ensure consistent quality and structural reliability. For other categories, you are welcome to choose your own vendors. However, our affiliate partners offer advantages such as better pricing, assured quality and timely delivery.",
      category: "Material procurement",
    },
    {
      id: "12",
      question: "Which material categories does Sunbrix support?",
      answer:
        "We cover everything needed for a complete home: Construction essentials: TMT steel, cement, RMC, paints, and construction chemicals. Finishes and fixtures: Tiles, sanitaryware, doors, and windows. Interiors and technology: Electricals, interior solutions, solar systems, and home automation.",
      category: "Material procurement",
    },
    {
      id: "13",
      question:
        "How does the selection process work for tiles, sanitaryware, and other fittings?",
      answer:
        "Browse curated catalogues from premium brands, tailored to your selected package. Scheduled visits to experience centres for hands-on selection of brands are available, if desired.",
      category: "Material procurement",
    },
    {
      id: "14",
      question:
        "How are materials delivered and managed at the construction site?",
      answer:
        "Partner brands manage material delivery as per the agreed schedule. Customers are responsible for ensuring safe storage of materials at the site until installation.",
      category: "Material procurement",
    },
    {
      id: "15",
      question: "How does Sunbrix ensure material quality?",
      answer:
        "We partner only with reputed brands known for quality and reliability. Our team ensures that the right materials reach your site in the right condition.",
      category: "Material procurement",
    },
    {
      id: "16",
      question:
        "What if there is any increase in material prices during the course of the project? Will it be absorbed by the contractor?",
      answer:
        "Any increase or decrease of up to 5% in the estimated material value (steel, cement and RMC) will be borne by the contractor. Variations beyond 5% will be borne by or passed on to the customer, as applicable.",
      category: "Material procurement",
    },
    {
      id: "17",
      question:
        "What are the payments process & controls in place for a project?",
      answer:
        "All customer payments are made to a nodal or escrow account managed by Sunbrix. The payment schedule is defined according to construction milestones and varies by project scale. For each milestone, payment is collected in advance from the customer and released to the contractor only after successful completion and customer confirmation.",
      category: "Construction",
    },
    {
      id: "18",
      question: "What are the benefits of procuring materials through Sunbrix?",
      answer:
        "We ensure high-quality materials from trusted brands at competitive prices, with timely delivery to your site.",
      category: "Material procurement",
    },
    {
      id: "19",
      question: "Which brands are partnered with Sunbrix?",
      answer:
        "We collaborate with industry leaders for guaranteed quality: • Tiles: Kajaria, Creanza, Somany, Johnson • Sanitaryware: Jaquar, Kohler, TOTO, Johnson, Cera • Doors and windows: Fenesta • Pipes: Astral • Electricals: Polycab • Interior solutions: Homelane",
      category: "Material procurement",
    },
    {
      id: "20",
      question: "Can I use my own vendors for certain materials?",
      answer:
        "Yes, you can. However, procuring through Sunbrix often ensures better pricing, assured availability and brand-backed quality.",
      category: "Material procurement",
    },
    {
      id: "21",
      question: "What kind of warranties are provided on materials?",
      answer:
        "All materials carry brand warranties. For any issues, we connect you directly with the brand for prompt resolution.",
      category: "Material procurement",
    },
    {
      id: "22",
      question:
        "Is there a cost benefit if I procure materials through Sunbrix?",
      answer:
        "Yes, we leverage our scale and partnerships to offer competitive prices, often better than market rates.",
      category: "Material procurement",
    },
    {
      id: "23",
      question: "How will an architect be allocated to our projects?",
      answer:
        "Local architects empaneled with Sunbrix Homes post clearing certain quality checks and having high customer NPS.",
      category: "Design",
    },
    {
      id: "24",
      question: "What are exclusions in the design package?",
      answer:
        "Interior design, landscape design, detailed MEP design, regulatory approvals.",
      category: "Design",
    },
    {
      id: "25",
      question:
        "How are the Vastu principles incorporated during the design stage?",
      answer:
        "The designs are usually worked out incorporating GENERIC Vastu principles by our Consulting Architects. In case customers are opting to proceed based on SPECIFIC Vastu principles or any other specific requirement e.g. Numerology etc. they are advised to appoint the respective consultants on board and furnish the preferred zoning layout/notes prepared by them for further design process.",
      category: "Design",
    },
    {
      id: "26",
      question:
        "How are the design revisions considered? What if the requirements are not fulfilled as offered in packages?",
      answer:
        "The design packages offer fixed nos. of revisions from Consulting Architect. Standard Design Package includes 3 nos. of Layout revisions & 2 nos. of Elevation/3D revisions. Design+ Package includes 5 nos. of Layout revisions & 3 nos. of Elevation/3D revisions. Any additional revisions to suit your custom requirements will be made available at an additional cost communicated to you time to time.",
      category: "Design",
    },
    {
      id: "27",
      question: "What are inclusions in the design package?",
      answer:
        "Floor plans & elevation designs in PDF. Construction drawings in PDF (on approval of cost estimate).",
      category: "Design",
    },
    {
      id: "28",
      question: "What is the medium of meeting with architect?",
      answer: "Pre-scheduled virtual meetings.",
      category: "Design",
    },
  ];

  const filteredFAQs =
    activeCategory === "All"
      ? faqData
      : faqData.filter((faq) => faq.category === activeCategory);

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-[#fdfdf8]">
      {/* Header */}
      <Header showCitySelector={false} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Frequently asked questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about Sunbrix, our construction
            process, materials, and services.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Categories
            </h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-3 h-3 text-orange-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900 text-left">
                      {faq.question}
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedFAQ === faq.id ? "rotate-180" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    expandedFAQ === faq.id
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-4">
                    <div className="pl-9">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Building homes Since 1999
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Sunbrix is a venture by the Sunbrix Group, a leading name in steel,
            cement, energy and other core sectors. We believe building a home
            should put you firmly in control, with access to verified
            professionals, quality products and a safe, transparent process -
            the Sunbrix way.
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors shadow-md">
            Book a meeting
          </button>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm
        title="Still have questions?"
        subtitle="Get in touch with our experts for personalized assistance."
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-5">
              <div className="text-3xl font-bold mb-6">Sunbrix</div>
              <p className="text-gray-300 mb-8 text-base leading-relaxed max-w-md">
                Browse ideas, explore options and book a meeting with our expert
                consultants to finalise your design.
              </p>
              <div className="space-y-3 mb-8">
                <div className="text-base font-semibold text-white">
                  Get in touch
                </div>
                <div className="text-base text-orange-400">
                  support.homes@jswone.in
                </div>
                <div className="text-base text-orange-400">+91 72080 55527</div>
              </div>
              {/* Social Media Icons */}
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Company Section */}
            <div className="lg:col-span-4">
              <h3 className="text-xl font-semibold mb-6 text-white">Company</h3>
              <ul className="space-y-4 text-base text-gray-300">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How it works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects"
                    className="hover:text-white transition-colors"
                  >
                    Our projects
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Testimonials
                  </Link>
                </li>

                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-white transition-colors"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Section */}
            <div className="lg:col-span-3">
              <h3 className="text-xl font-semibold mb-6 text-white">Legal</h3>
              <ul className="space-y-4 text-base text-gray-300">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Book a Meeting Button */}
      <FloatingBookButton />
    </div>
  );
}
