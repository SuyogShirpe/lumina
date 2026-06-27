import { OlaMaps } from "olamaps-web-sdk";
import { useEffect, useRef, useState } from "react";
import api from "../api/axiosInstance";

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

const createUserLocationElement = () => {
  const el = document.createElement("div");
  el.style.cssText = `
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: #1d4ed8;
        border: 3px solid white;
        box-shadow: 0 0 0 4px rgba(29,78,216,0.25);
        cursor: default;
    `;
  return el;
};

export default function MapPage() {

  
  const mapRef = useRef(null);
  const markerRef = useRef([]);
  const olaMapsRef = useRef(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchIncidents = async (lat, lng) => {
    try {
      setLoading(true);
      const response = await api.get("/api/incidents", {
        params: { lat, lng, radiusKm: 5 },
      });
      setIncidents(response.data);
      console.log(response.data);
    } catch (error) {
      console.log("Error fetching incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let map;

    const initMap = async () => {
      try {
        olaMapsRef.current = new OlaMaps({
          apiKey: apikey,
        });

        map = await olaMapsRef.current.init({
          style:
            "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
          container: "map",
          center: [78.9629, 20.5937],
          zoom: 5,
        });

        mapRef.current = map;

        map.on("load", () => {
          setIsMapLoaded(true);
          console.log("Ola Maps loaded successfully");

          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;

              console.log("User Location:", latitude, longitude);
              map.flyTo({
                center: [longitude, latitude],
                zoom: 14,
                duration: 1500,
              });

              new OlaMaps.Marker({
                element: createUserLocationElement(),
                offset: [0, 0],
                anchor: "center",
              })
                .setLngLat([longitude, latitude])
                .addTo(map);

              fetchIncidents(latitude, longitude);
            },
            (error) => {
              console.error("Geolocation error:", error);
            },
          );
        });
      } catch (error) {
        console.error("Map initialization error:", error);
      }
    };

    initMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;

    markerRef.current.forEach((marker) => marker.remove());
    markerRef.current = [];

    incidents.forEach((incident) => {
      const popup = new OlaMaps.Popup({ offset: [0, -10], anchor: "bottom" })
        .setHTML(`
                    <div style="min-width:160px;padding:6px;">
                        <div style="font-weight:500;font-size:14px;margin-bottom:4px;">
                            ${incident.title}
                        </div>
                        <div style="font-size:12px;color:#666;margin-bottom:4px;">
                            ${incident.category?.name || "Unknown"}
                        </div>
                        <div style="font-size:11px;color:#999;">
                            📍 ${incident.distanceKm?.toFixed(2)} km away
                            &nbsp;·&nbsp;
                            👍 ${incident.upvoteCount}
                        </div>
                    </div>
                `);

      const marker = new OlaMaps.Marker({
        element: createColoredMarkerElement(
          incident.category?.colorHex || "#888888",
        ),
        anchor: "center",
      })
        .setLngLat([Number(incident.lng), Number(incident.lat)])
        .setPopup(popup)
        .addTo(mapRef.current);

      markerRef.current.push(marker);
    });
  }, [incidents, isMapLoaded]);

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            zIndex: 1000,
            background: "white",
            padding: "8px 14px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 500,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          Loading incidents...
        </div>
      )}

      <div id="map" style={{ height: "100vh", width: "100%" }} />
    </div>
  );
}
