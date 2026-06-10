import React, { useState } from "react";
import "../../Style/BvnAuth.css";
import Signupimg from "../../assets/Signupimg.jpg";
import Button from "../../Components/Button";
import { LuArrowLeft, LuLock, LuFile } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { submitKyc } from "../../Services/authService";
import { OrbitProgress } from "react-loading-indicators";
import whiteLogo from "../../assets/white logo.png";

const BvnAuth = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const [idNumber, setIdNumber] = useState("");
  const [idPhoto, setIdPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
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
      setIdNumber(value); // Assuming this is for NIN, not BVN
    }
  };

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmitKyc = async (e) => {
    e.preventDefault();

    if (!idNumber) {
      toast.error("Enter NIN number");
      return;
    }

    if (idNumber.length !== 11) {
      toast.error("NIN must be 11 digits");
      return;
    }

    if (!idPhoto) {
      toast.error("Upload your NIN slip");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("idType", "nin");
      formData.append("idNumber", idNumber.toString());
      formData.append("idPhoto", idPhoto);

      const response = await submitKyc(formData, token);

      toast.success(response.message);

      navigate("/pin");
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "KYC upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="signup-section">
      {/* LEFT IMAGE */}
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

      {/* RIGHT FORM */}
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
            {/* FILE UPLOAD */}
            <div className="Auth-inputs-row">
              <label>ID Type</label>

              <div className="input-tag">NIN</div>
            </div>

            <div className="Auth-inputs-row">
              <label>Upload photo of NIN ID</label>

              <div
                className="input-tag"
                // style={{
                //   width: "100%",
                //   height: "100%",
                //   display: "flex",
                //   justifyContent: "space-between",
                // }}
              >
                <input
                  type="file"
                  id="ninUpload"
                  accept="image/*"
                  // capture="environment"
                  onChange={handleFileChange}
                  hidden
                />

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

            {/* NIN INPUT */}
            <div className="Auth-inputs-row">
              <label>Enter NIN Number (11 degits)</label>

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

            {/* SUBMIT BUTTON */}
            <div className="Auth-inputs-row">
              <label>What Best Describes You?</label>

              <div className="input-tag">
                <select
                  className="select-input"
                  // value={selectedOption}
                  // onChange={handleSelectChange}
                >
                  <option value="">Select an option</option>
                  <option value="Student">Student</option>
                  <option value="SelfEmployed">Self Employed</option>
                  <option value="Employed">Employed </option>
                  <option value="Others">Others </option>
                </select>
              </div>
            </div>

            {/* CONTINUE BUTTON */}
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
                color: "black",
                alignSelf: "flex-start",
                cursor: "pointer",
              }}
              onClick={() => navigate("/dashboard")}
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
