import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = sessionStorage.getItem("user");
  console.log(sessionStorage.getItem("user"));

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
