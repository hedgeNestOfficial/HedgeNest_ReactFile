import React, { useState, useEffect } from "react";
import "../Style/FAQs.css";
import { QAData } from "../JS/HeroCrad";
import SelectDropdown from "../static/SelectDropdown";
import Button from "../Components/Button";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const FAQs = () => {
  // 🌟 State Engine for Accordion Routing & Responsive Checks
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Safe exclusive toggle execution logic for touch devices
  const handleToggle = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <>
      {/* 🌟 Injected complete layout ecosystem wrappers */}
      <Header />

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
              {/* Maps out all FAQ Data items with full state monitoring */}
              {QAData.map((item, index) => (
                <SelectDropdown
                  key={index}
                  data={item}
                  isOpen={activeIndex === index}
                  isMobile={isMobile}
                  // Click execution limited to mobile layouts
                  onToggle={() => isMobile && handleToggle(index)}
                  // Hover actions active exclusively on desktop displays
                  onMouseEnter={() => !isMobile && setActiveIndex(index)}
                  onMouseLeave={() => !isMobile && setActiveIndex(null)}
                />
              ))}

              <Button text="See all FAQs" className="contact-support-btn" />
            </article>
          </section>

          <section className="faq-card-holder">
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

      <Footer />
    </>
  );
};

export default FAQs;
