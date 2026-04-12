import type { Metadata } from 'next';
import './styles/globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  metadataBase: new URL('https://deliverydei.com'),
  title: 'Deliverydei | Bangladesh\'s Fastest Delivery Platform',
  description: 'Join Deliverydei as a Merchant or Rider. Instant, Scheduled & Same-Day delivery for parcels, food, and cakes across Bangladesh.',
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
      </body>
    </html>
  );
}
