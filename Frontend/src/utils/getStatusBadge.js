export function getStatusBadge(status) {
  const styles = {
    ACTIVE: "background:#dcfce7;color:#166534;",
    RESOLVED: "background:#f1f5f9;color:#475569;",
    FLAGGED: "background:#fef2f2;color:#991b1b;",
  };
  return `<span style="
        ${styles[status] || styles.ACTIVE}
        font-size:11px;
        font-weight:500;
        padding:2px 8px;
        border-radius:20px;
    ">${status}</span>`;
}
