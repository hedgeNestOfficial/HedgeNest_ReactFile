import React from "react";
import "../Style/QAComp.css";
import { QAData } from "../JS/HeroCrad";
import SelectDropdown from "../static/SelectDropdown";
import Button from "./Button";

const QAcomponent = () => {
  return (
    <section className="faq-section-container">
      <div className="faq-content-wrapper">
        <article className="faq-header">
          <h2>Frequently Asked Questions</h2>
          <p>Get answers to your questions about HedgeNest</p>
        </article>
        <article className="faq-dropdowns-wrapper">
          {QAData.map((item, index) => (
            <SelectDropdown key={index} data={item} />
          ))}
          <Button text="See all FAQs" className="contact-support-btn" />
        </article>
      </div>
    </section>
  );
};

export default QAcomponent;
