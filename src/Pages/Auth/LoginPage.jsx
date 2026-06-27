// // import React from "react";
// // import "../../Style/Signup.css";
// // import Signupimg from "../../assets/Signupimg.jpg";
// // import Input from "../../Components/Input";
// // import Button from "../../Components/Button";
// // import { LoginData } from "../../JS/signupCard";
// // import { LuArrowLeft } from "react-icons/lu";
// // import { useNavigate } from "react-router-dom";
// // import { useDispatch } from "react-redux";
// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import toast from "react-hot-toast";
// // import { loginSchema } from "../../Validation/authSchema";
// // import { loginUser } from "../../Services/authService";
// // import { login } from "../../Store/UserSlice";
// // import { OrbitProgress } from "react-loading-indicators";
// // import whiteLogo from "../../assets/white logo.png";

// // const LoginPage = () => {
// //   const navigate = useNavigate();
// //   const dispatch = useDispatch();

// //   const {
// //     register,
// //     handleSubmit,
// //     watch,
// //     formState: { errors, isSubmitting },
// //   } = useForm({
// //     resolver: zodResolver(loginSchema),
// //     defaultValues: {
// //       email: "",
// //       password: "",
// //     },
// //   });

// //   const watchedFields = watch();

// //   const isFormFilled =
// //     watchedFields.email?.trim() && watchedFields.password?.trim();

// //   const onSubmitForm = async (formDataFields) => {
// //     try {
// //       const payload = {
// //         email: formDataFields.email.trim(),
// //         password: formDataFields.password,
// //       };

// //       const response = await loginUser(payload);

// //       // Extract properties according to the updated backend JSON scheme:
// //       const { message, data: userData, wallet, token } = response;

// //       // 1. VALIDATION CHECK: Check if user is verified (adjust key name if backend uses 'status')
// //       if (userData?.isVerified === false || userData?.status === false) {
// //         toast.error(
// //           "Account not verified. Redirecting to verification page...",
// //         );

// //         setTimeout(() => {
// //           navigate("/otp", { state: { email: payload.email } });
// //         }, 1500);
// //         return; // Halt execution so they don't get logged into global state
// //       }

// //       // Dispatch payload using the key names expected by your global state slice
// //       dispatch(
// //         login({
// //           user: {
// //             ...userData,
// //             _id: wallet?.userId,
// //           },
// //           wallet,
// //           token,
// //         }),
// //       );

// //       localStorage.setItem("wallet", JSON.stringify(wallet));

// //       toast.success(message || "Login Successful");

// //       setTimeout(() => {
// //         navigate("/dashboard");
// //       }, 1500);
// //     } catch (error) {
// //       console.log("LOGIN ERROR:", error);
// //       toast.error(
// //         error?.response?.data?.message || "Invalid email or password",
// //       );
// //     }
// //   };

// //   return (
// //     <section className="signup-section">
// //       <div className="image-container">
// //         <img src={Signupimg} alt="HedgeNest Protection Illustration" />

// //         <div
// //           className="brand-group"
// //           style={{
// //             position: "absolute",
// //             display: "flex",
// //             justifyContent: "center",
// //             alignItems: "center",
// //             top: "5%",
// //             left: "2%",
// //             gap: "10px",
// //           }}
// //         >
// //           <div className="brand-logo">
// //             <img
// //               onClick={() => navigate("/")}
// //               src={whiteLogo}
// //               alt="HedgeNest Logo"
// //             />
// //           </div>
// //           <span className="brand-name">HedgeNest</span>
// //         </div>
// //       </div>

// //       <div className="form-container">
// //         <div className="signup-form-wrapper">
// //           <div className="form-header-mobile">
// //             <div className="brand-group-mobile">
// //               <img src={whiteLogo} alt="Logo" />
// //             </div>

// //             <button
// //               type="button"
// //               className="back-arrow-btn"
// //               onClick={() => window.history.back()}
// //             >
// //               <LuArrowLeft className="back-arrow-icon" />
// //             </button>
// //           </div>

// //           <h2>Log In To Your Account</h2>

