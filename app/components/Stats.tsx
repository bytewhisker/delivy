'use client';

import { useEffect, useRef } from 'react';

export default function Stats() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const startCounter = (counter: any) => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const inc = target / speed;

      const updateCount = () => {
        if (count < target) {
          count += inc;
          counter.innerText = Math.ceil(count).toLocaleString() + (target >= 1000 ? '+' : '');
          setTimeout(updateCount, 1);
        } else {
          counter.innerText = target.toLocaleString() + '+';
        }
      };
      updateCount();
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="stats-bar-new">
      <div className="container stats-grid-new" ref={statsRef}>
        <div className="stat-card-new" data-aos="fade-up">
          <h3 className="counter" data-target="10000">0</h3>
          <p>Merchants</p>
        </div>
        <div className="stat-card-new" data-aos="fade-up" data-aos-delay="100">
          <h3 className="counter" data-target="5000">0</h3>
          <p>Riders</p>
        </div>
        <div className="stat-card-new" data-aos="fade-up" data-aos-delay="200">
          <h3 className="counter" data-target="500000">0</h3>
          <p>Deliveries</p>
        </div>
        <div className="stat-card-new" data-aos="fade-up" data-aos-delay="300">
          <h3>99%</h3>
          <p>Success</p>
        </div>
      </div>
    </div>
  );
}
