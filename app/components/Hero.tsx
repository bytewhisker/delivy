'use client';

import Image from 'next/image';

interface HeroProps {
  onOpenModal: (mode: 'login' | 'signup', role?: 'merchant' | 'rider') => void;
}

export default function Hero({ onOpenModal }: HeroProps) {
  return (
    <section className="hero" id="home">
      <div className="container hero-content">
        <div className="hero-text" data-aos="fade-right">
          <div className="hero-badge">🚀 Bangladesh's #1 Delivery</div>
          <h1>Deliver <span className="gradient-text">Faster.</span><br />Grow <span className="gradient-text">Bigger.</span></h1>
          <p className="hero-sub" style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)' }}>Reliable delivery for Merchants. Real income for Riders.</p>
          <div className="hero-cta-group">
            <button className="btn btn-primary btn-xl" onClick={() => onOpenModal('signup', 'merchant')}>Become a Merchant</button>
            <button className="btn btn-outline btn-xl" onClick={() => onOpenModal('signup', 'rider')}>Become a Rider</button>
          </div>
          <div className="hero-trust">
            <div className="trust-avatars">
              <Image src="https://i.pravatar.cc/32?img=1" alt="u" width={32} height={32} style={{ borderRadius: '50%', border: '2px solid white' }} />
              <Image src="https://i.pravatar.cc/32?img=2" alt="u" width={32} height={32} style={{ borderRadius: '50%', border: '2px solid white', marginLeft: '-10px' }} />
              <Image src="https://i.pravatar.cc/32?img=3" alt="u" width={32} height={32} style={{ borderRadius: '50%', border: '2px solid white', marginLeft: '-10px' }} />
            </div>
            <p><strong>15,000+</strong> merchants joined</p>
          </div>
        </div>
        <div className="hero-visual" data-aos="fade-left">
          <div className="float-card card-a" data-aos="zoom-in" data-aos-delay="600">
            <i className="fa-solid fa-bolt"></i>
            <span>Instant Pickup</span>
          </div>
          <div className="float-card card-b" data-aos="zoom-in" data-aos-delay="800">
            <i className="fa-solid fa-shield-halved"></i>
            <span>Safe Delivery</span>
          </div>
          <div className="float-card card-c" data-aos="zoom-in" data-aos-delay="1000">
            <i className="fa-solid fa-money-bill-wave"></i>
            <span>COD Ready</span>
          </div>
          <div className="hero-img-wrap">
            <Image 
              src="/images/maincover.png" 
              alt="Deliverydei Main Cover" 
              className="hero-img" 
              width={600} 
              height={450} 
              priority={true}
              style={{ height: 'auto', width: '100%', borderRadius: '30px' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
