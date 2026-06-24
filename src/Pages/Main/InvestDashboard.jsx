// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import toast from "react-hot-toast";
// import { InvestmentCard } from "../../Features/InvestmentCard";
// import PositionCard from "../../Features/PositionCard";
// import InvestModal from "../../Components/KycModals/InvestModal";
// import KycModalManager from "../../Components/KycModals/KycModalManager";
// import BreakInvestmentModalManager from "../../Components/KycModals/BreakInvestmentModalManager";

// // Network Actions
// import {
//   getInvestmentPlans,
//   getUserInvestments,
//   completeInvestment,
//   claimInvestment,
//   breakInvestment,
//   confirmTransactionPin,
// } from "../../Services/investmentService";
// import { getMyWallet } from "../../Services/Walletservice";
// import { updateWallet } from "../../Store/UserSlice";

// import "../../Style/InvestDashboard.css";

// const InvestDashboard = () => {
//   const dispatch = useDispatch();
//   const { user, token } = useSelector((state) => state.user);

//   const [plans, setPlans] = useState([]);
//   const [userInvestments, setUserInvestments] = useState([]);
//   const [loadingPlans, setLoadingPlans] = useState(true);
//   const [loadingInvestments, setLoadingInvestments] = useState(true);

//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [selectedPosition, setSelectedPosition] = useState(null);
//   const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
//   const [isKycModalOpen, setIsKycModalOpen] = useState(false);
//   const [showBreakModal, setShowBreakModal] = useState(false);

//   const refreshWallet = async () => {
//     if (!token) return;
//     try {
//       const response = await getMyWallet(token);
//       const walletData = response?.data?.[0];
//       if (walletData) {
//         dispatch(updateWallet(walletData));
//       }
//     } catch (error) {
//       console.error("Wallet data sync suspended:", error);
//     }
//   };

//   const fetchPlans = async () => {
//     if (!token) return;
//     try {
//       setLoadingPlans(true);
//       const response = await getInvestmentPlans(token);
//       const uniquePlans =
//         response?.investmentPlan?.filter(
//           (plan, index, self) =>
//             index ===
//             self.findIndex(
//               (item) => item.investmentName === plan.investmentName,
//             ),
//         ) || [];
//       setPlans(uniquePlans);
//     } catch (error) {
//       toast.error("Unable to load investment plans");
//     } finally {
//       setLoadingPlans(false);
//     }
//   };

//   const fetchUserInvestments = async () => {
//     if (!token) return;
//     try {
//       setLoadingInvestments(true);
//       const response = await getUserInvestments(token);
//       setUserInvestments(response?.data || []);
//     } catch (error) {
//       toast.error("Unable to load investments");
//     } finally {
//       setLoadingInvestments(false);
//     }
//   };

//   const initializeDashboard = async () => {
//     await Promise.all([fetchPlans(), fetchUserInvestments(), refreshWallet()]);
//   };

//   useEffect(() => {
//     if (token) {
//       initializeDashboard();
//     }
//   }, [token]);

//   const handleInvestActionTrigger = (product) => {
//     setSelectedProduct(product);
//     setIsInvestModalOpen(true);
//   };

//   const handleOpenBreakModal = (position) => {
//     setSelectedPosition(position);
//     setShowBreakModal(true);
//   };

//   const handleCloseBreakModal = () => {
//     setShowBreakModal(false);
//     setSelectedPosition(null);
//   };

//   const handleWithdrawInvestment = async (position) => {
//   try {
//     const payload = {
//       investmentId: position._id,
//       userId: position.userId,
//     };

//     const isBroken = !!position?.terminatedAt;

//     if (isBroken) {
//       // Broken investment
//       await claimInvestment(payload, token);

//       toast.success(
//         "Settlement claimed successfully"
//       );
//     } else {
//       // Naturally matured
//       await completeInvestment(payload, token);

//       await claimInvestment(payload, token);

//       toast.success(
//         "Investment claimed successfully"
//       );
//     }

