// import React, { useState, useEffect } from "react";
// import Swal from "sweetalert2";
// import PlanPinScreen from "./PlanPinScreen"; // Imports your pre-existing PIN component directly
// import "../Style/Withdraw.css";

// const WithdrawModal = ({ isOpen, onClose, vault, onWithdrawSuccess }) => {
//   // Modal states: "WARNING" | "LOADING" | "PIN"
//   const [screen, setScreen] = useState("WARNING");
//   const [isBtnLoading, setIsBtnLoading] = useState(false);
//   const [pin, setPin] = useState(["", "", "", "", "", ""]);

//   const isLocked = vault?.type?.toUpperCase() === "LOCKED";

//   useEffect(() => {
//     if (!isOpen) {
//       setScreen("WARNING");
//       setIsBtnLoading(false);
//       setPin(["", "", "", "", "", ""]);
//     }
//   }, [isOpen]);

//   // Intermediate screen processing effect for the loading spinner
//   useEffect(() => {
//     if (screen === "LOADING") {
//       const timer = setTimeout(() => {
//         setScreen("PIN");
//         setIsBtnLoading(false);
//       }, 1500);
//       return () => clearTimeout(timer);
//     }
//   }, [screen]);

//   if (!isOpen || !vault) return null;

//   // Warning screen submission logic
//   const handleWarningSubmit = (e) => {
//     e.preventDefault();
//     if (isBtnLoading) return;

//     setIsBtnLoading(true);
//     setTimeout(() => {
//       setScreen("LOADING");
//     }, 1000);
//   };

//   // State handlers passed directly to your PlanPinScreen component
//   const handlePinChange = (val, idx) => {
//     const cleanVal = val.substring(val.length - 1);
//     const updatedPin = [...pin];
//     updatedPin[idx] = cleanVal;
//     setPin(updatedPin);
//   };

//   const handlePinKeyDown = (e, idx) => {
//     if (e.key === "Backspace" && !pin[idx] && idx > 0) {
//       const updatedPin = [...pin];
//       updatedPin[idx - 1] = "";
//       setPin(updatedPin);
//     }
//   };

//   const handlePinSubmit = () => {
//     if (pin.includes("") || isBtnLoading) return;
//     setIsBtnLoading(true);

//     setTimeout(() => {
//       setIsBtnLoading(false);
//       onClose();

//       Swal.fire({
//         title: "Withdrawal Successful!",
//         text: `₦${Number(vault.balance).toLocaleString()} has been safely moved from your "${vault.title}" nest to your main wallet.`,
//         icon: "success",
//         confirmButtonText: "Close",
//         confirmButtonColor: "#EDC344",
//         buttonsStyling: true,
//         customClass: {
//           popup: "swal-vault-radius",
//           title: "swal-vault-title",
//           confirmButton: "swal-vault-button",
//         },
//       }).then(() => {
//         onWithdrawSuccess?.(vault.id);
//       });
//     }, 2000);
//   };

//   return (
//     <div className="withdraw-overlay">
//       <div className="withdraw-box">
//         {/* SCREEN 1: CONDITIONAL WARNING SCREENS */}
//         {screen === "WARNING" && (
//           <form
//             onSubmit={handleWarningSubmit}
//             className="withdraw-content animate-fade"
//           >
//             <h2 className="withdraw-title">
//               Are you sure you want to withdraw?
//             </h2>

//             {isLocked ? (
//               <p className="withdraw-subtext">
//                 Early Withdrawal will attract a{" "}
//                 <span className="text-red">1.5% breaking fee</span> and all
//                 accrued interest will be lost.
//               </p>
//             ) : (
//               <p className="withdraw-subtext">
//                 You could wait till the next day to get your accrued interest.
//               </p>
//             )}

//             <div className="withdraw-actions">
//               <button
//                 type="submit"
//                 className="withdraw-btn-continue"
//                 disabled={isBtnLoading}
//               >
//                 Continue
//               </button>

//               <button
//                 type="button"
//                 className="withdraw-btn-yellow"
//                 onClick={onClose}
//               >
//                 {isLocked ? "Go Back" : "Wait"}
//               </button>
//             </div>
//           </form>
//         )}

//         {/* SCREEN 2: PROCESSING LOADER */}
//         {screen === "LOADING" && (
//           <div className="withdraw-loading-container animate-fade">
//             <div className="withdraw-fullscreen-spinner"></div>
//             <p className="withdraw-loading-text">
//               Securing secure channel window...
//             </p>
//           </div>
//         )}

//         {/* SCREEN 3: INTEGRATED REUSABLE PIN SCREEN */}
//         {screen === "PIN" && (
//           <div className="animate-fade">
//             <PlanPinScreen
//               pin={pin}
//               handlePinChange={handlePinChange}
//               handlePinKeyDown={handlePinKeyDown}
//               onBack={() => setScreen("WARNING")}
//               onSubmit={handlePinSubmit}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default WithdrawModal;
