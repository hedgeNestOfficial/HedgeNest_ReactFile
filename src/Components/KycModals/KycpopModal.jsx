import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { LuLock } from "react-icons/lu";
import toast from "react-hot-toast";
import { OrbitProgress } from "react-loading-indicators";
import { submitKyc } from "../../Services/authService";
import { updateUser } from "../../Store/UserSlice"; // Ensure your slice action is imported if you need to update user state locally
import Button from "../../Components/Button";
import "../../Style/KycModalGlobal.css"; // Or wherever your shared modal styles live

const KycpopModal = ({ isOpen, onClose, onSuccessRefresh }) => {
  if (!isOpen) return null;

  const dispatch = useDispatch();
  const { token, tempUser } = useSelector((state) => state.user);

  // Dynamically resolve token based on context (Settings page vs Onboarding)
  const activeToken = token || tempUser?.authToken;

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
      return toast.error("Your session has expired. Please log in again.");
    }

    try {
      setIsLoading(true);

      const payload = {
        nin: idNumber,
        verification_consent: true,
      };

      const cleanToken = activeToken.replace(/^"|"$/g, "");
      const response = await submitKyc(payload, cleanToken);

      toast.success(response?.message || "Identity verified successfully");

      // If the backend sends updated user profile info back immediately:
      if (response?.data || response?.user) {
        dispatch(updateUser(response.data || response.user));
      }

      if (onSuccessRefresh) {
        onSuccessRefresh();
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("KYC MODAL ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Unable to verify identity",
      );
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
