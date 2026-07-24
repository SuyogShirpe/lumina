import { useState } from "react";
import LoginPage from "./components/LoginPage";
import { Route, Routes } from "react-router-dom";
import UserProfile from "./components/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import MapPage from "./components/MapPage";
import ReportPage from "./components/ReportPage";
import IncidentDetailPage from "./components/IncidentDetailPage";
import ProtectedLayout from "./components/ProtectedLayout"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<MapPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/incidents/:id" element={<IncidentDetailPage />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<div>Admin Panel coming soon...</div>} />
      </Route>
    </Routes>
  );
}

export default App;
