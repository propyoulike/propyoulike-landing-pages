// src/lib/media/cloudflareImage.ts

export function cfImage(
  src?: string,
  options?: {
    width?: number;
    quality?: number;
  }
) {
  if (!src) return src;

  // ❌ Never use Cloudflare resizing for external images
  if (
    src.startsWith("http://") ||
    src.startsWith("https://")
  ) {
    return src;
  }

  // ❌ Never double-process Cloudflare URLs
  if (src.includes("/cdn-cgi/")) {
    return src;
  }

  const params = [
    options?.width && `width=${options.width}`,
    `quality=${options?.quality ?? 80}`,
    "format=auto",
  ]
    .filter(Boolean)
    .join(",");

  return `/cdn-cgi/image/${params}/${src}`;
}
