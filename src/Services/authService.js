// import axios from "axios";
// import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

// const api = axios.create({
//   timeout: API_CONFIG.timeout,
//   headers: API_CONFIG.headers,
// });

// export const registerUser = async (payload) => {
//   const response = await api.post(ENDPOINTS.AUTH.REGISTER, payload);

//   return response.data;
// };

// export const verifyOtp = async (payload) => {
//   const response = await api.post(ENDPOINTS.AUTH.VERIFY_OTP, payload);

//   return response.data;
// };

// export const loginUser = async (payload) => {
//   const response = await api.post(ENDPOINTS.AUTH.LOGIN, payload);

//   return response.data;
// };

import axios from "axios";
import { ENDPOINTS } from "../Config/apiConfig";

export const registerUser = async (payload) => {
  const response = await axios.post(ENDPOINTS.AUTH.REGISTER, payload);

  return response.data;
};

export const verifyOtp = async (payload) => {
  const response = await axios.post(ENDPOINTS.AUTH.VERIFY_OTP, payload);

  return response.data;
};

export const resendOtp = async (payload) => {
  const response = await axios.post(ENDPOINTS.AUTH.RESET_OTP, payload);

  return response.data;
};
