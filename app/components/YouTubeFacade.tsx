"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface YouTubeFacadeProps {
  videoUrl: string;
  title: string;
  className?: string;
}

export default function YouTubeFacade({
  videoUrl,
  title,
  className = "",
}: YouTubeFacadeProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [thumbnailSrc, setThumbnailSrc] = useState<string | null>(null);

  // Helper to extract video ID
  const getVideoId = (url: string): string | null => {
    if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1]?.split("?")[0] || null;
    } else if (url.includes("youtube.com/watch?v=")) {
      return url.split("v=")[1]?.split("&")[0] || null;
    } else if (url.includes("youtube.com/embed/")) {
      return url.split("embed/")[1]?.split("?")[0] || null;
    }
    return null;
  };

  const videoId = getVideoId(videoUrl);

  useEffect(() => {
    if (videoId) {
      setThumbnailSrc(
        `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      );
    } else {
      setThumbnailSrc(null);
    }
  }, [videoId]);

  if (!videoId || !thumbnailSrc) {
    return null;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  const handleThumbnailError = () => {
    // Fallback if maxres thumbnail is unavailable
    if (thumbnailSrc.includes("maxresdefault")) {
      setThumbnailSrc(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
    }
  };

  if (showVideo) {
    return (
      <iframe
        className={className}
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <div
      className={`relative cursor-pointer group ${className}`}
      onClick={() => setShowVideo(true)}
      role="button"
      aria-label={`Play video: ${title}`}
    >
      <Image
        src={thumbnailSrc}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={handleThumbnailError}
      />
      {/* Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
          <svg
            className="w-8 h-8 text-white ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
