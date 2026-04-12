'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onOpenModal?: (mode: 'login' | 'signup', role?: 'merchant' | 'rider') => void;
}

export default function Header({ onOpenModal }: HeaderProps = {}) {
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
            style={{ width: 'auto', height: '40px', userSelect: 'none', pointerEvents: 'none' }}
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
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
          <button className="btn btn-ghost nav-btn" onClick={() => onOpenModal?.('login')}>Login</button>
          <button className="btn btn-primary nav-btn" onClick={() => onOpenModal?.('signup', 'merchant')}>Get Started</button>
          <button className={`hamburger ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
            justify-content: flex-start;
            align-items: center;
            padding-top: 100px;
            z-index: 999;
            transition: 0.5s;
            box-shadow: -10px 0 30px rgba(0,0,0,0.1);
            display: flex;
            overflow-y: auto;
            gap: 2rem;
          }
          .nav-links.mobile-active { right: 0; }
          .hamburger {
            display: flex !important;
            flex-direction: column;
            gap: 6px;
          }
          .hamburger span {
            width: 25px;
            height: 3px;
            background: var(--s);
            border-radius: 2px;
            transition: 0.3s;
            display: block;
          }
          .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(10px, 10px);
          }
          .hamburger.active span:nth-child(2) {
            opacity: 0;
          }
          .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(8px, -8px);
          }
        }
      `}</style>
    </header>
  );
}
