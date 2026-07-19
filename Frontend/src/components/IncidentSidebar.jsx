import { timeAgo } from "../utils/timeAgo";
import "../stylesheets/IncidentSidebar.css";

export default function IncidentSidebar({ incidents, onIncidentClick }) {
  if (!incidents?.length) {
    return (
      <div className="sidebar-empty">
        <h4>No incidents found nearby.</h4>
        <p>Try increasing the radius or changing filters.</p>
      </div>
    );
  }

  return (
    <div className="incident-sidebar">
      {incidents.map((incident) => (
        <div
          key={incident.incidentId}
          className="incident-card"
          onClick={() => onIncidentClick(incident)}
        >
          <div className="incident-header">
            <span
              className="category-dot"
              style={{
                backgroundColor: incident.category?.colorHex || "#6b7280",
              }}
            />

            <h4>{incident.title}</h4>
          </div>

          <p className="incident-distance">
            {incident.distanceKm != null ? incident.distanceKm.toFixed(2) : "N/A"} km away
          </p>

          <p className="incident-time">{timeAgo(incident.occurredAt)}</p>

          <div className="incident-footer">
            <span>👍 {incident.upvoteCount}</span>

            <span className={`status ${incident.status?.toLowerCase() || ""}`}>
              {incident.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
