import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../utils/helpers";

function ProtectedRoute({ children }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/admin" />;
  }

  return children;
}

export default ProtectedRoute;
