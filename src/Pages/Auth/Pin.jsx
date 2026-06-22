// import React, { useRef, useState } from "react";
// import Signupimg from "../../assets/Signupimg.jpg";
// import { LuArrowLeft } from "react-icons/lu";
// import Button from "../../Components/Button";
// import "../../Style/Otp.css";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import {
//   useSelector,
//   useDispatch,
// } from "react-redux";
// import {
//   login,
//   clearTempUser,
// } from "../../Store/UserSlice";
// import { createPin } from "../../Services/authService";
// import whiteLogo from "../../assets/white logo.png";
// import { OrbitProgress } from "react-loading-indicators";

// const Pin = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const inputRefs = useRef([]);

//   const { tempUser } = useSelector((state) => state.user);
//   const onboardingToken = tempUser?.authToken;
//   const userEmail = tempUser?.email;

//   const [pin, setPin] = useState(["", "", "", "", "", ""]);
//   const [confirmPin, setConfirmPin] = useState(["", "", "", "", "", ""]);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleChange = (value, index, type) => {
//     if (!/^\d?$/.test(value)) return;

//     if (type === "pin") {
//       const updatedPin = [...pin];
//       updatedPin[index] = value;
//       setPin(updatedPin);
//     } else {
//       const updatedConfirmPin = [...confirmPin];
//       updatedConfirmPin[index] = value;
//       setConfirmPin(updatedConfirmPin);
//     }

//     if (value && index < 5) {
//       const nextRef =
//         type === "pin"
//           ? inputRefs.current[`pin-${index + 1}`]
//           : inputRefs.current[`confirm-${index + 1}`];

//       nextRef?.focus();
//     }
//   };

//   const handleKeyDown = (e, index, type) => {
//     const currentArray = type === "pin" ? pin : confirmPin;

//     if (e.key === "Backspace" && !currentArray[index] && index > 0) {
//       const prevRef =
//         type === "pin"
//           ? inputRefs.current[`pin-${index - 1}`]
//           : inputRefs.current[`confirm-${index - 1}`];

//       prevRef?.focus();
//     }
//   };

//   const handleSubmitPin = async (e) => {
//     e.preventDefault();

//     const pinCode = pin.join("");
//     const confirmPinCode = confirmPin.join("");

//     if (pinCode.length !== 6 || confirmPinCode.length !== 6) {
//       toast.error("PIN must be 6 digits");
//       return;
//     }

//     if (pinCode !== confirmPinCode) {
//       toast.error("PINs do not match");
//       return;
//     }

//     if (!onboardingToken || !userEmail) {
//       toast.error("Session expired. Please restart registration.");
//       return;
//     }

//     try {
//       setIsLoading(true);

//       const payload = {
//         email: userEmail,
//         transactionPin: pinCode,
//         confirmTransactionPin: confirmPinCode,
//       };

//       const response = await createPin(payload, onboardingToken);

//       toast.success(
//         response?.message || "Transaction PIN created successfully",
//       );

//       // Extract user data and token from response
//       // Adjust these keys if your backend returns a different structure
//       const userData = response?.user || response?.data || tempUser;
//       const sessionToken = response?.token || onboardingToken;
//       const walletData = response?.wallet || null;

//       // FIX: was dispatching setUser() which doesn't exist.
//       // Changed to login() which is the correct action in UserSlice
//       dispatch(
//         login({
//           user: userData,
//           wallet: walletData,
//           token: sessionToken,
//         }),
//       );

//       // IMPORTANT: Save to localStorage to enable redux-persist rehydration
//       // This mirrors what LoginPage.jsx does
//       localStorage.setItem("authToken", sessionToken);
//       localStorage.setItem("user", JSON.stringify(userData));
//       if (walletData) {
//         localStorage.setItem("wallet", JSON.stringify(walletData));
//       }

//       // Clean up onboarding temporary states
//       dispatch(clearTempUser());

//       setTimeout(() => {
//         navigate("/dashboard");
//       }, 1500);
//     } catch (error) {
//       console.log("PIN ERROR:", error);
//       toast.error(error?.response?.data?.message || "Failed to create PIN");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <section className="signup-section">
//       <div className="image-container">
//         <img src={Signupimg} alt="HedgeNest Protection Illustration" />
//         <div
//           className="brand-group"
//           style={{
//             position: "absolute",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             top: "5%",
//             left: "2%",
//             gap: "10px",
//           }}
//         >
//           <div className="brand-logo">
//             <img
//               onClick={() => navigate("/")}
//               src={whiteLogo}
//               alt="HedgeNest Logo"
//             />
//           </div>
//           <span className="brand-name">HedgeNest</span>
//         </div>
//       </div>

