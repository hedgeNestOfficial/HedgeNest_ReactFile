import axios from "axios";
import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

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

export const resendOtp = async (payload) => {
  try {
    const response = await axios.post(ENDPOINTS.AUTH.RESET_OTP, payload, {
      headers: API_CONFIG.headers,
      timeout: API_CONFIG.timeout,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_BASE_URL;

// export const submitKyc = async (formData, token) => {
//   const response = await axios.post(`${BASE_URL}/kyc/verify`, formData, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "multipart/form-data",
//     },
//   });

//   return response.data;
// };

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

export const createTransactionPin = async (payload, token) => {
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
