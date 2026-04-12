'use client';

import Lottie from 'lottie-react';
import animationData from './404.json';
import Header from './components/Header';
import Footer from './components/Footer';

export default function NotFound() {
  return (
    <>
      <Header onOpenModal={() => {}} />

      <main style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'linear-gradient(135deg, rgba(255,107,0,0.05) 0%, rgba(255,157,0,0.05) 100%)' }}>
        <div style={{ textAlign: 'center', maxWidth: '700px' }}>
          {/* Heading */}
          <h1 style={{
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
            fontWeight: 800,
            marginBottom: '2rem',
            color: '#1a1a1a'
          }}>
            Oops! Lost in Delivery
          </h1>

          {/* Message */}
          <p style={{
            fontSize: '1rem',
            color: '#6b7280',
            marginBottom: '3rem',
            lineHeight: 1.8
          }}>
            This page took a wrong turn like a lost delivery
          </p>

          {/* Lottie Animation */}
          <div style={{ marginBottom: '2rem', height: '250px' }}>
            <Lottie
              animationData={animationData}
              loop={true}
              autoplay={true}
              rendererSettings={{
                preserveAspectRatio: 'xMidYMid slice'
              }}
              style={{ width: '100%', height: '100%' }}
            />
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
