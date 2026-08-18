import React from "react";
import "../Css/Contact.css";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

import { IoCallOutline } from "react-icons/io5";
import { CiMail } from "react-icons/ci";
import { FaWhatsapp } from "react-icons/fa";

const ContactUs = () => {
  return (
    <div className="contact-page-container">
      <section className="contact-hero">
        <div className="hero-icon-wrapper">
          <IoCallOutline className="hero-phone-icon" size={36} />
        </div>
        <h1>Contact Us</h1>
        <p>Our Support Team is always available 24/7 to assist you</p>
      </section>

      <section className="form-section-area">
        <div className="form-section-wrapper">
          <div className="message-text-block">
            <h2>Send Us A Message</h2>
            <p>Your message will be reviewed and responded to within 4 hours</p>
          </div>

          <div className="contact-form-card">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="input-group">
                <label>First Name</label>
                <input type="text" placeholder="Enter name" />
              </div>

              <div className="input-group">
                <label>Last Name</label>
                <input type="text" placeholder="Enter name" />
              </div>

              <div className="input-group">
                <label>Phone number</label>
                <input type="text" placeholder="Enter phone number" />
              </div>

              <div className="input-group">
                <label>Email address</label>
                <input type="email" placeholder="Enter email" />
              </div>

              <div className="input-group">
                <label>Write Message</label>
                <textarea placeholder="Message" rows={6}></textarea>
              </div>

              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="direct-channels-section">
        <div className="channels-wrapper">
          <h2 className="channels-title">Contact Us Directly</h2>

          <div className="channels-grid">
            <div className="channel-card">
              <div className="channel-icon-circle email-bg">
                <CiMail size={16} className="card-icon-color-orange" />
              </div>
              <h3>Email Support</h3>
              <p className="channel-subtitle">Replies within 4 hours</p>
              <div className="channel-links">
                <a href="mailto:hello.hedgenest@gmail.com">
                  hello.hedgenest@gmail.com ,
                </a>
                <a href="mailto:info.hedgenest@gmail.com">
                  info.hedgenest@gmail.com
                </a>
              </div>
            </div>

            <div className="channel-card">
              <div className="channel-icon-circle whatsapp-bg">
                <FaWhatsapp size={16} className="card-icon-color-green" />
              </div>
              <h3>WhatsApp Support</h3>
              <p className="channel-subtitle">Chat with our team</p>
              <div className="channel-links">
                <a
                  href="https://wa.me/2347047180205"
                  target="_blank"
                  rel="noreferrer"
                >
                  +2347047180205 ,
                </a>
                <a
                  href="https://wa.me/2347053350030"
                  target="_blank"
                  rel="noreferrer"
                >
                  +2347053350030
                </a>
              </div>
            </div>

            <div className="channel-card">
              <div className="channel-icon-circle phone-bg">
                <IoCallOutline size={16} className="card-icon-color-purple" />
              </div>
              <h3>Contact Us Through Phone</h3>
              <p className="channel-subtitle">
                Always available to pick your calls
              </p>
              <div className="channel-links">
                <a href="tel:09123103343">09123103343 ,</a>
                <a href="tel:09072771048">09072771048</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
