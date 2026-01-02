// src/lib/media/cloudflareImage.ts

const CF_BASE =
  typeof window !== "undefined"
    ? window.location.origin
    : "";

export function cfImage(
  src?: string,
  options?: {
    width?: number;
    quality?: number;
  }
) {
  if (!src) return src;

  // Already Cloudflare optimized → do nothing
  if (
    src.includes("imagedelivery.net") ||
    src.includes("/cdn-cgi/image")
  ) {
    return src;
  }

  const params = [
    options?.width && `width=${options.width}`,
    `quality=${options?.quality ?? 80}`,
    "format=auto",
  ]
    .filter(Boolean)
    .join(",");

  return `${CF_BASE}/cdn-cgi/image/${params}/${encodeURIComponent(
    src
  )}`;
}
