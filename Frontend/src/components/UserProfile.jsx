import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "./AuthProvider";
import "../stylesheets/userProfile.css";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/api/users/me");
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <h2>Loading profile...</h2>;
  }

  if (!user) {
    return <h2>Unable to load profile.</h2>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src={user.avatarUrl} alt={user.name} className="profile-avatar" />

        <h2>{user.name}</h2>
        <p>{user.email}</p>

        <span
          className={`role-badge ${user.role === "ADMIN" ? "admin" : "user"}`}
        >
          {user.role}
        </span>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}
