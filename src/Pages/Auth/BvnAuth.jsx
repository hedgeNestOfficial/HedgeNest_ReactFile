// import React, { useState } from "react";
// import "../../Style/BvnAuth.css";
// import Signupimg from "../../assets/Signupimg.jpg";
// import Button from "../../Components/Button";
// import { LuArrowLeft } from "react-icons/lu";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import toast from "react-hot-toast";

// import { submitKyc } from "../../Services/authService";

// const BvnAuth = () => {
//   const navigate = useNavigate();

//   const { token } = useSelector((state) => state.user);

//   const [idType, setIdType] = useState("");
//   const [idNumber, setIdNumber] = useState("");
//   const [idPhoto, setIdPhoto] = useState(null);
//   const [occupation, setOccupation] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];

//     if (!file) return;

//     setIdPhoto(file);
//   };

//   const handleSubmitKyc = async (e) => {
//     e.preventDefault();

//     if (!idType) {
//       toast.error("Please select ID type");
//       return;
//     }

//     if (!idNumber.trim()) {
//       toast.error(`Please enter your ${idType.toUpperCase()} number`);
//       return;
//     }

//     if (!occupation) {
//       toast.error("Please select occupation");
//       return;
//     }

//     if (idType === "nin" && !idPhoto) {
//       toast.error("Please upload your NIN image");
//       return;
//     }

//     try {
//       setIsLoading(true);

//       const formData = new FormData();

//       formData.append("idType", idType);
//       formData.append("idNumber", idNumber);

//       if (idType === "nin" && idPhoto) {
//         formData.append("idPhoto", idPhoto);
//       }

//       const response = await submitKyc(formData, token);

//       toast.success(response?.message || "KYC submitted successfully");

//       setTimeout(() => {
//         navigate("/dashboard");
//       }, 1500);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to submit KYC");

//       console.log(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <section className="signup-section">
//       <div className="image-container">
//         <img src={Signupimg} alt="HedgeNest Protection Illustration" />
//       </div>

//       <div className="form-container">
//         <div className="signup-form-wrapper">
//           <button
//             type="button"
//             className="back-arrow-btn"
//             onClick={() => window.history.back()}
//           >
//             <LuArrowLeft className="back-arrow-icon" />
//           </button>

//           <h2>Complete Your KYC</h2>

//           <form className="auth-form" onSubmit={handleSubmitKyc}>
//             {/* ID TYPE */}
//             <div className="Auth-inputs-row">
//               <label>ID Type</label>

//               <div className="input-tag">
//                 <select
//                   value={idType}
//                   onChange={(e) => {
//                     setIdType(e.target.value);
//                     setIdPhoto(null);
//                     setIdNumber("");
//                   }}
//                 >
//                   <option value="">Select ID Type</option>

//                   <option value="bvn">BVN</option>

//                   <option value="nin">NIN</option>
//                 </select>
//               </div>
//             </div>

//             {/* ID NUMBER */}
//             {idType && (
//               <div className="Auth-inputs-row">
//                 <label>{idType === "bvn" ? "BVN Number" : "NIN Number"}</label>

//                 <div className="input-tag">
//                   <input
//                     type="text"
//                     placeholder={`Enter your ${idType.toUpperCase()} number`}
//                     value={idNumber}
//                     onChange={(e) => setIdNumber(e.target.value)}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* NIN IMAGE */}
//             {idType === "nin" && (
//               <div className="Auth-inputs-row">
//                 <label>Upload NIN Image</label>

//                 <div className="input-tag file-upload-box">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     capture="environment"
//                     onChange={handleFileChange}
//                   />

//                   {idPhoto ? (
//                     <p className="file-name">{idPhoto.name}</p>
//                   ) : (
//                     <p className="upload-placeholder">
//                       Upload or take a picture
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* OCCUPATION */}
//             <div className="Auth-inputs-row">
//               <label>What best describes you</label>

//               <div className="input-tag">
//                 <select
//                   value={occupation}
//                   onChange={(e) => setOccupation(e.target.value)}
//                 >
//                   <option value="">Select Occupation</option>

//                   <option value="student">Student</option>

//                   <option value="self-employed">Self Employed</option>

