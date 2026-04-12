'use client';

interface JoinSectionProps {
  onOpenModal: (mode: 'login' | 'signup', role?: 'merchant' | 'rider') => void;
}

export default function JoinSection({ onOpenModal }: JoinSectionProps) {
  return (
    <section id="join" className="join-section">
      <div className="container">
        <div className="section-label" style={{ textAlign: 'center' }}>Join Us</div>
        <h2 className="section-title" style={{ textAlign: 'center' }}>Choose Your <span className="gradient-text">Journey</span></h2>
        
        <div className="join-grid">
          {/* Merchant Card */}
          <div className="join-card" data-aos="fade-right">
            <div className="join-header">
              <div className="join-icon-wrap"><i className="fa-solid fa-building-storefront"></i></div>
              <h3>Merchants</h3>
            </div>
            <p>Powerful tools to help you scale your delivery operations and grow your business.</p>
            <ul className="join-benefit-list">
              <li><i className="fa-solid fa-circle-check"></i> <b>Dedicated Dashboard</b> for easy tracking</li>
              <li><i className="fa-solid fa-circle-check"></i> <b>Lowest COD Charges</b> in the market</li>
              <li><i className="fa-solid fa-circle-check"></i> <b>Fast Next-Day</b> payment cycle</li>
              <li><i className="fa-solid fa-circle-check"></i> <b>24/7 Priority</b> customer support</li>
            </ul>
            <button className="btn btn-primary btn-xl" onClick={() => onOpenModal('signup', 'merchant')}>
              Register as Merchant <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          {/* Rider Card */}
          <div className="join-card" data-aos="fade-left">
            <div className="join-header">
              <div className="join-icon-wrap"><i className="fa-solid fa-person-biking"></i></div>
              <h3>Riders</h3>
            </div>
            <p>Join the largest fleet of professional riders and start earning big with total flexibility.</p>
            <ul className="join-benefit-list">
              <li><i className="fa-solid fa-circle-check"></i> <b>High Earnings</b> up to ৳35k/month</li>
              <li><i className="fa-solid fa-circle-check"></i> <b>Total Freedom</b> to pick your hours</li>
              <li><i className="fa-solid fa-circle-check"></i> <b>Daily Payments</b> directly to your wallet</li>
              <li><i className="fa-solid fa-circle-check"></i> <b>Professional App</b> with easy navigation</li>
            </ul>
            <button className="btn btn-primary btn-xl" onClick={() => onOpenModal('signup', 'rider')}>
              Register as Rider <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
