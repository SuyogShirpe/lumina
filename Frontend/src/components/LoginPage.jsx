import { useNavigate } from "react-router-dom"
import { useAuth } from "./AuthProvider"
import { GoogleLogin } from "@react-oauth/google"
import api from "../api/axiosInstance";
import logo from "../assets/logo.png";

export default function LoginPage() {

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    try{
        const credential = credentialResponse.credential

        if(!credential)
            throw new Error("No Google credential received")

        const response = await api.post("/auth/google", {
            idToken: credential,
        });

        const {token, user} = response.data;
        console.log("Google authentication successful, received token and user:", { token, user });

        login(token, user);

        navigate("/")
    } catch (error) {
        console.error("Google authentication failed:", error)
        alert("Google sign-in failed, please try again")
    }
  }

  const handleError = () => {
    alert("Google sign-in failed, please try again")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="flex flex-col items-center mb-8">
        <img
          src={logo}
          alt="Lumina Logo"
          className="w-20 h-20 mb-4"
        />
        <h1 className="text-4xl font-bold text-gray-900">Lumina</h1>
        <p className="mt-2 text-gray-600 text-lg">
          Indian City Safety Mapper
        </p>
      </div>

    
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
}
