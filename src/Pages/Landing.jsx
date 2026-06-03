import React from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Hero from "../Components/Hero";
import HerocardComp from "../Components/HerocardComp";

const Landing = () => {
  return (
    <section className="Hero-wrapper">
      <Header />
      <Hero />
      <HerocardComp />
      <Footer />
    </section>
  );
};

export default Landing;
