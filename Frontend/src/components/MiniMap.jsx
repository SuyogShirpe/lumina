import { OlaMaps } from "olamaps-web-sdk";
import { useEffect, useRef } from "react";

const apikey = import.meta.env.VITE_OLA_MAPS_API_KEY;

const createColoredMarkerElement = (color) => {
  const el = document.createElement("div");
  el.style.cssText = `
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: ${color};
        border: 2.5px solid white;
        box-shadow: 0 0 6px rgba(0,0,0,0.35);
        cursor: pointer;
    `;
  return el;
};

export default function MiniMap({ incident }) {
  const containerRef = useRef(null);
  useEffect(() => {
    if (!incident) return;

    if (!containerRef.current) return;

    if (incident?.lat == null || incident?.lng == null) return;

    let map;
    let cancelled = false;

    const initMap = async () => {
      try {
        const olaMaps = new OlaMaps({
          apiKey: apikey,
        });

        map = await olaMaps.init({
          style:
            "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
          container: containerRef.current,
          center: [incident.lng, incident.lat],
          zoom: 16,
          dragPan: false,
          scrollZoom: false,
          doubleClickZoom: false,
          dragRotate: false,
          touchZoomRotate: false,
          keyboard: false,
        });

        if (cancelled) {
          map.remove();
          return;
        }

        new OlaMaps.Marker({
          element: createColoredMarkerElement(
            incident.category?.colorHex ?? "#ef4444",
          ),
          offset: [0, 0],
          anchor: "center",
        })
          .setLngLat([incident.lng, incident.lat])
          .addTo(map);
      } catch (error) {
        console.error("Mini map initialization failed:", error);
      }
    };

    initMap();

    return () => {
      cancelled = true;
      if (map) {
        map.remove();
      }
    };
  }, [incident]);

  return (
    <div
      ref={containerRef}
      style={{
        height: "250px",
        width: "100%",
        borderRadius: "8px",
      }}
    />
  );
}
