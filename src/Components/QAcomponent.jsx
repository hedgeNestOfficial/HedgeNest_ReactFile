import React from "react";
import "../Style/QAComp.css";
import { QAData } from "../JS/HeroCrad";
import SelectDropdown from "../static/SelectDropdown";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const QAcomponent = () => {
  const navigate = useNavigate();
  return (
    <section className="faq-section-container">
      <div className="faq-content-wrapper">
        <article className="faq-header">
          <h2>Frequently Asked Questions</h2>
          <p className="Descript">
            Get answers to your questions about HedgeNest
          </p>
        </article>
        <article className="faq-dropdowns-wrapper">
          {QAData.slice(0, 4).map((item, index) => (
            <SelectDropdown key={index} data={item} />
          ))}
          <Button
            text="See all FAQs"
            className="contact-support-btn"
            onClick={() => navigate("/faqs")}
          />
        </article>
      </div>
    </section>
  );
};

export default QAcomponent;
