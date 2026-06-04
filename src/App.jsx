import React from "react";
import Button from "./Components/Button";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeroPage from "./Pages/HeroPage";
import Dashboard from "./Pages/Dashboard";
import SignupPage from "./Pages/Auth/SignupPage";
import LoginPage from "./Pages/Auth/LoginPage";
import Landing from "./Pages/Landing";
import OtpPage from "./Pages/Auth/Otp";
import BvnAuth from "./Pages/Auth/BvnAuth";
import FAQs from "./Pages/FAQs";
import save from "./Pages/Save";
import Shield from "./Pages/Shield";
import Invest from "./Pages/Invest";
import Save from "./Pages/Save";
import Pin from "./Pages/Auth/Pin";
import ReadyComp from "./Pages/Auth/ReadyComp";
import ResetPass from "./Pages/Auth/ResetPass";
import NewPass from "./Pages/Auth/NewPass";
import ResetSucessful from "./Pages/Auth/ResetSuccessful";
import MainLayout from "./Layout/MainLayout";
import WalletDashboard from "./Pages/WalletDashboard";
import Loading from "./Components/Loading";
import Policy from "./Pages/Policy";
import Contact from "./Pages/Contact";
import About from "./Pages/AboutUs";
import RegulatoryInfo from "./Pages/RegulatoryInfo";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/shield" element={<Shield />} />
          <Route path="/save" element={<Save />} />
          <Route path="/invest" element={<Invest />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="regulatory" element={<RegulatoryInfo />} />
        </Route>

        <Route path="/otp" element={<OtpPage />} />
        <Route path="pin" element={<Pin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="ReadyComp" element={<ReadyComp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="ResetPass" element={<ResetPass />} />
        <Route path="NewPass" element={<NewPass />} />
        <Route path="ResetSucessful" element={<ResetSucessful />} />
        <Route path="wallet" element={<WalletDashboard />} />
        <Route path="loading" element={<Loading />} />

        {/* <Route path="LoginPage" element={<LoginPage />} /> */}
      </Routes>
    </BrowserRouter>
   
  );
};

export default App;
