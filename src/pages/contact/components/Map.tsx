import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  coordinates: string; // "lat,lng"
  address: string;
}

// Fix for default marker icons (run once outside component)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

const Map: React.FC<Props> = ({ coordinates, address }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !coordinates) return;

    const parseCoordinates = (coordStr: string): [number, number] | null => {
      const parts = coordStr.split(",").map((s) => parseFloat(s.trim()));
      if (parts.length !== 2 || parts.some(isNaN)) return null;
      return parts as [number, number];
    };

    const coords = parseCoordinates(coordinates);
    if (!coords) return;

    // Clean up any existing map instance
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    // Ensure the container is empty (remove any leftover map artifacts)
    if (mapRef.current.hasChildNodes()) {
      mapRef.current.innerHTML = '';
    }

    try {
      // Initialize new map
      const map = L.map(mapRef.current).setView(coords, 13);
      mapInstance.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker(coords).addTo(map).bindPopup(address).openPopup();
    } catch (error) {
      console.error("Map initialization error:", error);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [coordinates, address]);

  return <div ref={mapRef} className="h-96 w-full" />;
};

export default Map;