//     await Promise.all([
//       fetchUserInvestments(),
//       refreshWallet(),
//     ]);
//   } catch (error) {
//     toast.error(
//       error?.response?.data?.message ||
//       "Unable to process investment"
//     );
//   }
// };

//   // const handleWithdrawInvestment = async (position) => {
//   //   if (!token) {
//   //     toast.error("Your login session has expired");
//   //     return;
//   //   }
//   //   try {
//   //     const payload = {
//   //       investmentId: position?._id || position?.id,
//   //       userId: position?.userId,
//   //     };
//   //     await completeInvestment(payload, token);
//   //     await claimInvestment(payload, token);
//   //     toast.success("Investment claimed successfully");
//   //     await Promise.all([fetchUserInvestments(), refreshWallet()]);
//   //   } catch (error) {
//   //     toast.error(
//   //       error?.response?.data?.message || "Unable to claim investment",
//   //     );
//   //   }
//   // };

//   const handleBreakInvestment = async (investmentId, transactionPin) => {
//     if (!token || !user?._id) {
//       toast.error("Authentication session missing. Please log in again.");
//       throw new Error("Missing auth credentials context tokens.");
//     }

//     await confirmTransactionPin(user._id, transactionPin, token);
//     const response = await breakInvestment(investmentId, token);

//     toast.success(response?.message || "Investment terminated successfully");
//     await Promise.all([fetchUserInvestments(), refreshWallet()]);
//     return response;
//   };

//   return (
//     <div className="dashboard-wrapper">
//       <header className="invest-dashboard-header">
//         <h1>Invest</h1>
//         <p>Curated, beginner-friendly products from low to medium risk</p>
//       </header>

//       {/* POSITIONS SECTION */}
//       <section className="positions-section">
//         <h2>Your Positions</h2>
//         {loadingInvestments ? (
//           <div className="flex-container">
//             {Array(4)
//               .fill(0)
//               .map((_, idx) => (
//                 <div key={idx} className="invest-skeleton-card">
//                   <div className="skel-row header-skel"></div>
//                   <div className="skel-row body-skel-line"></div>
//                   <div className="skel-row body-skel-line short-skel"></div>
//                   <div className="skel-row btn-skel"></div>
//                 </div>
//               ))}
//           </div>
//         ) : userInvestments.length > 0 ? (
//           <div className="flex-container">
//             {userInvestments.map((position) => (
//               <PositionCard
//                 key={position?._id || position?.id}
//                 position={position}
//                 onBreakClick={handleOpenBreakModal}
//                 onWithdrawClick={handleWithdrawInvestment}
//               />
//             ))}
//             <span>Position</span>
//           </div>
//         ) : (
//           <div className="empty-positions-card">
//             <p className="empty-positions-title">No Active Investments Yet</p>
//             <p className="empty-positions-subtitle">
//               You don't have any active investments right now.
//             </p>
//           </div>
//         )}
//       </section>

//       {/* AVAILABLE PRODUCTS SECTION */}
//       <section className="available-section">
//         <h2>Available Products</h2>
//         <div className="flex-container">
//           {loadingPlans ? (
//             <div className="flex-container">
//               {Array(4)
//                 .fill(0)
//                 .map((_, idx) => (
//                   <div key={idx} className="invest-skeleton-card">
//                     <div className="skel-row header-skel"></div>
//                     <div className="skel-row body-skel-line"></div>
//                     <div className="skel-row body-skel-line short-skel"></div>
//                     <div className="skel-row btn-skel"></div>
//                   </div>
//                 ))}
//             </div>
//           ) : (
//             plans.map((product) => (
//               <InvestmentCard
//                 key={product?._id || product?.id}
//                 product={product}
//                 onInvestClick={handleInvestActionTrigger}
//               />
//             ))
//           )}
//         </div>
//       </section>

//       {/* MODAL SYSTEM LAYER */}
//       <InvestModal
//         isOpen={isInvestModalOpen}
//         onClose={() => setIsInvestModalOpen(false)}
//         product={selectedProduct}
//         onSuccess={initializeDashboard}
//       />