// //           <form className="auth-form" onSubmit={handleSubmit(onSubmitForm)}>
// //             {LoginData.map((item, index) => (
// //               <Input
// //                 key={index}
// //                 label={item.label}
// //                 type={item.type}
// //                 placeholder={item.placeholder}
// //                 note={item.note}
// //                 className="input-group-wrapper"
// //                 registerProps={register(item.name)}
// //                 error={errors[item.name]}
// //               />
// //             ))}

// //             <Button
// //               text={
// //                 isSubmitting ? (
// //                   <div className="loader-wrapper">
// //                     <OrbitProgress color="#ffffff" size="small" />
// //                   </div>
// //                 ) : (
// //                   "Login"
// //                 )
// //               }
// //               type="submit"
// //               className={`signup-submit-btn ${
// //                 isFormFilled ? "active-submit-btn" : "disabled-submit-btn"
// //               }`}
// //               disabled={!isFormFilled || isSubmitting}
// //             />

// //             <p
// //               onClick={() => navigate("/reset")}
// //               className="forgot-password-text"
// //               style={{ textAlign: "left" }}
// //             >
// //               Forgotten password?
// //             </p>

// //             <p className="auth-switch-footer" style={{ textAlign: "left" }}>
// //               Don’t have an account?{" "}
// //               <span
// //                 className="highlight-link bold-link"
// //                 onClick={() => navigate("/signup")}
// //               >
// //                 Sign Up
// //               </span>
// //             </p>
// //           </form>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default LoginPage;

// import React from "react";
// import "../../Style/Signup.css";
// import Signupimg from "../../assets/Signupimg.jpg";
// import Input from "../../Components/Input";
// import Button from "../../Components/Button";
// import { LoginData } from "../../JS/signupCard";
// import { LuArrowLeft } from "react-icons/lu";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import toast from "react-hot-toast";
// import { loginSchema } from "../../Validation/authSchema";
// import { loginUser, resendOtp } from "../../Services/authService"; // 🟢 Imported resendOtp
// import { login } from "../../Store/UserSlice";
// import { OrbitProgress } from "react-loading-indicators";
// import whiteLogo from "../../assets/white logo.png";

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const watchedFields = watch();

//   const isFormFilled =
//     watchedFields.email?.trim() && watchedFields.password?.trim();

//   // const onSubmitForm = async (formDataFields) => {
//   //   try {
//   //     const payload = {
//   //       email: formDataFields.email.trim(),
//   //       password: formDataFields.password,
//   //     };

//   //     const response = await loginUser(payload);
//   //     const { message, data: userData, wallet, token } = response;

//   //     // 1. VALIDATION CHECK: Capture unverified state profiles safely
//   //     if (userData?.isVerified === false || userData?.status === false) {
//   //       toast.error("Account not verified. Sending OTP to your email...");

//   //       try {
//   //         // 🟢 Fire off OTP transmission so they don't land on an empty mailbox
//   //         await resendOtp({ email: payload.email });
//   //         toast.success("Verification code sent successfully!");
//   //       } catch (otpErr) {
//   //         console.error("Auto OTP Resend failed:", otpErr);
//   //         // Don't halt execution if the OTP fail message is just a rate-limit; pass them along
//   //       }

//   //       setTimeout(() => {
//   //         // 🟢 Pass both purpose and the context email into history state
//   //         navigate("/otp", {
//   //           state: {
//   //             email: payload.email,
//   //             purpose: "login-verify",
//   //           },
//   //         });
//   //       }, 1500);
//   //       return;
//   //     }

//   //     dispatch(
//   //       login({
//   //         user: {
//   //           ...userData,
//   //           _id: wallet?.userId,
//   //         },
//   //         wallet,
//   //         token,
//   //       }),
//   //     );

//   //     localStorage.setItem("wallet", JSON.stringify(wallet));
//   //     toast.success(message || "Login Successful");

