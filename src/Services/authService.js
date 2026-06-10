import axios from "axios";

import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

/* =========================
   REGISTER
========================= */
export const registerUser = async (payload) => {
  const response = await axios.post(ENDPOINTS.AUTH.REGISTER, payload, {
    headers: API_CONFIG.headers,
    timeout: API_CONFIG.timeout,
  });

  return response.data;
};

/* =========================
   LOGIN
========================= */
export const loginUser = async (payload) => {
  const response = await axios.post(ENDPOINTS.AUTH.LOGIN, payload, {
    headers: API_CONFIG.headers,
    timeout: API_CONFIG.timeout,
  });

  return response.data;
};

/* =========================
   VERIFY OTP
========================= */
export const verifyOtp = async (payload) => {
  const response = await axios.post(ENDPOINTS.AUTH.VERIFY_OTP, payload, {
    headers: API_CONFIG.headers,
    timeout: API_CONFIG.timeout,
  });

  return response.data;
};

/* =========================
   RESEND OTP
========================= */
export const resendOtp = async (payload) => {
  const response = await axios.post(ENDPOINTS.AUTH.RESEND_OTP, payload, {
    headers: API_CONFIG.headers,
    timeout: API_CONFIG.timeout,
  });

  return response.data;
};

/* =========================
   SUBMIT KYC
========================= */
// export const submitKyc = async (formData, token) => {
//   try {
//     const response = await axios.post(ENDPOINTS.AUTH.VERIFY_KYC, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },

//       timeout: 60000,
//     });

//     return response.data;
//   } catch (error) {
//     console.log("FULL UPLOAD ERROR:", error);

//     console.log("SERVER ERROR:", error?.response?.data);

//     throw error;
//   }
// };

export const submitKyc = async (formData, token) => {
  const response = await axios.post(ENDPOINTS.AUTH.VERIFY_KYC, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
/* =========================
   CREATE PIN
========================= */
export const createPin = async (payload, token) => {
  const response = await axios.post(ENDPOINTS.AUTH.CREATE_PIN, payload, {
    headers: {
      ...API_CONFIG.headers,
      Authorization: `Bearer ${token}`,
    },

    timeout: API_CONFIG.timeout,
  });

  return response.data;
};

/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = async (payload) => {
  const response = await axios.post(ENDPOINTS.USER.RESET_PASSWORD, payload, {
    headers: API_CONFIG.headers,
    timeout: API_CONFIG.timeout,
  });

  return response.data;
};
