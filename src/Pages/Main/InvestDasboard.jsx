import React, { useState } from "react";
import { availableProducts } from "../../JS/Invest.js";
import { InvestmentCard } from "../../Features/InvestmentCard.jsx";
import InvestModal from "../../Components/KycModals/InvestModal.jsx";
import KycModalManager from "../../Components/KycModals/KycModalManager.jsx";
import "../../Style/InvestDashboard.css";

export const InvestDashboard = ({ activeInvestments, userTier = 1 }) => {
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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

      <InvestModal
        isOpen={isInvestModalOpen}
        onClose={() => setIsInvestModalOpen(false)}
        product={selectedProduct}
      />

      <KycModalManager
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
      />
    </div>
  );
};
