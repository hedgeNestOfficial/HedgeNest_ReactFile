import React, { useState } from "react";
import "../../Style/ProfilePage.css";

const ProfilePage = () => {
  // State to hold form data, making it ready for API integration
  const [formData, setFormData] = useState({
    firstName: "Michael",
    lastName: "Promise",
    phone: "08073782933",
    email: "hello.hedgenest@gmail.com",
  });

  const [activeTab, setActiveTab] = useState("profile");

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
          <span className="tab-icon">👤</span> Profile
        </button>
        <button
          className={`profile-tab-btn ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <span className="tab-icon">⚙️</span> Settings
        </button>
        <button
          className={`profile-tab-btn ${activeTab === "support" ? "active" : ""}`}
          onClick={() => setActiveTab("support")}
        >
          <span className="tab-icon">🎧</span> Help & Support
        </button>
        <button
          className={`profile-tab-btn ${activeTab === "legal" ? "active" : ""}`}
          onClick={() => setActiveTab("legal")}
        >
          <span className="tab-icon">⚖️</span> Legal & Compliance
        </button>
      </div>

      {/* MAIN PROFILE CARD */}
      <div className="profile-content-card">
        {/* User Info Header */}
        <div className="user-info-section">
          <div className="avatar-wrapper">
            {/* Placeholder for actual image. You can replace src with user data */}
            <div className="avatar-circle">
              <img src="/src/assets/Micheal-B3vXSdq_.jpg" alt="User Avatar" />
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
    </div>
  );
};

export default ProfilePage;