//       <div className="form-container">
//         <div className="signup-form-wrapper">
//           <div className="form-header-mobile">
//             <div className="brand-group-mobile">
//               <img src={whiteLogo} alt="Logo" />
//             </div>
//             <button
//               type="button"
//               className="back-arrow-btn"
//               onClick={() => window.history.back()}
//             >
//               <LuArrowLeft className="back-arrow-icon" />
//             </button>
//           </div>

//           <h2>Create Transaction PIN</h2>

//           <p className="otp-subtitle">
//             Create a secure 6-digit PIN for transactions
//           </p>

//           <form className="auth-form" onSubmit={handleSubmitPin}>
//             {/* ENTER PIN */}
//             <div className="otp-inputs-row">
//               <label>Enter PIN</label>
//               <div className="otp-input-container">
//                 {pin.map((digit, index) => (
//                   <input
//                     key={index}
//                     ref={(el) => (inputRefs.current[`pin-${index}`] = el)}
//                     type="password"
//                     maxLength={1}
//                     inputMode="numeric"
//                     value={digit}
//                     className="otp-box"
//                     onChange={(e) => handleChange(e.target.value, index, "pin")}
//                     onKeyDown={(e) => handleKeyDown(e, index, "pin")}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* CONFIRM PIN */}
//             <div className="otp-inputs-row">
//               <label>Confirm PIN</label>
//               <div className="otp-input-container">
//                 {confirmPin.map((digit, index) => (
//                   <input
//                     key={index}
//                     ref={(el) => (inputRefs.current[`confirm-${index}`] = el)}
//                     type="password"
//                     maxLength={1}
//                     inputMode="numeric"
//                     value={digit}
//                     className="otp-box"
//                     onChange={(e) =>
//                       handleChange(e.target.value, index, "confirm")
//                     }
//                     onKeyDown={(e) => handleKeyDown(e, index, "confirm")}
//                   />
//                 ))}
//               </div>
//             </div>

//             <Button
//               text={
//                 isLoading ? (
//                   <div className="loader-wrapper">
//                     <OrbitProgress color="#fff" size="small" />
//                   </div>
//                 ) : (
//                   "Continue"
//                 )
//               }
//               type="submit"
//               className="otp-submit-btn"
//               disabled={isLoading}
//               color="#c9922a"
//             />
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Pin;
import React, { useRef, useState } from "react";
import Signupimg from "../../assets/Signupimg.jpg";
import { LuArrowLeft } from "react-icons/lu";
import Button from "../../Components/Button";
import "../../Style/Otp.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { login, clearTempUser } from "../../Store/UserSlice";
import { createPin } from "../../Services/authService";
import whiteLogo from "../../assets/white logo.png";
import { OrbitProgress } from "react-loading-indicators";

/**
 * Decode JWT to extract user ID and other claims
 *
 * Backend JWT structure:
 * {
 *   id: "6a38648e8dd1a3f0454c38ec",
 *   role: "user",
 *   iat: 1782081138,
 *   exp: 1782167538
 * }
 */
const decodeJWT = (token) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("❌ Invalid JWT format");
      return null;
    }
    const decoded = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    return decoded;
  } catch (error) {
    console.error("❌ Failed to decode JWT:", error);
    return null;
  }
};

