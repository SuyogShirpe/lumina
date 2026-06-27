export function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;

  const mins = Math.floor(diffMs / (1000 * 60));
  const hrs = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (mins < 1) return "Just now";

  if (hrs < 1) return `${mins} minute${mins === 1 ? "" : "s"} ago`;

  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;

  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
