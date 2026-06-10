import React, { useState } from "react";
import "../../Style/ProfilePage.css";
// IMPORT FIX: Pulling SettingView from the same Main folder
import SettingView from "./SettingView";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { GiInjustice } from "react-icons/gi";

const ProfilePage = () => {
  // State to hold form data, making it ready for API integration
  const [formData, setFormData] = useState({
    firstName: "Michael",
    lastName: "Promise",
    phone: "08073782933",
    email: "hello.hedgenest@gmail.com",
  });

  // Controls which view is currently active
  const [activeTab, setActiveTab] = useState("profile");

  // State placeholder for linked bank accounts (ready for your API later)
  const [linkedAccounts, setLinkedAccounts] = useState([]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission (Ready for your API call)
  const handleSaveProfile = (e) => {
    e.preventDefault();
    console.log("Submitting to API...", formData);
    // Add your fetch/axios logic here
  };

  const handleAddAccountClick = () => {
    console.log("Open Add Account Modal or trigger API flow");
  };

  return (
    <div className="profile-page-container">
      <div className="profile-header">
        <h1>Account</h1>
      </div>

      {/* TABS NAVIGATION */}
      <div className="profile-tabs-container">
        <button
          className={`profile-tab-btn ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          {/* <span> */}
          <CgProfile className="tab-icon" />
          {/* </span>{" "} */}
          Profile
        </button>
        <button
          className={`profile-tab-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          {/* <span */}
          {/* // style={{textAlign="center"}} */}
          {/* > */}
          <IoSettingsOutline className="tab-icon" />
          {/* </span>{" "} */}
          Settings
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

      {/* TOGGLED CONTENT ZONE */}
      <div className="account-view-content-driver">
        {/* VIEW 1: PROFILE FORM */}
        {activeTab === "profile" && (
          <div className="profile-content-card">
            {/* User Info Header */}
            <div className="user-info-section">
              <div className="avatar-wrapper">
                <div className="avatar-circle">
                  <img
                    src="/src/assets/Micheal-B3vXSdq_.jpg"
                    alt="User Avatar"
                  />
                </div>
                <button className="camera-btn" title="Upload Photo">
                  📷
                </button>
              </div>

              <div className="user-details">
                <h2>Abayomi Jeremiah</h2>
                <p className="user-email-text">hello.hedgenest@gmail.com</p>
                <div className="kyc-badge-row">
                  <span className="kyc-badge">
                    KYC: <span className="tier-text">Tier 1</span>
                  </span>
                  <a href="#upgrade" className="upgrade-link">
                    Upgrade To Tier 2
                  </a>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form className="profile-edit-form" onSubmit={handleSaveProfile}>
              <div className="form-grid">
                <div className="input-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Michael"
                  />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Promise"
                  />
                </div>
                <div className="input-group">
                  <label>Phone number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="08073782933"
                  />
                </div>
                <div className="input-group">
                  <label>Email address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="hello.hedgenest@gmail.com"
                  />
                </div>
              </div>

              <button type="submit" className="save-changes-btn">
                Save Changes
              </button>
            </form>
          </div>
        )}

        {/* VIEW 2: SETTINGS PANELS */}
        {activeTab === "settings" && (
          <SettingView
            accounts={linkedAccounts}
            onAddAccount={handleAddAccountClick}
          />
        )}

        {/* FALLBACK FOR UNFINISHED VIEWS */}
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
    </div>
  );
};

export default ProfilePage;
