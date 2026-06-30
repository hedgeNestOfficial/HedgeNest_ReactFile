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
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { updateProfile } from "../../Services/authService";
import { OrbitProgress } from "react-loading-indicators";
import { updateUser, logout } from "../../Store/UserSlice";
import { PiSignOutBold } from "react-icons/pi";
import KycModalManager from "../../Components/KycModals/KycModalManager";
import KycpopModal from "../../Components/KycModals/KycpopModal";
import SignoutModal from "../../Components/KycModals/SignoutModal";
import SplashScreen from "../../Components/SplashScreen";

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
  const [isKycPopOpen, setIsKycPopOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  // ✅ Check verification status from user object
  const isTier1Verified = user?.isVerified1 === true;
  const isTier2Verified = user?.isVerified2 === true;

  // ✅ Determine current tier
  const currentTier = user?.tier || 1;

  // ✅ Log user state for debugging
  useEffect(() => {
    console.log("🔵 Current User State:", {
      tier: user?.tier,
      isVerified1: user?.isVerified1,
      isVerified2: user?.isVerified2,
      user,
    });
  }, [user]);

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

  const handleLogoutConfirm = () => {
    try {
      setIsLogoutOpen(false);
      setShowSplash(true);

      setTimeout(() => {
        dispatch(logout());
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        sessionStorage.clear();
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Logout Error: ", error);
      toast.error("An error occurred during logout");
    }
  };

  // Handle Tier 1 KYC popup open
  const handleKycPopOpen = () => {
    setIsKycPopOpen(true);
  };

  // Handle Tier 1 KYC popup close
  const handleKycPopClose = () => {
    setIsKycPopOpen(false);
  };

  // ✅ Handle KYC modal close - refresh user data
  const handleKycModalClose = () => {
    setIsKycOpen(false);
  };

  // ✅ Get the display tier text
  const getTierDisplay = () => {
    if (isTier2Verified) {
      return "Tier 2";
    } else if (isTier1Verified) {
      return "Tier 1";
    } else {
      return "Tier 0";
    }
  };

  // ✅ Get the tier color
  const getTierColor = () => {
    if (isTier2Verified) {
      return "#10b981"; // Green for Tier 2
    } else if (isTier1Verified) {
      return "#e8b943"; // Gold for Tier 1
    } else {
      return "#dc2626"; // Red for Tier 0
    }
  };

  // ✅ Check if Tier 1 is clickable (only when not verified)
  const isTier1Clickable = !isTier1Verified && !isTier2Verified;

  // ✅ Check if upgrade to tier 2 should be shown
  const showUpgradeToTier2 = !isTier2Verified;

  return (
    <>
      {showSplash && <SplashScreen />}

      <div className="profile-page-container">
        {/* DESKTOP HEADER */}
        <div className="profile-header">
          <h1>Account</h1>
        </div>

        {/* MOBILE HEADER */}
        <div className="profile-header-mobile-view-mood">
          <h2>Account</h2>
          <nav className="signout-mobile" onClick={() => setIsLogoutOpen(true)}>
            Signout
            <PiSignOutBold size={16} />
          </nav>
        </div>

        {/* HORIZONTAL SWIPABLE TAB CONTAINER */}
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
              <div className="edit-btn-container">
                {!isEditing && (
                  <button
                    type="button"
                    className="edit-profile-trigger-btn"
                    onClick={() => setIsEditing(true)}
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
                      <div className="loader-wrapper">
                        <OrbitProgress color="#fff" size="small" />
                      </div>
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
                      <span
                        className="tier-text"
                        style={{
                          color: getTierColor(),
                          fontWeight: "600",
                          cursor: isTier1Clickable ? "pointer" : "default",
                          textDecoration: isTier1Clickable
                            ? "underline"
                            : "none",
                        }}
                        onClick={
                          isTier1Clickable ? handleKycPopOpen : undefined
                        }
                      >
                        {getTierDisplay()}
                      </span>
                    </span>

                    {/* ✅ Show Upgrade To Tier 2 only if not already Tier 2 */}
                    {showUpgradeToTier2 && (
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
                    )}
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
                  <div className="form-actions-row">
                    <button
                      type="submit"
                      className="save-changes-btn"
                      disabled={isLoading}
                      style={{ opacity: isLoading ? 0.5 : 1 }}
                    >
                      {isLoading ? (
                        <div className="loader-wrapper">
                          <OrbitProgress color="#fff" size="small" />
                        </div>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                    <button
                      type="button"
                      className="cancel-profile-btn"
                      onClick={handleCancel}
                      disabled={isLoading}
                      style={{ opacity: isLoading ? 0.5 : 1 }}
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
            <SettingView accounts={linkedAccounts} />
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
                    <MdOutlineWorkspacePremium />
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
                      style={{ cursor: "pointer" }}
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
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate("/policy")}
                    >
                      Read more &gt;
                    </span>
                  </div>
                </div>

                <div className="info-card">
                  <h3>Privacy policy</h3>
                  <p>
                    How we collect, use and protect your personal data,
                    including KYC information and transaction history.
                  </p>
                  <div className="card-links">
                    <span
                      className="action-link"
                      style={{ cursor: "pointer" }}
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
                      style={{ cursor: "pointer" }}
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

        <KycModalManager isOpen={isKycOpen} onClose={handleKycModalClose} />

        <KycpopModal isOpen={isKycPopOpen} onClose={handleKycPopClose} />

        <SignoutModal
          isOpen={isLogoutOpen}
          onClose={() => setIsLogoutOpen(false)}
          onConfirm={handleLogoutConfirm}
        />
      </div>
    </>
  );
};

export default ProfilePage;

// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../../Style/ProfilePage.css";
// import SettingView from "./SettingView";
// import { CgProfile } from "react-icons/cg";
// import { IoSettingsOutline } from "react-icons/io5";
// import { TfiHeadphoneAlt } from "react-icons/tfi";
// import { GiInjustice } from "react-icons/gi";
// import { MdPhotoCamera } from "react-icons/md";
// import { FiEdit2, FiMail, FiAlertTriangle } from "react-icons/fi";
// import { MdOutlineWorkspacePremium } from "react-icons/md";
// import { useSelector, useDispatch } from "react-redux";
// import toast from "react-hot-toast";
// import { updateProfile } from "../../Services/authService";
// import { OrbitProgress } from "react-loading-indicators";
// import { updateUser, logout } from "../../Store/UserSlice";
// import { PiSignOutBold } from "react-icons/pi";
// import KycModalManager from "../../Components/KycModals/KycModalManager";
// import KycpopModal from "../../Components/KycModals/KycpopModal";
// import SignoutModal from "../../Components/KycModals/SignoutModal";
// import SplashScreen from "../../Components/SplashScreen";

// const ProfilePage = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { token, user } = useSelector((state) => state.user);
//   const fileInputRef = useRef(null);

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     phoneNumber: "",
//     email: "",
//   });

//   const [activeTab, setActiveTab] = useState("profile");
//   const [linkedAccounts, setLinkedAccounts] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState("");

//   const [isKycOpen, setIsKycOpen] = useState(false);
//   const [isKycPopOpen, setIsKycPopOpen] = useState(false);
//   const [isLogoutOpen, setIsLogoutOpen] = useState(false);
//   const [showSplash, setShowSplash] = useState(false);

//   // Check if Tier 1 verification is complete
//   const isTier1Verified = user?.isVerified1 === true;

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         phoneNumber: user.phoneNumber || "",
//         email: user.email || "",
//       });

//       if (user.profilePicture?.url) {
//         setPreviewUrl(user.profilePicture.url);
//       } else {
//         setPreviewUrl("");
//       }
//     }
//   }, [user]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCameraClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) {
//         toast.error("Image must be less than 2MB");
//         return;
//       }
//       setProfilePicture(file);
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   const handleSaveProfile = async (e) => {
//     e.preventDefault();
//     try {
//       setIsLoading(true);
//       const profileFormData = new FormData();
//       profileFormData.append("phoneNumber", formData.phoneNumber);

//       if (profilePicture) {
//         profileFormData.append("profilePicture", profilePicture);
//       }

//       const response = await updateProfile(profileFormData, token);
//       dispatch(updateUser(response.data || response));

//       toast.success(response.message || "Profile updated successfully");
//       setIsEditing(false);
//       setProfilePicture(null);
//     } catch (error) {
//       console.log(error);
//       toast.error(error?.response?.data?.message || "Failed to update profile");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setFormData({
//       firstName: user?.firstName || "",
//       lastName: user?.lastName || "",
//       phoneNumber: user?.phoneNumber || "",
//       email: user?.email || "",
//     });
//     setPreviewUrl(user?.profilePicture?.url || "");
//     setProfilePicture(null);
//     setIsEditing(false);
//   };

//   const handleLogoutConfirm = () => {
//     try {
//       setIsLogoutOpen(false);
//       setShowSplash(true);

//       setTimeout(() => {
//         dispatch(logout());
//         localStorage.removeItem("authToken");
//         localStorage.removeItem("user");
//         sessionStorage.clear();
//         navigate("/");
//       }, 2000);
//     } catch (error) {
//       console.error("Logout Error: ", error);
//       toast.error("An error occurred during logout");
//     }
//   };

//   // Handle Tier 1 KYC popup open
//   const handleKycPopOpen = () => {
//     setIsKycPopOpen(true);
//   };

//   // Handle Tier 1 KYC popup close
//   const handleKycPopClose = () => {
//     setIsKycPopOpen(false);
//   };

//   return (
//     <>
//       {showSplash && <SplashScreen />}

//       <div className="profile-page-container">
//         {/* DESKTOP HEADER */}
//         <div className="profile-header">
//           <h1>Account</h1>
//         </div>

//         {/* MOBILE HEADER */}
//         <div className="profile-header-mobile-view-mood">
//           <h2>Account</h2>
//           <nav className="signout-mobile" onClick={() => setIsLogoutOpen(true)}>
//             Signout
//             <PiSignOutBold size={16} />
//           </nav>
//         </div>

//         {/* HORIZONTAL SWIPABLE TAB CONTAINER */}
//         <div className="profile-tabs-container">
//           <button
//             className={`profile-tab-btn ${activeTab === "profile" ? "active" : ""}`}
//             onClick={() => setActiveTab("profile")}
//           >
//             <CgProfile className="tab-icon" /> Profile
//           </button>
//           <button
//             className={`profile-tab-btn ${activeTab === "settings" ? "active" : ""}`}
//             onClick={() => setActiveTab("settings")}
//           >
//             <IoSettingsOutline className="tab-icon" /> Settings
//           </button>
//           <button
//             className={`profile-tab-btn ${activeTab === "support" ? "active" : ""}`}
//             onClick={() => setActiveTab("support")}
//           >
//             <TfiHeadphoneAlt className="tab-icon" /> Help & Support
//           </button>
//           <button
//             className={`profile-tab-btn ${activeTab === "legal" ? "active" : ""}`}
//             onClick={() => setActiveTab("legal")}
//           >
//             <GiInjustice className="tab-icon" /> Legal & Compliance
//           </button>
//         </div>

//         <div className="account-view-content-driver">
//           {/* PROFILE TAB */}
//           {activeTab === "profile" && (
//             <div className="profile-content-card">
//               {/* MARQUEE TAG - RED TEXT */}
//               {/* <marquee
//                 behavior="scroll"
//                 direction="left"
//                 scrollamount="5"
//                 style={{
//                   color: "#dc2626",
//                   fontSize: "14px",
//                   fontWeight: "500",
//                   padding: "8px 0",
//                   marginBottom: "16px",
//                   background: "#fef2f2",
//                   borderRadius: "6px",
//                   border: "1px solid #fca5a5",
//                 }}
//               >
//                 This is a testing account. To use the app fully, kindly verify
//                 your Tier 1 KYC.
//               </marquee> */}

//               <div className="edit-btn-container">
//                 {!isEditing && (
//                   <button
//                     type="button"
//                     className="edit-profile-trigger-btn"
//                     onClick={() => setIsEditing(true)}
//                   >
//                     <FiEdit2 /> Edit Profile
//                   </button>
//                 )}
//               </div>

//               <div className="user-info-section">
//                 <div className="avatar-wrapper">
//                   <div className="avatar-circle">
//                     {previewUrl ? (
//                       <img src={previewUrl} alt="User Avatar" />
//                     ) : (
//                       <div className="loader-wrapper">
//                         <OrbitProgress color="#fff" size="small" />
//                       </div>
//                     )}
//                   </div>

//                   <input
//                     type="file"
//                     accept="image/*"
//                     ref={fileInputRef}
//                     onChange={handleFileChange}
//                     style={{ display: "none" }}
//                   />

//                   {isEditing && (
//                     <button
//                       type="button"
//                       className="camera-btn"
//                       title="Upload Photo"
//                       onClick={handleCameraClick}
//                     >
//                       <MdPhotoCamera size={18} color="black" />
//                     </button>
//                   )}
//                 </div>

//                 <div className="user-details">
//                   <h2>
//                     {user?.firstName} {user?.lastName}
//                   </h2>
//                   <p className="user-email-text">{user?.email}</p>
//                   <div className="kyc-badge-row">
//                     <span className="kyc-badge">
//                       KYC:{" "}
//                       {!isTier1Verified ? (
//                         <span
//                           className="tier-text"
//                           style={{
//                             color: "#dc2626",
//                             fontWeight: "600",
//                             cursor: "pointer",
//                             textDecoration: "underline",
//                           }}
//                           onClick={handleKycPopOpen}
//                         >
//                           Tier 1
//                         </span>
//                       ) : (
//                         <span
//                           className="tier-text"
//                           style={{ color: "#e8b943", fontWeight: "600" }}
//                         >
//                           Tier 1
//                         </span>
//                       )}
//                     </span>

//                     <a
//                       href="#upgrade"
//                       className="upgrade-link"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         setIsKycOpen(true);
//                       }}
//                     >
//                       Upgrade To Tier 2
//                     </a>
//                   </div>
//                 </div>
//               </div>

//               <form className="profile-edit-form" onSubmit={handleSaveProfile}>
//                 <div className="form-grid">
//                   <div className="input-group">
//                     <label>First Name</label>
//                     <input
//                       type="text"
//                       value={user?.firstName || ""}
//                       disabled
//                       className="readonly-input"
//                     />
//                   </div>
//                   <div className="input-group">
//                     <label>Last Name</label>
//                     <input
//                       type="text"
//                       value={user?.lastName || ""}
//                       disabled
//                       className="readonly-input"
//                     />
//                   </div>
//                   <div className="input-group">
//                     <label>Phone Number</label>
//                     <input
//                       type="tel"
//                       name="phoneNumber"
//                       value={formData.phoneNumber}
//                       onChange={handleInputChange}
//                       disabled={!isEditing}
//                     />
//                   </div>
//                   <div className="input-group">
//                     <label>Email Address</label>
//                     <input
//                       type="email"
//                       value={user?.email || ""}
//                       disabled
//                       className="readonly-input"
//                     />
//                   </div>
//                 </div>

//                 {isEditing && (
//                   <div className="form-actions-row">
//                     <button
//                       type="submit"
//                       className="save-changes-btn"
//                       disabled={isLoading}
//                       style={{ opacity: isLoading ? 0.5 : 1 }}
//                     >
//                       {isLoading ? (
//                         <div className="loader-wrapper">
//                           <OrbitProgress color="#fff" size="small" />
//                         </div>
//                       ) : (
//                         "Save Changes"
//                       )}
//                     </button>
//                     <button
//                       type="button"
//                       className="cancel-profile-btn"
//                       onClick={handleCancel}
//                       disabled={isLoading}
//                       style={{ opacity: isLoading ? 0.5 : 1 }}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 )}
//               </form>
//             </div>
//           )}

//           {/* SETTINGS TAB */}
//           {activeTab === "settings" && (
//             <SettingView accounts={linkedAccounts} />
//           )}

//           {/* HELP & SUPPORT TAB */}
//           {activeTab === "support" && (
//             <div className="profile-content-card">
//               <div className="info-cards-grid">
//                 <div className="info-card">
//                   <div className="icon-wrapper email-icon">
//                     <FiMail />
//                   </div>
//                   <h3>Email Support</h3>
//                   <p>Replies within 4 hours</p>
//                   <div className="card-links">
//                     <a href="mailto:hello.hedgenest@gmail.com">
//                       hello.hedgenest@gmail.com
//                     </a>
//                     <a href="mailto:info.hedgenest@gmail.com">
//                       info.hedgenest@gmail.com
//                     </a>
//                   </div>
//                 </div>

//                 <div className="info-card">
//                   <div className="icon-wrapper wa-icon">
//                     <MdOutlineWorkspacePremium />
//                   </div>
//                   <h3>WhatsApp Support</h3>
//                   <p>Chat with our team</p>
//                   <div className="card-links">
//                     <a
//                       href="https://wa.me/2347047180205"
//                       target="_blank"
//                       rel="noreferrer"
//                     >
//                       +2347047180205
//                     </a>
//                     <a
//                       href="https://wa.me/2347063958038"
//                       target="_blank"
//                       rel="noreferrer"
//                     >
//                       +2347063958038
//                     </a>
//                   </div>
//                 </div>

//                 <div className="info-card">
//                   <div className="icon-wrapper alert-icon">
//                     <FiAlertTriangle />
//                   </div>
//                   <h3>Report a problem</h3>
//                   <p>Something's not right, let us know</p>
//                   <div className="card-links">
//                     <span
//                       className="action-link"
//                       style={{ cursor: "pointer" }}
//                       onClick={() => navigate("/contact")}
//                     >
//                       Open report form &gt;
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* LEGAL & COMPLIANCE TAB */}
//           {activeTab === "legal" && (
//             <div className="profile-content-card">
//               <div className="info-cards-grid">
//                 <div className="info-card">
//                   <h3>Terms of service</h3>
//                   <p>
//                     The rules and obligations that govern your use of HedgeNest,
//                     including account responsibilities, fees, and dispute
//                     resolution.
//                   </p>
//                   <div className="card-links">
//                     <span
//                       className="action-link"
//                       style={{ cursor: "pointer" }}
//                       onClick={() => navigate("/policy")}
//                     >
//                       Read more &gt;
//                     </span>
//                   </div>
//                 </div>

//                 <div className="info-card">
//                   <h3>Privacy policy</h3>
//                   <p>
//                     How we collect, use and protect your personal data,
//                     including KYC information and transaction history.
//                   </p>
//                   <div className="card-links">
//                     <span
//                       className="action-link"
//                       style={{ cursor: "pointer" }}
//                       onClick={() => navigate("/policy")}
//                     >
//                       Read more &gt;
//                     </span>
//                   </div>
//                 </div>

//                 <div className="info-card">
//                   <h3>Regulatory Information</h3>
//                   <p>
//                     HedgeNest operates with licensed partners and complies with
//                     Nigerian financial regulations.
//                   </p>
//                   <div className="card-links">
//                     <span
//                       className="action-link"
//                       style={{ cursor: "pointer" }}
//                       onClick={() => navigate("/policy")}
//                     >
//                       Read more &gt;
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         <KycModalManager
//           isOpen={isKycOpen}
//           onClose={() => setIsKycOpen(false)}
//         />

//         <KycpopModal isOpen={isKycPopOpen} onClose={handleKycPopClose} />

//         <SignoutModal
//           isOpen={isLogoutOpen}
//           onClose={() => setIsLogoutOpen(false)}
//           onConfirm={handleLogoutConfirm}
//         />
//       </div>
//     </>
//   );
// };

// export default ProfilePage;
