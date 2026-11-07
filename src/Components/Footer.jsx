// import React from "react";
// import "../Css/Footer.css";
// import WhiteLogo from "../assets/white logo.png";
// import {
//   FaRegCopyright,
//   FaXTwitter,
//   FaInstagram,
//   FaLinkedinIn,
// } from "react-icons/fa6";
// import { FaFacebook } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// const Footer = () => {
//   const navigate = useNavigate();
//   return (
//     <footer className="footer-container">
//       <section className="footer-holder">
//         <article className="footer-up">
//           <div className="Footer-logo-con">
//             <div className="footer-logo">
//               <img src={WhiteLogo} alt="HedgeNest logo" />
//               <h3>HedgeNest</h3>
//             </div>
//             <p>
//               HedgeNest helps you protect, save and grow your money with
//               confidence. Convert Naira to USDT at transparent rates, build
//               disciplined savings habits, and access simple investments options;
//               all in one secure platform.
//             </p>
//             <div className="socials">
//               <FaFacebook aria-label="Facebook" />
//               <FaXTwitter aria-label="X (Twitter)" />
//               <FaInstagram aria-label="Instagram" />
//               <FaLinkedinIn aria-label="LinkedIn" />
//             </div>
//           </div>

//           <div className="footer-box">
//             <h4>Company</h4>
//             <ul>
//               <li onClick={() => navigate("/contact")}>Contact Us</li>
//               <li onClick={() => navigate("/about")}>About Us</li>
//               <li>Savings</li>
//               <li>Investments</li>
//               <li>Currency Conversion</li>
//             </ul>
//           </div>

//           <div className="footer-box">
//             <h4>Business</h4>
//             <ul>
//               <li onClick={() => navigate("/policy")}>Stable Coin</li>
//               <li onClick={() => navigate("/save")}>Savings Vault</li>
//               <li onClick={() => navigate("/invest")}>Tiered Investments</li>
//             </ul>
//           </div>

//           <div className="footer-box">
//             <h4>Legal</h4>
//             <ul>
//               <li onClick={() => navigate("/policy")}>Privacy Policy</li>
//               <li onClick={() => navigate("/policy")}>Terms Of Service</li>
//               <li onClick={() => navigate("/policy")}>Cookie Policy</li>
//               <li onClick={() => navigate("/policy")}>Compliance</li>
//             </ul>
//           </div>

//           <div className="footer-box">
//             <h4>Support</h4>
//             <ul>
//               <li onClick={() => navigate("/contact")}>Help Center</li>
//               <li onClick={() => navigate("/contact")}>Contact Us</li>
//             </ul>
//           </div>
//         </article>

//         <hr className="footer-divider" />
//         <article className="footer-down">
//           <p className="down-disclaimer">
//             HedgeNest works with trusted partners to deliver secure financial
//             services. Investments outcomes may vary, always review details
//             before proceeding
//           </p>

//           <div className="copyright">
//             <FaRegCopyright style={{ fontSize: "16px", color: "white" }} />
//             <p>2026 HedgeNest. All Rights Reserved</p>
//           </div>
//         </article>
//       </section>
//     </footer>
//   );
// };

// export default Footer;

import React from "react";
import { Link } from "react-router-dom";
import "../Css/Footer.css";
import WhiteLogo from "../assets/white logo.png";

import {
  FaRegCopyright,
  FaFacebookF,
  FaXTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa6";

// Official HedgeNest social media accounts
const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61594261858810",
    Icon: FaFacebookF,
  },
  {
    name: "X",
    href: "https://x.com/HedgeNest",
    Icon: FaXTwitter,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/hedge-nest/",
    Icon: FaLinkedinIn,
  },
  {
    name: "WhatsApp",
    href: "https://whatsapp.com/channel/0029Vb8WxvMKbYMVa0dihi2A",
    Icon: FaWhatsapp,
  },
];

// Reusable footer navigation link
const FooterLink = ({ to, children }) => (
  <li>
    <Link className="footer-link" to={to}>
      {children}
    </Link>
  </li>
);

const Footer = () => {
  return (
    <footer className="footer-container">
      <section className="footer-holder">
        {/* FOOTER TOP SECTION */}
        <article className="footer-up">
          {/* LOGO, DESCRIPTION AND SOCIAL MEDIA */}
          <div className="Footer-logo-con">
            <div className="footer-logo">
              <img src={WhiteLogo} alt="HedgeNest logo" />
              <h3>HedgeNest</h3>
            </div>

            <p>
              HedgeNest helps you protect, save and grow your money with
              confidence. Convert Naira to USDT at transparent rates, build
              disciplined savings habits, and access simple investment options,
              all in one secure platform.
            </p>

            {/* SOCIAL MEDIA LINKS */}
            <nav className="socials" aria-label="HedgeNest social media">
              {socialLinks.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`HedgeNest on ${name} (opens in a new tab)`}
                  title={name}
                >
                  <Icon aria-hidden="true" focusable="false" />
                </a>
              ))}
            </nav>
          </div>

          {/* COMPANY */}
          <nav className="footer-box" aria-label="Company">
            <h4>Company</h4>
            <ul>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/contact">Contact Us</FooterLink>
              <FooterLink to="/save">Savings</FooterLink>
              <FooterLink to="/investPage">Investments</FooterLink>
              <FooterLink to="/convert">Currency Conversion</FooterLink>
            </ul>
          </nav>

          {/* BUSINESS */}
          <nav className="footer-box" aria-label="Business">
            <h4>Business</h4>
            <ul>
              <FooterLink to="/protect">Stable Coin</FooterLink>
              <FooterLink to="/save">Savings Vault</FooterLink>
              <FooterLink to="/investPage">Tiered Investments</FooterLink>
            </ul>
          </nav>

          {/* LEGAL */}
          <nav className="footer-box" aria-label="Legal">
            <h4>Legal</h4>
            <ul>
              <FooterLink to="/policy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms Of Service</FooterLink>
              <FooterLink to="/regulatory">Compliance</FooterLink>
            </ul>
          </nav>
          {/* SUPPORT */}
          <nav className="footer-box" aria-label="Support">
            <h4>Support</h4>
            <ul>
              <FooterLink to="/faqs">Help Center</FooterLink>
            </ul>
          </nav>
        </article>

        {/* FOOTER DIVIDER */}
        <hr className="footer-divider" />

        {/* FOOTER BOTTOM SECTION */}
        <article className="footer-down">
          <p className="down-disclaimer">
            HedgeNest works with trusted partners to deliver secure financial
            services. Investment outcomes may vary; always review details before
            proceeding.
          </p>

          <div className="copyright">
            <FaRegCopyright aria-hidden="true" style={{ fontSize: "16px" }} />
            <p>{new Date().getFullYear()} HedgeNest. All Rights Reserved.</p>
          </div>
        </article>
      </section>
    </footer>
  );
};

export default Footer;
