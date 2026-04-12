'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet with no SSR
const MapContainer = dynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>Loading Dhaka Map...</div>
});

interface CalculatorProps {
  onOpenModal: (mode: 'login' | 'signup', role?: 'merchant' | 'rider') => void;
}

export default function Calculator({ onOpenModal }: CalculatorProps) {
  const [distance, setDistance] = useState<number | string>(0);
  const [service, setService] = useState<'scheduled' | 'instant' | 'sameday'>('scheduled');
  const [itemType, setItemType] = useState<'parcel' | 'cake'>('parcel');
  const [weight, setWeight] = useState<number>(1);
  
  const [baseCharge, setBaseCharge] = useState(80);
  const [weightSurcharge, setWeightSurcharge] = useState(0);
  const [total, setTotal] = useState(80);

  useEffect(() => {
    calculatePrice();
  }, [distance, service, itemType, weight]);

  const calculatePrice = () => {
    const distNum = typeof distance === 'string' ? 0 : distance;
    let base = 0;
    let surcharge = 0;

    if (service === 'sameday') {
      base = 120;
      if (weight > 1) {
        surcharge = Math.ceil(weight - 1) * 20;
      }
    } else {
      const rates: any = {
        scheduled: { parcel: [80, 80, 150, 200, 250, 350, 400], cake: [150, 150, 200, 250, 300, 350, 450] },
        instant: { parcel: [100, 120, 160, 185, 220, 240, 300], cake: [160, 170, 210, 230, 260, 280, 350] }
      };

      const distTiers = [3, 6, 9, 15, 24, 30, 99];
      let tierIndex = distTiers.findIndex(t => distNum <= t);
      if (tierIndex === -1) tierIndex = distTiers.length - 1;

      base = rates[service][itemType][tierIndex];

      if (weight > 3) {
        surcharge = Math.ceil(weight - 3) * 20;
      }
    }

    setBaseCharge(base);
    setWeightSurcharge(surcharge);
    setTotal(base + surcharge);
  };

  return (
    <section id="coverage" className="map-section">
      <div className="container">
        <div className="section-label">Live Coverage</div>
        <h2 className="section-title">Check Your <span className="gradient-text">Delivery Area</span></h2>
        
        <div className="map-calculator-grid">
          {/* Left: Map */}
          <div className="map-container-wrap" data-aos="fade-right">
             <MapContainer onDistanceChange={setDistance} />
             <div className="map-overlay-info">
                <p><i className="fa-solid fa-mouse-pointer"></i> <b>Click Map Twice:</b> 1st for Pickup, 2nd for Delivery</p>
             </div>
          </div>

          {/* Right: Ticket */}
          <div className="calc-card" data-aos="fade-left">
            <div className="calc-header">
              <h3>Delivery Estimator</h3>
              <p>Select details for exact pricing</p>
            </div>
            
            <div className="calc-body">
              <div className="calc-row">
                <div className="calc-group">
                  <label><i className="fa-solid fa-circle-dot" style={{color:'#10b981'}}></i> Pickup Area</label>
                  <div className="input-wrap">
                    <input type="text" id="pickup-search" placeholder="Type area (e.g. Uttara)" />
                  </div>
                </div>
                <div className="calc-group">
                  <label><i className="fa-solid fa-location-dot" style={{color:'#ef4444'}}></i> Delivery Area</label>
                  <div className="input-wrap">
                    <input type="text" id="delivery-search" placeholder="Type area (e.g. Banani)" />
                  </div>
                </div>
              </div>

              <div className="calc-group">
                <label>Calculated Distance</label>
                <div className="range-wrap">
                  <span className="range-val" style={{textAlign:'left'}}><b id="main-dist-text">{distance}</b> KM (via fastest road)</span>
                </div>
              </div>

              <div className="calc-group">
                <label>Service Type</label>
                <div className="service-pills">
                  <button className={`pill ${service === 'scheduled' ? 'active' : ''}`} onClick={() => setService('scheduled')}>Scheduled</button>
                  <button className={`pill ${service === 'instant' ? 'active' : ''}`} onClick={() => setService('instant')}>Instant</button>
                  <button className={`pill ${service === 'sameday' ? 'active' : ''}`} onClick={() => setService('sameday')}>Same Day</button>
                </div>
              </div>

              <div className="calc-row">
                <div className="calc-group">
                  <label>Item Type</label>
                  <select value={itemType} onChange={(e) => setItemType(e.target.value as any)}>
                    <option value="parcel">Food / Parcel</option>
                    <option value="cake">Special Cake</option>
                  </select>
                </div>
                <div className="calc-group">
                  <label>Weight (KG)</label>
                  <input type="number" value={weight} min="1" max="20" onChange={(e) => setWeight(parseInt(e.target.value))} />
                </div>
              </div>

              <div className="price-ticket">
                <div className="ticket-row"><span>Base Charge</span><span>৳ {baseCharge}</span></div>
                <div className="ticket-row"><span>Weight Surcharge</span><span>৳ {weightSurcharge}</span></div>
                <div className="ticket-row border-top">
                  <strong>Total Payable</strong>
                  <strong className="total-anim">৳ {total}</strong>
                </div>
              </div>
              
              <button className="btn btn-primary btn-xl" style={{width:'100%', justifyContent:'center'}} onClick={() => onOpenModal('signup','merchant')}>
                Book This Delivery <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
