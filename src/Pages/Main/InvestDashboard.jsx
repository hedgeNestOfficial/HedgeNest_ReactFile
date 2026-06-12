import { availableProducts } from "../../JS/Invest.js"; // Assuming data is in this file
import { InvestmentCard } from "../../Features/InvestmentCard.jsx";
// import { PositionCard } from "../../Features/PositionCard.jsx";
import "../../Style/InvestDashboard.css";

const InvestDashboard = ({ activeInvestments }) => {
  return (
    <div className="dashboard-wrapper">
      <header>
        <h1>Invest</h1>
        <p>Curated, beginner-friendly products from low to medium risk</p>
      </header>

      {/* Your Positions Section */}
      {activeInvestments?.length > 0 && (
        <section className="positions-section">
          <h2>Your Positions</h2>
          <div className="flex-container">
            {activeInvestments.map((pos) => (
              <PositionCard key={pos.id} position={pos} />
            ))}
          </div>
        </section>
      )}

      {/* Available Products Section */}
      <section className="available-section">
        <h2>Available Products</h2>
        <div className="flex-container">
          {availableProducts.map((product) => (
            <InvestmentCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
export default InvestDashboard;
