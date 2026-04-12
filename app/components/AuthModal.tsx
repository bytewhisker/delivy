'use client';

import { useState, useEffect } from 'react';

type Mode = 'login' | 'signup';
type Role = 'merchant' | 'rider';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: Mode;
  initialRole: Role;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function AuthModal({
  isOpen,
  initialMode,
  onClose,
}: AuthModalProps) {
  const [mode, setMode] = useState<Mode>(initialMode);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      // Lock scroll when modal opens
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '12px'; // Prevent layout shift from scrollbar
    } else {
      // Unlock scroll when modal closes
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen, initialMode]);

  const handleClose = () => {
    onClose();
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={handleClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        
        <div className="modal-header-logo">
          <img src="/images/logo.png" alt="Logo" style={{ width: 'auto', height: '50px' }} />
        </div>

        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#1a1a1a' }}>🚀 Coming Soon</h2>
          <p style={{ fontSize: '1rem', color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>
            We're launching {mode === 'signup' ? 'registration' : 'login'} very soon!
          </p>
          <p style={{ fontSize: '0.9rem', color: '#999' }}>
            Stay tuned for updates. We're preparing an amazing delivery experience for local businesses.
          </p>
          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '1rem', borderRadius: '12px', marginTop: '1.5rem' }}
            onClick={handleClose}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
