import React from "react";
import "../Style/FAQs.css";
import { QAData } from "../JS/HeroCrad";
import SelectDropdown from "../static/SelectDropdown";
import Button from "../Components/Button";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const FAQs = () => {
  return (
    <section className="faq-page">
      <section className="faq-page-wrapper">
        <div className="faq-Header">
          <AiOutlineQuestionCircle className="faq-Icon" />
          <h4>Frequently Asked Questions</h4>
          <p>Get answers to your questions about HedgeNest</p>
        </div>
        <section className="faqs-Question">
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
        </section>
        <section className="faq-card-holder">
          {" "}
          <div className="Contact-Card">
            <p className="faq-card-title">Still Have Some Questions?</p>
            <p className="faq-card-subject">
              Can’t find the answer you’re looking for? Please get in <br />
              touch with us
            </p>
            <span>
              hello.hedenest@gmail.com <br />
              info.hedgenest@gmail.com
            </span>
          </div>
        </section>
      </section>
    </section>
  );
};

export default FAQs;
