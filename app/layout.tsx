import type { Metadata } from 'next';
import './styles/globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  metadataBase: new URL('https://deliverydei.com'),
  title: 'DeliveryDei – Fast Food, Cake & Parcel Delivery for Local Businesses in Bangladesh',
  description: 'Support local businesses with DeliveryDei. Fast, safe & affordable delivery for food, cakes & parcels. The alternative to FoodPanda. No commission cuts, just reliable service.',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><rect width="180" height="180" fill="%23FF6B00"/><text x="90" y="130" font-size="120" font-weight="900" font-style="italic" font-family="Outfit, sans-serif" fill="white" text-anchor="middle" dominant-baseline="middle">D</text></svg>',
        type: 'image/svg+xml',
        sizes: 'any',
      }
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
  },
  other: {
    'copyright': '© 2026 DeliveryDei Ltd. All rights reserved.',
    'author': 'DeliveryDei Ltd.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Hind+Siliguri:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/aos@2.3.1/dist/aos.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css" />
      </head>
      <body>
        {children}
        <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" strategy="afterInteractive" />
        <Script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js" strategy="afterInteractive" />

        {/* Code & Design Protection */}
        <Script
          dangerouslySetInnerHTML={{
            __html: `
              // Disable right-click on production
              if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
                document.addEventListener('contextmenu', (e) => {
                  e.preventDefault();
                });

                // Disable DevTools keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key === 'u')) {
                    e.preventDefault();
                  }
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
