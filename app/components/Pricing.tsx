'use client';

export default function Pricing() {
  return (
    <section id="pricing" className="pricing-section">
      <div className="container">
        <div className="pricing-header" data-aos="fade-up">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>Simple Pricing for <span className="gradient-text">Local Businesses</span></h2>
        </div>

        <div className="pricing-cards-grid">
          {/* Scheduled Card */}
          <div className="price-card" data-aos="fade-up">
            <div className="price-icon-box scheduled-icon">
              <i className="fa-solid fa-calendar-days"></i>
            </div>
            <h3>Scheduled</h3>
            <span className="bn-label">শিডিউল ডেলিভারি</span>
            <div className="price-display">
              <span className="price-type">From</span>
              <span className="taka-symbol">৳</span>
              <span className="amount">100</span>
            </div>
            <ul className="price-features">
              <li><i className="fa-solid fa-check"></i> Cake Handling</li>
              <li><i className="fa-solid fa-check"></i> Food Secure & Safe</li>
            </ul>
            <button className="pricing-cta">Join Now</button>
          </div>

          {/* Instant (Featured) Card */}
          <div className="price-card featured" data-aos="fade-up" data-aos-delay="100">
            <div className="featured-best-badge">Best Value</div>
            <div className="price-icon-box instant-icon">
              <i className="fa-solid fa-bolt"></i>
            </div>
            <h3>Instant</h3>
            <span className="bn-label">ইনস্ট্যান্ট ডেলিভারি</span>
            <div className="price-display">
              <span className="price-type">From</span>
              <span className="taka-symbol">৳</span>
              <span className="amount">120</span>
            </div>
            <ul className="price-features">
              <li><i className="fa-solid fa-check"></i> 1-Hour Pickup</li>
              <li><i className="fa-solid fa-check"></i> Priority Support</li>
            </ul>
            <button className="pricing-cta">Join Now</button>
          </div>

          {/* Same Day Card */}
          <div className="price-card" data-aos="fade-up" data-aos-delay="200">
            <div className="price-icon-box sameday-icon">
              <i className="fa-solid fa-sun"></i>
            </div>
            <h3>Same Day</h3>
            <span className="bn-label">সেম ডে ডেলিভারি</span>
            <div className="price-display">
              <span className="price-type">Flat</span>
              <span className="taka-symbol">৳</span>
              <span className="amount">115</span>
            </div>
            <ul className="price-features">
              <li><i className="fa-solid fa-check"></i> 6-8 Hour Gap</li>
              <li><i className="fa-solid fa-check"></i> Bulk Friendly</li>
            </ul>
            <button className="pricing-cta">Join Now</button>
          </div>
        </div>
      </div>
    </section>
  );
}
