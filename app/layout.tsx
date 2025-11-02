import type { Metadata } from "next";
import "./globals.css";
import { CityProvider } from "./contexts/CityContext";
import CityModal from "./components/CityModal";
import Footer from "./components/Footer";
import GoogleTagManager, {
  GoogleTagManagerNoScript,
} from "./components/GoogleTagManager";

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
    ],
    apple: "/favicon.ico",
    shortcut: "/favicon.ico",
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="msapplication-TileImage" content="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff" />
        <GoogleTagManager />
      </head>
      <body className="antialiased">
        <GoogleTagManagerNoScript />
        <CityProvider>
          {children}
          <CityModal />
          <Footer />
        </CityProvider>
      </body>
    </html>
  );
}
