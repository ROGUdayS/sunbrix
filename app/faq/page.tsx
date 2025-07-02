"use client";

import { useState } from "react";
import Header from "../components/Header";
import ContactForm from "../components/ContactForm";
import FloatingBookButton from "../components/FloatingBookButton";

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
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-12 sm:py-16 lg:py-20 pt-24 sm:pt-28 lg:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Frequently asked questions
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about Sunbrix, our construction
            process, materials, and services.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Categories */}
          <div className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Categories
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
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
          <div className="space-y-3 sm:space-y-4">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-600"
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
                    <span className="font-medium text-gray-900 text-left text-sm sm:text-base">
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
                  <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                    <div className="pl-7 sm:pl-9">
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
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
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Building homes Since 1999
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8">
            Sunbrix is a venture by the Sunbrix Group, a leading name in steel,
            cement, energy and other core sectors. We believe building a home
            should put you firmly in control, with access to verified
            professionals, quality products and a safe, transparent process -
            the Sunbrix way.
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-base sm:text-lg font-semibold transition-colors shadow-md">
            Contact Us
          </button>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm title="Contact Us" />

      {/* Floating Contact Us Button */}
      <FloatingBookButton />
    </div>
  );
}
