import { Metadata } from 'next';
import { METADATA_MAP } from './utils/metadata-map';
import { getOrgSchema, getLocalBusinessSchema } from './utils/schema-helpers';
import HomeContent from './HomeContent';

export const metadata: Metadata = {
  title: METADATA_MAP.home.title,
  description: METADATA_MAP.home.description,
  alternates: {
    canonical: 'https://deliverydei.com',
  },
  openGraph: {
    title: METADATA_MAP.home.title,
    description: METADATA_MAP.home.description,
    url: 'https://deliverydei.com',
    siteName: 'DeliveryDei',
    images: [
      {
        url: '/images/og-main.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_BD',
    type: 'website',
  },
};

export default function Home() {
  const orgSchema = getOrgSchema();
  const businessSchema = getLocalBusinessSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      <HomeContent />
    </>
  );
}