//       <BreakInvestmentModalManager
//         isOpen={showBreakModal}
//         onClose={handleCloseBreakModal}
//         position={selectedPosition}
//         onConfirmBreak={handleBreakInvestment}
//       />

//       <KycModalManager
//         isOpen={isKycModalOpen}
//         onClose={() => setIsKycModalOpen(false)}
//       />
//     </div>
//   );
// };

// export default InvestDashboard;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

// UI Components
import { InvestmentCard } from "../../Features/InvestmentCard";
import PositionCard from "../../Features/PositionCard";

// Modals
import InvestModal from "../../Components/KycModals/InvestModal";
import KycModalManager from "../../Components/KycModals/KycModalManager";
import BreakInvestmentModalManager from "../../Components/KycModals/BreakInvestmentModalManager";

// Services
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

/**
 * ============================================================================
 * INVEST DASHBOARD - COMPLETE INVESTMENT MANAGEMENT
 * ============================================================================
 *
 * Manages:
 * ✅ Displaying available investment plans
 * ✅ Showing user's active investments
 * ✅ Initiating new investments
 * ✅ Breaking/liquidating investments early
 * ✅ Claiming matured investments
 * ✅ Claiming broken investment settlements
 * ✅ Wallet balance updates
 * ✅ Error handling and user feedback
 *
 * Investment Flows:
 *
 * Flow 1: NEW INVESTMENT
 * User clicks plan → InvestModal → Confirm → Investment initiated
 *
 * Flow 2: BREAK INVESTMENT
 * User clicks "Break" → BreakModal → PIN verification → Breaks investment
 * Investment enters 26-hour settlement period
 *
 * Flow 3: CLAIM MATURED INVESTMENT
 * User clicks "Claim" → completeInvestment() → claimInvestment()
 * Funds added to wallet
 *
 * Flow 4: CLAIM BROKEN SETTLEMENT
 * User clicks "Claim" (after 26 hours) → claimInvestment()
 * Funds added to wallet
 */

