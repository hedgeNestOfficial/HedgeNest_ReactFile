// import React, { useState, useRef } from "react";
// import { BsFileEarmarkText } from "react-icons/bs";
// import { OrbitProgress } from "react-loading-indicators";

// const KycUploadModal = ({ onCancel, onVerify }) => {
//   const [utilityName, setUtilityName] = useState("");
//   const [licenseName, setLicenseName] = useState("");
//   const [isVerifying, setIsVerifying] = useState(false);

//   const utilityRef = useRef(null);
//   const licenseRef = useRef(null);

//   const handleUtilityChange = (e) => {
//     if (e.target.files[0]) setUtilityName(e.target.files[0].name);
//   };

//   const handleLicenseChange = (e) => {
//     if (e.target.files[0]) setLicenseName(e.target.files[0].name);
//   };

//   const handleVerifyClick = () => {
//     // Simulate API call before moving to PIN
//     setIsVerifying(true);
//     setTimeout(() => {
//       setIsVerifying(false);
//       onVerify();
//     }, 2000);
//   };

//   return (
//     <div style={{ textAlign: "left" }}>
//       <h2 className="kyc-modal-title" style={{ textAlign: "left" }}>
//         Complete KYC Verification
//       </h2>
//       <p className="kyc-modal-subtitle" style={{ textAlign: "left" }}>
//         Upload a photo of your latest Utility(NEPA) Bill or current Driver's
//         License (Choose 1 of 2)
//       </p>

//       {/* Utility Bill Upload */}
//       <div className="kyc-upload-group">
//         <label className="kyc-upload-label">Upload Photo Of Utility Bill</label>
//         <div
//           className="kyc-upload-box"
//           onClick={() => utilityRef.current.click()}
//         >
//           <span className="kyc-upload-text">
//             {utilityName || "Attach File"}
//           </span>
//           <BsFileEarmarkText size={20} color="#1a1a1a" />
//         </div>
//         <input
//           type="file"
//           ref={utilityRef}
//           style={{ display: "none" }}
//           onChange={handleUtilityChange}
//           accept="image/*,.pdf"
//         />
//       </div>

//       {/* Driver's License Upload */}
//       <div className="kyc-upload-group">
//         <label className="kyc-upload-label">
//           Upload Photo Of Driver's License
//         </label>
//         <div
//           className="kyc-upload-box"
//           onClick={() => licenseRef.current.click()}
//         >
//           <span className="kyc-upload-text">
//             {licenseName || "Attach File"}
//           </span>
//           <BsFileEarmarkText size={20} color="#1a1a1a" />
//         </div>
//         <input
//           type="file"
//           ref={licenseRef}
//           style={{ display: "none" }}
//           onChange={handleLicenseChange}
//           accept="image/*,.pdf"
//         />
//       </div>

//       <div className="kyc-btn-group">
//         <button
//           className="kyc-btn kyc-btn-cancel"
//           onClick={onCancel}
//           disabled={isVerifying}
//         >
//           Cancel
//         </button>
//         <button
//           className="kyc-btn kyc-btn-continue"
//           onClick={handleVerifyClick}
//           disabled={isVerifying}
//         >
//           {isVerifying ? (
//             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//               <OrbitProgress color="#000000" size="small" /> Verifying...
//             </div>
//           ) : (
//             "Verify"
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default KycUploadModal;

import React, { useRef, useState } from "react";
import { BsFileEarmarkText } from "react-icons/bs";
import toast from "react-hot-toast";

const KycUploadModal = ({ onCancel, onVerify }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleContinue = () => {
    if (!selectedFile) {
      toast.error("Please upload your utility bill to proceed.");
      return;
    }
    // Pass the file instance forward to your manager state for the final API consumption step
    onVerify(selectedFile);
  };

  return (
    <>
      <h2 className="kyc-modal-title">Complete Verification</h2>
      <p className="kyc-modal-subtitle">
        Please upload a clear copy of your recent utility bill (e.g.,
        electricity, water, or waste bill) matching your profile address.
      </p>

      <div className="kyc-upload-group">
        <label className="kyc-upload-label">Upload Photo Of Utility Bill</label>

        <input
          type="file"
          accept="image/*,.pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <div className="kyc-upload-box" onClick={handleBoxClick}>
          <span
            className="kyc-upload-text"
            style={{ color: selectedFile ? "#1a1a1a" : "#9ca3af" }}
          >
            {selectedFile ? selectedFile.name : "Attach Utility Bill (Max 5MB)"}
          </span>
          <BsFileEarmarkText
            color={selectedFile ? "#f2c94c" : "#9ca3af"}
            size={18}
          />
        </div>
      </div>

      <div className="kyc-btn-group">
        <button
          type="button"
          className="kyc-btn kyc-btn-cancel"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="kyc-btn kyc-btn-continue"
          onClick={handleContinue}
          disabled={!selectedFile}
        >
          Verify
        </button>
      </div>
    </>
  );
};

export default KycUploadModal;
