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

const DHAKA_AREA_COORDS: Record<string, [number, number]> = {
  'Uttara': [23.8278, 90.4029], 'Banani': [23.7947, 90.4064], 'Gulshan': [23.7912, 90.4056],
  'Dhanmondi': [23.7465, 90.3762], 'Mirpur': [23.8218, 90.3658], 'Mohammadpur': [23.7654, 90.3591],
  'Baridhara': [23.7969, 90.4286], 'Bashundhara': [23.8212, 90.4318], 'Niketon': [23.7878, 90.3892],
  'Gulshan 2': [23.7931, 90.4123], 'Paltan': [23.7364, 90.4059], 'Motijheel': [23.7273, 90.4177],
  'Agargaon': [23.7794, 90.3714], 'Badda': [23.7689, 90.4318], 'Mohanagar': [23.7436, 90.4414],
  'Jatrabari': [23.7181, 90.4335], 'Demra': [23.7281, 90.4589], 'Narayanganj': [23.6138, 90.5065],
  'Savar': [23.8583, 90.2665], 'Keraniganj': [23.6989, 90.3456], 'Kamrangirchar': [23.7192, 90.3992],
  'Shahbagh': [23.7397, 90.3991], 'Lalbagh': [23.7158, 90.3839], 'Wari': [23.7093, 90.4108],
  'Sutrapur': [23.7035, 90.4246], 'Kotwali': [23.7111, 90.4126], 'Cantonment': [23.7933, 90.3963],
  'Panchaboti': [23.7566, 90.3684], 'Farmgate': [23.7566, 90.3874], 'Tejgaon': [23.7633, 90.3876],
  'Khilgaon': [23.7427, 90.4514], 'Malibagh': [23.7397, 90.4248], 'Mugda': [23.7294, 90.4503],
  'Shantinagar': [23.7326, 90.4182], 'Islampur': [23.7257, 90.4021], 'Kamalpur': [23.7281, 90.3867],
  'Korail': [23.7685, 90.3612], 'Beribadh': [23.7389, 90.4331],
  'Uttara Sector 1-10': [23.8356, 90.4089]
};

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
    if (!mapRef.current || !query) return;

    const normalizedQuery = query.trim();
    const coords = DHAKA_AREA_COORDS[normalizedQuery];
    
    if (!coords) {
      console.log('Area not found in coords:', normalizedQuery);
      return;
    }

    const latlng = { lat: coords[0], lng: coords[1] };
    
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
    mapRef.current.setView(latlng, 13);
    
    onLocationChange(type, normalizedQuery);

    if (markersRef.current.pickup && markersRef.current.delivery) {
      updateRouteInternal();
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