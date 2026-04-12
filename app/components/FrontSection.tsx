import Image from 'next/image';

export default function FrontSection() {
  return (
    <section className="front-section">
      <div className="container front-grid">
        <div className="front-visual" data-aos="fade-right">
          <Image 
            src="/images/front.png" 
            alt="Delivery Process" 
            className="front-img" 
            width={600} 
            height={450}
            style={{ height: 'auto', width: '100%', borderRadius: '40px' }}
          />
        </div>
        <div className="front-text" data-aos="fade-left">
          <div className="section-label">Seamless Logistics</div>
          <h2 className="section-title">Built for the <span className="gradient-text">Modern Merchant</span></h2>
          <p>Deliverydei isn't just a delivery service; it's your business partner. Scale effortlessly with our integrated tracking and reliable fleet.</p>
          <ul className="front-perks">
            <li><i className="fa-solid fa-check-circle"></i> Real-time GPS Tracking</li>
            <li><i className="fa-solid fa-check-circle"></i> Automated COD Clearance</li>
            <li><i className="fa-solid fa-check-circle"></i> Multi-zone delivery support</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
