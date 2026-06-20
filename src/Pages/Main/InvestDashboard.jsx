import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

// Presentation UI Blocks
import { InvestmentCard } from "../../Features/InvestmentCard";
import PositionCard from "../../Features/PositionCard";

// Modal System Infrastructure
import InvestModal from "../../Components/KycModals/InvestModal";
import KycModalManager from "../../Components/KycModals/KycModalManager";
import BreakInvestmentModalManager from "../../Components/KycModals/BreakInvestmentModalManager";

// Network Actions
import {
  getInvestmentPlans,
  getUserInvestments,
  completeInvestment,
  claimInvestment,
  breakInvestment,
  confirmTransactionPin,
} from "../../Services/investmentService";
import { getMyWallet } from "../../Services/Walletservice";
import { updateWallet } from "../../Store/UserSlice";

import "../../Style/InvestDashboard.css";

const InvestDashboard = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.user);

  const [plans, setPlans] = useState([]);
  const [userInvestments, setUserInvestments] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingInvestments, setLoadingInvestments] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [showBreakModal, setShowBreakModal] = useState(false);

  const refreshWallet = async () => {
    if (!token) return;
    try {
      const response = await getMyWallet(token);
      const walletData = response?.data?.[0];
      if (walletData) {
        dispatch(updateWallet(walletData));
      }
    } catch (error) {
      console.error("Wallet data sync suspended:", error);
    }
  };

  const fetchPlans = async () => {
    if (!token) return;
    try {
      setLoadingPlans(true);
      const response = await getInvestmentPlans(token);
      const uniquePlans =
        response?.investmentPlan?.filter(
          (plan, index, self) =>
            index ===
            self.findIndex(
              (item) => item.investmentName === plan.investmentName,
            ),
        ) || [];
      setPlans(uniquePlans);
    } catch (error) {
      toast.error("Unable to load investment plans");
    } finally {
      setLoadingPlans(false);
    }
  };

  const fetchUserInvestments = async () => {
    if (!token) return;
    try {
      setLoadingInvestments(true);
      const response = await getUserInvestments(token);
      setUserInvestments(response?.data || []);
    } catch (error) {
      toast.error("Unable to load investments");
    } finally {
      setLoadingInvestments(false);
    }
  };

  const initializeDashboard = async () => {
    await Promise.all([fetchPlans(), fetchUserInvestments(), refreshWallet()]);
  };

  useEffect(() => {
    if (token) {
      initializeDashboard();
    }
  }, [token]);

  const handleInvestActionTrigger = (product) => {
    setSelectedProduct(product);
    setIsInvestModalOpen(true);
  };

  const handleOpenBreakModal = (position) => {
    setSelectedPosition(position);
    setShowBreakModal(true);
  };

  const handleCloseBreakModal = () => {
    setShowBreakModal(false);
    setSelectedPosition(null);
  };

  const handleWithdrawInvestment = async (position) => {
    if (!token) {
      toast.error("Your login session has expired");
      return;
    }
    try {
      const payload = {
        investmentId: position?._id || position?.id,
        userId: position?.userId,
      };
      await completeInvestment(payload, token);
      await claimInvestment(payload, token);
      toast.success("Investment claimed successfully");
      await Promise.all([fetchUserInvestments(), refreshWallet()]);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to claim investment",
      );
    }
  };

  const handleBreakInvestment = async (investmentId, transactionPin) => {
    if (!token || !user?._id) {
      toast.error("Authentication session missing. Please log in again.");
      throw new Error("Missing auth credentials context tokens.");
    }

    await confirmTransactionPin(user._id, transactionPin, token);
    const response = await breakInvestment(investmentId, token);

    toast.success(response?.message || "Investment terminated successfully");
    await Promise.all([fetchUserInvestments(), refreshWallet()]);
    return response;
  };

  return (
    <div className="dashboard-wrapper">
      <header className="invest-dashboard-header">
        <h1>Invest</h1>
        <p>Curated, beginner-friendly products from low to medium risk</p>
      </header>

      {/* POSITIONS SECTION */}
      <section className="positions-section">
        <h2>Your Positions</h2>
        {loadingInvestments ? (
          <div className="flex-container">
            {Array(4)
              .fill(0)
              .map((_, idx) => (
                <div key={idx} className="invest-skeleton-card">
                  <div className="skel-row header-skel"></div>
                  <div className="skel-row body-skel-line"></div>
                  <div className="skel-row body-skel-line short-skel"></div>
                  <div className="skel-row btn-skel"></div>
                </div>
              ))}
          </div>
        ) : userInvestments.length > 0 ? (
          <div className="flex-container">
            {userInvestments.map((position) => (
              <PositionCard
                key={position?._id || position?.id}
                position={position}
                onBreakClick={handleOpenBreakModal}
                onWithdrawClick={handleWithdrawInvestment}
              />
            ))}
            <span>Position</span>
          </div>
        ) : (
          <div className="empty-positions-card">
            <p className="empty-positions-title">No Active Investments Yet</p>
            <p className="empty-positions-subtitle">
              You don't have any active investments right now.
            </p>
          </div>
        )}
      </section>

      {/* AVAILABLE PRODUCTS SECTION */}
      <section className="available-section">
        <h2>Available Products</h2>
        <div className="flex-container">
          {loadingPlans ? (
            <div className="flex-container">
              {Array(4)
                .fill(0)
                .map((_, idx) => (
                  <div key={idx} className="invest-skeleton-card">
                    <div className="skel-row header-skel"></div>
                    <div className="skel-row body-skel-line"></div>
                    <div className="skel-row body-skel-line short-skel"></div>
                    <div className="skel-row btn-skel"></div>
                  </div>
                ))}
            </div>
          ) : (
            plans.map((product) => (
              <InvestmentCard
                key={product?._id || product?.id}
                product={product}
                onInvestClick={handleInvestActionTrigger}
              />
            ))
          )}
        </div>
      </section>

      {/* MODAL SYSTEM LAYER */}
      <InvestModal
        isOpen={isInvestModalOpen}
        onClose={() => setIsInvestModalOpen(false)}
        product={selectedProduct}
        onSuccess={initializeDashboard}
      />

      <BreakInvestmentModalManager
        isOpen={showBreakModal}
        onClose={handleCloseBreakModal}
        position={selectedPosition}
        onConfirmBreak={handleBreakInvestment}
      />

      <KycModalManager
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
      />
    </div>
  );
};

export default InvestDashboard;
