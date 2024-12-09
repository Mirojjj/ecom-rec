import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";

import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/product-details/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
