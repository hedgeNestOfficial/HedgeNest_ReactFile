import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Hero from "../Components/Hero";
import HowItWorks from "../Components/HowItWork";
import WhyChoose from "../Components/WhyChoose";
import SecurityCompliance from "../Components/SecurityCompliance";
import OurCore from "../Components/OurCore";
import "../Style/Landing.css";
import QAcomponent from "../Components/QAcomponent";
const Landing = () => {
  return (
    <section className="Hero-wrapper">
      <Hero />
      <OurCore />
      <HowItWorks />
      <WhyChoose />
      <SecurityCompliance />
      <QAcomponent />
    </section>
  );
};

export default Landing;
