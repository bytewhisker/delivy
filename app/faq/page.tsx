import { Metadata } from 'next';
import { METADATA_MAP } from '../utils/metadata-map';
import { getFAQSchema } from '../utils/schema-helpers';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Breadcrumbs from '../components/Breadcrumbs';

export const metadata: Metadata = {
  title: METADATA_MAP.faq.title,
  description: METADATA_MAP.faq.description,
};

const FAQS = [
  { q: "What is the delivery charge in Dhaka?", a: "Our standard delivery in Dhaka starts from ৳80. Instant delivery starts from ৳100." },
  { q: "Do you deliver cakes safely?", a: "Yes, we have specialized cake-handling riders and equipment designed for fragile items." },
  { q: "How fast is express delivery?", a: "Express or Instant delivery typically takes 60-90 minutes depending on the distance." },
  { q: "When do merchants get paid for COD?", a: "We process merchant payments on a next-day cycle (T+1)." }
];

export default function FAQPage() {
  const schema = getFAQSchema(FAQS);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Header />
      <main className="container" style={{ paddingTop: '120px' }}>
        <Breadcrumbs items={[{ name: 'Support', item: '/support' }, { name: 'FAQ', item: '/faq' }]} />
        
        <section className="faq-section">
          <div className="section-label">Support</div>
          <h1 className="section-title">Frequently Asked <span className="gradient-text">Questions</span></h1>
          
          <div className="faq-list" style={{ marginTop: '3rem', maxWidth: '800px' }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ marginBottom: '2rem', padding: '2rem', background: '#fff', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--p)' }}>{faq.q}</h3>
                <p style={{ color: 'var(--text-m)', lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
