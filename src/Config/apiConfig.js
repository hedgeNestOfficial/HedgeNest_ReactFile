const BASE_URL = import.meta.env.VITE_HedgeNest_Url;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

export const API_CONFIG = {
  baseUrl: BASE_URL,
  frontendUrl: FRONTEND_URL,

  timeout: 10000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// export const ENDPOINTS = {
//   AUTH: {
//     REGISTER: `${BASE_URL}/api/v1/create-user`,
//     LOGIN: `${BASE_URL}/api/v1/login`,
//     VERIFY_OTP: `${BASE_URL}/api/v1/verify/check`,
//     RESEND_OTP: `${BASE_URL}/api/v1/resendOtp`,
//     CREATE_PIN: `${BASE_URL}/api/v1/create-pin`,
//     VERIFY_KYC: `${BASE_URL}/api/v1/uploadId`,
//     GOOGLE_AUTH: `${BASE_URL}/api/v1/auth/google`,
//   },
// };
// const BASE_URL = import.meta.env.VITE_HedgeNest_Url;

// export const API_CONFIG = {
//   baseUrl: BASE_URL,

//   timeout: 10000,

//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// };

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${BASE_URL}/api/v1/create-user`,

    LOGIN: `${BASE_URL}/api/v1/login`,

    VERIFY_OTP: `${BASE_URL}/api/v1/verify/check`,

    RESEND_OTP: `${BASE_URL}/api/v1/resendOtp`,

    CREATE_PIN: `${BASE_URL}/api/v1/create-pin`,

    VERIFY_KYC: `${BASE_URL}/api/v1/uploadId`,
  },

  // =========================
  // USER
  // =========================

  USER: {
    CHANGE_PASSWORD: `${BASE_URL}/api/v1/change-password`,

    RESET_PASSWORD: `${BASE_URL}/api/v1/reset-password`,

    UPDATE_PROFILE: `${BASE_URL}/api/v1/update`,
  },

  // =========================
  // WALLET
  // =========================

  WALLET: {
    LINK_BANK_ACCOUNT: `${BASE_URL}/api/v1/link`,

    CONVERT: `${BASE_URL}/rates/convert`,
  },
};
