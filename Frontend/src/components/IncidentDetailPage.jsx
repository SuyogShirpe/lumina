import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import PhotoGallery from "./PhotoGallery";
import ReporterCard from "./ReporterCard";
import MiniMap from "./MiniMap";

export default function IncidentDetailPage() {
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);

  useEffect(() => {
    const fetchIncident = async (id) => {
      try {
        setLoading(true);
        const incidentResponse = await api.get(`/api/incidents/${id}`);
        setIncident(incidentResponse.data);
        console.log(incidentResponse.data);
        setUpvoteCount(incidentResponse.data.upvoteCount);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncident(id);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    const isNotFound = error.response?.status === 404;

    return (
      <div className="container py-5">
        <div className="card shadow-sm mx-auto" style={{ maxWidth: "500px" }}>
          <div className="card-body text-center">
            <h3 className="mb-3">
              {isNotFound ? "Incident not found" : "Something went wrong"}
            </h3>

            <p className="text-muted">
              {isNotFound
                ? "The incident you're looking for doesn't exist."
                : "An unexpected error occurred. Please try again later."}
            </p>

            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Go back to map
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {incident?.reporter && <ReporterCard reporter={incident.reporter} />}
      <MiniMap incident={incident} />
      <PhotoGallery incident={incident} />
    </div>
  );
}
