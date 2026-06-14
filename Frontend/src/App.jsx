import { useState } from "react";
import LoginPage from "./components/LoginPage";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MapPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/report" element={<ReportPage />} />
      </Route> */}
    </Routes>
  );
}

export default App;
