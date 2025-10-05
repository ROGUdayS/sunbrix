#!/usr/bin/env tsx

/**
 * Sync Page Configuration Data Script
 *
 * This script fetches page configuration data from the dashboard API
 * and saves it to the static JSON file for production builds.
 */

import { promises as fs } from "fs";
import path from "path";
import "dotenv/config";

interface PageConfig {
  id: string;
  pageId: string;
  pageName: string;
  enabled: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface SyncMeta {
  lastSync: string;
  source: string;
  pageConfigs: {
    total: number;
    enabled: number;
    disabled: number;
  };
}

async function syncPageConfigData(): Promise<void> {
  try {
    console.log("Starting page config data sync...");

    // Get dashboard URL from environment
    const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL;
    if (!dashboardUrl) {
      throw new Error(
        "NEXT_PUBLIC_DASHBOARD_URL not found in environment variables"
      );
    }

    console.log(`Fetching page config from: ${dashboardUrl}/api/page-config`);

    // Fetch page config data from dashboard
    const response = await fetch(`${dashboardUrl}/api/page-config`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const pageConfigs: PageConfig[] = await response.json();
    console.log(`Fetched ${pageConfigs.length} page configurations`);

    // Ensure public/data directory exists
    const dataDir = path.join(process.cwd(), "public", "data");
    await fs.mkdir(dataDir, { recursive: true });

    // Write to JSON file
    const filePath = path.join(dataDir, "page-config.json");
    await fs.writeFile(filePath, JSON.stringify(pageConfigs, null, 2), "utf8");

    console.log(`Page config data saved to: ${filePath}`);

    // Log summary
    const enabledPages = pageConfigs.filter((config) => config.enabled);
    const disabledPages = pageConfigs.filter((config) => !config.enabled);

    console.log("\nSummary:");
    console.log(`   • Total pages: ${pageConfigs.length}`);
    console.log(`   • Enabled: ${enabledPages.length}`);
    console.log(`   • Disabled: ${disabledPages.length}`);

    if (disabledPages.length > 0) {
      console.log("\n Disabled pages:");
      disabledPages.forEach((page) => {
        console.log(`   • ${page.pageName} (${page.pageId})`);
      });
    }

    console.log("\nPage config sync completed successfully!");

    // Update sync metadata
    const syncMeta: SyncMeta = {
      lastSync: new Date().toISOString(),
      source: "dashboard-api",
      pageConfigs: {
        total: pageConfigs.length,
        enabled: enabledPages.length,
        disabled: disabledPages.length,
      },
    };

    const metaPath = path.join(dataDir, "sync-meta.json");
    let existingMeta: Record<string, unknown> = {};
    try {
      const metaContent = await fs.readFile(metaPath, "utf8");
      existingMeta = JSON.parse(metaContent);
    } catch {
      // File doesn't exist, use empty object
    }

    const updatedMeta = {
      ...existingMeta,
      pageConfig: syncMeta,
    };

    await fs.writeFile(metaPath, JSON.stringify(updatedMeta, null, 2), "utf8");
    console.log("Sync metadata updated");
  } catch (error) {
    console.error(
      "Error syncing page config data:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

// Run the sync if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  syncPageConfigData();
}

export { syncPageConfigData };
