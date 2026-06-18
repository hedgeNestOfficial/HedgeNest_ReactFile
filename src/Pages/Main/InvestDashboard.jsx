import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { InvestmentCard } from "../../Features/InvestmentCard";
import PositionCard from "../../Features/PositionCard";
import InvestModal from "../../Components/KycModals/InvestModal";
import KycModalManager from "../../Components/KycModals/KycModalManager";
import BreakInvestmentModalManager from "../../Components/KycModals/BreakInvestmentModalManager";
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

  useEffect(() => {
    if (!token) return;
    initializeDashboard();
  }, [token]);
  const initializeDashboard = async () => {
    await Promise.all([fetchPlans(), fetchUserInvestments(), refreshWallet()]);
  };

  const refreshWallet = async () => {
    try {
      const response = await getMyWallet(token);

      const walletData = response?.data?.[0];

      if (walletData) {
        dispatch(updateWallet(walletData));
      }
    } catch (error) {
      console.log("Wallet refresh failed:", error);
    }
  };

  const fetchPlans = async () => {
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

  const handleInvestActionTrigger = (product) => {
    setSelectedProduct(product);
    setIsInvestModalOpen(true);
  };
  const handleWithdrawInvestment = async (position) => {
    try {
      const payload = {
        investmentId: position._id,
        userId: position.userId,
      };
      await completeInvestment(payload, token);
      await claimInvestment(payload, token);
      toast.success("Investment claimed successfully");
      await Promise.all([fetchUserInvestments(), refreshWallet()]);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.messagge ||
          "Unable to claim investment",
      );
    }
  };

  const handleOpenBreakModal = (position) => {
    setSelectedPosition(position);
    setShowBreakModal(true);
  };

  const handleBreakInvestment = async (investmentId, transactionPin) => {
    try {
      await confirmTransactionPin(user._id, transactionPin, token);

      const response = await breakInvestment(investmentId, token);

      toast.success(response?.message || "Investment terminated successfully");

      await Promise.all([fetchUserInvestments(), refreshWallet()]);

      return response;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to terminate investment",
      );

      throw error;
    }
  };

  return (
    <div className="dashboard-wrapper">
      <header className="invest-dashboard-header">
        <h1>Invest</h1>

        <p>Curated, beginner-friendly products from low to medium risk</p>
      </header>

      <section className="positions-section">
        <h2>Your Positions</h2>

        {loadingInvestments ? (
          <p className="loading-state">Loading positions...</p>
        ) : userInvestments.length > 0 ? (
          <div className="flex-container">
            {userInvestments.slice(0, 6).map((position) => (
              <PositionCard
                key={position._id}
                position={position}
                onBreakClick={handleOpenBreakModal}
                onWithdrawClick={handleWithdrawInvestment}
              />
            ))}
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

      <section className="available-section">
        <h2>Available Products</h2>

        <div className="flex-container">
          {loadingPlans ? (
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
        onSuccess={initializeDashboard}
      />

      <BreakInvestmentModalManager
        isOpen={showBreakModal}
        onClose={() => {
          setShowBreakModal(false);
          setSelectedPosition(null);
        }}
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
