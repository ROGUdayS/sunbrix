"use client";

import { useEffect, useState } from "react";
import { isPageEnabled } from "../../lib/data-provider-client";

interface PageGuardProps {
  pageId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
}

export default function PageGuard({
  pageId,
  children,
  fallback = null,
  loading = <div>Loading...</div>,
}: PageGuardProps) {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPageStatus = async () => {
      try {
        const enabled = await isPageEnabled(pageId);
        setIsEnabled(enabled);
      } catch (error) {
        console.error("Error checking page status:", error);
        // Default to enabled on error
        setIsEnabled(true);
      }
    };

    checkPageStatus();
  }, [pageId]);

  // Show loading state while checking
  if (isEnabled === null) {
    return <>{loading}</>;
  }

  // If page is disabled, show fallback or nothing
  if (!isEnabled) {
    return <>{fallback}</>;
  }

  // Page is enabled, show children
  return <>{children}</>;
}
