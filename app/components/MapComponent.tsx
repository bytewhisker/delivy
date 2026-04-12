'use client';

import { useEffect, useRef, useCallback } from 'react';

declare const L: any;

interface MapComponentProps {
  onDistanceChange: (dist: number) => void;
  onLocationChange: (type: 'pickup' | 'delivery', name: string | null) => void;
}

interface LocationMarker {
  marker: any;
  type: 'pickup' | 'delivery';
  latlng?: any;
}

const DHAKA_AREA_COORDS: Record<string, [number, number]> = {
  'Uttara': [23.8278, 90.4029], 'Uttara Model Town': [23.8320, 90.4080], 'Uttara Sector 1-10': [23.8356, 90.4089], 'Uttara Sector 11-13': [23.8420, 90.4150],
  'Banani': [23.7947, 90.4064], 'Banani Model Town': [23.7970, 90.4030],
  'Gulshan': [23.7912, 90.4056], 'Gulshan 2': [23.7931, 90.4123], 'Gulshan 1': [23.7880, 90.3980],
  'Dhanmondi': [23.7465, 90.3762], 'Dhanmondi 27': [23.7440, 90.3780], 'Dhanmondi 15': [23.7500, 90.3720], 'Dhanmondi 32': [23.7410, 90.3820],
  'Mirpur': [23.8218, 90.3658], 'Mirpur 1': [23.8160, 90.3620], 'Mirpur 2': [23.8190, 90.3580], 'Mirpur 6': [23.8280, 90.3700], 'Mirpur 10': [23.8350, 90.3750], 'Mirpur 11': [23.8380, 90.3800], 'Mirpur 12': [23.8400, 90.3850],
  'Mohammadpur': [23.7654, 90.3591], 'Mohammadpur Bazar': [23.7630, 90.3550], 'Beribadh': [23.7389, 90.4331], 'Kamalpur': [23.7281, 90.3867],
  'Baridhara': [23.7969, 90.4286], 'Baridhara DOHS': [23.8000, 90.4300], 'Bashundhara': [23.8212, 90.4318], 'Bashundhara R/A': [23.8180, 90.4290],
  'Niketon': [23.7878, 90.3892], 'Gulshan Baridhara': [23.7930, 90.4200], 'Merul Badda': [23.7780, 90.4250], 'Badda': [23.7689, 90.4318], 'Badda DNCC': [23.7700, 90.4350],
  'Paltan': [23.7364, 90.4059], 'Motijheel': [23.7273, 90.4177], 'Kotwali': [23.7111, 90.4126], 'Lalbagh': [23.7158, 90.3839], 'Kamarchar': [23.7192, 90.3992], 'Wari': [23.7093, 90.4108],
  'Agargaon': [23.7794, 90.3714], 'Sher-e-Bangla Nagar': [23.7750, 90.3750], 'Panchaboti': [23.7566, 90.3684], 'Farmgate': [23.7566, 90.3874],
  'Tejgaon': [23.7633, 90.3876], 'Tejgaon I/A': [23.7650, 90.3900], 'Khilgaon': [23.7427, 90.4514], 'Malibagh': [23.7397, 90.4248], 'Mugda': [23.7294, 90.4503], 'Shantinagar': [23.7326, 90.4182],
  'Shahbagh': [23.7397, 90.3991], 'Kadamtala': [23.7250, 90.4100], 'Islampur': [23.7257, 90.4021], 'Sutrapur': [23.7035, 90.4246], 'Jatrabari': [23.7181, 90.4335],
  'Demra': [23.7281, 90.4589], 'Demra Colony': [23.7300, 90.4600], 'Sarulia': [23.7450, 90.4700], 'Narayanganj': [23.6138, 90.5065], 'Siddirganj': [23.6200, 90.5100],
  'Savar': [23.8583, 90.2665], 'Savar Bazar': [23.8550, 90.2700], 'Zirabo': [23.8700, 90.2750], 'Ashulia': [23.8900, 90.2800], 'Gazipur': [23.9000, 90.4000],
  'Keraniganj': [23.6989, 90.3456], 'Konda': [23.7100, 90.3400], 'Kaliakoir': [23.9500, 90.4200], 'Tongi': [23.9100, 90.4100], 'Gazipur Sadar': [23.9000, 90.4000],
  'Cantonment': [23.7933, 90.3963], 'Mohanagar': [23.7436, 90.4414], 'Rampura': [23.7500, 90.4200], 'Bawni': [23.7600, 90.4100], 'Kuril': [23.8100, 90.4200], 'Khilkhet': [23.8150, 90.4350],
  'Jahangir Nagar': [23.8700, 90.3500], 'Bhasantek': [23.7800, 90.4400], 'Azampur': [23.8000, 90.4100], 'Uttarkhan': [23.8500, 90.4200], 'Dakshinkhan': [23.8600, 90.4300],
  'Shonir Akhra': [23.7200, 90.4400], 'Nayabazar': [23.7100, 90.4000], 'Chowkbazar': [23.7150, 90.3950], 'Dhamrai': [23.9500, 90.2800], 'Manikganj': [23.8500, 90.2500]
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

  const handleSearchSelect = useCallback(async (query: string, type: 'pickup' | 'delivery', providedCoords?: { lat: number; lng: number }) => {
    if (!mapRef.current || !query) return;

    const normalizedQuery = query.trim();
    let coords = providedCoords || DHAKA_AREA_COORDS[normalizedQuery];
    
    if (!coords) {
      console.log('Area not found in coords:', normalizedQuery);
      return;
    }

    const latlng = { lat: coords.lat || coords[0], lng: coords.lng || coords[1] };
    
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