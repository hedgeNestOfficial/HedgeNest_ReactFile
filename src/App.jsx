import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeroPage from "./Pages/HeroPage";
import Dashboard from "./Pages/Dashboard";
import SignupPage from "./Pages/Auth/SignupPage";
import LoginPage from "./Pages/Auth/LoginPage";
import Landing from "./Pages/Landing";
import OtpPage from "./Pages/Auth/Otp";
import BvnAuth from "./Pages/Auth/BvnAuth";
import FAQs from "./Pages/FAQs";
import Protect from "./Pages/Protect";
import Invest from "./Pages/Invest";
import Save from "./Pages/Save";

import Pin from "./Pages/Auth/Pin";
import ReadyComp from "./Pages/Auth/ReadyComp";
import ResetPass from "./Pages/Auth/ResetPass";
import NewPass from "./Pages/Auth/NewPass";
import ResetSuccessful from "./Pages/Auth/ResetSuccessful";
import MainLayout from "./Layout/MainLayout";
import WalletDashboard from "./Pages/WalletDashboard";
import Loading from "./Components/Loading";
import Policy from "./Pages/Policy";
import Contact from "./Pages/Contact";
import About from "./Pages/AboutUs";
import RegulatoryInfo from "./Pages/RegulatoryInfo";
import NotFoundPage from "./Pages/NotFoundPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/protect" element={<Protect />} />
          <Route path="/save" element={<Save />} />
          <Route path="/invest" element={<Invest />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/regulatory" element={<RegulatoryInfo />} />
        </Route>
        <Route element={<DashboardLayout />}></Route>

        <Route path="/*" element={<NotFoundPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/pin" element={<Pin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kycauth" element={<BvnAuth />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/ready" element={<ReadyComp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset" element={<ResetPass />} />
        <Route path="/newpass" element={<NewPass />} />
        <Route path="/reset-successful" element={<ResetSuccessful />} />
        <Route path="/wallet" element={<WalletDashboard />} />
        <Route path="/loading" element={<Loading />} />

        {/* <Route path="LoginPage" element={<LoginPage />} /> */}
      </Routes>
    </BrowserRouter>
   
  );
};

export default App;
