import { useEffect, useRef } from "react";
import { Box } from "@radix-ui/themes";

interface GoogleMapPickerProps {
  onCoordinatesChange: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

export function GoogleMapPicker({
  onCoordinatesChange,
  initialLat = 8.9138353,
  initialLng = -79.6087425
}: GoogleMapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Wait for Google Maps to load
    const initializeMap = () => {
      if (!window.google || !window.google.maps) {
        setTimeout(initializeMap, 100);
        return;
      }

      const map = new google.maps.Map(mapRef.current!, {
        zoom: 13,
        center: { lat: initialLat, lng: initialLng }
      });

      const marker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: { lat: initialLat, lng: initialLng }
      });

      // Update coordinates when marker is dragged
      marker.addListener('dragend', () => {
        const position = marker.getPosition();
        if (position) {
          onCoordinatesChange(position.lat(), position.lng());
        }
      });

      // Toggle bounce animation on click
      marker.addListener('click', () => {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    };

    initializeMap();
  }, [initialLat, initialLng, onCoordinatesChange]);

  return (
    <Box
      ref={mapRef}
      style={{
        border: "2px dashed var(--gray-6)",
        borderRadius: "var(--radius-2)",
        width: "100%",
        height: "300px",
      }}
    />
  );
}
