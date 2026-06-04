const BASE_URL = import.meta.env.VITE_HedgeNest_Url;

export const API_CONFIG = {
  baseUrl: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${BASE_URL}/api/v1/create-user`,
    LOGIN: `${BASE_URL}/auth/login`,
    VERIFY_OTP: `${BASE_URL}/api/v1/verify/check`,
    RESET_OTP: `${BASE_URL}//api/v1/resendOtp`,
    PIN: `${BASE_URL}/api/v1/create-pin`,
    VERIFY_KYC: `${BASE_URL}/api/v1/uploadId`,
    LOGIN: `${BASE_URL}/api/v1/login`,
  },
  EDIT_DATA: {
    RESET_PASSWORD: `${BASE_URL}/api/v1/reset-password`,
    CHANGE_PASSWORD: `${BASE_URL}/api/v1/change-password`,
    CHANGE_DATAS: `${BASE_URL}/api/v1/update`,
  },
  BANK_DETAILS: {
    GET_BANK_DETAILS: `${BASE_URL}/api/v1/link`,
    CONVERT: `${BASE_URL}/rates/convert`,
  },
};
