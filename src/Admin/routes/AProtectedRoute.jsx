import React from 'react'
import { Navigate } from 'react-router-dom';
import { getUser } from '../../utils/auth';

function AProtectedRoute({children}) {
    const user=getUser();

    if (!user|| user.role !== "admin"){
        return <Navigate to="/home"/>
    }

  return children;
}

export default AProtectedRoute
