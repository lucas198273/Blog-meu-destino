import { useEffect, type ReactNode } from 'react';

const gtmId = import.meta.env.VITE_GTM_ID?.trim();

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!gtmId || document.getElementById('gtm-script')) return;

    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });

    const script = document.createElement('script');
    script.id = 'gtm-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
    document.head.appendChild(script);
  }, []);

  return children;
}
