import { useState } from "react";
import LoginPage from "./components/LoginPage";
import { Route, Routes } from "react-router-dom";
import UserProfile from "./components/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
      <Route path="/" element={<div>Map coming soon</div>} />
        <Route path="/profile" element={<UserProfile />} />
      </Route>
    </Routes>
  );
}

export default App;
