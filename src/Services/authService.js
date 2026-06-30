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
  try {
    const response = await axios.put(ENDPOINTS.USER.UPDATE_PROFILE, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
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

// 🟢 EDITED: Added error boundary to prevent silent unhandled screen freezing
// export const changeTransactionPin = async (payload, token) => {
//   try {
//     const response = await axios.post(ENDPOINTS.USER.CHANGE_PIN, payload, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       timeout: API_CONFIG.timeout,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("API Service Error inside changeTransactionPin:", error);
//     throw error?.response?.data || error;
//   }
// };
// export const changeTransactionPin = async (payload, token) => {
//   try {
//     // 🟢 FIXED: Changed .USER. to .AUTH. to match your apiConfig.js structure
//     const response = await axios.post(ENDPOINTS.AUTH.CHANGE_PIN, payload, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       timeout: API_CONFIG.timeout,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("API Service Error inside changeTransactionPin:", error);
//     throw error?.response?.data || error;
//   }
// };

export const confirmTransactionPin = async (userId, enteredPin, token) => {
  try {
    console.log("🔐 Verifying transaction PIN...");

    if (!userId) {
      throw new Error("User ID is required for PIN verification");
    }

    if (!enteredPin || enteredPin.length !== 6) {
      throw new Error("PIN must be 6 digits");
    }

    if (!token) {
      throw new Error("Authorization token is required");
    }

    const response = await axios.post(
      `${ENDPOINTS.INVESTMENT.CONFIRM_PIN}/${userId}`,
      { enteredPin },
      {
        headers: {
          ...API_CONFIG.headers,
          Authorization: getAuthHeader(token),
        },
        timeout: API_CONFIG.timeout,
      },
    );

    console.log("✅ PIN verified successfully");
    return response.data;
  } catch (error) {
    console.error("❌ PIN Verification Error:", error.message);
    throw {
      message: error?.response?.data?.message || "PIN verification failed",
      status: error?.response?.status,
      data: error?.response?.data,
    };
  }
};

export const changeTransactionPin = async (payload, token) => {
  try {
    // 🟢 FIXED: Changed .post to .put to match the backend specification
    const response = await axios.put(ENDPOINTS.AUTH.CHANGE_PIN, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: API_CONFIG.timeout,
    });
    return response.data;
  } catch (error) {
    console.error("API Service Error inside changeTransactionPin:", error);
    throw error?.response?.data || error;
  }
};

// export const uploadUtilityBill = async (file, token) => {
//   try {
//     const formData = new FormData();
//     formData.append("utilityBill", file);

//     const response = await axios.post(
//       ENDPOINTS.KYC.UPLOAD_UTILITY_BILL,
//       formData,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       },
//     );
//     return response.data;
//   } catch (error) {
//     throw error?.response?.data || error;
//   }
// };

// In authService.js - Add or update this function

export const uploadUtilityBill = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append("utilityBill", file);

    const response = await axios.put(
      ENDPOINTS.KYC.UPLOAD_UTILITY_BILL,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: API_CONFIG.timeout,
      },
    );

    return response.data;
  } catch (error) {
    console.error("Upload utility bill error:", error);
    throw error;
  }
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

// export const changeTransactionPin = async (payload, token) => {
//   try {
//     // 🟢 FIXED: Changed .post to .put to match the backend specification
//     const response = await axios.put(ENDPOINTS.AUTH.CHANGE_PIN, payload, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       timeout: API_CONFIG.timeout,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("API Service Error inside changeTransactionPin:", error);
//     throw error?.response?.data || error;
//   }
// };
