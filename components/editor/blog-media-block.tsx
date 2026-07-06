"use client";

import { Image as ImageIcon } from "lucide-react";

interface BlogMediaBlockProps {
  imageUrl: string | null;
  prompt: string | null;
  altText: string | null;
  variant?: "banner" | "infographic";
}

/**
 * Renders a media asset at its position in the article — a real `<img>`
 * once `image_url` has been resolved (Finisher's `fetch_media_images` node,
 * via Google Images/SerpAPI), falling back to a gradient placeholder
 * showing the generation prompt while resolution is pending or unconfigured.
 */
export function BlogMediaBlock({ imageUrl, prompt, altText, variant = "infographic" }: BlogMediaBlockProps) {
  const aspect = variant === "banner" ? "aspect-[2/1]" : "aspect-[16/9]";

  if (imageUrl) {
    return (
      <figure className={variant === "banner" ? "mb-8" : "my-6"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={altText ?? prompt ?? ""}
          className={`w-full ${aspect} object-cover rounded-lg border border-border`}
        />
        {variant === "infographic" && altText && (
          <figcaption className="text-data-label text-graphite mt-2 text-center">{altText}</figcaption>
        )}
      </figure>
    );
  }

  return (
    <div
      className={`w-full ${aspect} rounded-lg ${variant === "banner" ? "mb-8" : "my-6"} bg-gradient-to-br from-proof-blue/40 via-violet/30 to-surface-container-highest flex items-end p-5 relative overflow-hidden`}
    >
      <ImageIcon className="absolute top-4 right-4 w-5 h-5 text-white/50" />
      {prompt && <p className="text-data-label text-white/70 line-clamp-2">{prompt}</p>}
    </div>
  );
}
