const BASE_URL = import.meta.env.VITE_HedgeNest_Url;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

export const API_CONFIG = {
  baseUrl: BASE_URL,

  frontendUrl: FRONTEND_URL,

  timeout: 60000,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${BASE_URL}/api/v1/create-user`,

    LOGIN: `${BASE_URL}/api/v1/login`,

    VERIFY_OTP: `${BASE_URL}/api/v1/verify/check`,

    RESEND_OTP: `${BASE_URL}/api/v1/resendOtp`,

    CREATE_PIN: `${BASE_URL}/api/v1/create-pin`,

    VERIFY_KYC: `${BASE_URL}/api/v1/verify`,

    // PASSWORD RESET FLOW
    FORGOT_PASSWORD: `${BASE_URL}/api/v1/forgot-password`,

    VERIFY_RESET_OTP: `${BASE_URL}/api/v1/verify/check`,

    RESET_PASSWORD: `${BASE_URL}/api/v1/reset-password`,
  },

  USER: {
    CHANGE_PASSWORD: `${BASE_URL}/api/v1/change-password`,

    UPDATE_PROFILE: `${BASE_URL}/api/v1/update`,
  },

  WALLET: {
    LINK_BANK_ACCOUNT: `${BASE_URL}/api/v1/link`,

    CONVERT: `${BASE_URL}/api/v1/convert`,
  },
  SMART_SAVE: {
    PREVIEW_PLAN: `${BASE_URL}/api/v1/preview-plan`,
    CREATE_PLAN: `${BASE_URL}/api/v1/create-plan`,
    BREAK_PLAN: `${BASE_URL}/api/v1/break-plan`,
  },
};
