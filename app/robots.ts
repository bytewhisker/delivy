import { MetadataRoute } from 'next';
import { SEO_CONFIG } from './utils/seo.config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/auth/',
          '/*?page=', // Prevent crawling duplicate paginated pages if not canonical
        ],
      },
    ],
    sitemap: `${SEO_CONFIG.siteUrl}/sitemap.xml`,
  };
}
