'use client';

import { useEffect, useRef } from 'react';

declare const L: any;

interface MapComponentProps {
  onDistanceChange: (dist: number) => void;
  onLocationChange: (type: 'pickup' | 'delivery', name: string | null) => void;
  pickupCoords?: { lat: number; lng: number };
  deliveryCoords?: { lat: number; lng: number };
}

export default function MapComponent({ onDistanceChange, onLocationChange, pickupCoords, deliveryCoords }: MapComponentProps) {
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const pickupMarkerRef = useRef<any>(null);
  const deliveryMarkerRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);

  useEffect(() => {
    const initMap = () => {
      if (typeof L === 'undefined') {
        setTimeout(initMap, 500);
        return;
      }

      if (mapInstanceRef.current) return;

      const dhakaCoords = [23.8103, 90.4125];

      mapInstanceRef.current = L.map('dhaka-map', {
        zoomControl: false,
        scrollWheelZoom: false,
        touchZoom: false,
        dragging: true
      }).setView(dhakaCoords, 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);

      L.control.zoom({ position: 'topright' }).addTo(mapInstanceRef.current);

      mapInstanceRef.current.on('click', (e: any) => {
        if (!pickupMarkerRef.current) {
          setMarker('pickup', { lat: e.latlng.lat, lng: e.latlng.lng }, true);
        } else if (!deliveryMarkerRef.current) {
          setMarker('delivery', { lat: e.latlng.lat, lng: e.latlng.lng }, true);
        } else {
          deleteMarker('delivery');
          setMarker('delivery', { lat: e.latlng.lat, lng: e.latlng.lng }, true);
        }
      });

      const mapContainer = document.getElementById('dhaka-map')?.parentElement;
      if (mapContainer) {
        mapContainer.addEventListener('mouseenter', () => {
          if (mapInstanceRef.current) mapInstanceRef.current.scrollWheelZoom.enable();
        });
        mapContainer.addEventListener('mouseleave', () => {
          if (mapInstanceRef.current) mapInstanceRef.current.scrollWheelZoom.disable();
        });
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      if (pickupCoords) {
        deleteMarker('pickup');
        setMarker('pickup', pickupCoords);
      } else {
        deleteMarker('pickup');
      }
    }
  }, [pickupCoords]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      if (deliveryCoords) {
        deleteMarker('delivery');
        setMarker('delivery', deliveryCoords);
      } else {
        deleteMarker('delivery');
      }
    }
  }, [deliveryCoords]);

  // Reset distance when either marker is cleared
  useEffect(() => {
    if (!pickupCoords || !deliveryCoords) {
      onDistanceChange(0);
      // Clear the route from map
      if (routeLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(routeLayerRef.current);
        routeLayerRef.current = null;
      }
    }
  }, [pickupCoords, deliveryCoords, onDistanceChange]);

  const setMarker = (type: 'pickup' | 'delivery', location: { lat: number; lng: number }, fromClick: boolean = false) => {
    const color = type === 'pickup' ? '#10b981' : '#ef4444';
    const icon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <i class="fa-solid fa-location-dot" style="color:${color}; font-size:32px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));"></i>
          <span style="background: ${color}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-top: -4px;">${type === 'pickup' ? 'Pickup' : 'Delivery'}</span>
        </div>
      `,
      iconSize: [40, 50],
      iconAnchor: [20, 50]
    });

    const marker = L.marker([location.lat, location.lng], { icon, draggable: true }).addTo(mapInstanceRef.current);

    marker.on('dragend', () => {
      const newLatlng = marker.getLatLng();
      location = { lat: newLatlng.lat, lng: newLatlng.lng };
      if (pickupMarkerRef.current && deliveryMarkerRef.current) {
        calculateRoute();
      }
    });

    if (type === 'pickup') {
      pickupMarkerRef.current = marker;
    } else {
      deliveryMarkerRef.current = marker;
    }

    if (fromClick) {
      onLocationChange(type, type);
    }

    if (pickupMarkerRef.current && deliveryMarkerRef.current) {
      calculateRoute();
    }
  };

  const deleteMarker = (type: 'pickup' | 'delivery') => {
    if (type === 'pickup' && pickupMarkerRef.current) {
      mapInstanceRef.current.removeLayer(pickupMarkerRef.current);
      pickupMarkerRef.current = null;
    } else if (type === 'delivery' && deliveryMarkerRef.current) {
      mapInstanceRef.current.removeLayer(deliveryMarkerRef.current);
      deliveryMarkerRef.current = null;
    }
  };

  const calculateRoute = () => {
    if (!pickupMarkerRef.current || !deliveryMarkerRef.current) return;

    const pickupLatlng = pickupMarkerRef.current.getLatLng();
    const deliveryLatlng = deliveryMarkerRef.current.getLatLng();

    // Use OSRM for routing
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${pickupLatlng.lng},${pickupLatlng.lat};${deliveryLatlng.lng},${deliveryLatlng.lat}?overview=full&geometries=geojson`;

    fetch(osrmUrl)
      .then(res => res.json())
      .then(data => {
        if (data.routes && data.routes[0]) {
          const route = data.routes[0];
          const distanceKm = route.distance / 1000;
          onDistanceChange(distanceKm);

          // Draw route on map
          if (routeLayerRef.current) {
            mapInstanceRef.current.removeLayer(routeLayerRef.current);
          }

          const routeGeoJSON = {
            type: 'Feature',
            geometry: route.geometry
          };

          routeLayerRef.current = L.geoJSON(routeGeoJSON, {
            style: {
              color: '#FF6B00',
              weight: 3,
              opacity: 0.7,
              lineCap: 'round',
              lineJoin: 'round'
            }
          }).addTo(mapInstanceRef.current);

          // Fit map to route
          const bounds = L.geoJSON(routeGeoJSON).getBounds();
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
      })
      .catch(err => console.error('OSRM Error:', err));
  };

  return (
    <div id="dhaka-map" ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '40px' }} />
  );
}
