import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import PhotoGallery from "./PhotoGallery";
import ReporterCard from "./ReporterCard";
import MiniMap from "./MiniMap";
import { toast } from "sonner";
import "../stylesheets/incidentDetails.css";

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
        setUserHasVoted(incidentResponse.data.userHasVoted ?? false);
        setUpvoteCount(incidentResponse.data.upvoteCount);
        console.log(incidentResponse.data);
      } catch (err) {
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

  if (!incident) {
    return null;
  }

  const handleVote = async () => {
    const prevCount = incident.upvoteCount;
    const prevVoted = incident.userHasVoted;

    const newVoted = !userHasVoted;
    const newCount = newVoted ? upvoteCount + 1 : upvoteCount - 1;

    setUserHasVoted(newVoted);
    setUpvoteCount(Math.max(0, newCount));

    try {
      const response = await api.put(`/api/incidents/${id}/vote`);
      setUpvoteCount(response.data.upvoteCount);
      setUserHasVoted(response.data.userHasVoted);
    } catch (error) {
      console.log("Vote failed:", error);
      setUpvoteCount(prevCount);
      setUserHasVoted(prevVoted);

      toast.error("Failed to register vote. Please try again.");
    }
  };

  return (
    <div className="container py-4 incident-page">
      <div className="card shadow-sm border-0 rounded-4 mb-4 incident-card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start flex-wrap">
            <div>
              <span
                className="badge mb-3 px-3 py-2"
                style={{
                  backgroundColor: incident.category.colorHex,
                  color: "#fff",
                }}
              >
                {incident.category.name}
              </span>

              <h2 className="fw-bold mb-2">{incident.title}</h2>

              <p className="text-secondary mb-4">{incident.description}</p>
            </div>

            <span
              className={`badge px-3 py-2 ${
                incident.status === "ACTIVE"
                  ? "bg-success"
                  : incident.status === "PENDING"
                    ? "bg-warning text-dark"
                    : "bg-secondary"
              }`}
            >
              {incident.status}
            </span>
          </div>

          <div className="d-flex align-items-center gap-3 flex-wrap">
            <button
              onClick={handleVote}
              className={`btn rounded-pill px-4 ${
                userHasVoted ? "btn-primary" : "btn-outline-primary"
              }`}
            >
              👍 {upvoteCount} {userHasVoted ? "Voted" : "Upvote"}
            </button>

            <small className="text-muted">
              {new Date(incident.occurredAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </small>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-4 mb-4 incident-card">
        <div className="card-body">
          <h4 className="section-title">Incident Information</h4>

          <div className="row">
            <div className="col-md-6 info-item">
              <span>Incident ID</span>
              <strong>#{incident.incidentId}</strong>
            </div>

            <div className="col-md-6 info-item">
              <span>Category</span>
              <strong>{incident.category.name}</strong>
            </div>

            <div className="col-md-6 info-item">
              <span>Status</span>
              <strong>{incident.status}</strong>
            </div>

            <div className="col-md-6 info-item">
              <span>Occurred At</span>
              <strong>
                {new Date(incident.occurredAt).toLocaleString("en-IN")}
              </strong>
            </div>

            <div className="col-md-6 info-item">
              <span>Latitude</span>
              <strong>{incident.lat}</strong>
            </div>

            <div className="col-md-6 info-item">
              <span>Longitude</span>
              <strong>{incident.lng}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-4 mb-4 incident-card">
        <div className="card-body">
          <h4 className="section-title">📍 Location</h4>

          <MiniMap incident={incident} />
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-4 mb-4 incident-card">
        <div className="card-body">
          <h4 className="section-title">📷 Photos</h4>

          <PhotoGallery incident={incident} />
        </div>
      </div>

      {incident.reporter && (
        <div className="card shadow-sm border-0 rounded-4 incident-card">
          <div className="card-body">
            <h4 className="section-title">👤 Reported By</h4>

            <ReporterCard reporter={incident.reporter} />
          </div>
        </div>
      )}
    </div>
  );
}
