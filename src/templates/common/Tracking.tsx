import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Tracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Google Analytics 4
    const gaScript1 = document.createElement("script");
    gaScript1.async = true;
    gaScript1.src = "https://www.googletagmanager.com/gtag/js?id=G-YZLLC4DES1";
    document.head.appendChild(gaScript1);

    const gaScript2 = document.createElement("script");
    gaScript2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-YZLLC4DES1');
      gtag('config', 'GT-K8FLQF8H');
    `;
    document.head.appendChild(gaScript2);

    // Google Ads
    const gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=AW-17754016716";
    document.head.appendChild(gtagScript);

    const gtagConfig = document.createElement("script");
    gtagConfig.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'AW-17754016716');
      gtag('config', 'GT-T9KB44PR');
    `;
    document.head.appendChild(gtagConfig);

    // Facebook Pixel
    const fbScript = document.createElement("script");
    fbScript.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '1080640150838893');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(fbScript);

    const fbNoScript = document.createElement("noscript");
    fbNoScript.innerHTML = `
      <img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=1080640150838893&ev=PageView&noscript=1"/>
    `;
    document.body.appendChild(fbNoScript);

    // Facebook Domain Verification
    const fbDomainMeta = document.createElement("meta");
    fbDomainMeta.name = "facebook-domain-verification";
    fbDomainMeta.content = "csm6vhc53r85yf2v6wdgeljchtb5xb";
    document.head.appendChild(fbDomainMeta);

    return () => {
      // Cleanup scripts on unmount
      document.head.removeChild(gaScript1);
      document.head.removeChild(gaScript2);
      document.head.removeChild(gtagScript);
      document.head.removeChild(gtagConfig);
      document.head.removeChild(fbScript);
      document.body.removeChild(fbNoScript);
      document.head.removeChild(fbDomainMeta);
    };
  }, []);

  // Track page views
  useEffect(() => {
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search,
      });
    }
    
    if (window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [location]);

  return null;
};

// Type declarations for tracking functions
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

export default Tracking;
