'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>Loading Dhaka Map...</div>
});

interface CalculatorProps {
  onOpenModal: (mode: 'login' | 'signup', role?: 'merchant' | 'rider') => void;
}

declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
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

  const pickupInputRef = useRef<HTMLInputElement>(null);
  const deliveryInputRef = useRef<HTMLInputElement>(null);
  const pickupAutocompleteRef = useRef<any>(null);
  const deliveryAutocompleteRef = useRef<any>(null);

  useEffect(() => {
    calculatePrice();
  }, [distance, service, itemType, weight]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickupInputRef.current && !pickupInputRef.current.contains(e.target as Node)) {
        setShowPickupResults(false);
      }
      if (deliveryInputRef.current && !deliveryInputRef.current.contains(e.target as Node)) {
        setShowDeliveryResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const initAutocomplete = () => {
      if (typeof window === 'undefined' || !window.google) {
        setTimeout(initAutocomplete, 500);
        return;
      }

      if (pickupInputRef.current && !pickupAutocompleteRef.current) {
        pickupAutocompleteRef.current = new window.google.maps.places.Autocomplete(pickupInputRef.current, {
          types: ['establishment', 'neighborhood', 'sublocality'],
          componentRestrictions: { country: 'bd' },
          fields: ['name', 'geometry', 'formatted_address']
        });

        pickupAutocompleteRef.current.addListener('place_changed', () => {
          const place = pickupAutocompleteRef.current.getPlace();
          if (place && place.geometry) {
            const name = place.name || place.formatted_address?.split(',')[0] || 'Pickup';
            setPickupLocation(name);
            setPickupQuery(name);
            
            if (typeof window !== 'undefined' && (window as any).searchLocation) {
              (window as any).searchLocation(name, 'pickup', {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              });
            }
          }
        });
      }

      if (deliveryInputRef.current && !deliveryAutocompleteRef.current) {
        deliveryAutocompleteRef.current = new window.google.maps.places.Autocomplete(deliveryInputRef.current, {
          types: ['establishment', 'neighborhood', 'sublocality'],
          componentRestrictions: { country: 'bd' },
          fields: ['name', 'geometry', 'formatted_address']
        });

        deliveryAutocompleteRef.current.addListener('place_changed', () => {
          const place = deliveryAutocompleteRef.current.getPlace();
          if (place && place.geometry) {
            const name = place.name || place.formatted_address?.split(',')[0] || 'Delivery';
            setDeliveryLocation(name);
            setDeliveryQuery(name);
            
            if (typeof window !== 'undefined' && (window as any).searchLocation) {
              (window as any).searchLocation(name, 'delivery', {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              });
            }
          }
        });
      }
    };

    initAutocomplete();
  }, []);

  const calculatePrice = () => {
    const distNum = typeof distance === 'string' ? 0 : distance;
    let base = 0;
    let surcharge = 0;

    if (service === 'sameday') {
      base = 120;
      if (weight > 1) {
        surcharge = Math.ceil(weight - 1) * 20;
      }
    } else if (service === 'instant') {
      const instantRates = {
        parcel: [
          { max: 5, price: 100 },
          { max: 10, price: 140 },
          { max: 15, price: 180 },
          { max: 20, price: 220 },
          { max: 25, price: 270 },
          { max: 30, price: 340 },
          { max: 35, price: 400 },
          { max: 99, price: 500 }
        ],
        cake: [
          { max: 5, price: 140 },
          { max: 10, price: 190 },
          { max: 15, price: 240 },
          { max: 20, price: 290 },
          { max: 25, price: 340 },
          { max: 30, price: 400 },
          { max: 35, price: 460 },
          { max: 99, price: 600 }
        ]
      };
      const tier = instantRates[itemType].find(t => distNum <= t.max);
      base = tier ? tier.price : 500;
      
      if (itemType === 'cake') {
        if (weight > 5) surcharge = Math.ceil(weight - 5) * 25;
      } else {
        if (weight > 3) surcharge = Math.ceil(weight - 3) * 20;
      }
    } else {
      const scheduledRates = {
        parcel: [
          { max: 5, price: 80 },
          { max: 10, price: 120 },
          { max: 15, price: 160 },
          { max: 20, price: 200 },
          { max: 25, price: 250 },
          { max: 30, price: 320 },
          { max: 35, price: 380 },
          { max: 99, price: 500 }
        ],
        cake: [
          { max: 5, price: 120 },
          { max: 10, price: 170 },
          { max: 15, price: 220 },
          { max: 20, price: 270 },
          { max: 25, price: 320 },
          { max: 30, price: 380 },
          { max: 35, price: 440 },
          { max: 99, price: 600 }
        ]
      };
      const tier = scheduledRates[itemType].find(t => distNum <= t.max);
      base = tier ? tier.price : 500;
      
      if (itemType === 'cake') {
        if (weight > 5) surcharge = Math.ceil(weight - 5) * 25;
      } else {
        if (weight > 3) surcharge = Math.ceil(weight - 3) * 20;
      }
    }

    setBaseCharge(base);
    setWeightSurcharge(surcharge);
    setTotal(base + surcharge);
  };

  const handlePickupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPickupQuery(val);
    setPickupLocation(val);
  };

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDeliveryQuery(val);
    setDeliveryLocation(val);
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
                <div className="calc-group" style={{position: 'relative'}} ref={pickupInputRef}>
                  <label><i className="fa-solid fa-circle-dot" style={{color:'#10b981'}}></i> Pickup Area</label>
                  <div className="input-wrap">
                    <input 
                      type="text" 
                      ref={pickupInputRef}
                      value={pickupQuery} 
                      onChange={handlePickupChange}
                      onFocus={() => setShowPickupResults(false)}
                      placeholder="Search pickup location..." 
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
                </div>
                <div className="calc-group" style={{position: 'relative'}} ref={deliveryInputRef}>
                  <label><i className="fa-solid fa-location-dot" style={{color:'#ef4444'}}></i> Delivery Area</label>
                  <div className="input-wrap">
                    <input 
                      type="text" 
                      ref={deliveryInputRef}
                      value={deliveryQuery} 
                      onChange={handleDeliveryChange}
                      onFocus={() => setShowDeliveryResults(false)}
                      placeholder="Search delivery location..." 
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