//   //     setTimeout(() => {
//   //       navigate("/dashboard");
//   //     }, 1500);
//   //   } catch (error) {
//   //     console.log("LOGIN ERROR:", error);
//   //     // 🟢 Clearer error handling that strictly reads your Axios response message structures
//   //     const backendErrorMessage =
//   //       error?.response?.data?.message ||
//   //       error?.message ||
//   //       "Invalid email or password";
//   //     toast.error(backendErrorMessage);
//   //   }
//   // };

//   const onSubmitForm = async (formDataFields) => {
//     const payload = {
//       email: formDataFields.email.trim(),
//       password: formDataFields.password,
//     };

//     try {
//       const response = await loginUser(payload);
//       const { message, data: userData, wallet, token } = response;

//       // This handles it IF your backend returns a 200 OK status for unverified users
//       if (userData?.isVerified === false || userData?.status === false) {
//         await handleUnverifiedUserRedirect(payload.email);
//         return;
//       }

//       // Standard successful login flow
//       dispatch(
//         login({
//           user: { ...userData, _id: wallet?.userId },
//           wallet,
//           token,
//         }),
//       );
//       localStorage.setItem("wallet", JSON.stringify(wallet));
//       toast.success(message || "Login Successful");

//       setTimeout(() => navigate("/dashboard"), 1500);
//     } catch (error) {
//       console.log("LOGIN ERROR DATA:", error?.response?.data);

//       const backendData = error?.response?.data;

//       // 🎯 FIX: Intercept the unverified user error here when the backend returns a 4xx error code
//       if (
//         backendData?.isVerified === false ||
//         backendData?.message?.toLowerCase().includes("verify your email")
//       ) {
//         await handleUnverifiedUserRedirect(payload.email);
//         return;
//       }

//       // Otherwise, treat it as a standard password/email mismatch error
//       const backendErrorMessage =
//         backendData?.message || error?.message || "Invalid email or password";
//       toast.error(backendErrorMessage);
//     }
//   };

//   /**
//    * 🟢 Helper function to cleanly handle the OTP re-fire and routing setup
//    */
//   const handleUnverifiedUserRedirect = async (email) => {
//     toast.error("Account not verified. Sending OTP to your email...");

//     try {
//       // Force fire the resendOtp service instantly
//       await resendOtp({ email });
//       toast.success("Verification code sent successfully!");
//     } catch (otpErr) {
//       console.error("Auto OTP Resend failed:", otpErr);
//       // If it fails because an OTP was recently sent, still let them proceed to the verification screen
//     }

//     setTimeout(() => {
//       navigate("/otp", {
//         state: {
//           email: email,
//           purpose: "login-verify",
//         },
//       });
//     }, 1500);
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

//           <h2>Log In To Your Account</h2>

//           <form className="auth-form" onSubmit={handleSubmit(onSubmitForm)}>
//             {LoginData.map((item, index) => (
//               <Input
//                 key={index}
//                 label={item.label}
//                 type={item.type}
//                 placeholder={item.placeholder}
//                 note={item.note}
//                 className="input-group-wrapper"
//                 registerProps={register(item.name)}
//                 error={errors[item.name]}
//               />
//             ))}

//             <Button
//               text={
//                 isSubmitting ? (
//                   <div className="loader-wrapper">
//                     <OrbitProgress color="#ffffff" size="small" />
//                   </div>
//                 ) : (
//                   "Login"
//                 )
//               }
//               type="submit"
//               className={`signup-submit-btn ${
//                 isFormFilled ? "active-submit-btn" : "disabled-submit-btn"
//               }`}
//               disabled={!isFormFilled || isSubmitting}
//             />

//             <p
//               onClick={() => navigate("/reset")}
//               className="forgot-password-text"
//               style={{ textAlign: "left" }}
//             >
//               Forgotten password?
//             </p>

//             <p className="auth-switch-footer" style={{ textAlign: "left" }}>
//               Don’t have an account?{" "}
//               <span
//                 className="highlight-link bold-link"
//                 onClick={() => navigate("/signup")}
//               >
//                 Sign Up
//               </span>
//             </p>
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default LoginPage;

