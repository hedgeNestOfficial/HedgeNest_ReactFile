// import axios from "axios";
// import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

// export const linkBankAccount = async (payload, token) => {
//   const response = await axios.post(
//     ENDPOINTS.WALLET.LINK_BANK_ACCOUNT,
//     payload,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     },
//   );
//   return response.data;
// };

// export const confirmTransactionPin = async (userId, enteredPin, token) => {
//   const response = await axios.post(
//     `${ENDPOINTS.INVESTMENT.CONFIRM_PIN}/${userId}`,
//     { enteredPin: enteredPin },
//     {
//       headers: {
//         ...API_CONFIG.headers,
//         Authorization: `Bearer ${token}`
//       },
//     },
//   );
//   return response.data;
// };

// export const getLinkedAccounts = async (token) => {
//   const response = await axios.get(ENDPOINTS.WALLET.GET_LINKED_ACCOUNTS, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });
//   return response.data;
// };

import axios from "axios";
import { toast } from "react-hot-toast";
import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

// Global toast configurations to guarantee it overlays correctly over modals if necessary
const toastConfig = {
  style: {
    zIndex: 999999,
  },
};

/**
 * Helper to extract error message safely from standard Axios error structures
 */
const handleBackendError = (error, fallbackMessage) => {
  console.error("API Transmission Fault:", error);

  const backendMessage = error.response?.data?.message || fallbackMessage;
  toast.error(backendMessage, toastConfig);

  // Re-throw the error so your components still know the operation failed
  throw error;
};

export const linkBankAccount = async (payload, token) => {
  try {
    const response = await axios.post(
      ENDPOINTS.WALLET.LINK_BANK_ACCOUNT,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    return handleBackendError(
      error,
      "Failed to link bank account. Please try again.",
    );
  }
};

export const confirmTransactionPin = async (userId, enteredPin, token) => {
  try {
    const response = await axios.post(
      `${ENDPOINTS.INVESTMENT.CONFIRM_PIN}/${userId}`,
      { enteredPin: enteredPin },
      {
        headers: {
          ...API_CONFIG.headers,
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    return handleBackendError(
      error,
      "PIN verification failed. Please try again.",
    );
  }
};

export const getLinkedAccounts = async (token) => {
  try {
    const response = await axios.get(ENDPOINTS.WALLET.GET_LINKED_ACCOUNTS, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    return handleBackendError(error, "Could not fetch linked bank accounts.");
  }
};
