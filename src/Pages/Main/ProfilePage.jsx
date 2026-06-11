// // import React, { useState, useRef } from "react";
// // import "../../Style/ProfilePage.css";
// // import SettingView from "./SettingView";
// // import { CgProfile } from "react-icons/cg";
// // import { IoSettingsOutline } from "react-icons/io5";
// // import { TfiHeadphoneAlt } from "react-icons/tfi";
// // import { GiInjustice } from "react-icons/gi";
// // import { MdPhotoCamera } from "react-icons/md";
// // import { FiEdit2 } from "react-icons/fi";
// // import { useSelector, useDispatch } from "react-redux";
// // import toast from "react-hot-toast";
// // import { updateProfile } from "../../Services/authService";
// // import { OrbitProgress } from "react-loading-indicators";
// // import { updateUser } from "../../Store/userSlice"; // Adjust path if needed

// // const ProfilePage = () => {
// //   const dispatch = useDispatch();
// //   const { token, user } = useSelector((state) => state.user);
// //   const fileInputRef = useRef(null);

// //   // Initialize with actual user data, no dummy defaults
// //   const [formData, setFormData] = useState({
// //     firstName: user?.firstName || "",
// //     lastName: user?.lastName || "",
// //     phoneNumber: user?.phoneNumber || "",
// //     email: user?.email || "",
// //   });

// //   const [activeTab, setActiveTab] = useState("profile");
// //   const [linkedAccounts, setLinkedAccounts] = useState([]);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [profilePicture, setProfilePicture] = useState(null);

// //   // Use the cloud URL if it exists on the user object, else fallback to empty/placeholder
// //   const [previewUrl, setPreviewUrl] = useState(user?.profilePicture?.url || "");

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData((prev) => ({ ...prev, [name]: value }));
// //   };

// //   const handleCameraClick = () => {
// //     fileInputRef.current.click();
// //   };

// //   const handleFileChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       if (file.size > 2 * 1024 * 1024) {
// //         toast.error("Image must be less than 2MB");
// //         return;
// //       }
// //       setProfilePicture(file);
// //       setPreviewUrl(URL.createObjectURL(file));
// //     }
// //   };

// //   const handleSaveProfile = async (e) => {
// //     e.preventDefault();

// //     if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
// //       toast.error("Please fill in all required fields.");
// //       return;
// //     }

// //     setIsLoading(true);

// //     try {
// //       const data = new FormData();
// //       data.append("firstName", formData.firstName);
// //       data.append("lastName", formData.lastName);
// //       data.append("phoneNumber", formData.phoneNumber);

// //       if (profilePicture) {
// //         data.append("profilePicture", profilePicture);
// //       }

// //       const response = await updateProfile(data, token);

// //       // Update global Redux state with the returned user object from your API
// //       // Assuming your backend returns the user object inside response.data based on Swagger
// //       const updatedUserData = response.data || response;
// //       dispatch(updateUser(updatedUserData));

// //       toast.success(response.message || "Profile updated successfully!");
// //       setIsEditing(false);
// //     } catch (error) {
// //       console.log(error);
// //       toast.error(error?.response?.data?.message || "Failed to update profile");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="profile-page-container">
// //       <div className="profile-header">
// //         <h1>Account</h1>
// //       </div>

// //       <div className="profile-tabs-container">
// //         <button
// //           className={`profile-tab-btn ${activeTab === "profile" ? "active" : ""}`}
// //           onClick={() => setActiveTab("profile")}
// //         >
// //           <CgProfile className="tab-icon" /> Profile
// //         </button>
// //         <button
// //           className={`profile-tab-btn ${activeTab === "settings" ? "active" : ""}`}
// //           onClick={() => setActiveTab("settings")}
// //         >
// //           <IoSettingsOutline className="tab-icon" /> Settings
// //         </button>
// //         <button
// //           className={`profile-tab-btn ${activeTab === "support" ? "active" : ""}`}
// //           onClick={() => setActiveTab("support")}
// //         >
// //           <TfiHeadphoneAlt className="tab-icon" /> Help & Support
// //         </button>
// //         <button
// //           className={`profile-tab-btn ${activeTab === "legal" ? "active" : ""}`}
// //           onClick={() => setActiveTab("legal")}
// //         >
// //           <GiInjustice className="tab-icon" /> Legal & Compliance
// //         </button>
// //       </div>

