import React from 'react'
import { Navigate } from 'react-router-dom';
import { getUser } from '../../utils/auth';

function AProtectedRoute({ children }) {
  const user = getUser();

  const role =
    user?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  if (!user || role !== "Admin") {
    return <Navigate to="/home" />;
  }

  return children;
}

export default AProtectedRoute
