import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

    if (!isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }

    return <Outlet />;
  }
}
