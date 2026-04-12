'use client';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="how-section">
      <div className="container">
        <div className="section-label" style={{ textAlign: 'center' }}>Simple Steps</div>
        <h2 className="section-title" style={{ textAlign: 'center' }}>How <span className="gradient-text">Deliverydei</span> Works</h2>
        
        <div className="how-grid">
          <div className="how-card" data-aos="fade-up">
            <div className="how-icon-box">
              <i className="fa-solid fa-pen-to-square"></i>
              <div className="how-step-badge">1</div>
            </div>
            <h3>Book Order</h3>
            <p>Use our seamless dashboard to book your food or cake delivery in under 60 seconds.</p>
          </div>
          
          <div className="how-card" data-aos="fade-up" data-aos-delay="100">
            <div className="how-icon-box">
              <i className="fa-solid fa-motorcycle"></i>
              <div className="how-step-badge">2</div>
            </div>
            <h3>Fast Pickup</h3>
            <p>Our nearest verified rider will arrive at your doorstep for a hassle-free pickup.</p>
          </div>
          
          <div className="how-card" data-aos="fade-up" data-aos-delay="200">
            <div className="how-icon-box">
              <i className="fa-solid fa-handshake-simple"></i>
              <div className="how-step-badge">3</div>
            </div>
            <h3>Safe Delivery</h3>
            <p>We ensure safe hand-to-hand delivery with a real-time notification to you.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
