import { Metadata } from 'next';
import { METADATA_MAP } from '../../utils/metadata-map';
import { getServiceSchema } from '../../utils/schema-helpers';
import Breadcrumbs from '../../components/Breadcrumbs';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata: Metadata = {
  title: METADATA_MAP.cakeDelivery.title,
  description: METADATA_MAP.cakeDelivery.description,
  alternates: {
    canonical: 'https://deliverydei.com/services/cake-delivery',
  },
};

export default function CakeDeliveryPage() {
  const serviceSchema = getServiceSchema(
    'Specialized Cake Delivery',
    'Safety-first cake delivery service for home bakers and boutiques in Bangladesh.'
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Header onOpenModal={() => {}} />
      <main className="container" style={{ paddingTop: '120px' }}>
        <Breadcrumbs items={[{ name: 'Services', item: '/services' }, { name: 'Cake Delivery', item: '/services/cake-delivery' }]} />
        
        <section className="service-detail">
          <div className="section-label">Safety First</div>
          <h1 className="section-title">Specialized <span className="gradient-text">Cake Delivery</span></h1>
          <p className="hero-sub">
            At DeliveryDei, we understand that cakes are fragile. That's why we've trained specialized riders and designed custom handling procedures to ensure your cakes arrive in perfect condition.
          </p>

          <div className="content-segment" style={{ marginTop: '4rem' }}>
            <h2>Why Choose Our Cake Delivery?</h2>
            <ul className="front-perks" style={{ gridTemplateColumns: '1fr 1fr', display: 'grid' }}>
              <li><i className="fa-solid fa-check-circle"></i> Suspension-friendly bikes</li>
              <li><i className="fa-solid fa-check-circle"></i> Level-surface carriage</li>
              <li><i className="fa-solid fa-check-circle"></i> Hand-to-hand careful handovers</li>
              <li><i className="fa-solid fa-check-circle"></i> Temperature-aware transport</li>
            </ul>
          </div>

          <div className="cta-box" style={{ background: '#fff', padding: '3rem', borderRadius: '30px', marginTop: '4rem', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
            <h3>Ready to send your first cake?</h3>
            <p>Join 500+ home bakers who trust us with their creations.</p>
            <button className="btn btn-primary btn-xl" style={{ marginTop: '1.5rem' }}>Get Started as Merchant</button>
          </div>
        </section>

        <section className="internal-linking" style={{ marginTop: '100px', borderTop: '1px solid #eee', paddingTop: '50px' }}>
          <h4>Serving in Major Cities</h4>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <a href="/locations/dhaka" className="btn btn-outline">Dhaka</a>
            <a href="/locations/chattogram" className="btn btn-outline">Chattogram</a>
            <a href="/locations/sylhet" className="btn btn-outline">Sylhet</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
