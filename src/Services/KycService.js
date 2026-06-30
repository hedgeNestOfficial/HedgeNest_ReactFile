// export const submitKyc = async (formData, token) => {
//   try {
//     const response = await axios.post(ENDPOINTS.AUTH.VERIFY_KYC, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "multipart/form-data",
//       },

//       timeout: API_CONFIG.timeout,
//     });

//     return response.data;
//   } catch (error) {
//     // console.log("UPLOAD ERROR:", error.response?.data);

//     throw error;
//   }
// };

// export const uploadUtilityBill = async (file, token) => {
//   const formData = new FormData();

//   formData.append("utilityBill", file);

//   const response = await axios.post(
//     ENDPOINTS.KYC.UPLOAD_UTILITY_BILL,
//     formData,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "multipart/form-data",
//       },
//     },
//   );

//   return response.data;
// };

import React, { useState, useEffect } from "react";
import "../../Style/BvnAuth.css";
import Signupimg from "../../assets/Signupimg.jpg";
import Button from "../../Components/Button";
import { LuArrowLeft, LuLock } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { submitKyc } from "../../Services/authService";
import { OrbitProgress } from "react-loading-indicators";
import whiteLogo from "../../assets/white logo.png";

const BvnAuth = () => {
  const navigate = useNavigate();

  // Extract both authenticated 'user' and 'tempUser' out of the user slice
  const { user, tempUser } = useSelector((state) => state.user);
  const onboardingToken = tempUser?.authToken;

  const [idNumber, setIdNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 🛡️ ON-MOUNT ROUTE GUARD
   * Stops fully authenticated users from re-accessing identity verification workflows.
   */
  useEffect(() => {
    if (user) {
      console.log(
        "🛡️ User already authenticated. Redirecting away from identity verification...",
      );
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleIdNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 11) {
      setIdNumber(value);
    }
  };

  const handleSubmitKyc = async (e) => {
    e.preventDefault();

    if (!idNumber.trim()) {
      return toast.error("Enter your NIN");
    }

    if (idNumber.length !== 11) {
      return toast.error("NIN must be exactly 11 digits");
    }

    // Safety Guard: Alert if preceding onboarding tokens didn't store correctly
    if (!onboardingToken) {
      return toast.error(
        "Verification session expired. Please restart signup.",
      );
    }

    try {
      setIsLoading(true);

      // ✅ FIXED: Using the correct payload structure for the /verify endpoint
      const payload = {
        id: idNumber, // Changed from 'nin' to 'id' as per the API spec
      };

      console.log("VERIFY PAYLOAD:", payload);

      // ✅ FIXED: Using the correct token (onboardingToken)
      // The submitKyc function already handles the Authorization header
      const response = await submitKyc(payload, onboardingToken);
      console.log("VERIFY RESPONSE:", response);

      // ✅ FIXED: Check for success and isVerified1 in the response
      if (response?.success === true && response?.data?.isVerified1 === true) {
        toast.success("Identity verified successfully!");

        // ✅ Navigate to PIN setup after successful verification
        setTimeout(() => {
          navigate("/pin");
        }, 1500);
      } else if (response?.success === true) {
        toast.success("Identity verified successfully!");
        setTimeout(() => {
          navigate("/pin");
        }, 1500);
      } else {
        toast.error(response?.message || "Unable to verify identity");
      }
    } catch (error) {
      console.log("VERIFY ERROR:", error);
      console.log("VERIFY ERROR RESPONSE:", error?.response?.data);

      // ✅ FIXED: Better error handling with specific messages
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to verify identity";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="signup-section">
      <div className="image-container">
        <img src={Signupimg} alt="HedgeNest Protection Illustration" />

        <div
          className="brand-group"
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            top: "5%",
            left: "2%",
            gap: "10px",
          }}
        >
          <div className="brand-logo">
            <img
              onClick={() => navigate("/")}
              src={whiteLogo}
              alt="HedgeNest Logo"
            />
          </div>

          <span className="brand-name">HedgeNest</span>
        </div>
      </div>

      <div className="form-container">
        <div className="signup-form-wrapper">
          <div className="form-header-mobile">
            <div className="brand-group-mobile">
              <img src={whiteLogo} alt="Logo" />
            </div>

            <button
              type="button"
              className="back-arrow-btn"
              onClick={() => window.history.back()}
            >
              <LuArrowLeft className="back-arrow-icon" />
            </button>
          </div>

          <h2>Verify Your Identity</h2>

          <form className="auth-form" onSubmit={handleSubmitKyc}>
            <div className="Auth-inputs-row">
              <label>ID Type</label>
              <div className="input-tag">NIN</div>
            </div>

            <div className="Auth-inputs-row">
              <label>Enter NIN Number (11 digits)</label>

              <div className="input-tag">
                <input
                  type="text"
                  placeholder="Enter your NIN number"
                  value={idNumber}
                  maxLength={11}
                  onChange={handleIdNumberChange}
                />
                <LuLock className="input-icon" />
              </div>
            </div>

            <Button
              text={
                isLoading ? (
                  <div className="loader-wrapper">
                    <OrbitProgress color="#ffffff" size="small" />
                  </div>
                ) : (
                  "Continue"
                )
              }
              type="submit"
              className="otp-submit-btn"
              disabled={isLoading}
              style={{
                background: isLoading ? "#b3b3b3" : "#eed06c",
                color: "#fff",
                marginTop: "10px",
              }}
            />

            <p
              style={{
                color: "#eed06c",
                alignSelf: "flex-start",
                cursor: "pointer",
              }}
              onClick={() => navigate("/pin")}
            >
              Skip for now
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BvnAuth;
