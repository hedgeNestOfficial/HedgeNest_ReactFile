import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Main/Dashboard";
import SignupPage from "./Pages/Auth/SignupPage";
import LoginPage from "./Pages/Auth/LoginPage";
import Landing from "./Pages/Landing";
import OtpPage from "./Pages/Auth/Otp";
import BvnAuth from "./Pages/Auth/BvnAuth";
import FAQs from "./Pages/FAQs";
import Protect from "./Pages/Protect";
import Invest from "./Pages/Invest";
import Save from "./Pages/Save";
import ConvertPage from "./Pages/Main/ConvertPage";
import Pin from "./Pages/Auth/Pin";
import ReadyComp from "./Pages/Auth/ReadyComp";
import ResetPass from "./Pages/Auth/ResetPass";
import NewPass from "./Pages/Auth/NewPass";
import ResetSuccessful from "./Pages/Auth/ResetSuccessful";
import MainLayout from "./Layout/MainLayout";
import WalletDashboard from "./Pages/Main/WalletDashboard";
import Loading from "./Components/Loading";
import Policy from "./Pages/Policy";
import Contact from "./Pages/Contact";
import About from "./Pages/AboutUs";
import RegulatoryInfo from "./Pages/RegulatoryInfo";
import NotFoundPage from "./Pages/NotFoundPage";
import DashboardLayout from "./Layout/DashboardLayout";
import ProfilePage from "./Pages/Main/ProfilePage";
// import SmartSafe from "./Pages/SmartSafe";
import PopupCard from "./Features/PopupCard";
import ScrollToTop from "./Components/ScrollToTop";
import { InvestDashboard } from "./Pages/Main/InvestDashboard";
import GoogleSuccess from "./Pages/Auth/GoogleSuccess";
import PrivateRoute from "./Routes/PrivateRoute";
import { TransactionHistory } from "./Features/TransactionHistory";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/protect" element={<Protect />} />
          <Route path="/save" element={<Save />} />
          <Route path="/investPage" element={<Invest />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/regulatory" element={<RegulatoryInfo />} />
          <Route path="/notification" element={<TransactionHistory />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/convert" element={<ConvertPage />} />
            <Route path="/wallet" element={<WalletDashboard />} />
            <Route path="/payment-success" element={<PaymentSuccess />}/>
            {/* <Route path="/smart-safe" element={<SmartSafe />} /> */}
            <Route path="/invest" element={<InvestDashboard />} />
          </Route>
        </Route>

        <Route path="/*" element={<NotFoundPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/pin" element={<Pin />} />
        <Route path="/popup" element={<PopupCard />} />

        <Route path="/kycauth" element={<BvnAuth />} />
        <Route path="/ready" element={<ReadyComp />} />
        <Route path="/reset" element={<ResetPass />} />
        <Route path="/newpass" element={<NewPass />} />
        <Route path="/reset-successful" element={<ResetSuccessful />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/google-success" element={<GoogleSuccess />} />

        {/* <Route path="LoginPage" element={<LoginPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
