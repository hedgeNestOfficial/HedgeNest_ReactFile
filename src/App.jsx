import React from "react";
import Button from "./Components/Button";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeroPage from "./Pages/HeroPage";
import Dashboard from "./Pages/Dashboard";
import SignupPage from "./Pages/Auth/SignupPage";
import LoginPage from "./Pages/Auth/LoginPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
