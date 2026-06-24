import axios from "axios";
import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

export const linkBankAccount = async (payload, token) => {
  try {
    const response = await axios.post(
      ENDPOINTS.WALLET.LINK_BANK_ACCOUNT,
      payload,
      {
        headers: {
          ...API_CONFIG.headers,
          Authorization: `Bearer ${token}`,
        },
        timeout: API_CONFIG.timeout,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🟢 Fetch linked accounts for the user
export const getLinkedAccounts = async (token) => {
  try {
    const response = await axios.get(ENDPOINTS.WALLET.GET_LINKED_ACCOUNTS, {
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

export const getMyWallet = async (token) => {
  try {
    const response = await axios.get(ENDPOINTS.CONVERSION.GET_MY_WALLET, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fundWallet = async (amount, token) => {
  const response = await axios.post(
    ENDPOINTS.PAYMENT.FUND_WALLET,
    { amount },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

// 🟢 Added: Process withdrawal out of Available Balance pool
export const withdrawFunds = async (payload, token) => {
  try {
    const response = await axios.post(
      ENDPOINTS.WALLET.WITHDRAW || ENDPOINTS.PAYMENT.WITHDRAW, // Adjust to your exact apiConfig constant name
      payload,
      {
        headers: {
          ...API_CONFIG.headers,
          Authorization: `Bearer ${token}`,
        },
        timeout: API_CONFIG.timeout,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const confirmTransactionPin = async (userId, enteredPin, token) => {
  const response = await axios.post(
    `${ENDPOINTS.INVESTMENT.CONFIRM_PIN}/${userId}`,
    { enteredPin },
    {
      headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};
// import axios from "axios"; // or your default axios import
// import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

// export const linkBankAccount = async (payload, token) => {
//   try {
//     const response = await axios.post(
//       ENDPOINTS.WALLET.LINK_BANK_ACCOUNT,
//       payload,
//       {
//         headers: {
//           ...API_CONFIG.headers,
//           Authorization: `Bearer ${token}`,
//         },
//         timeout: API_CONFIG.timeout,
//       },
//     );
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// // 🟢 Added: Fetch linked accounts for the user
// export const getLinkedAccounts = async (token) => {
//   try {
//     const response = await axios.get(ENDPOINTS.WALLET.GET_LINKED_ACCOUNTS, {
//       headers: {
//         ...API_CONFIG.headers,
//         Authorization: `Bearer ${token}`,
//       },
//       timeout: API_CONFIG.timeout,
//     });
//     return response.data; // This returns the object containing { success, linkedAccounts, totalAccounts }
//   } catch (error) {
//     throw error;
//   }
// };

// export const getMyWallet = async (token) => {
//   try {
//     const response = await axios.get(ENDPOINTS.CONVERSION.GET_MY_WALLET, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// export const fundWallet = async (amount, token) => {
//   const response = await axios.post(
//     ENDPOINTS.PAYMENT.FUND_WALLET,
//     { amount },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     },
//   );
//   return response.data;
// };
