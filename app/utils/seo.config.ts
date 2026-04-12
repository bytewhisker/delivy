import { Metadata } from 'next';

export const SEO_CONFIG = {
  siteName: 'DeliveryDei',
  siteUrl: 'https://deliverydei.com',
  companyName: 'DeliveryDei Ltd.',
  defaultTitle: 'DeliveryDei | Bangladesh\'s Fastest Food, Cake & Parcel Delivery',
  defaultDescription: 'Fast, safe, and reliable delivery for food, cakes, and mini parcels in Bangladesh. Best logistics partner for Dhaka merchants and f-commerce businesses.',
  twitterHandle: '@deliverydei',
  themeColor: '#FF6B00',
  language: 'en-BD',
  ogImage: '/images/og-main.png',
  
  // Business Info Placeholders
  contact: {
    phone: '+880-XXXX-XXXXXX', // TODO: BUSINESS_INPUT
    email: 'support@deliverydei.com',
    address: {
      street: 'Your Office Street',
      city: 'Dhaka',
      postalCode: '1200',
      country: 'Bangladesh'
    }
  },
  
  social: {
    facebook: 'https://facebook.com/deliverydei',
    instagram: 'https://instagram.com/deliverydei',
    linkedin: 'https://linkedin.com/company/deliverydei'
  }
};

export const titleTemplate = (title: string) => `${title} | ${SEO_CONFIG.siteName}`;
