import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../features/Auth/hooks/useAuth';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth(); // Get auth status from your hook

  // If authenticated, render child routes. Otherwise, redirect to login.
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;