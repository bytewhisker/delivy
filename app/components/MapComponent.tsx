'use client';

import { useEffect, useRef, useState } from 'react';

declare const L: any;

interface MapComponentProps {
  onDistanceChange: (dist: number) => void;
}

interface LocationMarker {
  marker: any;
  type: 'pickup' | 'delivery';
}

export default function MapComponent({ onDistanceChange }: MapComponentProps) {
  const mapRef = useRef<any>(null);
  const routingRef = useRef<any>(null);
  const markersRef = useRef<{ pickup: LocationMarker | null; delivery: LocationMarker | null }>({ pickup: null, delivery: null });
  const [zoomEnabled, setZoomEnabled] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showPickupSearch, setShowPickupSearch] = useState(false);
  const [showDeliverySearch, setShowDeliverySearch] = useState(false);
  const [activeSearch, setActiveSearch] = useState<'pickup' | 'delivery' | null>(null);

  useEffect(() => {
    const initMap = () => {
      if (typeof L === 'undefined') {
        setTimeout(initMap, 500);
        return;
      }

      if (mapRef.current) return;

      const dhakaCoords = [23.8103, 90.4125];
      mapRef.current = L.map('dhaka-map', {
        zoomControl: false,
        scrollWheelZoom: false,
        touchZoom: true,
        tap: false
      }).setView(dhakaCoords, 12);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(mapRef.current);

      L.control.zoom({ position: 'topright' }).addTo(mapRef.current);

      mapRef.current.on('click', (e: any) => {
        if (!markersRef.current.pickup) {
          setMarker('pickup', e.latlng);
        } else if (!markersRef.current.delivery) {
          setMarker('delivery', e.latlng);
        } else {
          removeMarker('delivery');
          setMarker('delivery', e.latlng);
        }
      });
    };

    const searchLocations = async (query: string, type: 'pickup' | 'delivery') => {
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}%2C%20Dhaka%2C%20Bangladesh&limit=5&countrycodes=bd`
        );
        const data = await res.json();
        setSearchResults(data);
      } catch (err) {
        console.error('Search error:', err);
      }
    };

    const setMarker = (type: 'pickup' | 'delivery', latlng: any, label?: string) => {
      if (markersRef.current[type]) {
        removeMarker(type);
      }

      const color = type === 'pickup' ? '#10b981' : '#ef4444';
      const icon = L.divIcon({
        className: 'custom-marker-container',
        html: `
          <div style="
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
          ">
            <button 
              class="marker-remove-btn"
              onclick="event.stopPropagation(); window.removeLocationMarker('${type}')"
              style="
                position: absolute;
                top: -8px;
                right: -8px;
                width: 20px;
                height: 20px;
                background: #dc2626;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
              "
            >&times;</button>
            <i class="fa-solid fa-location-dot" style="color:${color}; font-size:32px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));"></i>
            <span style="
              background: ${color};
              color: white;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 600;
              margin-top: -4px;
            ">${type === 'pickup' ? 'Pickup' : 'Delivery'}</span>
          </div>
        `,
        iconSize: [40, 50],
        iconAnchor: [20, 50]
      });

      const marker = L.marker(latlng, { icon, draggable: true }).addTo(mapRef.current);
      
      marker.on('dragend', () => {
        const newLatlng = marker.getLatLng();
        if (markersRef.current[type]) {
          markersRef.current[type]!.latlng = newLatlng;
        }
        updateRoute();
      });

      markersRef.current[type] = { marker, type };

      if (markersRef.current.pickup && markersRef.current.delivery) {
        updateRoute();
      }
    };

    const removeMarker = (type: 'pickup' | 'delivery') => {
      if (markersRef.current[type]) {
        mapRef.current.removeLayer(markersRef.current[type]!.marker);
        markersRef.current[type] = null;
        
        if (routingRef.current) {
          mapRef.current.removeControl(routingRef.current);
          routingRef.current = null;
        }
        
        onDistanceChange(0);
      }
    };

    (window as any).removeLocationMarker = (type: string) => {
      removeMarker(type as 'pickup' | 'delivery');
    };

    (window as any).searchAndSetLocation = (query: string, type: 'pickup' | 'delivery') => {
      searchLocations(query, type);
    };

    const updateRoute = () => {
      if (!markersRef.current.pickup || !markersRef.current.delivery) return;
      
      if (routingRef.current) {
        mapRef.current.removeControl(routingRef.current);
      }

      onDistanceChange(0);

      routingRef.current = L.Routing.control({
        waypoints: [
          markersRef.current.pickup!.marker.getLatLng(),
          markersRef.current.delivery!.marker.getLatLng()
        ],
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1'
        }),
        lineOptions: {
          styles: [{ color: '#FF6B00', weight: 5, opacity: 0.8, dashArray: '10, 10' }]
        },
        createMarker: function() { return null; },
        addWaypoints: false,
        routeWhileDragging: true,
        show: false,
        zooming: true
      }).addTo(mapRef.current);

      routingRef.current.on('routesfound', (e: any) => {
        const routes = e.routes;
        const summary = routes[0].summary;
        const dist = parseFloat((summary.totalDistance / 1000).toFixed(1));
        onDistanceChange(dist);
      });

      routingRef.current.on('routingerror', () => {
        onDistanceChange(0);
      });
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleSearch = async (query: string, type: 'pickup' | 'delivery') => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}%2C%20Bangladesh&limit=5&countrycodes=bd`
      );
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const selectLocation = (result: any, type: 'pickup' | 'delivery') => {
    const latlng = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
    
    if (!mapRef.current) return;
    
    if (markersRef.current[type]) {
      mapRef.current.removeLayer(markersRef.current[type]!.marker);
      markersRef.current[type] = null;
    }

    const color = type === 'pickup' ? '#10b981' : '#ef4444';
    const labelText = type === 'pickup' ? 'Pickup' : 'Delivery';
    const icon = L.divIcon({
      className: 'custom-marker-container',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <button 
            class="marker-remove-btn"
            onclick="event.stopPropagation(); window.removeLocationMarker('${type}')"
            style="position: absolute; top: -8px; right: -8px; width: 20px; height: 20px; background: #dc2626; color: white; border: none; border-radius: 50%; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; z-index: 1000;">&times;</button>
          <i class="fa-solid fa-location-dot" style="color:${color}; font-size:32px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));"></i>
          <span style="background: ${color}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-top: -4px;">${labelText}</span>
        </div>
      `,
      iconSize: [40, 50],
      iconAnchor: [20, 50]
    });

    const marker = L.marker(latlng, { icon, draggable: true }).addTo(mapRef.current);
    
    marker.on('dragend', () => {
      const newLatlng = marker.getLatLng();
      markersRef.current[type] = { marker, type };
      updateRouteInternal();
    });

    markersRef.current[type] = { marker, type };
    
    mapRef.current.setView(latlng, 14);
    
    setSearchResults([]);
    setShowPickupSearch(false);
    setShowDeliverySearch(false);

    if (markersRef.current.pickup && markersRef.current.delivery) {
      updateRouteInternal();
    }
  };

  const updateRouteInternal = () => {
    if (!markersRef.current.pickup || !markersRef.current.delivery) return;
    
    if (routingRef.current) {
      mapRef.current.removeControl(routingRef.current);
    }

    onDistanceChange(0);

    routingRef.current = L.Routing.control({
      waypoints: [
        markersRef.current.pickup!.marker.getLatLng(),
        markersRef.current.delivery!.marker.getLatLng()
      ],
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1'
      }),
      lineOptions: {
        styles: [{ color: '#FF6B00', weight: 5, opacity: 0.8, dashArray: '10, 10' }]
      },
      createMarker: function() { return null; },
      addWaypoints: false,
      routeWhileDragging: true,
      show: false,
      zooming: true
    }).addTo(mapRef.current);

    routingRef.current.on('routesfound', (e: any) => {
      const routes = e.routes;
      const summary = routes[0].summary;
      const dist = parseFloat((summary.totalDistance / 1000).toFixed(1));
      onDistanceChange(dist);
    });
  };

  return (
    <>
      <div id="dhaka-map" style={{ width: '100%', height: '100%' }}></div>
      
      <div className="map-controls" style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1000,
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={() => setZoomEnabled(!zoomEnabled)}
          className="zoom-toggle-btn"
          style={{
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          title={zoomEnabled ? 'Disable scroll zoom' : 'Enable scroll zoom'}
        >
          <i className={`fa-solid fa-${zoomEnabled ? 'lock' : 'lock-open'}`}></i>
          <span style={{fontSize: '12px'}}>Scroll: {zoomEnabled ? 'On' : 'Off'}</span>
        </button>
      </div>

      <div className="map-search-boxes" style={{
        position: 'absolute',
        top: '10px',
        right: '50px',
        zIndex: 1000,
        display: 'flex',
        gap: '8px'
      }}>
        <div style={{position: 'relative'}}>
          <input
            type="text"
            id="pickup-search-input"
            placeholder="Pickup area..."
            onFocus={() => setShowPickupSearch(true)}
            onChange={(e) => handleSearch(e.target.value, 'pickup')}
            style={{
              padding: '8px 12px',
              border: '1px solid #10b981',
              borderRadius: '6px 0 0 6px',
              width: '150px',
              fontSize: '13px',
              outline: 'none'
            }}
          />
          {showPickupSearch && searchResults.length > 0 && (
            <div className="search-dropdown" style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '0 0 6px 6px',
              maxHeight: '200px',
              overflow: 'auto',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              {searchResults.map((result, idx) => (
                <div
                  key={idx}
                  onClick={() => selectLocation(result, 'pickup')}
                  style={{
                    padding: '10px 12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0',
                    fontSize: '13px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <div style={{fontWeight: 500}}>{result.display_name.split(',')[0]}</div>
                  <div style={{fontSize: '11px', color: '#666'}}>
                    {result.display_name.split(',').slice(1, 3).join(',')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div style={{position: 'relative'}}>
          <input
            type="text"
            id="delivery-search-input"
            placeholder="Delivery area..."
            onFocus={() => setShowDeliverySearch(true)}
            onChange={(e) => handleSearch(e.target.value, 'delivery')}
            style={{
              padding: '8px 12px',
              border: '1px solid #ef4444',
              borderRadius: '6px 0 0 6px',
              width: '150px',
              fontSize: '13px',
              outline: 'none'
            }}
          />
          {showDeliverySearch && searchResults.length > 0 && (
            <div className="search-dropdown" style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '0 0 6px 6px',
              maxHeight: '200px',
              overflow: 'auto',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              {searchResults.map((result, idx) => (
                <div
                  key={idx}
                  onClick={() => selectLocation(result, 'delivery')}
                  style={{
                    padding: '10px 12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0',
                    fontSize: '13px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <div style={{fontWeight: 500}}>{result.display_name.split(',')[0]}</div>
                  <div style={{fontSize: '11px', color: '#666'}}>
                    {result.display_name.split(',').slice(1, 3).join(',')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}