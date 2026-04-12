import { SEO_CONFIG } from './seo.config';

export const getOrgSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': SEO_CONFIG.siteName,
  'url': SEO_CONFIG.siteUrl,
  'logo': `${SEO_CONFIG.siteUrl}/images/logo.png`,
  'sameAs': [
    SEO_CONFIG.social.facebook,
    SEO_CONFIG.social.instagram,
    SEO_CONFIG.social.linkedin
  ],
  'contactPoint': {
    '@type': 'ContactPoint',
    'telephone': SEO_CONFIG.contact.phone,
    'contactType': 'customer service',
    'areaServed': 'BD',
    'availableLanguage': ['English', 'Bengali']
  }
});

export const getLocalBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'DeliveryService',
  'name': SEO_CONFIG.siteName,
  'image': `${SEO_CONFIG.siteUrl}/images/og-main.png`,
  '@id': `${SEO_CONFIG.siteUrl}/#organization`,
  'url': SEO_CONFIG.siteUrl,
  'telephone': SEO_CONFIG.contact.phone,
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': SEO_CONFIG.contact.address.street,
    'addressLocality': SEO_CONFIG.contact.address.city,
    'postalCode': SEO_CONFIG.contact.address.postalCode,
    'addressCountry': 'BD'
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 23.8103,
    'longitude': 90.4125
  },
  'openingHoursSpecification': {
    '@type': 'OpeningHoursSpecification',
    'dayOfWeek': [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
    ],
    'opens': '08:00',
    'closes': '22:00'
  },
  'areaServed': [
    { '@type': 'City', 'name': 'Dhaka' },
    { '@type': 'City', 'name': 'Chattogram' },
    { '@type': 'City', 'name': 'Sylhet' }
  ]
});

export const getBreadcrumbSchema = (items: { name: string; item: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': items.map((it, idx) => ({
    '@type': 'ListItem',
    'position': idx + 1,
    'name': it.name,
    'item': `${SEO_CONFIG.siteUrl}${it.item}`
  }))
});

export const getServiceSchema = (name: string, description: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  'serviceType': 'DeliveryService',
  'provider': {
    '@type': 'LocalBusiness',
    'name': SEO_CONFIG.siteName
  },
  'name': name,
  'description': description,
  'areaServed': 'BD'
});

export const getFAQSchema = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': faqs.map(faq => ({
    '@type': 'Question',
    'name': faq.q,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': faq.a
    }
  }))
});