const Pin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRefs = useRef([]);

  const { tempUser } = useSelector((state) => state.user);
  const onboardingToken = tempUser?.authToken;
  const userEmail = tempUser?.email;

  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (value, index, type) => {
    if (!/^\d?$/.test(value)) return;

    if (type === "pin") {
      const updatedPin = [...pin];
      updatedPin[index] = value;
      setPin(updatedPin);
    } else {
      const updatedConfirmPin = [...confirmPin];
      updatedConfirmPin[index] = value;
      setConfirmPin(updatedConfirmPin);
    }

    if (value && index < 5) {
      const nextRef =
        type === "pin"
          ? inputRefs.current[`pin-${index + 1}`]
          : inputRefs.current[`confirm-${index + 1}`];

      nextRef?.focus();
    }
  };

  const handleKeyDown = (e, index, type) => {
    const currentArray = type === "pin" ? pin : confirmPin;

    if (e.key === "Backspace" && !currentArray[index] && index > 0) {
      const prevRef =
        type === "pin"
          ? inputRefs.current[`pin-${index - 1}`]
          : inputRefs.current[`confirm-${index - 1}`];

      prevRef?.focus();
    }
  };

  /**
   * ============================================================================
   * CREATE PIN & TRANSITION TO AUTHENTICATED STATE
   * ============================================================================
   *
   * CRITICAL FIX: Handle the EXACT backend response structure
   *
   * Backend response from create-pin:
   * {
   *   "status": true,
   *   "message": "Transaction pin created successfully",
   *   "data": { firstName, lastName, email, phoneNumber },  ← NO _id!
   *   "token": "eyJ..."                                     ← Contains id in JWT
   * }
   *
   * Solution:
   * 1. Extract user data from response.data
   * 2. Decode token to get user id
   * 3. Merge id into user object
   * 4. Fetch wallet data (create-pin doesn't return it)
   * 5. Dispatch login with complete data
   */
  const handleSubmitPin = async (e) => {
    e.preventDefault();

    const pinCode = pin.join("");
    const confirmPinCode = confirmPin.join("");

    // Validation
    if (pinCode.length !== 6 || confirmPinCode.length !== 6) {
      toast.error("PIN must be 6 digits");
      return;
    }

    if (pinCode !== confirmPinCode) {
      toast.error("PINs do not match");
      return;
    }

    if (!onboardingToken || !userEmail) {
      toast.error("Session expired. Please restart registration.");
      navigate("/signup");
      return;
    }

    try {
      setIsLoading(true);

      console.log("📝 Creating PIN with email:", userEmail);

      const payload = {
        email: userEmail,
        transactionPin: pinCode,
        confirmTransactionPin: confirmPinCode,
      };

      // Call createPin API
      const response = await createPin(payload, onboardingToken);

      console.log("✅ Create PIN response:", response);

      // ============================================
      // EXTRACT DATA FROM RESPONSE
      // ============================================
      // Backend returns: { status, message, data, token }
      // Note: data does NOT include _id or wallet

      const userDataFromResponse = response?.data;
      const sessionToken = response?.token;

      if (!userDataFromResponse) {
        throw new Error("Invalid response: missing user data");
      }

      if (!sessionToken) {
        throw new Error("Invalid response: missing token");
      }

      console.log("📊 User data from response:", userDataFromResponse);
      console.log("🔐 Token received:", sessionToken.substring(0, 30) + "...");

      // ============================================
      // DECODE TOKEN TO GET USER ID
      // ============================================
      // Backend doesn't return _id in response.data
      // But it's embedded in the JWT token
      // We decode it to extract the id

      const decodedToken = decodeJWT(sessionToken);

      if (!decodedToken || !decodedToken.id) {
        throw new Error("Failed to decode user ID from token");
      }

      console.log("🔑 User ID from JWT:", decodedToken.id);

      // ============================================
      // CONSTRUCT COMPLETE USER OBJECT
      // ============================================
      // Merge response data with decoded id

      const completeUserData = {
        ...userDataFromResponse,
        _id: decodedToken.id, // ← Add _id from JWT (CRITICAL!)
      };

      console.log("✅ Complete user object:", completeUserData);

      // ============================================
      // HANDLE WALLET DATA
      // ============================================
      // create-pin doesn't return wallet data
      // Either:
      // 1. Fetch it separately after login
      // 2. Create default wallet object
      // 3. Leave as null and let dashboard fetch it

      // Option 1: Create default wallet (quick start)
      const walletData = {
        availableBalance: 0,
        balanceInNaira: 0,
        balanceInUSDT: 0,
        smartVaults: 0,
        investments: 0,
      };

      console.log("💰 Wallet data:", walletData);

      // ============================================
      // DISPATCH LOGIN ACTION
      // ============================================
      // This transitions user from tempUser state to authenticated state
      // CRITICAL: completeUserData now has _id!

      console.log("🔄 Dispatching login action...");

      dispatch(
        login({
          user: completeUserData, // ← Has _id now!
          wallet: walletData, // ← Wallet data included
          token: sessionToken, // ← Valid token
        }),
      );

      // Clear temporary signup data
      dispatch(clearTempUser());

      console.log("✅ Redux state updated with:");
      console.log("   - user._id:", completeUserData._id);
      console.log("   - user.email:", completeUserData.email);
      console.log("   - token: present");
      console.log("   - rehydrating: false (set by login reducer)");

      // Show success message
      toast.success("PIN created successfully! Welcome to HedgeNest");

      // Redirect to dashboard
      setTimeout(() => {
        console.log("🚀 Navigating to dashboard as authenticated user...");
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("❌ PIN Creation Error:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create PIN";

      toast.error(errorMessage);

      // Reset form
      setPin(["", "", "", "", "", ""]);
      setConfirmPin(["", "", "", "", "", ""]);

      // Focus first input
      inputRefs.current[`pin-0`]?.focus();
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

          <h2>Create Transaction PIN</h2>

          <p className="otp-subtitle">
            Create a secure 6-digit PIN for transactions
          </p>

          <form className="auth-form" onSubmit={handleSubmitPin}>
            {/* ENTER PIN */}
            <div className="otp-inputs-row">
              <label>Enter PIN</label>
              <div className="otp-input-container">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[`pin-${index}`] = el)}
                    type="password"
                    maxLength={1}
                    inputMode="numeric"
                    value={digit}
                    className="otp-box"
                    onChange={(e) => handleChange(e.target.value, index, "pin")}
                    onKeyDown={(e) => handleKeyDown(e, index, "pin")}
                  />
                ))}
              </div>
            </div>

            {/* CONFIRM PIN */}
            <div className="otp-inputs-row">
              <label>Confirm PIN</label>
              <div className="otp-input-container">
                {confirmPin.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[`confirm-${index}`] = el)}
                    type="password"
                    maxLength={1}
                    inputMode="numeric"
                    value={digit}
                    className="otp-box"
                    onChange={(e) =>
                      handleChange(e.target.value, index, "confirm")
                    }
                    onKeyDown={(e) => handleKeyDown(e, index, "confirm")}
                  />
                ))}
              </div>
            </div>

            <Button
              text={
                isLoading ? (
                  <div className="loader-wrapper">
                    <OrbitProgress color="#fff" size="small" />
                  </div>
                ) : (
                  "Continue"
                )
              }
              type="submit"
              className="otp-submit-btn"
              disabled={isLoading}
              color="#c9922a"
            />
          </form>
        </div>
      </div>
    </section>
  );
};

