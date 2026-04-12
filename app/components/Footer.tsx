'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-col brand">
            <img src="/images/logo.png" alt="Deliverydei Logo" className="footer-logo" style={{ width: 'auto', height: '45px' }} />
            <p className="footer-desc">
              Bangladesh's most reliable and fastest logistics partner. Empowering merchants and providing opportunities for riders across the nation.
            </p>
            <div className="social-links">
              <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#"><i className="fa-brands fa-x-twitter"></i></a>
              <a href="#"><i className="fa-brands fa-instagram"></i></a>
              <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h3>Company</h3>
            <ul className="footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/#services">Our Services</Link></li>
              <li><Link href="/#pricing">Rates & Pricing</Link></li>
              <li><Link href="/#coverage">Coverage Map</Link></li>
              <li><Link href="/about-us">About Us</Link></li>
            </ul>
          </div>

          {/* Business Links */}
          <div className="footer-col">
            <h3>For Business</h3>
            <ul className="footer-links">
              <li><Link href="/#join">Become a Merchant</Link></li>
              <li><Link href="#">Merchant Dashboard</Link></li>
              <li><Link href="#">API Documentation</Link></li>
              <li><Link href="#">Enterprise Solutions</Link></li>
              <li><Link href="#">COD Policy</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="footer-col">
            <h3>Support & Legal</h3>
            <ul className="footer-links">
              <li><Link href="#">Help Center</Link></li>
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Terms of Service</Link></li>
              <li><Link href="#">Refund Policy</Link></li>
              <li><Link href="#">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="copyright">
            © 2026 <strong>Deliverydei Ltd.</strong> All rights reserved.
          </div>
          <div className="footer-badges">
            <span className="location-badge"><i className="fa-solid fa-location-dot"></i> Dhaka, Bangladesh</span>
            <span className="made-badge">Made with <i className="fa-solid fa-heart" style={{color: '#ff6b00'}}></i> for Merchants</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-section {
          background: #121212;
          color: #fff;
          padding: 100px 0 40px;
          position: relative;
          overflow: hidden;
          border-top: 1px solid #1f1f1f;
        }
        
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 4rem;
          margin-bottom: 80px;
        }

        .footer-logo {
          height: 45px;
          margin-bottom: 2rem;
          filter: brightness(0) invert(1);
        }

        .footer-desc {
          color: #8892b0;
          line-height: 1.8;
          margin-bottom: 2.5rem;
          font-size: 1rem;
          max-width: 320px;
        }

        .social-links {
          display: flex;
          gap: 1.2rem;
        }

        .social-links a {
          width: 44px;
          height: 44px;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8892b0;
          text-decoration: none;
          transition: 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          border: 1px solid rgba(255,255,255,0.05);
        }

        .social-links a:hover {
          background: var(--p);
          border-color: var(--p);
          transform: translateY(-5px);
          color: white;
          box-shadow: 0 10px 20px rgba(255,107,0,0.2);
        }

        .footer-col h3 {
          font-size: 1.2rem;
          font-weight: 800;
          margin-bottom: 2rem;
          color: #f8fafc;
          position: relative;
        }

        .footer-col h3::after {
          content: "";
          position: absolute;
          bottom: -10px; left: 0;
          width: 25px; height: 3px;
          background: var(--p);
          border-radius: 10px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        /* Essential for styling Link component in styled-jsx */
        .footer-links :global(a) {
          color: #8892b0 !important;
          text-decoration: none !important;
          font-size: 1rem;
          transition: 0.3s;
          display: inline-block;
        }

        .footer-links :global(a:hover) {
          color: var(--p) !important;
          transform: translateX(8px);
        }

        .footer-bottom-bar {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.95rem;
          color: #4b5563;
        }

        .copyright strong {
          color: #94a3b8;
        }

        .footer-badges {
          display: flex;
          gap: 2.5rem;
        }

        .footer-badges span {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        @media (max-width: 1200px) {
          .footer-grid {
             gap: 2rem;
          }
        }

        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
          }
          .footer-desc {
            max-width: 100%;
          }
        }

        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .footer-bottom-bar {
            flex-direction: column;
            gap: 2rem;
            text-align: center;
          }
          .footer-badges {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </footer>
  );
}
