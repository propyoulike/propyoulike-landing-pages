// src/lib/media/getCdnImage.ts
export function getCdnImage(
  url?: string,
  opts?: { width?: number; quality?: number }
) {
  if (!url) return "";

  // Never wrap local assets
  if (url.startsWith("/") || url.startsWith("data:")) {
    return url;
  }

  const width = opts?.width ?? 640;
  const quality = opts?.quality ?? 75;

  return `https://propyoulike.com/cdn-cgi/image/width=${width},quality=${quality},format=auto/${encodeURIComponent(
    url
  )}`;
}
