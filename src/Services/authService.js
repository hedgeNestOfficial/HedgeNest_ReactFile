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

export const forgotPin = async (payload) => {
  const response = await axios.post(ENDPOINTS.AUTH.FORGOT_PIN, payload, {
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

export const resendOtp = async (payload) => {
  try {
    const response = await axios.post(ENDPOINTS.AUTH.RESEND_OTP, payload, {
      headers: API_CONFIG.headers,
      timeout: API_CONFIG.timeout,
    });

    return response.data;
  } catch (error) {
    console.log("OTP ERROR:", error);
    throw error;
  }
};

export const submitKyc = async (payload, token) => {
  try {
    const response = await axios.post(ENDPOINTS.AUTH.VERIFY_KYC, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data || error.message;
  }
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
    throw error;
  }
};

export const updateProfile = async (formData, token) => {
  const response = await axios.put(ENDPOINTS.USER.UPDATE_PROFILE, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const forgotPassword = async (payload) => {
  const response = await axios.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, payload, {
    headers: API_CONFIG.headers,
    timeout: API_CONFIG.timeout,
  });

  return response.data;
};

export const verifyResetOtp = async (payload) => {
  const response = await axios.post(ENDPOINTS.AUTH.VERIFY_RESET_OTP, payload, {
    headers: API_CONFIG.headers,
    timeout: API_CONFIG.timeout,
  });

  return response.data;
};

export const resetPassword = async (payload) => {
  const response = await axios.post(ENDPOINTS.AUTH.RESET_PASSWORD, payload, {
    headers: API_CONFIG.headers,
    timeout: API_CONFIG.timeout,
  });

  return response.data;
};

export const changeTransactionPin = async (payload, token) => {
  const response = await axios.post(ENDPOINTS.USER.CHANGE_PIN, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    timeout: API_CONFIG.timeout,
  });

  return response.data;
};

export const uploadUtilityBill = async (file, token) => {
  const formData = new FormData();

  formData.append("utilityBill", file);

  const response = await axios.post(
    ENDPOINTS.KYC.UPLOAD_UTILITY_BILL,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};

export const getTransactionHistory = async (token) => {
  try {
    const response = await axios.get(ENDPOINTS.AUTH.TRANSACTION, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error?.response?.data || error.message;
  }
};
