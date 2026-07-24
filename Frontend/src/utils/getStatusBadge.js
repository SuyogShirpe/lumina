export function getStatusBadge(status) {
  const styles = {
    ACTIVE: "background:#fef2f2;color:#991b1b;",    
  RESOLVED: "background:#dcfce7;color:#166534;",   
  FLAGGED: "background:#fefce8;color:#854d0e;", 
  };
  return `<span style="
        ${styles[status] || styles.ACTIVE}
        font-size:11px;
        font-weight:500;
        padding:2px 8px;
        border-radius:20px;
    ">${status}</span>`;
}