// //       <div className="account-view-content-driver">
// //         {activeTab === "profile" && (
// //           <div className="profile-content-card">
// //             {/* Action Bar for Edit Button */}
// //             <div
// //               style={{
// //                 display: "flex",
// //                 justifyContent: "flex-end",
// //                 marginBottom: "10px",
// //               }}
// //             >
// //               {!isEditing && (
// //                 <button
// //                   type="button"
// //                   onClick={() => setIsEditing(true)}
// //                   style={{
// //                     display: "flex",
// //                     alignItems: "center",
// //                     justifyContent: "center",
// //                     gap: "8px",
// //                     textAlign: "center",
// //                     padding: "8px 8px",
// //                     borderRadius: "4px",
// //                     border: "1px solid #ccc",
// //                     background: "transparent",
// //                     cursor: "pointer",
// //                     fontWeight: "600",
// //                     color: "black",
// //                   }}
// //                 >
// //                   <FiEdit2 /> Edit Profile
// //                 </button>
// //               )}
// //             </div>

// //             <div className="user-info-section">
// //               <div className="avatar-wrapper">
// //                 <div className="avatar-circle">
// //                   {previewUrl ? (
// //                      <img src={previewUrl} alt="User Avatar" />
// //                   ) : (
// //                      <CgProfile size={50} color="#ccc" /> // Fallback icon if no picture
// //                   )}
// //                 </div>

// //                 <input
// //                   type="file"
// //                   accept="image/*"
// //                   ref={fileInputRef}
// //                   onChange={handleFileChange}
// //                   style={{ display: "none" }}
// //                 />

// //                 {isEditing && (
// //                   <button
// //                     type="button"
// //                     className="camera-btn"
// //                     title="Upload Photo"
// //                     onClick={handleCameraClick}
// //                   >
// //                     <MdPhotoCamera size={18} color="black" />
// //                   </button>
// //                 )}
// //               </div>

// //               <div className="user-details">
// //                 <h2>
// //                   {user?.firstName} {user?.lastName}
// //                 </h2>
// //                 <p className="user-email-text">{user?.email}</p>
// //                 <div className="kyc-badge-row">
// //                   <span className="kyc-badge">
// //                     KYC: <span className="tier-text">Tier {user?.tier || 1}</span>
// //                   </span>
// //                   <a href="#upgrade" className="upgrade-link">
// //                     Upgrade To Tier 2
// //                   </a>
// //                 </div>
// //               </div>
// //             </div>

// //             <form className="profile-edit-form" onSubmit={handleSaveProfile}>
// //               <div className="form-grid">
// //                 <div className="input-group">
// //                   <label>First Name</label>
// //                   <input
// //                     type="text"
// //                     name="firstName"
// //                     value={formData.firstName}
// //                     onChange={handleInputChange}
// //                     disabled={!isEditing}
// //                   />
// //                 </div>
// //                 <div className="input-group">
// //                   <label>Last Name</label>
// //                   <input
// //                     type="text"
// //                     name="lastName"
// //                     value={formData.lastName}
// //                     onChange={handleInputChange}
// //                     disabled={!isEditing}
// //                   />
// //                 </div>
// //                 <div className="input-group">
// //                   <label>Phone number</label>
// //                   <input
// //                     type="tel"
// //                     name="phoneNumber"
// //                     value={formData.phoneNumber}
// //                     onChange={handleInputChange}
// //                     disabled={!isEditing}
// //                   />
// //                 </div>
// //                 <div className="input-group">
// //                   <label>Email address</label>
// //                   <input
// //                     type="email"
// //                     name="email"
// //                     value={formData.email}
// //                     disabled
// //                   />
// //                 </div>
// //               </div>

// //               <button
// //                 type="submit"
// //                 className="save-changes-btn"
// //                 disabled={!isEditing || isLoading}
// //                 style={{
// //                   opacity: !isEditing ? 0.5 : 1,
// //                   cursor: !isEditing ? "not-allowed" : "pointer",
// //                 }}
// //               >
// //                 {isLoading ? (
// //                   <OrbitProgress color="#ffffff" size="small" />
// //                 ) : (
// //                   "Save Changes"
// //                 )}
// //               </button>
// //             </form>
// //           </div>
// //         )}

// //         {activeTab === "settings" && (
// //           <SettingView
// //             accounts={linkedAccounts}
// //             onAddAccount={() => console.log("Open Add Account")}
// //           />
// //         )}

// //         {(activeTab === "support" || activeTab === "legal") && (
// //           <div className="profile-content-card">
// //             <p
// //               style={{
// //                 color: "#6b7280",
// //                 textAlign: "center",
// //                 padding: "20px 0",
// //               }}
// //             >
// //               Content coming soon...
// //             </p>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProfilePage;

