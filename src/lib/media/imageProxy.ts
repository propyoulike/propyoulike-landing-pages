const IMAGE_PROXY_ORIGIN = "https://img.propyoulike.com";

export function proxyImage(
  url?: string,
  options?: {
    w?: number;
    h?: number;
    q?: number;
  }
) {
  if (!url) return "";

  // already proxied or local
  if (url.startsWith("/") || url.includes("img.propyoulike.com")) {
    return url;
  }

  const params = new URLSearchParams();
  if (options?.w) params.set("w", String(options.w));
  if (options?.h) params.set("h", String(options.h));
  if (options?.q) params.set("q", String(options.q ?? 80));

  return `${IMAGE_PROXY_ORIGIN}/cdn-cgi/image/${params.toString()}/${encodeURIComponent(
    url
  )}`;
}
