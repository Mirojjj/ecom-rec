import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AdminPage from "./pages/AdminPage";

import AdminDashboardPage from "./pages/AdminDashboardPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
