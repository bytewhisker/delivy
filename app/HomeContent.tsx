'use client';

import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import PageLoader from './components/PageLoader';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import FrontSection from './components/FrontSection';
import Services from './components/Services';
import Pricing from './components/Pricing';
import Calculator from './components/Calculator';
import Stats from './components/Stats';
import HowItWorks from './components/HowItWorks';
import JoinSection from './components/JoinSection';
import TrustGallery from './components/TrustGallery';
import Footer from './components/Footer';
import { useToast } from './hooks/useToast';

type AuthMode = 'login' | 'signup';
type UserRole = 'merchant' | 'rider';

export default function HomeContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [userRole, setUserRole] = useState<UserRole>('merchant');
  const { toast, show: showToast, dismiss: dismissToast } = useToast();

  useEffect(() => {
    // Initialize AOS
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

  const handleOpenModal = (mode: AuthMode, role?: UserRole) => {
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
      <main>
        <Hero onOpenModal={handleOpenModal} />
        <FrontSection />
        <Pricing />
        <Calculator onOpenModal={handleOpenModal} />
        <TrustGallery />
        <Stats />
        <HowItWorks />
        <JoinSection onOpenModal={handleOpenModal} />
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
    </>
  );
}
