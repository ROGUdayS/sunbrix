"use client";

import { getDataMode } from "@/lib/data-provider-client";

export default function DataModeIndicator() {
  const mode = getDataMode();

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black bg-opacity-80 text-white px-3 py-2 rounded-lg text-sm font-mono">
      Data Mode:{" "}
      <span className={mode === "api" ? "text-yellow-400" : "text-green-400"}>
        {mode.toUpperCase()}
      </span>
    </div>
  );
}
