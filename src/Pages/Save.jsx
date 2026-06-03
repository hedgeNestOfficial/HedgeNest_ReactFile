import React from "react";
import "../Css/Save.css";
import saveIMG1 from "../assets/saveIMG1.png";
import saveIMG2 from "../assets/saveIMG2.jpg";
import saveIMG3 from "../assets/saveIMG3.jpg";
import saveIMG4 from "../assets/saveIMG4.jpg";
import saveIMG5 from "../assets/saveIMG5.png";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { MdOutlineCheck } from "react-icons/md";

const Save = () => {
  return (
    <div className="hn-page-wrapper">
      <section className="sc-save-section">
        <div className="sc-container">
          <div className="sc-content-block">
            <h2 className="sc-main-heading">
              Save in <br />
              <span className="sc-highlight-text">Stablecoin</span>
            </h2>
            <p className="sc-description">
              Create multiple saving goals, with flexible or locked options. Our
              smart saving features help you build consistent habits.
            </p>
            <ul className="sc-features-list">
              <li className="sc-feature-item">
                <span className="sc-checkmark">
                  {" "}
                  <MdOutlineCheck />
                </span>{" "}
                Save against inflation
              </li>
              <li className="sc-feature-item">
                <span className="sc-checkmark">
                  {" "}
                  <MdOutlineCheck />
                </span>{" "}
                Secure your money in stablecoin
              </li>
              <li className="sc-feature-item">
                <span className="sc-checkmark">
                  {" "}
                  <MdOutlineCheck />
                </span>{" "}
                Locked and flexible saving options
              </li>
              <li className="sc-feature-item">
                <span className="sc-checkmark">
                  {" "}
                  <MdOutlineCheck />
                </span>{" "}
                Track your savings progress in real time
              </li>
            </ul>
            <button className="sc-primary-btn" type="button">
              Start Saving
            </button>
          </div>
          <div className="sc-graphic-block">
            <div className="sc-image-card">
              <img src={saveIMG1} alt="coin img" />
            </div>
          </div>
        </div>
      </section>

      <section className="ss-section">
        <div className="ss-container">
          <div className="ss-column">
            <div className="ss-text-content">
              <h2 className="ss-heading">Save smarter</h2>
              <p className="ss-description">
                With our stablecoin solution, your hard savings is protected
                from 11% month on month inflation.
              </p>
            </div>
            <div className="ss-image-frame ss-img-piggy">
              <img src={saveIMG2} alt="" />
            </div>
          </div>
          <div className="ss-column ss-reverse-mobile">
            <div className="ss-image-frame ss-img-couple">
              <img src={saveIMG3} alt="" />
            </div>
            <div className="ss-text-content ss-padding-top">
              <h2 className="ss-heading">Locked + Flexible Options</h2>
              <p className="ss-description">
                Create multiple saving goals, with flexible or locked options.
                Our smart saving features help you build consistent habits.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="sb-section">
        <div className="sb-container">
          <div className="sb-content-side">
            <h2 className="sb-heading">Save beyond currency devaluation</h2>
            <p className="sb-subheading">
              simple 6 step process to get started
            </p>
            <ol className="sb-steps-list">
              <li className="sb-step-item">Go to the Safe wallet</li>
              <li className="sb-step-item">Set target amount</li>
              <li className="sb-step-item">
                Create a target name for your savings (e.g. Rent)
              </li>
              <li className="sb-step-item">
                Select flexible or locked savings
              </li>
              <li className="sb-step-item">
                Set payback or savings maturity date
              </li>
              <li className="sb-step-item">Start saving!</li>
            </ol>
            <button className="sb-primary-btn" type="button">
              Start Saving
            </button>
          </div>
          <div className="sb-graphic-side">
            <div className="sb-image-card">
              <img src={saveIMG4} alt="" />
            </div>
          </div>
        </div>
      </section>

      <section className="im-section">
        <div className="im-card">
          <div className="im-image-panel">
            <img src={saveIMG5} alt="" />
          </div>
          <div className="im-content-panel">
            <h2 className="im-heading">
              Small Steps Today, <br />
              Big Impact Tomorrow
            </h2>
            <p className="im-subtext">
              Start saving now and build the future you deserve.
            </p>
            <button className="im-action-btn" type="button">
              Start Saving Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Save;
