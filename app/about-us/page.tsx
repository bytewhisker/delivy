import { Metadata } from 'next';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
  title: 'About Us | DeliveryDei',
  description: 'Learn about DeliveryDei, a modern delivery service built to support local businesses across Bangladesh. Fast, safe, and reliable.',
};

export default function AboutPage() {
  return <AboutContent />;
}
