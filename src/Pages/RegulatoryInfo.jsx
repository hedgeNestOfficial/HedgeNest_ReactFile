import React from "react";
import "../Css/Regulatory.css";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const RegulatoryInfo = () => {
  return (
    <div className="Regulatory-container">
      <main className="reg-section">
        <section className="reg-content">
          <h1 className="reg-heading">Regulatory Information</h1>

          <div className="reg-block">
            <p>
              HedgeNest operates with licensed partners and complies with
              Nigerian financial regulations.
            </p>
            <p>
              HedgeNest partners with CBN-licensed payment service providers and
              SEC-registered investment firms to deliver wallet, savings and
              investment services.
            </p>
            <p>
              All USDT conversions are executed through compliant virtual-asset
              service providers.
            </p>
            <p className="reg-contact">
              For regulatory enquiries, contact{" "}
              <a href="mailto:hello.hedgenest@gmail.com">
                hello.hedgenest@gmail.com
              </a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RegulatoryInfo;
