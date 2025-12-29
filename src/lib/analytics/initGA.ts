export function initGA() {
  if (typeof window === "undefined") return;

  const id = import.meta.env.VITE_GA4_MEASUREMENT_ID;
  if (!id) return;

  // Prevent double init
  if ((window as any).__ga_initialized) return;
  (window as any).__ga_initialized = true;

  // Inject gtag script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  // Init gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", id, {
    send_page_view: false, // IMPORTANT: you control page_view manually
  });
}
