/**
 * Traffic Source Parser
 * Identifies traffic sources from referrer URLs and UTM parameters
 */

export interface TrafficSourceData {
  source: string;
  medium: string;
  category: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

/**
 * Parse traffic source from referrer and current URL
 */
export function parseTrafficSource(
  referrer: string | null,
  currentUrl?: string
): TrafficSourceData {
  const result: TrafficSourceData = {
    source: "direct",
    medium: "none",
    category: "Direct",
  };

  // Extract UTM parameters from current URL
  if (currentUrl) {
    try {
      const url = new URL(currentUrl);
      const params = url.searchParams;
      
      if (params.has("utm_source")) {
        result.utm_source = params.get("utm_source") || undefined;
        result.source = result.utm_source.toLowerCase();
      }
      if (params.has("utm_medium")) {
        result.utm_medium = params.get("utm_medium") || undefined;
        result.medium = result.utm_medium.toLowerCase();
      }
      if (params.has("utm_campaign")) {
        result.utm_campaign = params.get("utm_campaign") || undefined;
      }
      if (params.has("utm_term")) {
        result.utm_term = params.get("utm_term") || undefined;
      }
      if (params.has("utm_content")) {
        result.utm_content = params.get("utm_content") || undefined;
      }
    } catch (e) {
      // Invalid URL, continue with referrer parsing
    }
  }

  // If UTM parameters are present, use them and categorize
  if (result.utm_source) {
    result.category = categorizeUTMSource(result.utm_source, result.utm_medium);
    return result;
  }

  // Parse referrer if no UTM parameters
  if (!referrer) {
    return result;
  }

  try {
    const referrerUrl = new URL(referrer);
    const hostname = referrerUrl.hostname.toLowerCase().replace("www.", "");

    // Check if referrer is from same domain (should be considered direct)
    if (currentUrl) {
      try {
        const currentUrlObj = new URL(currentUrl);
        const currentHostname = currentUrlObj.hostname.toLowerCase().replace("www.", "");
        if (hostname === currentHostname) {
          return result; // Same domain = direct
        }
      } catch {
        // Continue with referrer parsing
      }
    }

    // Social Media Platforms
    if (hostname.includes("instagram.com")) {
      result.source = "instagram";
      result.medium = "social";
      result.category = "Social Media";
    } else if (hostname.includes("facebook.com") || hostname.includes("fb.com")) {
      result.source = "facebook";
      result.medium = "social";
      result.category = "Social Media";
    } else if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
      result.source = "youtube";
      result.medium = "social";
      result.category = "Social Media";
    } else if (hostname.includes("twitter.com") || hostname.includes("x.com")) {
      result.source = "twitter";
      result.medium = "social";
      result.category = "Social Media";
    } else if (hostname.includes("linkedin.com")) {
      result.source = "linkedin";
      result.medium = "social";
      result.category = "Social Media";
    } else if (hostname.includes("tiktok.com")) {
      result.source = "tiktok";
      result.medium = "social";
      result.category = "Social Media";
    } else if (hostname.includes("pinterest.com")) {
      result.source = "pinterest";
      result.medium = "social";
      result.category = "Social Media";
    }
    // Search Engines
    else if (hostname.includes("google.com") || hostname.includes("google.")) {
      result.source = "google";
      result.medium = "organic";
      result.category = "Search Engine";
      
      // Check if it's a paid search (has gclid parameter)
      if (referrerUrl.searchParams.has("gclid")) {
        result.medium = "cpc";
        result.category = "Paid Search";
      }
    } else if (hostname.includes("bing.com")) {
      result.source = "bing";
      result.medium = "organic";
      result.category = "Search Engine";
    } else if (hostname.includes("yahoo.com")) {
      result.source = "yahoo";
      result.medium = "organic";
      result.category = "Search Engine";
    } else if (hostname.includes("duckduckgo.com")) {
      result.source = "duckduckgo";
      result.medium = "organic";
      result.category = "Search Engine";
    }
    // Other referrers
    else {
      result.source = hostname;
      result.medium = "referral";
      result.category = "Referral";
    }
  } catch (e) {
    // Invalid referrer URL, treat as direct
    return result;
  }

  return result;
}

/**
 * Categorize UTM source into appropriate category
 */
function categorizeUTMSource(utmSource: string, utmMedium?: string): string {
  const source = utmSource.toLowerCase();
  const medium = utmMedium?.toLowerCase() || "";

  // Social media sources
  if (
    source.includes("instagram") ||
    source.includes("facebook") ||
    source.includes("fb") ||
    source.includes("youtube") ||
    source.includes("twitter") ||
    source.includes("linkedin") ||
    source.includes("tiktok") ||
    source.includes("pinterest")
  ) {
    return "Social Media";
  }

  // Search engines
  if (
    source.includes("google") ||
    source.includes("bing") ||
    source.includes("yahoo") ||
    source.includes("duckduckgo")
  ) {
    if (medium === "cpc" || medium === "ppc") {
      return "Paid Search";
    }
    return "Search Engine";
  }

  // Email
  if (medium === "email" || source.includes("email")) {
    return "Email";
  }

  // Display/Advertising
  if (medium === "display" || medium === "banner" || medium === "cpm") {
    return "Display";
  }

  // Affiliate
  if (medium === "affiliate" || source.includes("affiliate")) {
    return "Affiliate";
  }

  // Default to Referral
  return "Referral";
}

