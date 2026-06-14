// import React, { useState } from "react";
// import "../../Style/KycModals.css";
// import KycStartModal from "./KycStartModal";
// import KycUploadModal from "./KycUploadModal";
// import KycPinModal from "./KycPinModal";
// import KycSuccessModal from "./KycSuccessModal";

// const KycModalManager = ({ isOpen, onClose }) => {
//   const [step, setStep] = useState(1);

//   if (!isOpen) return null;

//   const nextStep = () => setStep((prev) => prev + 1);
//   const prevStep = () => setStep((prev) => prev - 1);
//   const handleComplete = () => {
//     setStep(1); // Reset for next time
//     onClose();
//   };

//   return (
//     <div className="kyc-modal-overlay">
//       <div className="kyc-modal-content">
//         {step === 1 && (
//           <KycStartModal onCancel={onClose} onContinue={nextStep} />
//         )}
//         {step === 2 && (
//           <KycUploadModal onCancel={onClose} onVerify={nextStep} />
//         )}
//         {step === 3 && <KycPinModal onBack={prevStep} onNext={nextStep} />}
//         {step === 4 && <KycSuccessModal onClose={handleComplete} />}
//       </div>
//     </div>
//   );
// };

// export default KycModalManager;

import React, { useState } from "react";
import "../../Style/KycModals.css";

import KycStartModal from "./KycStartModal";
import KycUploadModal from "./KycUploadModal";
import KycPinModal from "./KycPinModal";
import KycSuccessModal from "./KycSuccessModal";

const KycModalManager = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);

  const [utilityBill, setUtilityBill] = useState(null);

  if (!isOpen) return null;

  const nextStep = () => setStep((prev) => prev + 1);

  const prevStep = () => setStep((prev) => prev - 1);

  const handleUploadComplete = (file) => {
    setUtilityBill(file);
    setStep(3);
  };

  const handleComplete = () => {
    setStep(1);
    setUtilityBill(null);
    onClose();
  };

  return (
    <div className="kyc-modal-overlay">
      <div className="kyc-modal-content">
        {step === 1 && (
          <KycStartModal onCancel={onClose} onContinue={nextStep} />
        )}

        {step === 2 && (
          <KycUploadModal onCancel={onClose} onVerify={handleUploadComplete} />
        )}

        {step === 3 && (
          <KycPinModal
            utilityBill={utilityBill}
            onBack={prevStep}
            onNext={nextStep}
          />
        )}

        {step === 4 && <KycSuccessModal onClose={handleComplete} />}
      </div>
    </div>
  );
};

export default KycModalManager;
