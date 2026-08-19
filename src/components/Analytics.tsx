'use client'

import Script from 'next/script'
import { useConsent } from '@/lib/useConsent'

// Third-party trackers load ONLY after the visitor opts in via the consent
// banner: Google Analytics behind `analytics` consent, Meta Pixel behind
// `marketing` consent. With no consent (or with the env vars unset) nothing is
// injected — safe by default and independent of the hosting platform.
export function Analytics() {
  const { consent } = useConsent()
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID

  return (
    <>
      {gaId && consent?.analytics && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}
      {fbPixelId && consent?.marketing && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${fbPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  )
}
