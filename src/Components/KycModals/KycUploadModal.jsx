import React, { useState, useRef } from "react";
import { BsFileEarmarkText } from "react-icons/bs";
import { OrbitProgress } from "react-loading-indicators";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { uploadUtilityBill } from "../../Services/authService";

const KycUploadModal = ({ onCancel, onVerify }) => {
  const [utilityName, setUtilityName] = useState("");
  const [utilityFile, setUtilityFile] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const utilityRef = useRef(null);

  const { token } = useSelector((state) => state.user);

  const handleUtilityChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        e.target.value = "";
        return;
      }

      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image or PDF file");
        e.target.value = "";
        return;
      }

      setUtilityName(file.name);
      setUtilityFile(file);
    }
  };

  const handleVerifyClick = async () => {
    if (!utilityFile) {
      toast.error("Please upload a utility bill first");
      return;
    }

    const authToken = token || localStorage.getItem("authToken");

    if (!authToken) {
      toast.error("Session expired. Please login again.");
      return;
    }

    try {
      setIsVerifying(true);

      const response = await uploadUtilityBill(utilityFile, authToken);

      toast.success(response?.message || "Utility bill uploaded successfully");

      // Pass the file to parent component for PIN verification
      onVerify(utilityFile);
    } catch (error) {
      console.error("Upload error:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to upload utility bill. Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div style={{ textAlign: "left" }}>
      <h2 className="kyc-modal-title" style={{ textAlign: "left" }}>
        Complete KYC Verification
      </h2>
      <p className="kyc-modal-subtitle" style={{ textAlign: "left" }}>
        Upload a photo of your latest Utility (NEPA) Bill or current Driver's
        License (Choose 1 of 2)
      </p>

      {/* Utility Bill Upload */}
      <div className="kyc-upload-group">
        <label className="kyc-upload-label">Upload Photo Of Utility Bill</label>
        <div
          className="kyc-upload-box"
          onClick={() => utilityRef.current.click()}
          style={{ cursor: "pointer" }}
        >
          <span className="kyc-upload-text">
            {utilityName || "Attach File"}
          </span>
          <BsFileEarmarkText size={20} color="#1a1a1a" />
        </div>
        <input
          type="file"
          ref={utilityRef}
          style={{ display: "none" }}
          onChange={handleUtilityChange}
          accept="image/*,.pdf"
        />
      </div>

      <div className="kyc-btn-group">
        <button
          className="kyc-btn kyc-btn-cancel"
          onClick={onCancel}
          disabled={isVerifying}
        >
          Cancel
        </button>
        <button
          className="kyc-btn kyc-btn-continue"
          onClick={handleVerifyClick}
          disabled={isVerifying}
        >
          {isVerifying ? (
            <div className="loader-wrapper">
              <OrbitProgress color="#fff" size="small" />
            </div>
          ) : (
            "Verify"
          )}
        </button>
      </div>
    </div>
  );
};

export default KycUploadModal;

// import React, { useRef, useState } from "react";
// import { BsFileEarmarkText } from "react-icons/bs";
// import toast from "react-hot-toast";

// const KycUploadModal = ({ onCancel, onVerify }) => {
//   const fileInputRef = useRef(null);
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleBoxClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("File size must be less than 5MB");
//         return;
//       }
//       setSelectedFile(file);
//     }
//   };

//   const handleContinue = () => {
//     if (!selectedFile) {
//       toast.error("Please upload your utility bill to proceed.");
//       return;
//     }
//     // Pass the file instance forward to your manager state for the final API consumption step
//     onVerify(selectedFile);
//   };

//   return (
//     <>
//       <h2 className="kyc-modal-title">Complete Verification</h2>
//       <p className="kyc-modal-subtitle">
//         Please upload a clear copy of your recent utility bill (e.g.,
//         electricity, water, or waste bill) matching your profile address.
//       </p>

//       <div className="kyc-upload-group">
//         <label className="kyc-upload-label">Upload Photo Of Utility Bill</label>

//         <input
//           type="file"
//           accept="image/*,.pdf"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           style={{ display: "none" }}
//         />

//         <div className="kyc-upload-box" onClick={handleBoxClick}>
//           <span
//             className="kyc-upload-text"
//             style={{ color: selectedFile ? "#1a1a1a" : "#9ca3af" }}
//           >
//             {selectedFile ? selectedFile.name : "Attach Utility Bill (Max 5MB)"}
//           </span>
//           <BsFileEarmarkText
//             color={selectedFile ? "#f2c94c" : "#9ca3af"}
//             size={18}
//           />
//         </div>
//       </div>

//       <div className="kyc-btn-group">
//         <button
//           type="button"
//           className="kyc-btn kyc-btn-cancel"
//           onClick={onCancel}
//         >
//           Cancel
//         </button>
//         <button
//           type="button"
//           className="kyc-btn kyc-btn-continue"
//           onClick={handleContinue}
//           disabled={!selectedFile}
//         >
//           Verify
//         </button>
//       </div>
//     </>
//   );
// };

// export default KycUploadModal;
