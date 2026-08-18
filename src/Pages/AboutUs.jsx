import React from "react";
import "../Css/About.css";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Abayomi from "../assets/Abayomi.png";
import Jeremiah from "../assets/Jeremiah.png";
import promise from "../assets/Promise.jpg";
import Ruth from "../assets/Ruth.png";
import Christianah from "../assets/Christianah.jpg";
import Micheal from "../assets/Micheal.jpg";

const AboutUs = () => {
  const stakeholders = [
    { name: "Abayomi Abiola", role: "Product Designer", image: Abayomi },
    { name: "Olisa Jeremiah", role: "Product Designer", image: Jeremiah },
    { name: "Promise Elijah", role: "Frontend Developer", image: promise },
    { name: "Davies Ruth", role: "Frontend Developer", image: Ruth },
    {
      name: "Abolarinwa Christianah",
      role: "Backend Developer",
      image: Christianah,
    },
    { name: "Iyanuoluwa Michael", role: "Backend Developer", image: Micheal },
  ];

  return (
    <div className="about-page-container">
      <section className="story-hero">
        <div className="story-badge">
          <span className="sparkle">✦</span> OUR STORY{" "}
          <span className="sparkle">✦</span>
        </div>
        <h1>
          We watched our savings <span className="highlight-gold">shrink</span>.{" "}
          <br />
          So we built the <span className="highlight-gold">antidote</span>.
        </h1>
        <p className="story-description">
          HedgeNest started as a research project: why do so many young
          Nigerians struggle to save, fear investing, and watch helplessly as
          the Naira loses value? We surveyed hundreds, listened hard, and
          learned that the apps people had weren't built for the lives they
          actually live.
        </p>
      </section>

      <section className="stakeholders-section">
        <div className="stakeholders-wrapper">
          <h2 className="section-title">Meet Our StakeHolders</h2>

          <div className="stakeholders-grid">
            {stakeholders.map((person, index) => (
              <div key={index} className="stakeholder-card">
                <div className="image-frame">
                  <img src={person.image} alt="" />
                </div>
                <div className="card-info">
                  <h3>{person.name}</h3>
                  <p>{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