//                   <option value="employed">Employed</option>

//                   <option value="others">Others</option>
//                 </select>
//               </div>
//             </div>

//             <Button
//               text={isLoading ? "Submitting..." : "Continue"}
//               type="submit"
//               className="otp-submit-btn"
//               disabled={isLoading}
//               color="#c9922a"
//             />
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default BvnAuth;

import React, { useState } from "react";
import "../../Style/BvnAuth.css";
import Signupimg from "../../assets/Signupimg.jpg";
import Button from "../../Components/Button";
// 1. Import the icons we need for the inputs
import { LuArrowLeft, LuLock, LuFile, LuChevronDown } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { submitKyc } from "../../Services/authService";

const BvnAuth = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);

  const [idType, setIdType] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [idPhoto, setIdPhoto] = useState(null);
  const [occupation, setOccupation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIdPhoto(file);
  };

  const handleSubmitKyc = async (e) => {
    e.preventDefault();
    if (!idType) return toast.error("Please select ID type");
    if (!idNumber.trim())
      return toast.error(`Please enter your ${idType.toUpperCase()} number`);
    if (!occupation) return toast.error("Please select occupation");
    if (idType === "nin" && !idPhoto)
      return toast.error("Please upload your NIN image");

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("idType", idType);
      formData.append("idNumber", idNumber);
      if (idType === "nin" && idPhoto) {
        formData.append("idPhoto", idPhoto);
      }
      const response = await submitKyc(formData, token);
      toast.success(response?.message || "KYC submitted successfully");
      setTimeout(() => navigate("/create-pin"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit KYC");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="signup-section">
      <div className="image-container">
        <img src={Signupimg} alt="HedgeNest Protection Illustration" />
      </div>

      <div className="form-container">
        <div className="signup-form-wrapper">
          <button
            type="button"
            className="back-arrow-btn"
            onClick={() => window.history.back()}
          >
            <LuArrowLeft className="back-arrow-icon" />
          </button>

          <h2>Verify Your Identity</h2>

          <form className="auth-form" onSubmit={handleSubmitKyc}>
            <div className="Auth-inputs-row">
              <label>ID Type</label>
              <div className="input-tag">
                <select
                  value={idType}
                  onChange={(e) => {
                    setIdType(e.target.value);
                    setIdPhoto(null);
                    setIdNumber("");
                  }}
                >
                  <option value="">Select ID Type</option>
                  <option value="bvn">BVN</option>
                  <option value="nin">NIN</option>
                </select>
                <LuChevronDown className="input-icon" />
              </div>
            </div>

            {idType === "nin" && (
              <div className="Auth-inputs-row">
                <label>Upload Photo Of NIN ID</label>
                <div className="input-tag">
                  <input
                    type="file"
                    id="ninUpload"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="ninUpload" className="custom-file-label">
                    <span
                      className={idPhoto ? "file-selected" : "file-placeholder"}
                    >
                      {idPhoto ? idPhoto.name : "Attach File"}
                    </span>
                    <LuFile className="input-icon" />
                  </label>
                </div>
              </div>
            )}

            {idType && (
              <div className="Auth-inputs-row">
                <label>Enter {idType.toUpperCase()} Number (11 digits)</label>
                <div className="input-tag">
                  <input
                    type="text"
                    placeholder=" "
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                  />
                  <LuLock className="input-icon" />
                </div>
              </div>
            )}

            <div className="Auth-inputs-row">
              <label>What best describes you</label>
              <div className="input-tag">
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                >
                  <option value="">Enter</option>
                  <option value="student">Student</option>
                  <option value="self-employed">Self Employed</option>
                  <option value="employed">Employed</option>
                  <option value="others">Others</option>
                </select>
                <LuChevronDown className="input-icon" />
              </div>
            </div>

            <Button
              text={isLoading ? "Submitting..." : "Next"}
              type="submit"
              className="otp-submit-btn"
              disabled={isLoading}
              style={{
                background: isLoading ? "#b3b3b3" : "#eed06c",
                color: "#fff",
                marginTop: "10px",
              }}
            />
          </form>
        </div>
      </div>
    </section>
  );
};

export default BvnAuth;
