import { useState } from "react";
import LoginPage from "./components/LoginPage";
import { Route, Routes } from "react-router-dom";
import UserProfile from "./components/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import MapPage from "./components/MapPage";
import ReportPage from "./components/ReportPage";
import IncidentDetailPage from "./components/IncidentDetailPage";
import ProtectedLayout from "./components/ProtectedLayout";
import AdminPanel from "./components/AdminPanel";
import NotFoundPage from "./components/NotFoundPage";

function App() {
  return (
    <Routes>
      
      <Route path="/login" element={<LoginPage />} />

   
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<MapPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/incidents/:id" element={<IncidentDetailPage />} />
        </Route>
      </Route>

  
      <Route element={<AdminRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
      </Route>

  
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
