import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import Forbidden from "./Forbidden";

export default function AdminRoute() {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-white">
        <div
          className="spinner-border"
          role="status"
          style={{
            width: "3rem",
            height: "3rem",
            color: "#4285F4", 
          }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>

        <p
          className="mt-3"
          style={{
            color: "#5F6368",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          Loading...
        </p>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return <Forbidden />
  }

  return <Outlet />;
}