export default Pin;

/**
 * ============================================================================
 * WHAT THIS FIX DOES - HANDLES ACTUAL BACKEND RESPONSE
 * ============================================================================
 *
 * BEFORE (Operations fail):
 * ✗ create-pin returns response.data without _id
 * ✗ Redux user object has NO _id
 * ✗ API calls fail: "Cannot read _id of undefined"
 * ✗ User can't perform any operations
 *
 * AFTER (Full functionality):
 * ✅ Extract user data from response.data
 * ✅ Decode token to get id
 * ✅ Merge id into user object: { ...data, _id: id }
 * ✅ Create wallet object (not returned by create-pin)
 * ✅ Dispatch login with COMPLETE data including _id
 * ✅ Redux has user._id for API calls
 * ✅ User can immediately perform operations
 * ✅ Stays logged in after refresh
 *
 * ============================================================================
 * BACKEND RESPONSE HANDLING
 * ============================================================================
 *
 * Response Structure:
 * {
 *   status: true,
 *   message: "Transaction pin created successfully",
 *   data: {
 *     firstName: "WILLIAM",
 *     lastName: "JOHN",
 *     email: "info.orientglobalstar@gmail.com",
 *     phoneNumber: "09125448899"
 *     // NOTE: NO _id here!
 *   },
 *   token: "eyJ..." // Contains id in payload
 * }
 *
 * This code:
 * 1. Extracts response.data (user info without _id)
 * 2. Decodes token (contains user id)
 * 3. Merges them: { ...data, _id: decodedToken.id }
 * 4. Creates wallet data (not in response)
 * 5. Dispatches complete login data
 *
 * Result: User object has _id ✅
 *
 * ============================================================================
 */
