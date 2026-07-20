import { OlaMaps } from "olamaps-web-sdk";
import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { buildIncidentPopup } from "../utils/buildIncidentPopup";
import CategoryFilter from "./CategoryFilter";
import "../stylesheets/mapPage.css";
import IncidentSidebar from "./IncidentSidebar";
import RadiusSlider from "./RadiusSlider";

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
  const markerRef = useRef(new Map());
  const olaMapsRef = useRef(null);

  const [userLocation, setUserLocation] = useState(null);
  const [radiusKm, setRadiusKm] = useState(5);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState(new Set());

  const navigate = useNavigate();



  const fetchIncidents = async (lat, lng) => {
    try {
      setLoading(true);
      const response = await api.get("/api/incidents", {
        params: { lat, lng, radiusKm: 5 },
      });
      setIncidents(response.data);
    } catch (error) {
      console.log("Error fetching incidents:", error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    const handlePopupClick = async (event) => {
      const target = event.target.closest("[data-action]");
      if (!target) return;

      const { action, incidentId } = event.target.dataset;

      if (!action || !incidentId) return;

      if (action === "vote") {
        try {
          const response = await api.put(`/api/incidents/${incidentId}/vote`);
          const updatedIncident = response.data;

          setIncidents((prev) =>
            prev.map((incident) =>
              incident.incidentId === updatedIncident.incidentId
                ? {
                    ...incident,
                    upvoteCount: updatedIncident.upvoteCount,
                    userHasVoted: updatedIncident.userHasVoted,
                  }
                : incident,
            ),
          );
        } catch (error) {
          console.error("Failed to vote:", error);
        }
      }

      if (action === "details") {
        window.location.href = `/incidents/${incidentId}`;
      }
    };

    document.addEventListener("click", handlePopupClick);

    return () => {
      document.removeEventListener("click", handlePopupClick);
    };
  }, [setIncidents]);



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

          navigator.geolocation.getCurrentPosition(
            (position) => {
              
              const location = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              }

              setUserLocation(location);

              map.flyTo({
                center: [location.lng, location.lat],
                zoom: 14,
                duration: 1500,
              });

              new OlaMaps.Marker({
                element: createUserLocationElement(),
                offset: [0, 0],
                anchor: "center",
              })
                .setLngLat([location.lng, location.lat])
                .addTo(map);

              fetchIncidents(location.lat, location.lng);
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


  const handleIncidentClick = (incident) => {
    mapRef.current.flyTo({
      center: [incident.lat , incident.lng],
      zoom:18,
    });
  }

  const onIncidentClick = (incident) => {
    const marker = markerRef.current.get(incident.incidentId);
    if(!marker) return;

    marker.togglePopup();
  }


  const filteredIncidents = useMemo(() => {
    if (selectedCategories.length === 0) {
      return incidents;
    }

    return incidents.filter((incident) =>
      selectedCategories.has(incident.category.categoryId),
    );
  }, [incidents, selectedCategories]);



  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;

    markerRef.current.forEach((marker) => marker.remove());
    markerRef.current.clear();

    filteredIncidents.forEach((incident) => {
      const popup = new OlaMaps.Popup({
        offset: [0, -10],
        anchor: "bottom",
      }).setHTML(buildIncidentPopup(incident));

      popup.on("open" , () => {
        const popupEl = popup.getElement();

        const detailsBtn = popupEl.querySelector(".details-btn")

        detailsBtn?.addEventListener("click", () => {
          navigate(`/incidents/${incident.incidentId}`);
        })
      })
      

      const marker = new OlaMaps.Marker({
        element: createColoredMarkerElement(
          incident.category?.colorHex || "#888888",
        ),
        anchor: "center",
      })
        .setLngLat([Number(incident.lng), Number(incident.lat)])
        .setPopup(popup)
        .addTo(mapRef.current);

      markerRef.current.set(incident.incidentId, marker);
    });
  }, [filteredIncidents, isMapLoaded]);


  useEffect(() => {

    if(!userLocation) return;

    const timer = setTimeout(() => {
      fetchIncidents(
        userLocation.lat,
        userLocation.lng,
        radiusKm
      )
    }, 500);

    return () => clearTimeout(timer);


  }, [radiusKm, userLocation]);
  



  return (
    <div className="map-container">
    {loading && <div className="loading-box">Loading incidents...</div>}

    
    <div id="map" className="map" />

    
    <div className="right-panel">

      <RadiusSlider
        value={radiusKm}
        onChange={setRadiusKm} 
      />


      <CategoryFilter
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />

      <IncidentSidebar
        incidents={filteredIncidents}
        onIncidentClick={onIncidentClick}
      />
    </div>
  </div>
  );
}
