import { useAuth } from "../contexts/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../stylesheets/navbar.css"

export default function Navbar() {
  const { user } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="left-side">
        <img
          className="logo"
          src={logo}
          alt="Lumina"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />
        <span
          className="name"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          Lumina
        </span>
      </div>

      <div className="right-side">
        <span
          className="map-link"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          Map
        </span>

        <button className="report-btn" onClick={() => navigate("/report")}>
          Report
        </button>

        {user?.role === "ADMIN" && (
          <span
            className="admin-link"
            onClick={() => navigate("/admin")}
            style={{ cursor: "pointer" }}
          >
            Admin
          </span>
        )}

        <div className="profile dropdown">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              data-bs-toggle="dropdown"
            ></img>
          ) : (
            <div
              className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center "
              data-bs-toggle="dropdown"
            >
              {getInitials(user.name)}
            </div>
            
          )}
          <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item" onClick={() => navigate("/profile")}>Profile</button></li>
                <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
              </ul>
        </div>
      </div>
    </div>
  );
}
