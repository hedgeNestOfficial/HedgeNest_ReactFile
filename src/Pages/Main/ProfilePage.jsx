import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../Style/ProfilePage.css";
import SettingView from "./SettingView";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { GiInjustice } from "react-icons/gi";
import { MdPhotoCamera } from "react-icons/md";
import { FiEdit2, FiMail, FiAlertTriangle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { updateProfile } from "../../Services/authService";
import { OrbitProgress } from "react-loading-indicators";
import { updateUser } from "../../Store/UserSlice";
import { PiSignOutBold } from "react-icons/pi";
import KycModalManager from "../../Components/KycModals/KycModalManager";
// 🟢 Imported the Logout Modal component
import LogoutModal from "../../Components/KycModals/SignoutModal";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.user);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [isKycOpen, setIsKycOpen] = useState(false);
  // 🟢 State to manage Logout Modal visibility
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  // Synchronize state values directly against the clean state.user structure
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
        email: user.email || "",
      });

      if (user.profilePicture?.url) {
        setPreviewUrl(user.profilePicture.url);
      } else {
        setPreviewUrl("");
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB");
        return;
      }
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const profileFormData = new FormData();
      profileFormData.append("phoneNumber", formData.phoneNumber);

      if (profilePicture) {
        profileFormData.append("profilePicture", profilePicture);
      }

      const response = await updateProfile(profileFormData, token);

      // Dispatch the response directly. The slice handler handles both data and raw objects safely!
      dispatch(updateUser(response.data || response));

      toast.success(response.message || "Profile updated successfully");
      setIsEditing(false);
      setProfilePicture(null);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneNumber: user?.phoneNumber || "",
      email: user?.email || "",
    });
    setPreviewUrl(user?.profilePicture?.url || "");
    setProfilePicture(null);
    setIsEditing(false);
  };

  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <h1>Account</h1>
      </div>

      <div
        className="profile-header-mobile-view-mood"
        style={{ justifyContent: "space-between", width: "100%" }}
      >
        <h2>Account</h2>

        {/* 🟢 Added onClick trigger and a pointer cursor for cleaner mobile interaction */}
        <nav
          className="signout-mobile"
          style={{
            cursor: "pointer",
            color: "red",
            width: "150px",
            gap: "10px",
            height: "50px",
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setIsLogoutOpen(true)}
        >
          Signout
          <span>
            <PiSignOutBold />
          </span>
        </nav>
      </div>

      <div className="profile-tabs-container">
        <button
          className={`profile-tab-btn ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <CgProfile className="tab-icon" /> Profile
        </button>
        <button
          className={`profile-tab-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <IoSettingsOutline className="tab-icon" /> Settings
        </button>
        <button
          className={`profile-tab-btn ${activeTab === "support" ? "active" : ""}`}
          onClick={() => setActiveTab("support")}
        >
          <TfiHeadphoneAlt className="tab-icon" /> Help & Support
        </button>
        <button
          className={`profile-tab-btn ${activeTab === "legal" ? "active" : ""}`}
          onClick={() => setActiveTab("legal")}
        >
          <GiInjustice className="tab-icon" /> Legal & Compliance
        </button>
      </div>

      <div className="account-view-content-driver">
        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="profile-content-card">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "10px",
              }}
            >
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    alignSelf: "flex-end",
                    textAlign: "center",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    background: "transparent",
                    cursor: "pointer",
                    fontWeight: "600",
                    color: "black",
                  }}
                >
                  <FiEdit2 /> Edit Profile
                </button>
              )}
            </div>

            <div className="user-info-section">
              <div className="avatar-wrapper">
                <div className="avatar-circle">
                  {previewUrl ? (
                    <img src={previewUrl} alt="User Avatar" />
                  ) : (
                    <CgProfile size={50} color="#ccc" />
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

                {isEditing && (
                  <button
                    type="button"
                    className="camera-btn"
                    title="Upload Photo"
                    onClick={handleCameraClick}
                  >
                    <MdPhotoCamera size={18} color="black" />
                  </button>
                )}
              </div>

              <div className="user-details">
                <h2>
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="user-email-text">{user?.email}</p>
                <div className="kyc-badge-row">
                  <span className="kyc-badge">
                    KYC:{" "}
                    <span className="tier-text">Tier {user?.tier || 1}</span>
                  </span>

                  <a
                    href="#upgrade"
                    className="upgrade-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsKycOpen(true);
                    }}
                  >
                    Upgrade To Tier 2
                  </a>
                </div>
              </div>
            </div>

            <form className="profile-edit-form" onSubmit={handleSaveProfile}>
              <div className="form-grid">
                <div className="input-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={user?.firstName || ""}
                    disabled
                    className="readonly-input"
                  />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={user?.lastName || ""}
                    disabled
                    className="readonly-input"
                  />
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="readonly-input"
                  />
                </div>
              </div>

              {isEditing && (
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "flex-start",
                    marginTop: "20px",
                  }}
                >
                  <button
                    type="submit"
                    className="save-changes-btn"
                    disabled={isLoading}
                    style={{
                      opacity: isLoading ? 0.5 : 1,
                      cursor: isLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    {isLoading ? (
                      <OrbitProgress color="#ffffff" size="small" />
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    style={{
                      padding: "12px 24px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      background: "transparent",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                      color: "#181739",
                      opacity: isLoading ? 0.5 : 1,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading)
                        e.target.style.backgroundColor = "#f5f5f7";
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading)
                        e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <SettingView
            accounts={linkedAccounts}
            // onAddAccount={() => console.log("Open Add Account")}
          />
        )}

        {/* HELP & SUPPORT TAB */}
        {activeTab === "support" && (
          <div className="profile-content-card">
            <div className="info-cards-grid">
              <div className="info-card">
                <div className="icon-wrapper email-icon">
                  <FiMail />
                </div>
                <h3>Email Support</h3>
                <p>Replies within 4 hours</p>
                <div className="card-links">
                  <a href="mailto:hello.hedgenest@gmail.com">
                    hello.hedgenest@gmail.com
                  </a>
                  <a href="mailto:info.hedgenest@gmail.com">
                    info.hedgenest@gmail.com
                  </a>
                </div>
              </div>

              <div className="info-card">
                <div className="icon-wrapper wa-icon">
                  <FaWhatsapp />
                </div>
                <h3>WhatsApp Support</h3>
                <p>Chat with our team</p>
                <div className="card-links">
                  <a
                    href="https://wa.me/2347047180205"
                    target="_blank"
                    rel="noreferrer"
                  >
                    +2347047180205
                  </a>
                  <a
                    href="https://wa.me/2347063958038"
                    target="_blank"
                    rel="noreferrer"
                  >
                    +2347063958038
                  </a>
                </div>
              </div>

              <div className="info-card">
                <div className="icon-wrapper alert-icon">
                  <FiAlertTriangle />
                </div>
                <h3>Report a problem</h3>
                <p>Something's not right, let us know</p>
                <div className="card-links">
                  <span
                    className="action-link"
                    style={{
                      cursor: "pointer",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                    onClick={() => navigate("/contact")}
                  >
                    Open report form &gt;
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LEGAL & COMPLIANCE TAB */}
        {activeTab === "legal" && (
          <div className="profile-content-card">
            <div className="info-cards-grid">
              <div className="info-card">
                <h3>Terms of service</h3>
                <p>
                  The rules and obligations that govern your use of HedgeNest,
                  including account responsibilities, fees, and dispute
                  resolution.
                </p>
                <div className="card-links">
                  <span
                    className="action-link"
                    style={{
                      cursor: "pointer",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                    onClick={() => navigate("/policy")}
                  >
                    Read more &gt;
                  </span>
                </div>
              </div>

              <div className="info-card">
                <h3>Privacy policy</h3>
                <p>
                  How we collect, use and protect your personal data, including
                  KYC information and transaction history.
                </p>
                <div className="card-links">
                  <span
                    className="action-link"
                    style={{
                      cursor: "pointer",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                    onClick={() => navigate("/policy")}
                  >
                    Read more &gt;
                  </span>
                </div>
              </div>

              <div className="info-card">
                <h3>Regulatory Information</h3>
                <p>
                  HedgeNest operates with licensed partners and complies with
                  Nigerian financial regulations.
                </p>
                <div className="card-links">
                  <span
                    className="action-link"
                    style={{
                      cursor: "pointer",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                    onClick={() => navigate("/policy")}
                  >
                    Read more &gt;
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <KycModalManager isOpen={isKycOpen} onClose={() => setIsKycOpen(false)} />
      {/* 🟢 Rendered the Logout Modal Component */}
      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
      />
    </div>
  );
};

export default ProfilePage;
