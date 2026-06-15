import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { InvestmentCard } from "../../Features/InvestmentCard";
import InvestModal from "../../Components/KycModals/InvestModal";
import KycModalManager from "../../Components/KycModals/KycModalManager";

import { getInvestmentPlans } from "../../Services/investmentService";

import "../../Style/InvestDashboard.css";

export const InvestDashboard = ({
  activeInvestments,
  userTier = 2, // temporarily bypass KYC
}) => {
  const { token } = useSelector((state) => state.user);

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);

      const response = await getInvestmentPlans(token);

      // remove duplicate plans by name
      const uniquePlans = response.investmentPlan.filter(
        (plan, index, self) =>
          index ===
          self.findIndex((p) => p.investmentName === plan.investmentName),
      );

      setPlans(uniquePlans);
    } catch (error) {
      console.log(error);

      toast.error("Unable to load investment plans");
    } finally {
      setLoading(false);
    }
  };

  const handleInvestActionTrigger = (product) => {
    // KYC bypass for now

    setSelectedProduct(product);

    setIsInvestModalOpen(true);
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
          {loading ? (
            <p>Loading investment plans...</p>
          ) : (
            plans.map((product) => (
              <InvestmentCard
                key={product._id}
                product={product}
                onInvestClick={handleInvestActionTrigger}
              />
            ))
          )}
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
