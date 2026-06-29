import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { GoogleLogin } from "@react-oauth/google";
import api from "../api/axiosInstance";
import logo from "../assets/logo.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    try {
      const credential = credentialResponse.credential;

      if (!credential) throw new Error("No Google credential received");

      const response = await api.post("/auth/google", {
        idToken: credential,
      });

      const { token, user } = response.data;
      

      login(token, user);

      navigate("/");
    } catch (error) {
      alert("Google sign-in failed, please try again");
    }
  };

  const handleError = () => {
    alert("Google sign-in failed, please try again");
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div
        className="card border-0 shadow-lg"
        style={{
          maxWidth: "900px",
          width: "100%",
          borderRadius: "28px",
        }}
      >
        <div className="row g-0">
          {/* Left Side */}
          <div className="col-md-6 p-5 d-flex flex-column justify-content-center">
            <img
              src={logo}
              alt="Lumina"
              style={{
                width: "80px",
                height: "80px",
                marginBottom: "24px",
              }}
            />

            <h1
              className="fw-light"
              style={{
                fontSize: "3rem",
                color: "#202124",
              }}
            >
              Sign in
            </h1>

            <p className="text-secondary fs-5">
              to continue to <strong>Lumina</strong>
            </p>

            <p className="text-muted mt-4">
              India's intelligent city safety platform helping citizens
              discover, report, and track incidents in real time.
            </p>
          </div>

          {/* Right Side */}
          <div className="col-md-6 p-5 d-flex align-items-center">
            <div
              className="border rounded-4 p-4 w-100"
              style={{ borderColor: "#dadce0" }}
            >
              <h3 className="mb-3">Welcome</h3>

              <p className="text-muted mb-4">
                Use your Google account to continue.
              </p>

              <div className="d-flex justify-content-center">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="pill"
                  width="320"
                />
              </div>

              <p className="text-muted text-center mt-4 small">
                By continuing, you agree to Lumina's Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
