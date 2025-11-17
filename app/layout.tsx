import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { CityProvider } from "./contexts/CityContext";
import CityModal from "./components/CityModal";
import Footer from "./components/Footer";
import GoogleTagManager, {
  GoogleTagManagerNoScript,
} from "./components/GoogleTagManager";
import AnalyticsTracker from "./components/AnalyticsTracker";

export const metadata: Metadata = {
  metadataBase: new URL("https://sunbrix.co"),
  title: "Sunbrix - Building homes Since 1999",
  description:
    "Build your dream home hassle-free with Sunbrix. High-quality materials, transparent pricing, and on-time delivery.",
  keywords:
    "home construction, dream home, Sunbrix homes, house building, construction company",
  alternates: {
    canonical: "https://sunbrix.co",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sunbrix",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="msapplication-TileImage" content="/icon-192.png" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <GoogleTagManager />
      </head>
      <body className="antialiased">
        <GoogleTagManagerNoScript />
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <CityProvider>
          {children}
          <CityModal />
          <Footer />
        </CityProvider>
      </body>
    </html>
  );
}
