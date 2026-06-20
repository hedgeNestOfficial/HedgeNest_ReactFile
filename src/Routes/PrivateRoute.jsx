import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import SplashScreen from "../Components/SplashScreen";

/**
 * PrivateRoute protects authenticated pages
 *
 * Before checking auth, it waits for redux-persist to finish rehydrating
 * from localStorage. This prevents redirect loops during initial page load.
 */
const PrivateRoute = () => {
  const { token } = useSelector((state) => state.user);
  const isRehydrated = useSelector((state) => state._persist?.rehydrated);
  // ✅ While rehydrating, show nothing (don't render or redirect)
  // This gives redux-persist time to load the token from localStorage
  if (!isRehydrated) {
    return <SplashScreen />;
  }

  // ✅ After rehydration, check if user has a token
  // If yes, allow access to protected routes
  // If no, redirect to login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
