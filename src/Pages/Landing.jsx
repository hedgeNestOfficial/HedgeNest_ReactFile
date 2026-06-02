import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Hero from "../Components/Hero";
// import HerocardComp from "../Components/OurCore";
import HowItWorks from "../Components/HowitWork";
import WhyChooseUs from "../Components/WhyChoose";
import SecurityCompliance from "../Components/SecurityCompliance";
import OurCore from "../Components/OurCore";

const Landing = () => {
  return (
    <section className="Hero-wrapper">
      <Header />
      <Hero />
      <OurCore />
      <HowItWorks />
      <WhyChooseUs />
      <SecurityCompliance />
      <Footer />
    </section>
  );
};

export default Landing;
