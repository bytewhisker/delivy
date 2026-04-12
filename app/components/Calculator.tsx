'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

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

  const [pickupLocation, setPickupLocation] = useState<string | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<string | null>(null);
  
  const [pickupQuery, setPickupQuery] = useState('');
  const [deliveryQuery, setDeliveryQuery] = useState('');
  const [pickupResults, setPickupResults] = useState<any[]>([]);
  const [deliveryResults, setDeliveryResults] = useState<any[]>([]);
  const [showPickupResults, setShowPickupResults] = useState(false);
  const [showDeliveryResults, setShowDeliveryResults] = useState(false);

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

  const searchLocations = async (query: string, type: 'pickup' | 'delivery') => {
    if (query.length < 2) {
      if (type === 'pickup') setPickupResults([]);
      else setDeliveryResults([]);
      return;
    }

    try {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}%2C%20Dhaka%2C%20Bangladesh&limit=5&lang=en`
      );
      const data = await res.json();
      const results = data.features?.map((f: any) => ({
        display_name: f.properties.name + (f.properties.city ? ', ' + f.properties.city : '') + (f.properties.country ? ', ' + f.properties.country : ''),
        lat: f.geometry.coordinates[1],
        lon: f.geometry.coordinates[0]
      })) || [];
      
      if (type === 'pickup') {
        setPickupResults(results);
        setShowPickupResults(true);
      } else {
        setDeliveryResults(results);
        setShowDeliveryResults(true);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const selectLocation = (result: any, type: 'pickup' | 'delivery') => {
    const name = result.display_name?.split(',')[0] || query;
    if (type === 'pickup') {
      setPickupLocation(name);
      setPickupQuery(name);
      setShowPickupResults(false);
      setPickupResults([]);
    } else {
      setDeliveryLocation(name);
      setDeliveryQuery(name);
      setShowDeliveryResults(false);
      setDeliveryResults([]);
    }
    
    if (typeof window !== 'undefined' && (window as any).searchLocation) {
      (window as any).searchLocation(result.display_name?.split(',')[0] || query, type);
    }
  };

  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPickupQuery(val);
    setPickupLocation(val);
    searchLocations(val, 'pickup');
  };

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDeliveryQuery(val);
    setDeliveryLocation(val);
    searchLocations(val, 'delivery');
  };

  return (
    <section id="coverage" className="map-section">
      <div className="container">
        <div className="section-label">Live Coverage</div>
        <h2 className="section-title">Check Your <span className="gradient-text">Delivery Area</span></h2>
        
        <div className="map-calculator-grid">
          <div className="map-container-wrap" data-aos="fade-right">
             <MapContainer 
               onDistanceChange={setDistance} 
               onLocationChange={(type, name) => {
                 if (type === 'pickup') {
                   setPickupLocation(name);
                   setPickupQuery(name || '');
                 } else {
                   setDeliveryLocation(name);
                   setDeliveryQuery(name || '');
                 }
               }}
             />
             <div className="map-overlay-info">
                <p><i className="fa-solid fa-mouse-pointer"></i> <b>Hover map</b> to enable scroll zoom. <b>Click</b> to set pickup & delivery</p>
             </div>
          </div>

          <div className="calc-card" data-aos="fade-left">
            <div className="calc-header">
              <h3>Delivery Estimator</h3>
              <p>Select details for exact pricing</p>
            </div>
            
            <div className="calc-body">
              <div className="calc-row">
                <div className="calc-group" style={{position: 'relative'}}>
                  <label><i className="fa-solid fa-circle-dot" style={{color:'#10b981'}}></i> Pickup Area</label>
                  <div className="input-wrap">
                    <input 
                      type="text" 
                      value={pickupQuery} 
                      onChange={handlePickupChange}
                      onFocus={() => setShowPickupResults(true)}
                      placeholder="Type area (e.g. Uttara)" 
                    />
                    {pickupLocation && (
                      <span 
                        style={{position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#ef4444'}}
                        onClick={() => { setPickupLocation(null); setPickupQuery(''); if ((window as any).removeLocationMarker) (window as any).removeLocationMarker('pickup'); }}
                      >
                        <i className="fa-solid fa-times"></i>
                      </span>
                    )}
                  </div>
                  {showPickupResults && pickupResults.length > 0 && (
                    <div className="search-suggestions">
                      {pickupResults.map((result, idx) => (
                        <div key={idx} onClick={() => selectLocation(result, 'pickup')} className="suggestion-item">
                          <div style={{fontWeight: 500}}>{result.display_name.split(',')[0]}</div>
                          <div style={{fontSize: '11px', color: '#666'}}>{result.display_name.split(',').slice(1, 3).join(',')}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="calc-group" style={{position: 'relative'}}>
                  <label><i className="fa-solid fa-location-dot" style={{color:'#ef4444'}}></i> Delivery Area</label>
                  <div className="input-wrap">
                    <input 
                      type="text" 
                      value={deliveryQuery} 
                      onChange={handleDeliveryChange}
                      onFocus={() => setShowDeliveryResults(true)}
                      placeholder="Type area (e.g. Banani)" 
                    />
                    {deliveryLocation && (
                      <span 
                        style={{position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#ef4444'}}
                        onClick={() => { setDeliveryLocation(null); setDeliveryQuery(''); if ((window as any).removeLocationMarker) (window as any).removeLocationMarker('delivery'); }}
                      >
                        <i className="fa-solid fa-times"></i>
                      </span>
                    )}
                  </div>
                  {showDeliveryResults && deliveryResults.length > 0 && (
                    <div className="search-suggestions">
                      {deliveryResults.map((result, idx) => (
                        <div key={idx} onClick={() => selectLocation(result, 'delivery')} className="suggestion-item">
                          <div style={{fontWeight: 500}}>{result.display_name.split(',')[0]}</div>
                          <div style={{fontSize: '11px', color: '#666'}}>{result.display_name.split(',').slice(1, 3).join(',')}</div>
                        </div>
                      ))}
                    </div>
                  )}
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