import { MetadataRoute } from 'next';
import { SEO_CONFIG } from './utils/seo.config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SEO_CONFIG.siteUrl;

  const corePages = [
    '',
    '/about',
    '/contact',
    '/pricing',
    '/track-order',
    '/merchant-signup',
    '/rider-signup',
    '/services',
    '/services/food-delivery',
    '/services/cake-delivery',
    '/services/small-parcel-delivery',
    '/merchants',
    '/riders',
    '/faq',
    '/privacy-policy',
    '/terms',
  ];

  const locationPages = [
    '/locations/dhaka',
    '/locations/chattogram',
    '/locations/sylhet',
    '/locations/khulna',
    '/locations/rajshahi',
  ];

  const allPages = [...corePages, ...locationPages].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: (path === '' ? 'daily' : 'weekly') as any,
    priority: path === '' ? 1 : 0.8,
  }));

  return allPages;
}
