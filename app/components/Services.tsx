'use client';

interface ServicesProps {
  onOpenModal: (mode: 'login' | 'signup', role?: 'merchant' | 'rider') => void;
}

export default function Services({ onOpenModal }: ServicesProps) {
  return (
    <section id="services" className="services-section">
      <div className="container">
        <div className="section-label">Our Speeds</div>
        <h2 className="section-title">Three Ways to <span className="gradient-text">Deliver</span></h2>
        <div className="services-grid">
          <div className="service-card" data-aos="fade-up">
            <div className="service-icon-wrap scheduled-icon"><i className="fa-solid fa-calendar"></i></div>
            <h3>Scheduled</h3>
            <p className="service-bn">শিডিউল ডেলিভারি</p>
            <div className="service-price-from">From <strong>৳ 80</strong></div>
            <ul className="service-features">
              <li><i className="fa-solid fa-check"></i> Parcel & Food</li>
              <li><i className="fa-solid fa-check"></i> Cake Handling</li>
            </ul>
            <button className="btn btn-outline" style={{width:'100%', justifyContent:'center'}} onClick={() => onOpenModal('signup', 'merchant')}>Join Now</button>
          </div>
          
          <div className="service-card service-featured" data-aos="fade-up" data-aos-delay="100">
            <div className="featured-ribbon">Best Value</div>
            <div className="service-icon-wrap instant-icon"><i className="fa-solid fa-bolt"></i></div>
            <h3>Instant</h3>
            <p className="service-bn">ইনস্ট্যান্ট ডেলিভারি</p>
            <div className="service-price-from">From <strong>৳ 100</strong></div>
            <ul className="service-features">
              <li><i className="fa-solid fa-check"></i> 1-Hour Pickup</li>
              <li><i className="fa-solid fa-check"></i> Priority Support</li>
            </ul>
            <button className="btn btn-primary" style={{width:'100%', justifyContent:'center'}} onClick={() => onOpenModal('signup', 'merchant')}>Join Now</button>
          </div>
          
          <div className="service-card" data-aos="fade-up" data-aos-delay="200">
            <div className="service-icon-wrap sameday-icon"><i className="fa-solid fa-sun"></i></div>
            <h3>Same Day</h3>
            <p className="service-bn">সেম ডে ডেলিভারি</p>
            <div className="service-price-from">Flat <strong>৳ 120</strong></div>
            <ul className="service-features">
              <li><i className="fa-solid fa-check"></i> 6-8 Hour Gap</li>
              <li><i className="fa-solid fa-check"></i> Bulk Friendly</li>
            </ul>
            <button className="btn btn-outline" style={{width:'100%', justifyContent:'center'}} onClick={() => onOpenModal('signup', 'merchant')}>Join Now</button>
          </div>
        </div>
      </div>
    </section>
  );
}
