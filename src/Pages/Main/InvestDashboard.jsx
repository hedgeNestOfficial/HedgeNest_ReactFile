// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import toast from "react-hot-toast";
// import { InvestmentCard } from "../../Features/InvestmentCard";
// import PositionCard from "../../Features/PositionCard";
// import InvestModal from "../../Components/KycModals/InvestModal";
// import KycModalManager from "../../Components/KycModals/KycModalManager";
// import BreakInvestmentModalManager from "../../Components/KycModals/BreakInvestmentModalManager";
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

//   useEffect(() => {
//     if (!token) return;
//     initializeDashboard();
//   }, [token]);

//   const initializeDashboard = async () => {
//     await Promise.all([fetchPlans(), fetchUserInvestments(), refreshWallet()]);
//   };
//   console.log("USER:", user);
//   console.log("USER ID:", user?._id);
//   const refreshWallet = async () => {
//     try {
//       const response = await getMyWallet(token);
//       const walletData = response?.data?.[0];
//       if (walletData) {
//         dispatch(updateWallet(walletData));
//       }
//     } catch (error) {
//       console.log("Wallet refresh failed:", error);
//     }
//   };

//   const fetchPlans = async () => {
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

//   const handleInvestActionTrigger = (product) => {
//     setSelectedProduct(product);
//     setIsInvestModalOpen(true);
//   };

//   const handleWithdrawInvestment = async (position) => {
//     try {
//       const payload = {
//         investmentId: position._id,
//         userId: position.userId,
//       };
//       await completeInvestment(payload, token);
//       await claimInvestment(payload, token);
//       toast.success("Investment claimed successfully");
//       await Promise.all([fetchUserInvestments(), refreshWallet()]);
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message ||
//           error?.response?.data?.messagge ||
//           "Unable to claim investment",
//       );
//     }
//   };

//   const handleOpenBreakModal = (position) => {
//     setSelectedPosition(position);
//     setShowBreakModal(true);
//   };

//   const handleCloseBreakModal = () => {
//     setShowBreakModal(false);
//     setSelectedPosition(null);
//   };

//   // This is the single source of truth for PIN verification + break.
//   // The modal collects the PIN and calls this — it does not verify or break itself.
//   const handleBreakInvestment = async (investmentId, transactionPin) => {
//     try {
//       if (!user?._id) {
//         throw new Error("User session not found. Please log in again.");
//       }

//       // Step 1: Confirm PIN
//       await confirmTransactionPin(user._id, transactionPin, token);

//       // Step 2: Break the investment
//       const response = await breakInvestment(investmentId, token);

//       toast.success(response?.message || "Investment terminated successfully");

//       // Step 3: Refresh data
//       await Promise.all([fetchUserInvestments(), refreshWallet()]);

//       return response;
//     } catch (error) {
//       const message =
//         error?.response?.data?.message ||
//         error?.message ||
//         "Unable to terminate investment";

//       toast.error(message);

//       // Re-throw so the modal can catch it and return the user to PIN entry
//       throw error;
//     }
//   };

//   return (
//     <div className="dashboard-wrapper">
//       <header className="invest-dashboard-header">
//         <h1>Invest</h1>
//         <p>Curated, beginner-friendly products from low to medium risk</p>
//       </header>

//       <section className="positions-section">
//         <h2>Your Positions</h2>

//         {loadingInvestments ? (
//           <p className="loading-state">Loading positions...</p>
//         ) : userInvestments.length > 0 ? (
//           <div className="flex-container">
//             {userInvestments.slice(0, 12).map((position) => (
//               <PositionCard
//                 key={position._id}
//                 position={position}
//                 onBreakClick={handleOpenBreakModal}
//                 onWithdrawClick={handleWithdrawInvestment}
//               />
//             ))}
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

//       <section className="available-section">
//         <h2>Available Products</h2>
//         <div className="flex-container">
//           {loadingPlans ? (
//             <p>Loading investment plans...</p>
//           ) : (
//             plans.map((product) => (
//               <InvestmentCard
//                 key={product._id}
//                 product={product}
//                 onInvestClick={handleInvestActionTrigger}
//               />
//             ))
//           )}
//         </div>
//       </section>

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

// Feature Components
import { InvestmentCard } from "../../Features/InvestmentCard";
import PositionCard from "../../Features/PositionCard";

// Modals
import InvestModal from "../../Components/KycModals/InvestModal";
import KycModalManager from "../../Components/KycModals/KycModalManager";
import BreakInvestmentModalManager from "../../Components/KycModals/BreakInvestmentModalManager";

// Services & Global State Actions
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

// Styles
import "../../Style/InvestDashboard.css";

const InvestDashboard = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.user);

  // --- Data State ---
  const [plans, setPlans] = useState([]);
  const [userInvestments, setUserInvestments] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingInvestments, setLoadingInvestments] = useState(true);

  // --- UI/Modal State ---
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [showBreakModal, setShowBreakModal] = useState(false);

  // --- Core Fetching & Logic ---
  const refreshWallet = async () => {
    try {
      const response = await getMyWallet(token);
      const walletData = response?.data?.[0];
      if (walletData) {
        dispatch(updateWallet(walletData));
      }
    } catch (error) {
      console.error("Wallet refresh background failure:", error);
    }
  };

  const fetchPlans = async () => {
    try {
      setLoadingPlans(true);
      const response = await getInvestmentPlans(token);

      // Filter out duplicate investment items by plan name
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
      toast.error("Unable to load active positions");
    } finally {
      setLoadingInvestments(false);
    }
  };

  // Synchronized initialization runner
  const initializeDashboard = async () => {
    await Promise.all([fetchPlans(), fetchUserInvestments(), refreshWallet()]);
  };

  useEffect(() => {
    if (token) {
      initializeDashboard();
    }
  }, [token]);

  // --- Action Handlers ---
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

  /**
   * Complete Withdrawal Logic (Matured Investments)
   */
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
          "Unable to process withdrawal",
      );
    }
  };

  /**
   * Two-Step Liquidate/Break Flow (Early Terminations)
   * Handled sequentially, errors pass directly back up to the modal layout
   */
  const handleBreakInvestment = async (investmentId, transactionPin) => {
    if (!user?._id) {
      throw new Error("User session not found. Please log in again.");
    }

    // Step 1: Securely confirm transaction authorization matching user account profile
    await confirmTransactionPin(user._id, transactionPin, token);

    // Step 2: Terminate active position document reference
    const response = await breakInvestment(investmentId, token);
    toast.success(response?.message || "Investment terminated successfully");

    // Step 3: Refresh background parameters concurrently
    await Promise.all([fetchUserInvestments(), refreshWallet()]);

    return response;
  };

  return (
    <div className="dashboard-wrapper">
      <header className="invest-dashboard-header">
        <h1>Invest</h1>
        <p>Curated, beginner-friendly products from low to medium risk</p>
      </header>

      {/* --- Positions Segment --- */}
      <section className="positions-section">
        <h2>Your Positions</h2>

        {loadingInvestments ? (
          <p className="loading-state">Loading positions...</p>
        ) : userInvestments.length > 0 ? (
          <div className="flex-container">
            {userInvestments.slice(0, 12).map((position) => (
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

      {/* --- Catalog Products Segment --- */}
      <section className="available-section">
        <h2>Available Products</h2>
        <div className="flex-container">
          {loadingPlans ? (
            <p className="loading-state">Loading investment plans...</p>
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

      {/* --- Modal Architecture Core Layer --- */}
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
