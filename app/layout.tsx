import type { Metadata } from "next";
import "./globals.css";
import { CityProvider } from "./contexts/CityContext";
import CityModal from "./components/CityModal";

export const metadata: Metadata = {
  title: "JSW One Homes - You Dream. We Deliver.",
  description:
    "Build your dream home hassle-free with JSW One Homes. High-quality materials, transparent pricing, and on-time delivery.",
  keywords:
    "home construction, dream home, JSW homes, house building, construction company",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CityProvider>
          {children}
          <CityModal />
        </CityProvider>
      </body>
    </html>
  );
}
