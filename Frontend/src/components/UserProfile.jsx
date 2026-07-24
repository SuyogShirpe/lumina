import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../contexts/AuthProvider";
import "../stylesheets/userProfile.css";
import { toast } from "sonner";
import { timeAgo } from "../utils/timeAgo";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [incidentLoading , setIncidentLoading] = useState(true);
  const [incidents, setIncidents] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/api/users/me");
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await api.get("/api/users/me/incidents");
        setIncidents(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setIncidentLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  const stats = useMemo(
    () => ({
      total: incidents.length,
      totalUpvotes: incidents.reduce((sum, i) => sum + (i.upvoteCount || 0), 0),
      resolved: incidents.filter((i) => i.status === "RESOLVED").length,
    }),
    [incidents],
  );

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this incident?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await api.delete(`/api/users/me/incidents/${id}`);

      setIncidents((prev) => prev.filter((i) => i.incidentId != id));

      toast.success("Incident deleted successfully.");
    } catch (error) {
      console.error("Failed to delete incident:", error);
      toast.error("Failed to delete incident. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (userLoading) {
    return <h2>Loading profile...</h2>;
  }

  if (!user) {
    return <h2>Unable to load profile.</h2>;
  }

  if (incidents.length === 0) {
    return (
      <div className="text-center py-5">
        <div style={{ fontSize: "48px" }}>📋</div>
        <h4>No incidents reported yet</h4>
        <p>Be the first to report a safety incident in your area.</p>
        <button onClick={() => navigate("/report")} className="btn btn-primary">
          Report an Incident
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="profile-container">
        <div className="profile-card">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="profile-avatar"
          />

          <h2>{user.name}</h2>
          <p>{user.email}</p>

          <span
            className={`role-badge ${user.role === "ADMIN" ? "admin" : "user"}`}
          >
            {user.role}
          </span>

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="incident-container">
        {incidents.map((incident) => (
          <div
            key={incident.incidentId}
            className="incident-card"
            onClick={() => navigate(`/incidents/${incident.incidentId}`)}
          >
            <div className="incident-header">
              <span
                className="category-dot"
                style={{
                  backgroundColor: incident.category?.colorHex || "#6b7280",
                }}
              />

              <span className="category-name">{incident.category?.name}</span>
            </div>

            <h4>{incident.title}</h4>

            <p className="incident-time">{timeAgo(incident.occurredAt)}</p>

            <div className="incident-footer">
              <span>👍 {incident.upvoteCount}</span>

              <span
                className={`status ${incident.status?.toLowerCase() || ""}`}
              >
                {incident.status}
              </span>
            </div>

            {incident.status?.toLowerCase() === "active" && (
              <button
                className="delete-incident"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(incident.incidentId);
                }}
                disabled={deletingId === incident.incidentId}
              >
                {deletingId === incident.incidentId ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
