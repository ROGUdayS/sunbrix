/* eslint-disable react/no-unescaped-entities */
import Header from "../components/Header";
import ContactForm from "../components/ContactForm";
import FloatingBookButton from "../components/FloatingBookButton";
import Image from "next/image";
import { getAboutUsContent } from "@/lib/data-provider";

export default async function About() {
  const aboutContent = await getAboutUsContent();
  return (
    <div className="min-h-screen bg-[#fdfdf8]">
      {/* Header */}
      <Header showCitySelector={false} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-12 sm:py-16 lg:py-20 pt-24 sm:pt-28 lg:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            {aboutContent.heroSection?.title || "About Sunbrix"}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            {aboutContent.heroSection?.subtitle ||
              "Building dreams with trust, quality, and innovation. We're here to make your home-building journey seamless and stress-free."}
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                {aboutContent.storySection?.title || "Our Story"}
              </h2>
              {aboutContent.storySection?.paragraphs?.map(
                (paragraph, index) => (
                  <p
                    key={index}
                    className={`text-base sm:text-lg text-gray-700 leading-relaxed ${
                      index <
                      (aboutContent.storySection?.paragraphs?.length || 0) - 1
                        ? "mb-4 sm:mb-6"
                        : ""
                    }`}
                  >
                    {paragraph}
                  </p>
                )
              ) || (
                <>
                  <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                    Sunbrix was launched in 2021 as part of the Sunbrix Group, a
                    leading name in steel, cement, energy, and other core
                    sectors. We recognized that building a home shouldn't be a
                    stressful experience filled with uncertainty and delays.
                  </p>
                  <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                    Our mission is simple: to offer independent homeowners a
                    hassle-free home-building experience with complete
                    transparency, quality materials, and trusted professionals.
                    We believe that building your dream home should put you
                    firmly in control.
                  </p>
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    With the backing of Sunbrix Group's decades of expertise in
                    construction materials and our commitment to innovation,
                    we're reshaping the future of independent homebuilding - one
                    dream home at a time.
                  </p>
                </>
              )}
            </div>
            <div className="relative">
              <Image
                src={
                  aboutContent.storySection?.image ||
                  "/images/HomeHeroWebImage.webp"
                }
                alt={
                  aboutContent.storySection?.imageAlt ||
                  "Sunbrix construction site showcasing our expertise"
                }
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {aboutContent.valuesSection?.title || "Our Values"}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              {aboutContent.valuesSection?.subtitle ||
                "The principles that guide everything we do"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {aboutContent.valuesSection?.values?.map((value) => (
              <div key={value.id} className="text-center">
                <div className="flex justify-center mx-auto mb-3 sm:mb-4">
                  <Image
                    src={value.icon}
                    alt={value.iconAlt || value.title}
                    width={80}
                    height={80}
                    className="w-16 h-16 sm:w-20 sm:h-20"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                  {value.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-700">
                  {value.description}
                </p>
              </div>
            )) || (
              <>
                {/* Quality */}
                <div className="text-center">
                  <div className="flex justify-center mx-auto mb-3 sm:mb-4">
                    <Image
                      src="/icons/about-us/Quality First.svg"
                      alt="Quality First"
                      width={80}
                      height={80}
                      className="w-16 h-16 sm:w-20 sm:h-20"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    Quality First
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    We use only certified-grade materials and work with trusted
                    professionals to ensure the highest standards.
                  </p>
                </div>

                {/* Transparency */}
                <div className="text-center">
                  <div className="flex justify-center mx-auto mb-3 sm:mb-4">
                    <Image
                      src="/icons/about-us/Transparency.svg"
                      alt="Transparency"
                      width={80}
                      height={80}
                      className="w-16 h-16 sm:w-20 sm:h-20"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    Transparency
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    Clear pricing, regular updates, and no hidden surprises.
                    You'll know exactly what to expect at every step.
                  </p>
                </div>

                {/* Innovation */}
                <div className="text-center">
                  <div className="flex justify-center mx-auto mb-3 sm:mb-4">
                    <Image
                      src="/icons/about-us/Innovation.svg"
                      alt="Innovation"
                      width={80}
                      height={80}
                      className="w-16 h-16 sm:w-20 sm:h-20"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    Innovation
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    We leverage technology and modern construction methods to
                    deliver better homes faster and more efficiently.
                  </p>
                </div>

                {/* Customer Focus */}
                <div className="text-center">
                  <div className="flex justify-center mx-auto mb-3 sm:mb-4">
                    <Image
                      src="/icons/about-us/Customer Focus.svg"
                      alt="Customer Focus"
                      width={80}
                      height={80}
                      className="w-16 h-16 sm:w-20 sm:h-20"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    Customer Focus
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700">
                    Your vision is our priority. We work closely with you to
                    ensure your dream home becomes reality.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <ContactForm title="Contact Us" />

      {/* Floating Contact Us Button */}
      <FloatingBookButton />
    </div>
  );
}
