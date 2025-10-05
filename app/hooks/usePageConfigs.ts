"use client";

import { useEffect, useState } from "react";
import { getPageConfigs, PageConfigData } from "../../lib/data-provider-client";

export function usePageConfigs() {
  const [configs, setConfigs] = useState<PageConfigData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        setLoading(true);
        const pageConfigs = await getPageConfigs();
        setConfigs(pageConfigs);
        setError(null);
      } catch (err) {
        setError("Failed to load page configurations");
        console.error("Error loading page configs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfigs();
  }, []);

  const isPageEnabled = (pageId: string): boolean => {
    const config = configs.find((c) => c.pageId === pageId);
    return config ? config.enabled : true; // Default to enabled if not found
  };

  const getEnabledPages = (): PageConfigData[] => {
    return configs.filter((config) => config.enabled);
  };

  const getDisabledPages = (): PageConfigData[] => {
    return configs.filter((config) => !config.enabled);
  };

  return {
    configs,
    loading,
    error,
    isPageEnabled,
    getEnabledPages,
    getDisabledPages,
  };
}
