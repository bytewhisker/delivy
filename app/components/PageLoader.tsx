'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function PageLoader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="page-loader" className={hidden ? 'hidden' : ''}>
      <div className="loader-content">
        <Image 
          src="/images/logo.png" 
          alt="Deliverydei Logo" 
          width={150} 
          height={50} 
          style={{ objectFit: 'contain', width: 'auto', height: 'auto' }} 
        />
        <div className="loader-track">
          <div className="loader-scooter">
            <i className="fa-solid fa-motorcycle"></i>
          </div>
          <div className="loader-progress-bar"></div>
        </div>
      </div>
    </div>
  );
}
