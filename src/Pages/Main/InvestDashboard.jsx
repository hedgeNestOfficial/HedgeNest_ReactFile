// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";

// import { InvestmentCard } from "../../Features/InvestmentCard";
// import PositionCard from "../../Features/PositionCard";
// import InvestModal from "../../Components/KycModals/InvestModal";
// import KycModalManager from "../../Components/KycModals/KycModalManager";

// import { getInvestmentPlans, getUserInvestments } from "../../Services/investmentService";

// import "../../Style/InvestDashboard.css";

// export const InvestDashboard = ({
//   userTier = 2, // temporarily bypass KYC
// }) => {
//   const { token } = useSelector((state) => state.user);

//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // New Live Active Positions States
//   const [userInvestments, setUserInvestments] = useState([]);
//   const [investmentLoading, setInvestmentLoading] = useState(true);

//   const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
//   const [isKycModalOpen, setIsKycModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   useEffect(() => {
//     if (token) {
//       fetchPlans();
//       fetchUserInvestments();
//     }
//   }, [token]);

//   const fetchPlans = async () => {
//     try {
//       setLoading(true);
//       const response = await getInvestmentPlans(token);

//       // remove duplicate plans by name
//       const uniquePlans = response.investmentPlan.filter(
//         (plan, index, self) =>
//           index ===
//           self.findIndex((p) => p.investmentName === plan.investmentName),
//       );

//       setPlans(uniquePlans);
//     } catch (error) {
//       console.log(error);
//       toast.error("Unable to load investment plans");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserInvestments = async () => {
//     try {
//       setInvestmentLoading(true);
//       const response = await getUserInvestments(token);
//       setUserInvestments(response?.data || []);
//     } catch (error) {
//       console.log(error);
//       toast.error("Unable to load investments");
//     } finally {
//       setInvestmentLoading(false);
//     }
//   };

//   const handleInvestActionTrigger = (product) => {
//     setSelectedProduct(product);
//     setIsInvestModalOpen(true);
//   };

//   return (
//     <div className="dashboard-wrapper">
//       <header className="invest-dashboard-header">
//         <h1>Invest</h1>
//         <p>Curated, beginner-friendly products from low to medium risk</p>
//       </header>

//       {/* POSITIONS SECTION (Handles Loading, Active and Empty States) */}
//       <section className="positions-section">
//         <h2>Your Positions</h2>

//         {investmentLoading ? (
//           <p style={{ padding: "20px 0", color: "#6b7280" }}>Loading positions...</p>
//         ) : userInvestments.length > 0 ? (
//           <div className="flex-container">
//             {userInvestments.map((pos) => (
//               <PositionCard
//                 key={pos._id}
//                 position={pos}
//                 onTopUpClick={(item) => console.log("Top up clicked", item)}
//                 onWithdrawClick={(item) => console.log("Withdraw clicked", item)}
//               />
//             ))}
//           </div>
//         ) : (
//           /* CLEAN EMPTY STATE DECLARATION */
//           <div className="empty-positions-card">
//             <p className="empty-positions-title">No Active Investments Yet</p>
//             <p className="empty-positions-subtitle">
//               You don't have any open investment positions right now. Explore
//               the available products below to grow your wealth!
//             </p>
//           </div>
//         )}
//       </section>

//       {/* AVAILABLE PRODUCTS SECTION */}
//       <section className="available-section">
//         <h2>Available Products</h2>

//         <div className="flex-container">
//           {loading ? (
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
//         onSuccess={fetchUserInvestments} // Triggers instant background refresh on deposit completion
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
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { InvestmentCard } from "../../Features/InvestmentCard";
import PositionCard from "../../Features/PositionCard";
import InvestModal from "../../Components/KycModals/InvestModal";
import KycModalManager from "../../Components/KycModals/KycModalManager";

import {
  getInvestmentPlans,
  getUserInvestments,
} from "../../Services/investmentService";

import "../../Style/InvestDashboard.css";

export const InvestDashboard = ({
  userTier = 2, // temporarily bypass KYC
}) => {
  const { token } = useSelector((state) => state.user);

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Live Active Positions States
  const [userInvestments, setUserInvestments] = useState([]);
  const [investmentLoading, setInvestmentLoading] = useState(true);

  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (token) {
      fetchPlans();
      fetchUserInvestments();
    }
  }, [token]);

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

  const fetchUserInvestments = async () => {
    try {
      setInvestmentLoading(true);
      const response = await getUserInvestments(token);
      setUserInvestments(response?.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Unable to load investments");
    } finally {
      setInvestmentLoading(false);
    }
  };

  const handleInvestActionTrigger = (product) => {
    setSelectedProduct(product);
    setIsInvestModalOpen(true);
  };

  return (
    <div className="dashboard-wrapper">
      <header className="invest-dashboard-header">
        <h1>Invest</h1>
        <p>Curated, beginner-friendly products from low to medium risk</p>
      </header>

      {/* POSITIONS SECTION (Handles Loading, Active and Empty States) */}
      <section className="positions-section">
        <h2>Your Positions</h2>

        {investmentLoading ? (
          <p style={{ padding: "20px 0", color: "#6b7280" }}>
            Loading positions...
          </p>
        ) : userInvestments.length > 0 ? (
          <div className="flex-container">
            {userInvestments.map((pos) => (
              <PositionCard
                key={pos._id}
                position={pos}
                onTopUpClick={(item) => console.log("Top up clicked", item)}
                onWithdrawClick={(item) =>
                  console.log("Withdraw clicked", item)
                }
              />
            ))}
          </div>
        ) : (
          /* CLEAN EMPTY STATE DECLARATION */
          <div className="empty-positions-card">
            <p className="empty-positions-title">No Active Investments Yet</p>
            <p className="empty-positions-subtitle">
              You don't have any open investment positions right now. Explore
              the available products below to grow your wealth!
            </p>
          </div>
        )}
      </section>

      {/* AVAILABLE PRODUCTS SECTION */}
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
        onSuccess={fetchUserInvestments} // Triggers instant background refresh on deposit completion
      />

      <KycModalManager
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
      />
    </div>
  );
};

export default InvestDashboard;
