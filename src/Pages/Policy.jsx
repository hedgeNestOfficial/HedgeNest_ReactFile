import React from "react";
import "../Css/Policy.css";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Policy = () => {
  return (
    <div className="policy-container">
      <main className="policy-section">
        <section className="policy-content">
          <h1 className="policy-heading">Privacy Policy</h1>

          <div className="policy-block">
            <p>
              The rules and obligations that govern your use of HedgeNest,
              including account responsibilities, fees, and dispute resolution.
            </p>
            <p>
              By creating an account you agree to use HedgeNest only for lawful
              purposes and in line with our acceptable-use policy.
            </p>
            <p>
              You are responsible for keeping your login credentials secure.
              HedgeNest is not liable for losses arising from credentials shared
              with third parties.
            </p>
            <p>
              Fees, including the 1.5% conversion spread and any network
              charges, are disclosed before a transaction is confirmed.
            </p>
            <p>
              We may suspend or terminate accounts that violate these terms or
              applicable Nigerian financial regulations.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Policy;
