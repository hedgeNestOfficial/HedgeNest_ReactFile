import React, { useState } from "react";
import "../../Style/BvnAuth.css";
import Signupimg from "../../assets/Signupimg.jpg";
import Button from "../../Components/Button";

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

  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");

      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    setIdPhoto(file);

    toast.success("Image attached successfully");
  };

  const handleIdNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 11) {
      setIdNumber(value);
    }

    if (value.length === 11) {
      toast.success(`${idType.toUpperCase()} number looks valid`);
    }
  };

  const handleSubmitKyc = async (e) => {
    e.preventDefault();

    if (!idType) {
      return toast.error("Please select ID type");
    }
    if (!idNumber.trim()) {
      return toast.error(`Please enter your ${idType.toUpperCase()} number`);
    }
    if (idNumber.length !== 11) {
      return toast.error(`${idType.toUpperCase()} must be exactly 11 digits`);
    }
    if (!occupation) {
      return toast.error("Please select occupation");
    }
    if (idType === "nin" && !idPhoto) {
      return toast.error("Please upload your NIN slip");
    }
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

      // REDIRECT TO PIN PAGE
      setTimeout(() => {
        navigate("/create-pin");
      }, 1500);
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

          <p className="bvn-subtitle">
            Complete your KYC verification to continue
          </p>

          <form className="auth-form" onSubmit={handleSubmitKyc}>
            {/* ID TYPE */}
            <div className="Auth-inputs-row">
              <label>ID Type</label>

              <div className="input-tag">
                <select
                  value={idType}
                  onChange={(e) => {
                    setIdType(e.target.value);

                    // RESET STATES
                    setIdPhoto(null);

                    setIdNumber("");
                  }}
                >
                  <option value="">Select ID Type</option>

                  {/* <option value="bvn">BVN</option> */}

                  <option value="nin">NIN</option>
                </select>

                <LuChevronDown className="input-icon" />
              </div>
            </div>

            {/* NIN FILE UPLOAD */}
            {idType === "nin" && (
              <div className="Auth-inputs-row">
                <label>Upload NIN Slip</label>

                <div className="input-tag">
                  {/* HIDDEN INPUT */}
                  <input
                    type="file"
                    id="ninUpload"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />

                  {/* CUSTOM LABEL */}
                  <label htmlFor="ninUpload" className="custom-file-label">
                    <span
                      className={idPhoto ? "file-selected" : "file-placeholder"}
                    >
                      {idPhoto ? idPhoto.name : "Attach NIN Slip"}
                    </span>

                    <LuFile className="input-icon" />
                  </label>
                </div>
              </div>
            )}

            {/* ID NUMBER */}
            {idType && (
              <div className="Auth-inputs-row">
                <label>Enter {idType.toUpperCase()} Number</label>

                <div className="input-tag">
                  <input
                    type="text"
                    placeholder={`Enter your ${idType.toUpperCase()} number`}
                    value={idNumber}
                    maxLength={11}
                    onChange={handleIdNumberChange}
                  />

                  <LuLock className="input-icon" />
                </div>
              </div>
            )}

            {/* OCCUPATION */}
            <div className="Auth-inputs-row">
              <label>What best describes you</label>

              <div className="input-tag">
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                >
                  <option value="">Select Occupation</option>

                  <option value="student">Student</option>

                  <option value="self-employed">Self Employed</option>

                  <option value="employed">Employed</option>

                  <option value="others">Others</option>
                </select>

                <LuChevronDown className="input-icon" />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <Button
              text={isLoading ? "Submitting..." : "Continue"}
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
