import React, { useState } from "react";
import { availableProducts } from "../../JS/Invest.js";
import { InvestmentCard } from "../../Features/InvestmentCard.jsx";
// import { PositionCard } from "../../Features/PositionCard.jsx";
import InvestModal from "../../Components/KycModals/InvestModal.jsx";
import KycModalManager from "../../Components/KycModals/KycModalManager.jsx"; // Assuming this is your KYC module path
import "../../Style/InvestDashboard.css";

// Added 'userTier' prop to evaluate access permissions dynamically (e.g., 1 or 2)
export const InvestDashboard = ({ activeInvestments, userTier = 1 }) => {
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Evaluates tier authorization upon clicking the action trigger
  const handleInvestActionTrigger = (product) => {
    if (userTier >= 2) {
      setSelectedProduct(product);
      setIsInvestModalOpen(true);
    } else {
      setIsKycModalOpen(true);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <header className="invest-dashboard-header">
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
            <InvestmentCard
              key={product.id}
              product={product}
              onInvestClick={handleInvestActionTrigger}
            />
          ))}
        </div>
      </section>

      {/* INVESTMENT FORM PIPELINE OVERLAY PORTAL */}
      <InvestModal
        isOpen={isInvestModalOpen}
        onClose={() => setIsInvestModalOpen(false)}
        product={selectedProduct}
      />

      {/* REGULATORY KYC VERIFICATION OVERLAY PORTAL */}
      <KycModalManager
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
      />
    </div>
  );
};
