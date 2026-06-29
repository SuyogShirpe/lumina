import { timeAgo } from "./timeAgo";
import { getStatusBadge } from "./getStatusBadge";
import { getPhotoThumbnails } from "./getPhotoThumbnails";
import "../stylesheets/incidentPopup.css";

export const buildIncidentPopup = (incident) => {
  const accentColor = incident.category?.colorHex || "#888888";

  const reporterName = incident.reporter?.name || "Anonymous";

  const initials = reporterName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const statusBadge = getStatusBadge(incident.status);
  const timeAgoText = timeAgo(incident.occurredAt);
  const photoThumbnails = getPhotoThumbnails(incident.photoUrls);

  

  return `
<div class="incident-popup">
    <div class="popup-header">
        <div>
            <h3>${incident.title || "Untitled Incident"}</h3>
            <span class="category" style="background:${incident.category?.colorHex || "#E8F0FE"};">${incident.category?.name || "Unknown"}</span>
        </div>

        ${statusBadge}
    </div>

    <div class="popup-meta">
        <div class="reporter">
            <div class="avatar">${initials}</div>
            <div>
                <div class="name">${reporterName}</div>
                <div class="time">${timeAgoText}</div>
            </div>
        </div>
    </div>

    ${
      incident.description
        ? `<p class="description">${incident.description}</p>`
        : ""
    }

    ${photoThumbnails}

    <div class="popup-footer">
        <button
            class="popup-btn vote-btn"
            data-action="vote"
            data-incident-id="${incident.incidentId}">
            👍 ${incident.upvoteCount ?? 0}
        </button>

        <button
            class="popup-btn details-btn"
            data-action="details"
            data-incident-id="${incident.incidentId}">
            View Details
        </button>
    </div>
</div>
`;
};
