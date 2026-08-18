import React from "react";
import "../Css/Terms.css";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const TermsOfService = () => {
  return (
    <div className="Terms-container">
      <main className="terms-section">
        <section className="terms-content">
          <h1 className="terms-heading">Terms of Service</h1>

          <div className="terms-block">
            <p>
              How we collect, use and protect your personal data, including KYC
              information and transaction history.
            </p>
            <p>
              We collect identity (BVN, NIN), contact and transactional data to
              comply with KYC/AML obligations
            </p>
            <p>
              Your data is encrypted in transit and at rest. We never sell
              personal data to third parties
            </p>
            <p>
              Cookies and analytics are used solely to improve product
              performance and prevent fraud
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TermsOfService;
