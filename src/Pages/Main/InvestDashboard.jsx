import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { InvestmentCard } from "../../Features/InvestmentCard";
import PositionCard from "../../Features/PositionCard";
import InvestModal from "../../Components/KycModals/InvestModal";
import KycModalManager from "../../Components/KycModals/KycModalManager";

import {
  getInvestmentPlans,
  getUserInvestments,
  completeInvestment,
  claimInvestment,
} from "../../Services/investmentService";

import { getMyWallet } from "../../Services/walletService";
import { updateWallet } from "../../Store/UserSlice";

import "../../Style/InvestDashboard.css";

const InvestDashboard = ({ userTier = 2 }) => {
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.user);

  const [plans, setPlans] = useState([]);
  const [userInvestments, setUserInvestments] = useState([]);

  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingInvestments, setLoadingInvestments] = useState(true);

  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (!token) return;

    fetchPlans();
    fetchUserInvestments();
  }, [token]);

  const refreshWallet = async () => {
    try {
      const response = await getMyWallet(token);

      const walletData = response?.data?.[0];

      if (walletData) {
        dispatch(updateWallet(walletData));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPlans = async () => {
    try {
      setLoadingPlans(true);

      const response = await getInvestmentPlans(token);

      const uniquePlans = response?.investmentPlan?.filter(
        (plan, index, self) =>
          index ===
          self.findIndex((p) => p.investmentName === plan.investmentName),
      );

      setPlans(uniquePlans || []);
    } catch (error) {
      console.log(error);
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
      console.log(error);
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

      toast.success("Investment claimed successfully and added to wallet");

      await Promise.all([fetchUserInvestments(), refreshWallet()]);
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.messagge ||
          "Unable to claim investment",
      );
    }
  };

  return (
    <div className="dashboard-wrapper">
      <header className="invest-dashboard-header">
        <h1>Invest</h1>

        <p>Curated, beginner-friendly products from low to medium risk</p>
      </header>

      {/* USER POSITIONS */}

      <section className="positions-section">
        <h2>Your Positions</h2>

        {loadingInvestments ? (
          <p className="loading-state">Loading positions...</p>
        ) : userInvestments.length > 0 ? (
          <div className="flex-container">
            {userInvestments.slice(0, 4).map((pos) => (
              <PositionCard
                key={pos._id}
                position={pos}
                onWithdrawClick={handleWithdrawInvestment}
              />
            ))}
          </div>
        ) : (
          <div className="empty-positions-card">
            <p className="empty-positions-title">No Active Investments Yet</p>

            <p className="empty-positions-subtitle">
              You don't have any open investment positions right now. Explore
              the available products below to grow your wealth.
            </p>
          </div>
        )}
      </section>

      {/* AVAILABLE PRODUCTS */}

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

      {/* INVEST MODAL */}

      <InvestModal
        isOpen={isInvestModalOpen}
        onClose={() => setIsInvestModalOpen(false)}
        product={selectedProduct}
        onSuccess={() => {
          fetchUserInvestments();
          refreshWallet();
        }}
      />

      {/* KYC MODAL */}

      <KycModalManager
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
      />
    </div>
  );
};

export default InvestDashboard;
