import axios from "axios";

import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

/* =========================
   REGISTER
========================= */
export const registerUser = async (payload) => {
  try {
    const response = await axios.post(ENDPOINTS.AUTH.REGISTER, payload, {
      headers: API_CONFIG.headers,
      timeout: API_CONFIG.timeout,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

/* =========================
   LOGIN
========================= */
export const loginUser = async (payload) => {
  try {
    const response = await axios.post(ENDPOINTS.AUTH.LOGIN, payload, {
      headers: API_CONFIG.headers,
      timeout: API_CONFIG.timeout,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

/* =========================
   VERIFY OTP
========================= */
export const verifyOtp = async (payload) => {
  try {
    const response = await axios.post(ENDPOINTS.AUTH.VERIFY_OTP, payload, {
      headers: API_CONFIG.headers,
      timeout: API_CONFIG.timeout,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

/* =========================
   RESEND OTP
========================= */
export const resendOtp = async (payload) => {
  try {
    const response = await axios.post(ENDPOINTS.AUTH.RESEND_OTP, payload, {
      headers: API_CONFIG.headers,
      timeout: API_CONFIG.timeout,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

/* =========================
   SUBMIT KYC
========================= */
export const submitKyc = async (formData, token) => {
  try {
    const response = await axios.post(ENDPOINTS.AUTH.VERIFY_KYC, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },

      timeout: API_CONFIG.timeout,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

/* =========================
   CREATE PIN
========================= */
export const createPin = async (payload, token) => {
  try {
    const response = await axios.post(ENDPOINTS.AUTH.CREATE_PIN, payload, {
      headers: {
        ...API_CONFIG.headers,
        Authorization: `Bearer ${token}`,
      },

      timeout: API_CONFIG.timeout,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = async (payload) => {
  try {
    const response = await axios.post(ENDPOINTS.USER.RESET_PASSWORD, payload, {
      headers: API_CONFIG.headers,
      timeout: API_CONFIG.timeout,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
