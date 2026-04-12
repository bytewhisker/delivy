'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

declare const L: any;

interface MapComponentProps {
  onDistanceChange: (dist: number) => void;
  onLocationChange: (type: 'pickup' | 'delivery', name: string | null) => void;
}

interface LocationMarker {
  marker: any;
  type: 'pickup' | 'delivery';
}

export default function MapComponent({ onDistanceChange, onLocationChange }: MapComponentProps) {
  const mapRef = useRef<any>(null);
  const routingRef = useRef<any>(null);
  const markersRef = useRef<{ pickup: LocationMarker | null; delivery: LocationMarker | null }>({ pickup: null, delivery: null });

  useEffect(() => {
    const initMap = () => {
      if (typeof L === 'undefined') {
        setTimeout(initMap, 500);
        return;
      }

      if (typeof L.Routing === 'undefined') {
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

      const mapContainer = document.getElementById('dhaka-map')?.parentElement;
      if (mapContainer) {
        mapContainer.addEventListener('mouseenter', () => {
          if (mapRef.current) mapRef.current.scrollWheelZoom.enable();
        });
        mapContainer.addEventListener('mouseleave', () => {
          if (mapRef.current) mapRef.current.scrollWheelZoom.disable();
        });
      }
    };

    const setMarker = (type: 'pickup' | 'delivery', latlng: any) => {
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

      reverseGeocode(latlng, type);

      if (markersRef.current.pickup && markersRef.current.delivery) {
        updateRoute();
      }
    };

    const reverseGeocode = async (latlng: any, type: 'pickup' | 'delivery') => {
      try {
        const res = await fetch(
          `https://photon.komoot.io/reverse?lat=${latlng.lat}&lon=${latlng.lng}`
        );
        const data = await res.json();
        const name = data.features?.[0]?.properties?.name || 
                     data.features?.[0]?.properties?.city || 
                     data.features?.[0]?.properties?.county || 
                     'Dhaka Area';
        onLocationChange(type, name);
      } catch (err) {
        onLocationChange(type, 'Dhaka Area');
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
        onLocationChange(type, null);
      }
    };

    (window as any).removeLocationMarker = (type: string) => {
      removeMarker(type as 'pickup' | 'delivery');
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

  const handleSearchSelect = useCallback(async (query: string, type: 'pickup' | 'delivery') => {
    if (!mapRef.current || query.length < 2) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}%2C%20Dhaka%2C%20Bangladesh&limit=1&countrycodes=bd`
      );
      const data = await res.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const latlng = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
        
        if (markersRef.current[type]) {
          mapRef.current.removeLayer(markersRef.current[type]!.marker);
        }

        const color = type === 'pickup' ? '#10b981' : '#ef4444';
        const icon = L.divIcon({
          className: 'custom-marker-container',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
              <button 
                class="marker-remove-btn"
                onclick="event.stopPropagation(); window.removeLocationMarker('${type}')"
                style="position: absolute; top: -8px; right: -8px; width: 20px; height: 20px; background: #dc2626; color: white; border: none; border-radius: 50%; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; z-index: 1000;">&times;</button>
              <i class="fa-solid fa-location-dot" style="color:${color}; font-size:32px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));"></i>
              <span style="background: ${color}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-top: -4px;">${type === 'pickup' ? 'Pickup' : 'Delivery'}</span>
            </div>
          `,
          iconSize: [40, 50],
          iconAnchor: [20, 50]
        });

        const marker = L.marker(latlng, { icon, draggable: true }).addTo(mapRef.current);
        
        marker.on('dragend', () => {
          const newLatlng = marker.getLatLng();
          markersRef.current[type] = { marker, type };
          if (markersRef.current.pickup && markersRef.current.delivery) {
            updateRouteInternal();
          }
        });

        markersRef.current[type] = { marker, type };
        
        mapRef.current.setView(latlng, 14);
        
        const name = result.display_name?.split(',')[0] || query;
        onLocationChange(type, name);

        if (markersRef.current.pickup && markersRef.current.delivery) {
          updateRouteInternal();
        }
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  }, []);

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

  (window as any).searchLocation = handleSearchSelect;

  return (
    <div id="dhaka-map" style={{ width: '100%', height: '100%' }}></div>
  );
}