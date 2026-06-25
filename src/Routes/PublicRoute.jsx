import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const { user } = useSelector((state) => state.user);

  // If user session token or details exist, intercept and bounce them to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, let them view the login/signup/otp screens safely
  return <Outlet />;
};

export default PublicRoute;
