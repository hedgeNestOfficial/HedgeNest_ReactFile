import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * PrivateRoute protects authenticated pages
 * 
 * Before checking auth, it waits for redux-persist to finish rehydrating
 * from localStorage. This prevents redirect loops during initial page load.
 */
const PrivateRoute = () => {
  const { token, rehydrating } = useSelector((state) => state.user);

  // ✅ While rehydrating, show nothing (don't render or redirect)
  // This gives redux-persist time to load the token from localStorage
  if (rehydrating) {
    return null;
  }

  // ✅ After rehydration, check if user has a token
  // If yes, allow access to protected routes
  // If no, redirect to login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