// import React, { useState, useRef, useEffect } from "react";
// import "../../Style/ProfilePage.css";
// import SettingView from "./SettingView";
// import { CgProfile } from "react-icons/cg";
// import { IoSettingsOutline } from "react-icons/io5";
// import { TfiHeadphoneAlt } from "react-icons/tfi";
// import { GiInjustice } from "react-icons/gi";
// import { MdPhotoCamera } from "react-icons/md";
// import { FiEdit2 } from "react-icons/fi";
// import { useSelector, useDispatch } from "react-redux";
// import toast from "react-hot-toast";
// import { updateProfile } from "../../Services/authService";
// import { OrbitProgress } from "react-loading-indicators";
// import { updateUser } from "../../Store/userSlice";

// const ProfilePage = () => {
//   const dispatch = useDispatch();
//   const { token, user } = useSelector((state) => state.user);
//   const fileInputRef = useRef(null);

//   // Initialize empty state fields to safely wait for Redux rehydration
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

//   // Sync state automatically whenever the Redux user object initializes or changes
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
//     if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
//       toast.error("Please fill in all required fields.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const data = new FormData();
//       data.append("firstName", formData.firstName);
//       data.append("lastName", formData.lastName);
//       data.append("phoneNumber", formData.phoneNumber);
//       if (profilePicture) {
//         data.append("profilePicture", profilePicture);
//       }

//       const response = await updateProfile(data, token);

//       // Inspect this log in your browser DevTools to see your exact backend schema response
//       console.log("Backend Update Response:", response);

//       // Safely check how data is layered within your axios/fetch instance
//       const updatedUserData = response.user || response.data || response;

//       dispatch(updateUser(updatedUserData));
//       toast.success("Profile updated successfully!");
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Profile update error details:", error);
//       toast.error(error?.response?.data?.message || "Failed to update profile");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="profile-page-container">
//       <div className="profile-header">
//         <h1>Account</h1>
//       </div>

//       <div className="profile-tabs-container">
//         <button
//           className={`profile-tab-btn ${activeTab === "profile" ? "active" : ""}`}
//           onClick={() => setActiveTab("profile")}
//         >
//           <CgProfile className="tab-icon" /> Profile
//         </button>
//         <button
//           className={`profile-tab-btn ${activeTab === "settings" ? "active" : ""}`}
//           onClick={() => setActiveTab("settings")}
//         >
//           <IoSettingsOutline className="tab-icon" /> Settings
//         </button>
//         <button
//           className={`profile-tab-btn ${activeTab === "support" ? "active" : ""}`}
//           onClick={() => setActiveTab("support")}
//         >
//           <TfiHeadphoneAlt className="tab-icon" /> Help & Support
//         </button>
//         <button
//           className={`profile-tab-btn ${activeTab === "legal" ? "active" : ""}`}
//           onClick={() => setActiveTab("legal")}
//         >
//           <GiInjustice className="tab-icon" /> Legal & Compliance
//         </button>
//       </div>

//       <div className="account-view-content-driver">
//         {activeTab === "profile" && (
//           <div className="profile-content-card">
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 marginBottom: "10px",
//               }}
//             >
//               {!isEditing && (
//                 <button
//                   type="button"
//                   onClick={() => setIsEditing(true)}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: "8px",
//                     textAlign: "center",
//                     padding: "8px 8px",
//                     borderRadius: "4px",
//                     border: "1px solid #ccc",
//                     background: "transparent",
//                     cursor: "pointer",
//                     fontWeight: "600",
//                     color: "black",
//                   }}
//                 >
//                   <FiEdit2 /> Edit Profile
//                 </button>
//               )}
//             </div>

//             <div className="user-info-section">
//               <div className="avatar-wrapper">
//                 <div className="avatar-circle">
//                   {previewUrl ? (
//                     <img src={previewUrl} alt="User Avatar" />
//                   ) : (
//                     <CgProfile size={50} color="#ccc" />
//                   )}
//                 </div>

//                 <input
//                   type="file"
//                   accept="image/*"
//                   ref={fileInputRef}
//                   onChange={handleFileChange}
//                   style={{ display: "none" }}
//                 />

//                 {isEditing && (
//                   <button
//                     type="button"
//                     className="camera-btn"
//                     title="Upload Photo"
//                     onClick={handleCameraClick}
//                   >
//                     <MdPhotoCamera size={18} color="black" />
//                   </button>
//                 )}
//               </div>

//               <div className="user-details">
//                 <h2>
//                   {user?.firstName} {user?.lastName}
//                 </h2>
//                 <p className="user-email-text">{user?.email}</p>
//                 <div className="kyc-badge-row">
//                   <span className="kyc-badge">
//                     KYC:{" "}
//                     <span className="tier-text">Tier {user?.tier || 1}</span>
//                   </span>
//                   <a href="#upgrade" className="upgrade-link">
//                     Upgrade To Tier 2
//                   </a>
//                 </div>
//               </div>
//             </div>

