import Link from "next/link";
import Image from "next/image";
import FooterNavigation from "./FooterNavigation";
import { getCompanySettings, isPageEnabled } from "@/lib/data-provider";

interface CompanySettings {
  company_name: string;
  contact_email: string;
  contact_phone: string;
  show_facebook: boolean;
  facebook_url: string | null;
  show_instagram: boolean;
  instagram_url: string | null;
  show_google: boolean;
  google_url: string | null;
  show_youtube: boolean;
  youtube_url: string | null;
}

async function getCompanySettingsForFooter(): Promise<CompanySettings> {
  try {
    // Use server-side data provider which respects static/API mode
    const settings = await getCompanySettings();

    // Validate that we got actual settings data
    if (
      settings &&
      typeof settings === "object" &&
      Object.keys(settings).length > 0
    ) {
      // Helper to ensure boolean values are properly converted
      // Handles cases where API might return strings, numbers, or null
      const toBoolean = (value: unknown): boolean => {
        if (value === true || value === "true" || value === 1 || value === "1")
          return true;
        if (
          value === false ||
          value === "false" ||
          value === 0 ||
          value === "0"
        )
          return false;
        return false;
      };

      // ALWAYS log raw settings for debugging in production
      console.log(
        "[FOOTER] Raw settings received:",
        JSON.stringify(
          {
            show_facebook: settings.show_facebook,
            show_facebook_type: typeof settings.show_facebook,
            facebook_url: settings.facebook_url,
            show_instagram: settings.show_instagram,
            show_instagram_type: typeof settings.show_instagram,
            instagram_url: settings.instagram_url,
            show_google: settings.show_google,
            show_google_type: typeof settings.show_google,
            google_url: settings.google_url,
            show_youtube: settings.show_youtube,
            show_youtube_type: typeof settings.show_youtube,
            youtube_url: settings.youtube_url,
            allKeys: Object.keys(settings),
          },
          null,
          2
        )
      );

      // Helper to normalize URL - ensure empty strings become null
      const normalizeUrl = (url: unknown): string | null => {
        if (!url || typeof url !== "string" || url.trim() === "") return null;
        return url.trim();
      };

      // Ensure all required fields exist with proper defaults and convert booleans
      const processedSettings = {
        company_name: settings.company_name || "SUNBRIX Constructions",
        contact_email: settings.contact_email || "sunbrix.co@gmail.com",
        contact_phone: settings.contact_phone || "+91 8867920940",
        show_facebook: toBoolean(settings.show_facebook),
        facebook_url: normalizeUrl(settings.facebook_url),
        show_instagram: toBoolean(settings.show_instagram),
        instagram_url: normalizeUrl(settings.instagram_url),
        show_google: toBoolean(settings.show_google),
        google_url: normalizeUrl(settings.google_url),
        show_youtube: toBoolean(settings.show_youtube),
        youtube_url: normalizeUrl(settings.youtube_url),
      };

      // ALWAYS log processed settings for debugging in production
      console.log(
        "[FOOTER] Processed settings:",
        JSON.stringify(
          {
            show_facebook: processedSettings.show_facebook,
            has_facebook_url: !!processedSettings.facebook_url,
            facebook_url: processedSettings.facebook_url,
            will_show_facebook:
              processedSettings.show_facebook &&
              !!processedSettings.facebook_url,
            show_instagram: processedSettings.show_instagram,
            has_instagram_url: !!processedSettings.instagram_url,
            instagram_url: processedSettings.instagram_url,
            will_show_instagram:
              processedSettings.show_instagram &&
              !!processedSettings.instagram_url,
            show_google: processedSettings.show_google,
            has_google_url: !!processedSettings.google_url,
            google_url: processedSettings.google_url,
            will_show_google:
              processedSettings.show_google && !!processedSettings.google_url,
            show_youtube: processedSettings.show_youtube,
            has_youtube_url: !!processedSettings.youtube_url,
            youtube_url: processedSettings.youtube_url,
            will_show_youtube:
              processedSettings.show_youtube && !!processedSettings.youtube_url,
          },
          null,
          2
        )
      );

      return processedSettings;
    } else {
      console.warn(
        "[FOOTER] getCompanySettings returned empty or invalid data, using fallback"
      );
    }
  } catch (error) {
    console.error("[FOOTER] Failed to fetch company settings:", error);
  }

  // Return fallback defaults if fetch fails
  return {
    company_name: "SUNBRIX Constructions",
    contact_email: "sunbrix.co@gmail.com",
    contact_phone: "+91 8867920940",
    show_facebook: false,
    facebook_url: null,
    show_instagram: false,
    instagram_url: null,
    show_google: false,
    google_url: null,
    show_youtube: false,
    youtube_url: null,
  };
}

export default async function Footer() {
  const settings = await getCompanySettingsForFooter();
  const isPrivacyEnabled = await isPageEnabled("privacy-policy");
  const isTermsEnabled = await isPageEnabled("terms-conditions");

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-5">
            <div className="mb-6">
              <Image
                src="/logos/horizontal-logo/LOGO-WHITE-H.svg"
                alt="Sunbrix"
                width={150}
                height={50}
                className="h-12 w-auto"
                priority
              />
            </div>
            <p className="text-gray-300 mb-8 text-base leading-relaxed max-w-md">
              Browse ideas, explore options and book a meeting with our expert
              consultants to finalise your design.
            </p>
            <div className="space-y-3 mb-8">
              <div className="text-base font-semibold text-white">
                Get in touch
              </div>
              <a
                href={`mailto:${settings.contact_email || ""}`}
                className="text-base text-orange-400 hover:text-orange-300 transition-colors block"
              >
                {settings.contact_email || "Contact Email"}
              </a>
              <a
                href={`tel:${(settings.contact_phone || "").replace(
                  /\s+/g,
                  ""
                )}`}
                className="text-base text-orange-400 hover:text-orange-300 transition-colors block"
              >
                {settings.contact_phone || "Contact Number"}
              </a>
            </div>
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              {/* Debug info - remove after fixing */}
              {process.env.NEXT_PUBLIC_DEBUG_FOOTER === "true" && (
                <div className="text-xs text-red-400 mb-2">
                  Debug: FB={String(settings.show_facebook)} URL=
                  {String(settings.facebook_url?.substring(0, 20))} | IG=
                  {String(settings.show_instagram)} URL=
                  {String(settings.instagram_url?.substring(0, 20))}
                </div>
              )}
              {/* Facebook */}
              {settings.show_facebook && settings.facebook_url && (
                <Link
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Link>
              )}

              {/* Instagram */}
              {settings.show_instagram && settings.instagram_url && (
                <Link
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </Link>
              )}

              {/* Google */}
              {settings.show_google && settings.google_url && (
                <Link
                  href={settings.google_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Google"
                >
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </Link>
              )}

              {/* YouTube */}
              {settings.show_youtube && settings.youtube_url && (
                <Link
                  href={settings.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Company Section */}
          <FooterNavigation />

          {/* Legal Section - Only show if at least one legal page is enabled */}
          {(isPrivacyEnabled || isTermsEnabled) && (
            <div className="lg:col-span-3">
              <h3 className="text-xl font-semibold mb-6 text-white">Legal</h3>
              <ul className="space-y-4 text-base text-gray-300">
                {isTermsEnabled && (
                  <li>
                    <Link
                      href="/terms"
                      className="hover:text-white transition-colors"
                    >
                      Terms & Conditions
                    </Link>
                  </li>
                )}
                {isPrivacyEnabled && (
                  <li>
                    <Link
                      href="/privacy"
                      className="hover:text-white transition-colors"
                    >
                      Privacy policy
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
