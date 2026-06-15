import { useNavigate } from "react-router-dom";

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100 px-3"
      style={{ backgroundColor: "#F8F9FA" }}
    >
      <div
        className="text-center p-5 bg-white"
        style={{
          maxWidth: "500px",
          borderRadius: "16px",
          boxShadow:
            "0 1px 3px rgba(60,64,67,.3), 0 4px 8px rgba(60,64,67,.15)",
        }}
      >
        <div
          className="mb-3"
          style={{
            fontSize: "64px",
            color: "#EA4335",
          }}
        >
          🔒
        </div>

        <h1
          style={{
            color: "#202124",
            fontSize: "32px",
            fontWeight: 500,
          }}
        >
          Access Denied
        </h1>

        <p
          className="mt-3 mb-4"
          style={{
            color: "#5F6368",
            fontSize: "15px",
            lineHeight: 1.6,
          }}
        >
          You don't have permission to access this page.
        </p>

        <button
          onClick={() => navigate("/")}
          className="btn"
          style={{
            backgroundColor: "#1A73E8",
            color: "#fff",
            borderRadius: "24px",
            padding: "10px 24px",
            fontWeight: 500,
            border: "none",
          }}
        >
          Go back to map
        </button>
      </div>
    </div>
  );
}
