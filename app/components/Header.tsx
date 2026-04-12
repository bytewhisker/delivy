import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onOpenModal: (mode: 'login' | 'signup', role?: 'merchant' | 'rider') => void;
}

export default function Header({ onOpenModal }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <nav className="container nav-content">
        <Link href="/" className="logo">
          <Image 
            src="/images/logo.png" 
            alt="Deliverydei Logo" 
            width={150} 
            height={40} 
            priority={true}
            style={{ width: 'auto', height: '40px' }} 
          />
        </Link>
        <div className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`} id="nav-links">
          <Link href="/#services" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Services</Link>
          <Link href="/#pricing" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
          <Link href="/#how-it-works" className="nav-link" onClick={() => setMobileMenuOpen(false)}>How it Works</Link>
          <Link href="/#join" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Join Us</Link>
          <Link href="/about-us" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About</Link>
        </div>
        <div className="nav-actions">
          <button className="btn btn-ghost" onClick={() => onOpenModal('login')}>Login</button>
          <button className="btn btn-primary" onClick={() => onOpenModal('signup', 'merchant')}>Get Started</button>
          <button className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
      
      <style jsx>{`
        @media (max-width: 992px) {
          .nav-links {
            position: fixed;
            top: 0; right: -100%;
            height: 100vh; width: 80%;
            background: white;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 999;
            transition: 0.5s;
            box-shadow: -10px 0 30px rgba(0,0,0,0.1);
            display: flex;
          }
          .nav-links.mobile-active { right: 0; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
