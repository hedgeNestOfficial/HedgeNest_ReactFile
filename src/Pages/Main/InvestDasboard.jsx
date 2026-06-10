// import { availableProducts } from "./data.js"; // Assuming data is in this file
import { Card } from "../../Features/InvestmentCard.jsx";
import "../../Style/InvestDashboard.css";
import { availableProducts } from "../../JS/Invest.js";

export const InvestDashboard = ({ activeInvestments }) => {
  return (
    <div className="dashboard-wrapper">
      <header>
        <h1>Invest</h1>
        <p>Curated, beginner-friendly products from low to medium risk</p>
      </header>

      {/* Conditional Rendering for "Your Positions" */}
      {activeInvestments && activeInvestments.length > 0 && (
        <section className="positions-section">
          <h2>Your Positions</h2>
          <div className="positions-container">
            {activeInvestments.map((pos) => (
              <div key={pos.id} className="position-card">
                {/* Your Position Card UI here */}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Available Products Section */}
      <section className="available-section">
        <h2>Available Products</h2>
        <div className="products-grid">
          {availableProducts.map((product) => (
            <Card key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
