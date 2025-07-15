import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedPermissions }) => {
  // Read user id from localStorage and convert it to number
  const userId = parseInt(localStorage.getItem('user_id'));
  const is_admin = localStorage.getItem('is_admin');

  if (!userId) {
    // Not logged in
    return <Navigate to="/login" />;
  }

  if (!allowedPermissions.includes(userId  )) {
    // Logged in but not authorized
    return <Navigate to="/unauthorized" />;
  }

  // Authorized
  return <Outlet />;
};

export default ProtectedRoute;