import React from "react";
import "../../Style/Signup.css";
import Signupimg from "../../assets/Signupimg.jpg";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import { LoginData } from "../../JS/signupCard";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { loginSchema } from "../../Validation/authSchema";
import { loginUser, resendOtp } from "../../Services/authService";
import { login } from "../../Store/UserSlice";
import { OrbitProgress } from "react-loading-indicators";
import whiteLogo from "../../assets/white logo.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const watchedFields = watch();

  // Basic checking to see if text entry fields are filled
  const isFormFilled =
    watchedFields.email?.trim() && watchedFields.password?.trim();

  const onSubmitForm = async (formDataFields) => {
    const payload = {
      email: formDataFields.email.trim(),
      password: formDataFields.password,
    };

    try {
      const response = await loginUser(payload);
      const { message, data: userData, wallet, token } = response;

      // ============================================================================
      // STRICT FINTECH INTERCEPT PIPELINE (Excluding KYC 1 & 2)
      // ============================================================================

      // 1. Email OTP Verification Intercept
      if (userData?.isVerified === false) {
        await handleUnverifiedUserRedirect(payload.email);
        return;
      }

      // 2. Security Transaction PIN Intercept
      if (userData?.createdAlready === false) {
        toast.error("Transaction PIN required. Redirecting to setup...");
        setTimeout(() => {
          navigate("/pin", {
            state: {
              email: payload.email,
              purpose: "pin-setup",
              token: token, // Secure transient routing token context
            },
          });
        }, 1500);
        return;
      }

      // ============================================================================
      // PERSISTED WORKSPACE REDUX STATE DISPATCH (Passed all conditions)
      // ============================================================================
      dispatch(
        login({
          user: { ...userData, _id: wallet?.userId },
          wallet,
          token,
        }),
      );

      toast.success(message || "Login Successful");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.log("LOGIN ERROR DATA:", error?.response?.data);

      const backendData = error?.response?.data;

      // Unverified catch handling block for 4xx responses
      if (
        backendData?.isVerified === false ||
        backendData?.message?.toLowerCase().includes("verify your email")
      ) {
        await handleUnverifiedUserRedirect(payload.email);
        return;
      }

      const backendErrorMessage =
        backendData?.message || error?.message || "Invalid email or password";
      toast.error(backendErrorMessage);
    }
  };

  /**
   * Helper utility to handle API re-fire transmission cleanly
   */
  const handleUnverifiedUserRedirect = async (email) => {
    toast.error("Account not verified. Sending OTP to your email...");

    try {
      await resendOtp({ email });
      toast.success("Verification code sent successfully!");
    } catch (otpErr) {
      console.error("Auto OTP Resend failed:", otpErr);
    }

    setTimeout(() => {
      navigate("/otp", {
        state: {
          email: email,
          purpose: "login-verify",
        },
      });
    }, 1500);
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

          <h2>Log In To Your Account</h2>

          <form className="auth-form" onSubmit={handleSubmit(onSubmitForm)}>
            {LoginData.map((item, index) => (
              <Input
                key={index}
                label={item.label}
                type={item.type}
                placeholder={item.placeholder}
                note={item.note}
                className="input-group-wrapper"
                registerProps={register(item.name)}
                error={errors[item.name]}
              />
            ))}

            {/* 🎯 Now disabled natively when form is loading or incomplete */}
            <Button
              text={
                isSubmitting ? (
                  <div className="loader-wrapper">
                    <OrbitProgress color="#ffffff" size="small" />
                  </div>
                ) : (
                  "Login"
                )
              }
              type="submit"
              className={`signup-submit-btn ${
                isFormFilled ? "active-submit-btn" : "disabled-submit-btn"
              }`}
              disabled={!isFormFilled || isSubmitting}
            />

            <p
              onClick={() => navigate("/reset")}
              className="forgot-password-text"
              style={{ textAlign: "left" }}
            >
              Forgotten password?
            </p>

            <p className="auth-switch-footer" style={{ textAlign: "left" }}>
              Don’t have an account?{" "}
              <span
                className="highlight-link bold-link"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
