'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageLoader from '../components/PageLoader';
import AuthModal from '../components/AuthModal';
import Toast from '../components/Toast';
import Breadcrumbs from '../components/Breadcrumbs';
import { useToast } from '../hooks/useToast';

export default function AboutContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [userRole, setUserRole] = useState<'merchant' | 'rider'>('merchant');
  const { toast, show: showToast, dismiss: dismissToast } = useToast();

  useEffect(() => {
    const loadAOS = async () => {
      // @ts-ignore
      const AOS = (await import('aos')).default;
      AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
      });
    };
    loadAOS();
  }, []);

  const handleOpenModal = (mode: 'login' | 'signup', role?: 'merchant' | 'rider') => {
    setAuthMode(mode);
    if (role) setUserRole(role);
    setIsAuthModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <>
      <PageLoader />
      <Header onOpenModal={handleOpenModal} />
      
      <main className="about-minimal">
        {/* PREMIUM HERO & COMPANY STORY */}
        <section className="about-hero-minimal">
          <div className="container">
            <Breadcrumbs items={[{ name: 'About Us', item: '/about-us' }]} />
            
            <div className="minimal-story-grid">
              <div className="story-text" data-aos="fade-right">
                <span className="premium-label">The Story of DeliveryDei</span>
                <h1 className="minimal-h1">Building the Backbone of <span className="gradient-text">Bangladesh's Logistics</span></h1>
                <p className="story-p">
                  DeliveryDei was born out of a simple necessity: local merchants needed a delivery partner that understood the unique pace and challenges of Bangladesh's economy. 
                  We didn't just want to move parcels; we wanted to empower the heart of our commerce—the small and home-based businesses.
                </p>
                <p className="story-p secondary">
                  Today, we focus on safe, reliable, and same-day delivery services. From fragile cakes to essential food and parcels, 
                  we ensure that speed never compromises safety. Our goal is to make professional delivery accessible to every merchant, 
                  helping them scale faster and reach further.
                </p>
              </div>
              <div className="story-image-wrap" data-aos="fade-left">
                <div className="image-stack">
                  <div className="stack-img main">
                    <Image src="/images/front.png" alt="Delivery Logistics" width={600} height={400} />
                  </div>
                  <div className="experience-badge">
                    <span className="num">Dhaka</span>
                    <span className="text">Center of Operations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REDESIGNED LEADERSHIP SECTION */}
        <section className="leadership-redesign">
          <div className="container">
            <div className="section-head-compact" data-aos="fade-up">
              <h2 className="minimal-h2">The Visionaries</h2>
              <div className="h-line"></div>
              <p>Meet the team driving innovation in delivery systems across the nation.</p>
            </div>

            <div className="founders-horizontal-list">
              {/* FOUNDER 1: MAHADI */}
              <div className="founder-row" data-aos="fade-up">
                <div className="founder-visual">
                  <div className="founder-img-circle">
                    <Image src="/images/mahadi.png" alt="Md Mahadi" width={400} height={400} />
                  </div>
                </div>
                <div className="founder-detail">
                  <div className="f-header">
                    <h3>Md Mahadi</h3>
                    <span className="f-tag">Founder & CEO</span>
                  </div>
                  <p className="f-bio">
                    Md Mahadi is the driving force behind DeliveryDei. With a deep understanding of the local market, 
                    he built a reliable and scalable delivery system designed to simplify logistics for merchants. 
                    His vision focuses on empowering businesses by removing the complexities of transport and handling.
                  </p>
                  <div className="f-socials">
                    <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                  </div>
                </div>
              </div>

              {/* FOUNDER 2: IFRAN */}
              <div className="founder-row reverse" data-aos="fade-up">
                <div className="founder-visual">
                  <div className="founder-img-circle">
                    <Image src="/images/ifran.png" alt="Ifran Sakib" width={400} height={400} />
                  </div>
                </div>
                <div className="founder-detail">
                  <div className="f-header">
                    <h3>Ifran Sakib</h3>
                    <span className="f-tag">Co-Founder & COO</span>
                  </div>
                  <p className="f-bio">
                    Ifran Sakib leads operations and strategy at DeliveryDei. He is dedicated to improving delivery efficiency 
                    and ensuring a seamless experience for both merchants and customers. His operational expertise 
                    is the glue that holds our nationwide logistics network together.
                  </p>
                  <div className="f-socials">
                    <a href="#"><i className="fab fa-linkedin-in"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="about-cta-minimal">
          <div className="container">
            <div className="cta-box-glass" data-aos="zoom-in">
              <h3>Ready to transform your delivery experience?</h3>
              <p>Join thousands of merchants growing with DeliveryDei today.</p>
              <div className="cta-btns">
                <button className="btn btn-primary btn-xl" onClick={() => handleOpenModal('signup', 'merchant')}>Get Started Now</button>
                <Link href="/#services" className="btn btn-outline btn-xl">Learn More</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        initialRole={userRole}
        onClose={handleCloseModal}
        onSuccess={showToast}
      />

      <Toast message={toast} onDismiss={dismissToast} />

      <style jsx>{`
        .about-minimal {
          background: #fff;
          overflow-x: hidden;
        }

        /* HERO & STORY */
        .about-hero-minimal {
          padding: 140px 0 100px;
          background: linear-gradient(to bottom, #fafbff 0%, #fff 100%);
        }

        .minimal-story-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 5rem;
          align-items: center;
          margin-top: 2rem;
        }

        .premium-label {
          color: var(--p);
          font-weight: 800;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          display: block;
          margin-bottom: 1rem;
        }

        .minimal-h1 {
          font-size: 3.8rem;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 2rem;
          color: var(--s);
        }

        .story-p {
          font-size: 1.2rem;
          line-height: 1.7;
          color: #4b5563;
          margin-bottom: 1.5rem;
        }

        .story-p.secondary {
          font-size: 1.05rem;
          opacity: 0.8;
        }

        .story-image-wrap {
          position: relative;
        }

        .image-stack {
          position: relative;
          padding: 20px;
        }

        .stack-img {
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.1);
          transform: rotate(-2deg);
        }

        .experience-badge {
          position: absolute;
          bottom: -20px;
          left: -20px;
          background: white;
          padding: 1.5rem 2.5rem;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          z-index: 2;
          transform: rotate(2deg);
          border-left: 5px solid var(--p);
        }

        .experience-badge .num {
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--s);
        }

        .experience-badge .text {
          font-size: 0.8rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* LEADERSHIP REDESIGN - HORIZONTAL ROWS */
        .leadership-redesign {
          padding: 100px 0;
          background: #fff;
        }

        .section-head-compact {
          text-align: center;
          margin-bottom: 5rem;
        }

        .minimal-h2 {
          font-size: 2.8rem;
          font-weight: 900;
          margin-bottom: 1rem;
        }

        .h-line {
          width: 60px;
          height: 4px;
          background: var(--p);
          margin: 0 auto 1.5rem;
          border-radius: 10px;
        }

        .founders-horizontal-list {
          display: flex;
          flex-direction: column;
          gap: 6rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .founder-row {
          display: flex;
          align-items: center;
          gap: 4rem;
        }

        .founder-row.reverse {
          flex-direction: row-reverse;
        }

        .founder-visual {
          flex-shrink: 0;
        }

        .founder-img-circle {
          width: 320px;
          height: 320px;
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.08);
          border: 8px solid white;
          outline: 1px solid #f1f5f9;
        }

        .founder-img-circle :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: 0.5s;
        }

        .founder-row:hover .founder-img-circle :global(img) {
          transform: scale(1.1);
        }

        .founder-detail {
          flex-grow: 1;
        }

        .f-header {
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .f-header h3 {
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--s);
        }

        .f-tag {
          background: #fff5ee;
          color: var(--p);
          padding: 0.4rem 1.2rem;
          border-radius: 50px;
          font-weight: 800;
          font-size: 0.8rem;
          text-transform: uppercase;
        }

        .f-bio {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #64748b;
          margin-bottom: 2rem;
        }

        .f-socials {
          display: flex;
          gap: 1rem;
        }

        .f-socials a {
          width: 45px;
          height: 45px;
          background: #f8fafc;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 1.2rem;
          transition: 0.3s;
          border: 1px solid #f1f5f9;
        }

        .f-socials a:hover {
          background: var(--p);
          color: white;
          transform: translateY(-5px);
          border-color: var(--p);
        }

        /* CTA SECTION */
        .about-cta-minimal {
          padding: 100px 0 150px;
        }

        .cta-box-glass {
          background: linear-gradient(135deg, var(--s) 0%, #2a2a2a 100%);
          padding: 5rem 3rem;
          border-radius: 50px;
          text-align: center;
          color: white;
          box-shadow: 0 30px 60px rgba(0,0,0,0.15);
        }

        .cta-box-glass h3 {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 1rem;
        }

        .cta-box-glass p {
          font-size: 1.2rem;
          opacity: 0.8;
          margin-bottom: 3rem;
        }

        .cta-btns {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 992px) {
          .minimal-story-grid {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 4rem;
          }
          .minimal-h1 {
            font-size: clamp(2.5rem, 8vw, 3.5rem);
          }
          .founder-row, .founder-row.reverse {
            flex-direction: column;
            text-align: center;
            gap: 2.5rem;
          }
          .f-header {
            flex-direction: column;
            gap: 0.5rem;
          }
          .f-socials {
            justify-content: center;
          }
          .founder-img-circle {
            width: 250px;
            height: 250px;
          }
        }
      `}</style>
    </>
  );
}
