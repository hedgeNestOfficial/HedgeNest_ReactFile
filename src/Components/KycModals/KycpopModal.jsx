import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { LuLock } from "react-icons/lu";
import toast from "react-hot-toast";
import { OrbitProgress } from "react-loading-indicators";
import { submitKyc } from "../../Services/authService";
import { updateUser } from "../../Store/UserSlice";
import Button from "../../Components/Button";
import "../../Style/KycModalGlobal.css";

const KycpopModal = ({ isOpen, onClose, onSuccessRefresh }) => {
  if (!isOpen) return null;

  const dispatch = useDispatch();
  const { token, tempUser, user } = useSelector((state) => state.user);

  // ✅ FIXED: Better token resolution with multiple fallbacks
  const activeToken =
    token ||
    tempUser?.authToken ||
    tempUser?.token ||
    user?.token ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("onboardingToken");

  const [idNumber, setIdNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

    if (!activeToken) {
      console.error("❌ No token found. State:", { token, tempUser, user });
      return toast.error("Your session has expired. Please log in again.");
    }

    try {
      setIsLoading(true);

      // ✅ FIXED: Using the correct payload structure for the /verify endpoint
      const payload = {
        id: idNumber, // Changed from 'nin' to 'id' as per the API spec
      };

      // ✅ FIXED: Pass the token directly
      const response = await submitKyc(payload, activeToken);

      // ✅ FIXED: Check for success and isVerified1 in the response
      if (response?.success === true && response?.data?.isVerified1 === true) {
        toast.success("Identity verified successfully!");

        // Update user state with the new verification status
        if (response?.data) {
          dispatch(
            updateUser({
              ...response.data,
              isVerified1: true,
            }),
          );
        }

        if (onSuccessRefresh) {
          onSuccessRefresh();
        }

        setTimeout(() => {
          onClose();
        }, 1000);
      } else if (response?.success === true) {
        toast.success("Identity verified successfully!");

        if (response?.data) {
          dispatch(updateUser(response.data));
        }

        if (onSuccessRefresh) {
          onSuccessRefresh();
        }

        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        toast.error(response?.message || "Unable to verify identity");
      }
    } catch (error) {
      console.error(" KYC MODAL ERROR:", error);
      console.error(" KYC MODAL ERROR RESPONSE:", error?.response?.data);

      // ✅ FIXED: Better error handling with specific messages
      let errorMessage = "Unable to verify identity";

      if (error?.response?.status === 401) {
        errorMessage = "Your session has expired. Please log in again.";
      } else if (error?.response?.status === 400) {
        errorMessage =
          error?.response?.data?.message ||
          "Invalid NIN provided. Please check and try again.";
      } else if (error?.response?.status === 404) {
        errorMessage =
          "Verification service unavailable. Please try again later.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header-row">
          <h2>Verify Identity (NIN)</h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <IoMdClose size={22} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form className="modal-form-content" onSubmit={handleSubmitKyc}>
          <div className="modal-input-group">
            <label>ID Type</label>
            <div className="disabled-mock-input">
              NIN (National Identification Number)
            </div>
          </div>

          <div className="modal-input-group">
            <label>Enter NIN Number (11 digits)</label>
            <div className="modal-input-wrapper">
              <input
                type="text"
                placeholder="Enter your 11-digit NIN"
                value={idNumber}
                maxLength={11}
                onChange={handleIdNumberChange}
                disabled={isLoading}
              />
              <LuLock className="modal-input-icon" />
            </div>
          </div>

          <Button
            text={
              isLoading ? (
                <div className="loader-wrapper">
                  <OrbitProgress color="#ffffff" size="small" />
                </div>
              ) : (
                "Verify Identity"
              )
            }
            type="submit"
            className="modal-submit-btn"
            disabled={isLoading}
            style={{
              background: isLoading
                ? "#b3b3b3"
                : "linear-gradient(90deg, #e6b042 0%, #f5ce71 100%)",
              color: "#fff",
              marginTop: "16px",
              width: "100%",
              height: "50px",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
          />
        </form>
      </div>
    </div>
  );
};

export default KycpopModal;
