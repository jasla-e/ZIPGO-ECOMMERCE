import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

function PublicRoute({ children }) {
  if (isLoggedIn()) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default PublicRoute;