import axios from "axios";

import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

export const registerUser = async (payload) => {
  const response = await axios.post(ENDPOINTS.AUTH.REGISTER, payload, {
    headers: API_CONFIG.headers,
    timeout: API_CONFIG.timeout,
  });

  return response.data;
};

export const loginUser = async (payload) => {
  const response = await axios.post(ENDPOINTS.AUTH.LOGIN, payload, {
    headers: API_CONFIG.headers,
    timeout: API_CONFIG.timeout,
  });

  return response.data;
};

export const verifyOtp = async (payload) => {
  const response = await axios.post(ENDPOINTS.AUTH.VERIFY_OTP, payload, {
    headers: API_CONFIG.headers,
    timeout: API_CONFIG.timeout,
  });

  return response.data;
};

// export const resendOtp = async (payload) => {
//   const response = await axios.post(ENDPOINTS.AUTH.RESEND_OTP, payload, {
//     headers: API_CONFIG.headers,
//     timeout: API_CONFIG.timeout,
//   });

//   return response.data;
// };
export const resendOtp = async (payload) => {
  try {
    console.log("Sending OTP:", payload);
    console.log("URL:", ENDPOINTS.AUTH.RESEND_OTP);

    const response = await axios.post(ENDPOINTS.AUTH.RESEND_OTP, payload, {
      headers: API_CONFIG.headers,
      timeout: API_CONFIG.timeout,
    });

    console.log("OTP RESPONSE:", response);

    return response.data;
  } catch (error) {
    console.log("OTP ERROR:", error);
    console.log("OTP ERROR CODE:", error.code);
    console.log("OTP ERROR RESPONSE:", error.response);

    throw error;
  }
};

export const submitKyc = async (payload, token) => {
  const response = await axios.post(ENDPOINTS.AUTH.VERIFY_KYC, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const createPin = async (payload, token) => {
  try {
    const response = await axios.patch(ENDPOINTS.AUTH.CREATE_PIN, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      timeout: 60000,
    });

    return response.data;
  } catch (error) {
    console.log("CREATE PIN ERROR:", error);

    console.log("CREATE PIN RESPONSE:", error?.response);

    console.log("CREATE PIN DATA:", error?.response?.data);

    throw error;
  }
};

export const resetPassword = async (payload) => {
  const response = await axios.post(ENDPOINTS.USER.RESET_PASSWORD, payload, {
    headers: API_CONFIG.headers,
    timeout: API_CONFIG.timeout,
  });

  return response.data;
};

export const updateProfile = async (formData, token) => {
  const response = await axios.put(ENDPOINTS.USER.UPDATE_PROFILE, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
