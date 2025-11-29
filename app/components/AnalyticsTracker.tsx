"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { parseTrafficSource } from "@/lib/traffic-source";

// Generate or retrieve session ID
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
}

// Get user ID from localStorage if available
function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("analytics_user_id");
}

// Track analytics event
async function trackEvent(
  eventType: string,
  eventData?: Record<string, any>,
  duration?: number
) {
  try {
    const trackingUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!trackingUrl) {
      console.warn("Analytics tracking URL not configured");
      return;
    }

    // Check if we're on the correct domain
    if (typeof window !== "undefined") {
      const currentUrl = window.location.origin;
      if (!currentUrl.startsWith(trackingUrl.replace(/\/$/, ""))) {
        return; // Don't track if not on the configured domain
      }
    }

    const sessionId = getSessionId();
    const userId = getUserId();

    // Parse traffic source for page_view events
    let trafficSourceData = null;
    if (eventType === "page_view") {
      const currentUrl = window.location.href;
      trafficSourceData = parseTrafficSource(document.referrer || null, currentUrl);
    }

    const payload = {
      event_type: eventType,
      page_path: window.location.pathname + window.location.search,
      page_title: document.title,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      language: navigator.language,
      session_id: sessionId,
      user_id: userId,
      event_data: trafficSourceData 
        ? { ...eventData, traffic_source: trafficSourceData }
        : eventData || null,
      duration: duration || null,
    };

    // Fire and forget - don't await response to avoid blocking main thread
    fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true, // Ensure request completes even if page unloads
    }).catch((err) => {
      // Silently fail for network errors to avoid console noise
      if (process.env.NODE_ENV === "development") {
        console.warn("Analytics tracking failed:", err);
      }
    });


  } catch (error) {
    // Only log unexpected errors, not network issues or temporary unavailability
    if (error instanceof TypeError && error.message.includes("fetch")) {
      // Network error - silently fail
      return;
    }
    console.error("Analytics tracking error:", error);
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionStartTime = useRef<number>(Date.now());
  const lastPathname = useRef<string>("");

  useEffect(() => {
    // Track page view on route change
    const currentPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
    
    if (lastPathname.current !== currentPath) {
      // Calculate duration for previous page
      if (lastPathname.current) {
        const duration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
        trackEvent("page_exit", { path: lastPathname.current }, duration);
      }

      // Track new page view
      sessionStartTime.current = Date.now();
      lastPathname.current = currentPath;
      
      setTimeout(() => {
        trackEvent("page_view", {
          path: currentPath,
          timestamp: new Date().toISOString(),
        });
      }, 100);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    // Track session start
    trackEvent("session_start", {
      timestamp: new Date().toISOString(),
    });

    // Track clicks on links and buttons
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      const button = target.closest("button");
      
      if (link) {
        const href = link.getAttribute("href");
        if (href && !href.startsWith("#") && !href.startsWith("javascript:")) {
          trackEvent("link_click", {
            href,
            text: link.textContent?.trim() || "",
            target: link.getAttribute("target") || "_self",
          });
        }
      } else if (button) {
        trackEvent("button_click", {
          text: button.textContent?.trim() || "",
          type: button.getAttribute("type") || "button",
        });
      }
    };

    // Track form submissions
    const handleSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      trackEvent("form_submit", {
        form_id: form.id || form.name || "unknown",
        action: form.action || "",
        method: form.method || "get",
      });
    };

    // Track scroll depth
    let maxScroll = 0;
    const handleScroll = () => {
      const scrollPercent = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      );
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        // Track at 25%, 50%, 75%, 100%
        if ([25, 50, 75, 100].includes(scrollPercent)) {
          trackEvent("scroll_depth", {
            depth: scrollPercent,
            path: window.location.pathname,
          });
        }
      }
    };

    // Track time on page
    const timeOnPageInterval = setInterval(() => {
      const duration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      if (duration > 0 && duration % 30 === 0) {
        // Track every 30 seconds
        trackEvent("time_on_page", {
          duration,
          path: window.location.pathname,
        });
      }
    }, 30000);

    // Track page exit
    const handlePageHide = () => {
      const duration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      // Use sendBeacon for reliable tracking on page unload
      const trackingUrl = process.env.NEXT_PUBLIC_SITE_URL;
      if (trackingUrl && navigator.sendBeacon) {
        const sessionId = getSessionId();
        const userId = getUserId();
        const payload = JSON.stringify({
          event_type: "page_exit",
          page_path: window.location.pathname + window.location.search,
          page_title: document.title,
          session_id: sessionId,
          user_id: userId,
          duration,
        });
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/analytics", blob);
      } else {
        trackEvent("page_exit", { path: window.location.pathname }, duration);
      }
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleSubmit);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pagehide", handlePageHide);
      clearInterval(timeOnPageInterval);
    };
  }, []);

  return null; // This component doesn't render anything
}

// Export helper functions for business-specific tracking
export function trackProjectClick(projectId: string, projectTitle: string, location: string) {
  trackEvent("project_card_click", {
    project_id: projectId,
    project_title: projectTitle,
    location: location,
  });
}

export function trackPackageView(packageName: string, city: string, price?: string | number) {
  trackEvent("package_view", {
    package_name: packageName,
    city: city,
    price: price || null,
  });
}

export function trackPackageSectionExpand(packageName: string, sectionTitle: string) {
  trackEvent("package_section_expand", {
    package_name: packageName,
    section_title: sectionTitle,
  });
}

export function trackPackageSectionCollapse(packageName: string, sectionTitle: string) {
  trackEvent("package_section_collapse", {
    package_name: packageName,
    section_title: sectionTitle,
  });
}

export function trackCityChange(oldCity: string | null, newCity: string) {
  trackEvent("city_change", {
    old_city: oldCity || "none",
    new_city: newCity,
  });
}

export function trackFormFieldFocus(formId: string, fieldName: string, fieldType: string) {
  trackEvent("form_field_focus", {
    form_id: formId,
    field_name: fieldName,
    field_type: fieldType,
  });
}

export function trackFormFieldChange(formId: string, fieldName: string, fieldType: string, valueLength: number) {
  trackEvent("form_field_change", {
    form_id: formId,
    field_name: fieldName,
    field_type: fieldType,
    value_length: valueLength,
  });
}

export function trackFormFieldBlur(formId: string, fieldName: string, fieldType: string) {
  trackEvent("form_field_blur", {
    form_id: formId,
    field_name: fieldName,
    field_type: fieldType,
  });
}

