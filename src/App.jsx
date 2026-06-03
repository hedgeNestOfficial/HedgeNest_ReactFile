import React from "react";
import Button from "./Components/Button";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeroPage from "./Pages/HeroPage";
import Dashboard from "./Pages/Dashboard";
import SignupPage from "./Pages/Auth/SignupPage";
import LoginPage from "./Pages/Auth/LoginPage";
import Landing from "./Pages/Landing";
import OtpPage from "./Pages/Auth/Otp";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OtpPage />} />
        {/* <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
