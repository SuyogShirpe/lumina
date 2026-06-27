export function getStatusBadge(status) {
  switch (status) {
    case "ACTIVE":
      return '<span class="badge badge-success">ACTIVE</span>';

    case "RESOLVED":
      return '<span class="badge badge-secondary">RESOLVED</span>';

    case "FLAGGED":
      return '<span class="badge badge-danger">FLAGGED</span>';

    default:
        return `<span class="badge badge-light">${status}</span>`
  }
}
