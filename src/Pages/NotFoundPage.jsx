import { Link } from "react-router-dom";
import { LuHouse, LuLayoutDashboard, LuSearchX } from "react-icons/lu";
import "../Style/NotFoundPage.css";
import logo from "../assets/Hedge.png";
import brandMark from "../assets/white logo.png";

const NotFoundPage = () => {
  return (
    <main className="not-found-page">
      <section className="not-found-card" aria-labelledby="not-found-title">
        <div className="not-found-brand">
          <img src={logo} alt="HedgeNest" className="not-found-logo" />
          <span>Secure savings, clear direction.</span>
        </div>

        <div className="not-found-visual" aria-hidden="true">
          <span className="not-found-orbit"></span>
          <span className="not-found-logo-badge">
            <img src={brandMark} alt="" />
          </span>
          <LuSearchX className="not-found-icon" />
          <strong>404</strong>
        </div>

        <p className="not-found-eyebrow">Page not found</p>
        <h1 id="not-found-title">This route has gone off plan.</h1>
        <p className="not-found-copy">
          The page you are looking for may have moved, expired, or never
          existed. Let us guide you back to a safe place.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="not-found-primary">
            <LuHouse />
            Back home
          </Link>
          <Link to="/dashboard" className="not-found-secondary">
            <LuLayoutDashboard />
            Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
