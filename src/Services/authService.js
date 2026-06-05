import axios from "axios";
import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

export const registerUser = async (payload) => {
  try {
    const response = await axios.post(
      ENDPOINTS.AUTH.REGISTER,
      payload,
      {
        headers: API_CONFIG.headers,
        timeout: API_CONFIG.timeout,
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (payload) => {
  try {
    const response = await axios.post(
      ENDPOINTS.AUTH.LOGIN,
      payload,
      {
        headers: API_CONFIG.headers,
        timeout: API_CONFIG.timeout,
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (payload) => {
  try {
    const response = await axios.post(
      ENDPOINTS.AUTH.VERIFY_OTP,
      payload,
      {
        headers: API_CONFIG.headers,
        timeout: API_CONFIG.timeout,
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const resendOtp = async (payload) => {
  try {
    const response = await axios.post(
      ENDPOINTS.AUTH.RESET_OTP,
      payload,
      {
        headers: API_CONFIG.headers,
        timeout: API_CONFIG.timeout,
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};