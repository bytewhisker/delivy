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
  initialRole,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [role, setRole] = useState<Role>(initialRole);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setRole(initialRole);
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
  }, [isOpen, initialMode, initialRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      onSuccess(mode === 'signup' ? 'Account created successfully!' : 'Logged in successfully!');
      setLoading(false);
      setTimeout(onClose, 1500);
    }, 500);
  };

  const handleClose = () => {
    setPhone('');
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
        
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>{mode === 'signup' ? 'Create Account' : 'Welcome Back'}</h2>
        
        <div className="role-toggle">
          <button 
            className={`role-btn ${role === 'merchant' ? 'active' : ''}`} 
            onClick={() => setRole('merchant')}
          >
            Merchant
          </button>
          <button 
            className={`role-btn ${role === 'rider' ? 'active' : ''}`} 
            onClick={() => setRole('rider')}
          >
            Rider
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input 
            type="tel" 
            placeholder="Phone Number" 
            className="join-input" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required 
          />
          <input type="password" placeholder="Password" className="join-input" required />
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '12px' }}>
            {loading ? 'Processing...' : 'Continue'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setMode(mode === 'signup' ? 'login' : 'signup');
            }}
            style={{ color: 'var(--p)', textDecoration: 'none', fontWeight: 'bold' }}
          >
            {mode === 'signup' ? 'Login here' : 'Sign up here'}
          </a>
        </p>
      </div>
    </div>
  );
}
