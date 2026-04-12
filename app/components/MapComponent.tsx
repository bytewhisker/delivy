'use client';

import { useEffect, useRef } from 'react';

// External script loading logic for Leaflet
declare const L: any;

interface MapComponentProps {
  onDistanceChange: (dist: number) => void;
}

export default function MapComponent({ onDistanceChange }: MapComponentProps) {
  const mapRef = useRef<any>(null);
  const routingRef = useRef<any>(null);
  const pointsRef = useRef<{ pickup: any; delivery: any }>({ pickup: null, delivery: null });

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
        scrollWheelZoom: false, // Disable scroll zoom by default for better page scrolling on mobile
        touchZoom: true,
        tap: false // Recommended for mobile interactivity
      }).setView(dhakaCoords, 13);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(mapRef.current);

      mapRef.current.on('click', (e: any) => {
        if (!pointsRef.current.pickup) {
          setPoint('pickup', e.latlng);
        } else if (!pointsRef.current.delivery) {
          setPoint('delivery', e.latlng);
        } else {
          pointsRef.current.pickup = null;
          pointsRef.current.delivery = null;
          if (routingRef.current) mapRef.current.removeControl(routingRef.current);
          setPoint('pickup', e.latlng);
        }
      });
    };

    const setPoint = (type: 'pickup' | 'delivery', latlng: any) => {
      pointsRef.current[type] = latlng;
      
      if (pointsRef.current.pickup && pointsRef.current.delivery) {
        updateRoute();
      } else {
        L.marker(latlng).addTo(mapRef.current).bindPopup(type.toUpperCase()).openPopup();
      }
    };

    const updateRoute = () => {
      if (routingRef.current) mapRef.current.removeControl(routingRef.current);

      onDistanceChange(0); // Loading state

      routingRef.current = L.Routing.control({
        waypoints: [
          pointsRef.current.pickup,
          pointsRef.current.delivery
        ],
        router: L.Routing.osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1'
        }),
        lineOptions: {
          styles: [{ color: '#FF6B00', weight: 6, opacity: 0.8 }]
        },
        createMarker: function(i: number, wp: any) {
          return L.marker(wp.latLng, {
            draggable: true,
            icon: L.divIcon({
              className: 'custom-marker',
              html: `<i class="fa-solid fa-location-dot" style="color:${i === 0 ? '#10b981' : '#ef4444'}; font-size:24px;"></i>`
            })
          });
        },
        addWaypoints: false,
        routeWhileDragging: true,
        show: false 
      }).addTo(mapRef.current);

      routingRef.current.on('routesfound', (e: any) => {
        const routes = e.routes;
        const summary = routes[0].summary;
        const dist = parseFloat((summary.totalDistance / 1000).toFixed(1));
        onDistanceChange(dist);
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

  return <div id="dhaka-map" style={{ width: '100%', height: '100%' }}></div>;
}