const InvestDashboard = () => {
  // ============================================================================
  // STATE & REDUX
  // ============================================================================

  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.user);

  // Data state
  const [plans, setPlans] = useState([]);
  const [userInvestments, setUserInvestments] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingInvestments, setLoadingInvestments] = useState(true);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [showBreakModal, setShowBreakModal] = useState(false);

  // ============================================================================
  // WALLET MANAGEMENT
  // ============================================================================

  /**
   * Refresh wallet balance from backend
   * Called after any transaction
   */
  const refreshWallet = async () => {
    if (!token) {
      console.warn("⚠️ No token available for wallet refresh");
      return;
    }

    try {
      console.log("💰 Refreshing wallet...");
      const response = await getMyWallet(token);
      const walletData = response?.data?.[0];

      if (walletData) {
        console.log("✅ Wallet updated:", {
          availableBalance: walletData.availableBalance,
        });
        dispatch(updateWallet(walletData));
      }
    } catch (error) {
      console.error("❌ Wallet refresh failed:", error.message);
      // Don't show error toast - wallet refresh is non-critical
    }
  };

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  /**
   * Load all available investment plans
   */
  const fetchPlans = async () => {
    if (!token) {
      console.warn("⚠️ No token available for fetching plans");
      return;
    }

    try {
      setLoadingPlans(true);
      console.log("📊 Loading investment plans...");

      const response = await getInvestmentPlans(token);

      // Filter to unique plans (by name)
      const uniquePlans =
        response?.investmentPlan?.filter(
          (plan, index, self) =>
            index ===
            self.findIndex(
              (item) => item.investmentName === plan.investmentName,
            ),
        ) || [];

      console.log("✅ Loaded", uniquePlans.length, "investment plans");
      setPlans(uniquePlans);
    } catch (error) {
      console.error("❌ Fetch Plans Error:", error.message);
      toast.error(error.message || "Unable to load investment plans");
      setPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  };

  /**
   * Load user's active investments
   */
  const fetchUserInvestments = async () => {
    if (!token) {
      console.warn("⚠️ No token available for fetching investments");
      return;
    }

    try {
      setLoadingInvestments(true);
      console.log("📈 Loading user investments...");

      const response = await getUserInvestments(token);
      const investments = response?.data || [];

      console.log("✅ Loaded", investments.length, "investments");
      setUserInvestments(investments);
    } catch (error) {
      console.error("❌ Fetch Investments Error:", error.message);
      toast.error(error.message || "Unable to load your investments");
      setUserInvestments([]);
    } finally {
      setLoadingInvestments(false);
    }
  };

  /**
   * Initialize dashboard - load all data
   */
  const initializeDashboard = async () => {
    console.log("🚀 Initializing dashboard...");
    await Promise.all([fetchPlans(), fetchUserInvestments(), refreshWallet()]);
    console.log("✅ Dashboard initialized");
  };

  /**
   * Load data on component mount or when token changes
   */
  useEffect(() => {
    if (token && user?._id) {
      initializeDashboard();
    }
  }, [token, user?._id]);

  // ============================================================================
  // INVEST FLOW
  // ============================================================================

  /**
   * Open invest modal for selected plan
   */
  const handleInvestActionTrigger = (product) => {
    console.log("🔘 Invest clicked for plan:", product?.investmentName);
    setSelectedProduct(product);
    setIsInvestModalOpen(true);
  };

  // ============================================================================
  // BREAK INVESTMENT FLOW
  // ============================================================================

  /**
   * Open break investment confirmation modal
   */
  const handleOpenBreakModal = (position) => {
    console.log("🔘 Break clicked for investment:", position?._id);
    setSelectedPosition(position);
    setShowBreakModal(true);
  };

  /**
   * Close break investment modal
   */
  const handleCloseBreakModal = () => {
    setShowBreakModal(false);
    setSelectedPosition(null);
  };

  /**
   * Handle break investment with PIN verification
   *
   * Steps:
   * 1. Verify transaction PIN
   * 2. Break the investment (sets terminatedAt)
   * 3. Refresh data (investment now in settlement period)
   */
  const handleBreakInvestment = async (investmentId, transactionPin) => {
    if (!token || !user?._id) {
      toast.error("Your session has expired. Please log in again.");
      console.error("❌ Missing auth credentials");
      throw new Error("Missing auth credentials");
    }

    try {
      console.log("⚡ Starting break investment flow...", { investmentId });

      // Step 1: Verify PIN
      console.log("Step 1: Verifying PIN...");
      await confirmTransactionPin(user._id, transactionPin, token);
      console.log("✅ PIN verified");

      // Step 2: Break investment
      console.log("Step 2: Breaking investment...");
      const response = await breakInvestment(investmentId, token);
      console.log("✅ Investment broken:", response.message);

      // Step 3: Refresh data
      console.log("Step 3: Refreshing dashboard data...");
      await Promise.all([fetchUserInvestments(), refreshWallet()]);

      // Show success
      toast.success(
        response?.message ||
          "Investment terminated. Settlement period: 26 hours",
      );

      console.log("✅ Break investment flow completed");
      return response;
    } catch (error) {
      console.error("❌ Break investment failed:", error.message);

      // Show error with proper message
      const errorMessage = error?.message || "Failed to break investment";
      toast.error(errorMessage);

      // Re-throw so modal can handle it (clear PIN, return to PIN entry)
      throw error;
    }
  };

  // ============================================================================
  // CLAIM INVESTMENT FLOW
  // ============================================================================

  /**
   * Handle withdrawal/claim based on investment state
   *
   * Flow 1: Naturally Matured Investment
   * - Investment reached maturity date
   * - Call completeInvestment() to mark as complete
   * - Call claimInvestment() to add funds to wallet
   *
   * Flow 2: Broken Investment (after 26 hours)
   * - Investment was broken early
   * - 26-hour settlement period has passed
   * - Call claimInvestment() directly to claim settlement
   */
  const handleClaimClick = async (position) => {
    if (!token) {
      toast.error("Your session has expired. Please log in again.");
      console.error("❌ No token available");
      return;
    }

    try {
      const investmentId = position?._id || position?.id;
      const userId = position?.userId;
      const isBroken = !!position?.terminatedAt;

      if (!investmentId || !userId) {
        throw new Error("Invalid investment data");
      }

      const payload = { investmentId, userId };

      // Flow 1: Naturally matured investment
      if (!isBroken) {
        console.log("💰 Claiming naturally matured investment...");
        console.log("  Step 1: Marking as complete...");
        await completeInvestment(payload, token);
        console.log("  ✅ Marked as complete");

        console.log("  Step 2: Claiming funds...");
        await claimInvestment(payload, token);
        console.log("  ✅ Funds claimed");

        toast.success(
          "Investment claimed successfully! Funds added to wallet.",
        );
      }

      // Flow 2: Broken investment (after 26-hour settlement)
      if (isBroken) {
        console.log("💳 Claiming broken investment settlement...");
        await claimInvestment(payload, token);
        console.log("✅ Settlement claimed");

        toast.success(
          "Settlement claimed successfully! Funds added to wallet.",
        );
      }

      // Refresh data after claim
      console.log("Refreshing dashboard data...");
      await Promise.all([fetchUserInvestments(), refreshWallet()]);
      console.log("✅ Claim flow completed");
    } catch (error) {
      console.error("❌ Claim failed:", error.message);
      toast.error(error?.message || "Failed to claim investment");
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="dashboard-wrapper">
      {/* HEADER */}
      <header className="invest-dashboard-header">
        <h1>Invest</h1>
        <p>Curated, beginner-friendly products from low to medium risk</p>
      </header>

      {/* YOUR POSITIONS SECTION */}
      <section className="positions-section">
        <h2>Your Positions</h2>

        {loadingInvestments ? (
          // Loading skeleton
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
          // Display investments
          <div className="flex-container">
            {userInvestments.map((position) => (
              <PositionCard
                key={position?._id || position?.id}
                position={position}
                onBreakClick={handleOpenBreakModal}
                onClaimClick={handleClaimClick}
              />
            ))}
          </div>
        ) : (
          // Empty state
          <div className="empty-positions-card">
            <p className="empty-positions-title">No Active Investments Yet</p>
            <p className="empty-positions-subtitle">
              You don't have any active investments right now. Check out
              available products below to get started.
            </p>
          </div>
        )}
      </section>

      {/* AVAILABLE PRODUCTS SECTION */}
      <section className="available-section">
        <h2>Available Products</h2>

        <div className="flex-container">
          {loadingPlans ? (
            // Loading skeleton
            Array(4)
              .fill(0)
              .map((_, idx) => (
                <div key={idx} className="invest-skeleton-card">
                  <div className="skel-row header-skel"></div>
                  <div className="skel-row body-skel-line"></div>
                  <div className="skel-row body-skel-line short-skel"></div>
                  <div className="skel-row btn-skel"></div>
                </div>
              ))
          ) : plans.length > 0 ? (
            // Display plans
            plans.map((product) => (
              <InvestmentCard
                key={product?._id || product?.id}
                product={product}
                onInvestClick={handleInvestActionTrigger}
              />
            ))
          ) : (
            // Empty state
            <div
              className="empty-positions-card"
              style={{ gridColumn: "1 / -1" }}
            >
              <p className="empty-positions-title">No Products Available</p>
              <p className="empty-positions-subtitle">
                Investment products are currently unavailable. Please try again
                later.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* MODAL LAYER */}

      {/* Invest Modal: Start new investment */}
      <InvestModal
        isOpen={isInvestModalOpen}
        onClose={() => {
          setIsInvestModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSuccess={initializeDashboard}
      />

      {/* Break Investment Modal: Liquidate early with PIN */}
      <BreakInvestmentModalManager
        isOpen={showBreakModal}
        onClose={handleCloseBreakModal}
        position={selectedPosition}
        onConfirmBreak={handleBreakInvestment}
      />

      {/* KYC Modal: Verification (if needed) */}
      <KycModalManager
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
      />
    </div>
  );
};

export default InvestDashboard;
