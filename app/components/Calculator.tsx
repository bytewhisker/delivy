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

declare global {
  interface Window {
    google: any;
    initAutocomplete: () => void;
  }
}

export default function Calculator({ onOpenModal }: CalculatorProps) {
  const [distance, setDistance] = useState<number>(0);
  const [service, setService] = useState<'scheduled' | 'instant' | 'sameday'>('scheduled');
  const [itemType, setItemType] = useState<'parcel' | 'cake'>('parcel');
  const [weight, setWeight] = useState<number>(1);
  
  const [baseCharge, setBaseCharge] = useState(80);
  const [weightSurcharge, setWeightSurcharge] = useState(0);
  const [total, setTotal] = useState(80);

  const [pickupLocation, setPickupLocation] = useState<string | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<string | null>(null);
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [deliveryCoords, setDeliveryCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [pickupQuery, setPickupQuery] = useState('');
  const [deliveryQuery, setDeliveryQuery] = useState('');

  const pickupInputRef = useRef<HTMLInputElement>(null);
  const deliveryInputRef = useRef<HTMLInputElement>(null);
  const pickupContainerRef = useRef<HTMLDivElement>(null);
  const deliveryContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    calculatePrice();
  }, [distance, service, itemType, weight]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Close pickup suggestions if click is outside pickup container
      if (pickupContainerRef.current && !pickupContainerRef.current.contains(e.target as Node)) {
        setShowPickupSuggestions(false);
      }
      // Close delivery suggestions if click is outside delivery container
      if (deliveryContainerRef.current && !deliveryContainerRef.current.contains(e.target as Node)) {
        setShowDeliverySuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [deliverySuggestions, setDeliverySuggestions] = useState<any[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDeliverySuggestions, setShowDeliverySuggestions] = useState(false);


  // Search locations using Nominatim (OpenStreetMap)
  const searchLocation = async (query: string, type: 'pickup' | 'delivery') => {
    if (query.length < 2) {
      if (type === 'pickup') {
        setPickupSuggestions([]);
        setShowPickupSuggestions(false);
      } else {
        setDeliverySuggestions([]);
        setShowDeliverySuggestions(false);
      }
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)},Dhaka,Bangladesh&format=json&limit=5`
      );
      const results = await response.json();

      if (type === 'pickup') {
        setPickupSuggestions(results);
        setShowPickupSuggestions(results.length > 0);
      } else {
        setDeliverySuggestions(results);
        setShowDeliverySuggestions(results.length > 0);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const selectSuggestion = (suggestion: any, type: 'pickup' | 'delivery') => {
    const name = suggestion.display_name?.split(',')[0] || suggestion.name || 'Location';
    const coords = {
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon)
    };

    if (type === 'pickup') {
      setPickupLocation(name);
      setPickupQuery(name);
      setPickupCoords(coords);
      setShowPickupSuggestions(false);
    } else {
      setDeliveryLocation(name);
      setDeliveryQuery(name);
      setDeliveryCoords(coords);
      setShowDeliverySuggestions(false);
    }
  };

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
    searchLocation(val, 'pickup');
  };

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDeliveryQuery(val);
    searchLocation(val, 'delivery');
  };

  const handlePickupKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && pickupSuggestions.length > 0) {
      e.preventDefault();
      selectSuggestion(pickupSuggestions[0], 'pickup');
    }
  };

  const handleDeliveryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && deliverySuggestions.length > 0) {
      e.preventDefault();
      selectSuggestion(deliverySuggestions[0], 'delivery');
    }
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
               pickupCoords={pickupCoords || undefined}
               deliveryCoords={deliveryCoords || undefined}
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
                <p><i className="fa-solid fa-hand-pointer"></i> <b>Tap</b> to set pickup & delivery locations</p>
             </div>
          </div>

          <div className="calc-card" data-aos="fade-left">
            <div className="calc-header">
              <h3>Delivery Estimator</h3>
              <p>Select details for exact pricing</p>
            </div>
            
            <div className="calc-body">
              <div className="calc-row">
                <div className="calc-group" style={{position: 'relative'}} ref={pickupContainerRef}>
                  <label><i className="fa-solid fa-circle-dot" style={{color:'#10b981'}}></i> Pickup Area</label>
                  <div className="input-wrap" style={{ position: 'relative' }}>
                    <input
                      type="text"
                      ref={pickupInputRef}
                      value={pickupQuery}
                      onChange={handlePickupChange}
                      onKeyDown={handlePickupKeyDown}
                      onFocus={() => setShowPickupSuggestions(pickupSuggestions.length > 0)}
                      onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 100)}
                      placeholder="Search pickup location..."
                    />
                    {showPickupSuggestions && pickupSuggestions.length > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: 'white',
                        border: '1px solid #ddd',
                        borderTop: 'none',
                        borderRadius: '0 0 8px 8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        zIndex: 1000,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        marginTop: '-4px'
                      }}>
                        {pickupSuggestions.map((suggestion, idx) => (
                          <div
                            key={idx}
                            onClick={() => selectSuggestion(suggestion, 'pickup')}
                            style={{
                              padding: '10px 12px',
                              borderBottom: '1px solid #f0f0f0',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              color: '#1a1a1a'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            {suggestion.display_name?.split(',')[0]}
                          </div>
                        ))}
                      </div>
                    )}
                    {pickupLocation && (
                      <span
                        style={{position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#ef4444'}}
                        onClick={() => {
                          setPickupLocation(null);
                          setPickupQuery('');
                          setPickupCoords(null);
                        }}
                      >
                        <i className="fa-solid fa-times"></i>
                      </span>
                    )}
                  </div>
                </div>
                <div className="calc-group" style={{position: 'relative'}} ref={deliveryContainerRef}>
                  <label><i className="fa-solid fa-location-dot" style={{color:'#ef4444'}}></i> Delivery Area</label>
                  <div className="input-wrap" style={{ position: 'relative' }}>
                    <input
                      type="text"
                      ref={deliveryInputRef}
                      value={deliveryQuery}
                      onChange={handleDeliveryChange}
                      onKeyDown={handleDeliveryKeyDown}
                      onFocus={() => setShowDeliverySuggestions(deliverySuggestions.length > 0)}
                      onBlur={() => setTimeout(() => setShowDeliverySuggestions(false), 100)}
                      placeholder="Search delivery location..."
                    />
                    {showDeliverySuggestions && deliverySuggestions.length > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: 'white',
                        border: '1px solid #ddd',
                        borderTop: 'none',
                        borderRadius: '0 0 8px 8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        zIndex: 1000,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        marginTop: '-4px'
                      }}>
                        {deliverySuggestions.map((suggestion, idx) => (
                          <div
                            key={idx}
                            onClick={() => selectSuggestion(suggestion, 'delivery')}
                            style={{
                              padding: '10px 12px',
                              borderBottom: '1px solid #f0f0f0',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              color: '#1a1a1a'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            {suggestion.display_name?.split(',')[0]}
                          </div>
                        ))}
                      </div>
                    )}
                    {deliveryLocation && (
                      <span
                        style={{position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#ef4444'}}
                        onClick={() => {
                          setDeliveryLocation(null);
                          setDeliveryQuery('');
                          setDeliveryCoords(null);
                        }}
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
                  <span className="range-val" style={{textAlign:'left'}}><b id="main-dist-text">{typeof distance === 'number' ? distance.toFixed(2) : distance}</b> KM (via fastest road)</span>
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
              
              <button
                className="btn btn-primary btn-xl"
                style={{
                  width:'100%',
                  justifyContent:'center'
                }}
                disabled={!deliveryLocation}
                onClick={() => onOpenModal('signup','merchant')}
              >
                Book This Delivery <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}