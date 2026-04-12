import { Metadata } from 'next';
import { METADATA_MAP } from '../../utils/metadata-map';
import Breadcrumbs from '../../components/Breadcrumbs';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata: Metadata = {
  title: METADATA_MAP.dhaka.title,
  description: METADATA_MAP.dhaka.description,
  alternates: {
    canonical: 'https://deliverydei.com/locations/dhaka',
  },
};

export default function DhakaLocationPage() {
  return (
    <>
      <Header />
      <main className="container" style={{ paddingTop: '120px' }}>
        <Breadcrumbs items={[{ name: 'Locations', item: '/locations' }, { name: 'Dhaka', item: '/locations/dhaka' }]} />
        
        <section className="location-hero">
          <div className="section-label">Local Delivery</div>
          <h1 className="section-title">Fastest Delivery in <span className="gradient-text">Dhaka</span></h1>
          <p className="hero-sub">
            From Uttara to Old Dhaka, we cover the entire capital with our specialized fleet. Get your food, cakes, and parcels delivered within 60-90 minutes.
          </p>

          <div className="coverage-zones" style={{ marginTop: '4rem' }}>
            <h2 style={{ marginBottom: '2rem' }}>Zones We Cover in Dhaka</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {[
                'Uttara', 'Banani', 'Gulshan', 'Dhanmondi', 
                'Mirpur', 'Mohammadpur', 'Badda', 'Bashundhara',
                'Motijheel', 'Old Dhaka', 'Khilgaon', 'Malibagh'
              ].map(zone => (
                <div key={zone} style={{ padding: '1rem', background: '#fff', borderRadius: '15px', fontWeight: 600, textAlign: 'center', border: '1px solid #f1f5f9' }}>
                  {zone}
                </div>
              ))}
            </div>
          </div>

          <div className="city-services" style={{ marginTop: '100px' }}>
            <h2>Available Services in Dhaka</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '2rem' }}>
              <div style={{ padding: '2rem', background: '#fff', borderRadius: '24px' }}>
                <i className="fa-solid fa-utensils" style={{ color: 'var(--p)', fontSize: '2rem' }}></i>
                <h3 style={{ margin: '1rem 0' }}>Food Delivery</h3>
                <p>Hot delivery from 1000+ restaurants.</p>
                <a href="/services/food-delivery" style={{ color: 'var(--p)', fontWeight: 700, textDecoration: 'none' }}>Learn More →</a>
              </div>
              <div style={{ padding: '2rem', background: '#fff', borderRadius: '24px' }}>
                <i className="fa-solid fa-cake-candles" style={{ color: 'var(--p)', fontSize: '2rem' }}></i>
                <h3 style={{ margin: '1rem 0' }}>Cake Delivery</h3>
                <p>Fragile handling for Dhaka home bakers.</p>
                <a href="/services/cake-delivery" style={{ color: 'var(--p)', fontWeight: 700, textDecoration: 'none' }}>Learn More →</a>
              </div>
              <div style={{ padding: '2rem', background: '#fff', borderRadius: '24px' }}>
                <i className="fa-solid fa-box-open" style={{ color: 'var(--p)', fontSize: '2rem' }}></i>
                <h3 style={{ margin: '1rem 0' }}>Parcel Delivery</h3>
                <p>Same-day mini packs for small businesses.</p>
                <a href="/services/small-parcel-delivery" style={{ color: 'var(--p)', fontWeight: 700, textDecoration: 'none' }}>Learn More →</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