//             <form className="profile-edit-form" onSubmit={handleSaveProfile}>
//               <div className="form-grid">
//                 <div className="input-group">
//                   <label>First Name</label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleInputChange}
//                     disabled={!isEditing}
//                   />
//                 </div>
//                 <div className="input-group">
//                   <label>Last Name</label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={formData.lastName}
//                     onChange={handleInputChange}
//                     disabled={!isEditing}
//                   />
//                 </div>
//                 <div className="input-group">
//                   <label>Phone number</label>
//                   <input
//                     type="tel"
//                     name="phoneNumber"
//                     value={formData.phoneNumber}
//                     onChange={handleInputChange}
//                     disabled={!isEditing}
//                   />
//                 </div>
//                 <div className="input-group">
//                   <label>Email address</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     disabled
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="save-changes-btn"
//                 disabled={!isEditing || isLoading}
//                 style={{
//                   opacity: !isEditing ? 0.5 : 1,
//                   cursor: !isEditing ? "not-allowed" : "pointer",
//                 }}
//               >
//                 {isLoading ? (
//                   <OrbitProgress color="#ffffff" size="small" />
//                 ) : (
//                   "Save Changes"
//                 )}
//               </button>
//             </form>
//           </div>
//         )}

//         {activeTab === "settings" && (
//           <SettingView
//             accounts={linkedAccounts}
//             onAddAccount={() => console.log("Open Add Account")}
//           />
//         )}

//         {(activeTab === "support" || activeTab === "legal") && (
//           <div className="profile-content-card">
//             <p
//               style={{
//                 color: "#6b7280",
//                 textAlign: "center",
//                 padding: "20px 0",
//               }}
//             >
//               Content coming soon...
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useState, useRef, useEffect } from "react";
import "../../Style/ProfilePage.css";
import SettingView from "./SettingView";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { GiInjustice } from "react-icons/gi";
import { MdPhotoCamera } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { updateProfile } from "../../Services/authService";
import { OrbitProgress } from "react-loading-indicators";
import { updateUser } from "../../Store/userSlice";

// Import your exact 4-step modal manager from yesterday
import KycModalManager from "../../Components/KycModals/KycModalManager";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.user);
  const fileInputRef = useRef(null);

  // Initialize empty state fields to safely wait for Redux rehydration
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

  // Control state for your KYC popup canvas layer
  const [isKycOpen, setIsKycOpen] = useState(false);

  // Sync state automatically whenever the Redux user object initializes or changes
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

  // FIXED: Moved handleFileChange to the top-level scope of the component
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
      profileFormData.append("firstName", formData.firstName);
      profileFormData.append("lastName", formData.lastName);
      profileFormData.append("phoneNumber", formData.phoneNumber);

      if (profilePicture) {
        profileFormData.append("profilePicture", profilePicture);
      }

      const response = await updateProfile(profileFormData, token);

      // Log to inspect exact backend response structure
      console.log("🔍 Backend Response:", response);

      // Extract user object from various possible backend response structures
      const responseData = response?.data || response?.user || response;

      const normalizedUser = {
        ...responseData,
        profilePicture: responseData.profilePicture?.url || null,
      };

      dispatch(updateUser(normalizedUser));

      console.log("✅ Extracted User Data:", updatedUserData);

      dispatch(updateUser(updatedUserData));
      toast.success(response.message || "Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original user data
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phoneNumber: user?.phoneNumber || "",
      email: user?.email || "",
    });
    // Reset preview to original profile picture
    setPreviewUrl(user?.profilePicture?.url || "");
    // Clear any pending profile picture upload
    setProfilePicture(null);
    // Exit edit mode
    setIsEditing(false);
  };

  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <h1>Account</h1>
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
                    padding: "8px 8px",
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
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="input-group">
                  <label>Phone number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="input-group">
                  <label>Email address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
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

        {activeTab === "settings" && (
          <SettingView
            accounts={linkedAccounts}
            onAddAccount={() => console.log("Open Add Account")}
          />
        )}

        {(activeTab === "support" || activeTab === "legal") && (
          <div className="profile-content-card">
            <p
              style={{
                color: "#6b7280",
                textAlign: "center",
                padding: "20px 0",
              }}
            >
              Content coming soon...
            </p>
          </div>
        )}
      </div>

      {/* Rendered cleanly on top without layout shifts */}
      <KycModalManager isOpen={isKycOpen} onClose={() => setIsKycOpen(false)} />
    </div>
  );
};

export default ProfilePage;
