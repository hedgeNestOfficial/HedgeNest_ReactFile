import axios from "axios";
import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

const getAuthHeader = (token) => {
  if (!token) return "";
  const cleanToken = token.toString().trim();
  return cleanToken.startsWith("Bearer ") ? cleanToken : `Bearer ${cleanToken}`;
};

export const convertCurrency = async (payload, token) => {
  try {
    const response = await axios.post(ENDPOINTS.CONVERSION.CONVERT, payload, {
      headers: {
        ...API_CONFIG.headers,
        Authorization: getAuthHeader(token),
      },
      timeout: API_CONFIG.timeout,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Conversion failed" };
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

export const GetLiveRate = async () => {
  try {
    const response = await axios.get(ENDPOINTS.CONVERSION.LIVE_RATE);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to fetch current live market rates",
      }
    );
  }
};

export const GetHistory = async (token) => {
  try {
    const response = await axios.get(ENDPOINTS.CONVERSION.HISTORY, {
      headers: {
        ...API_CONFIG.headers,
        Authorization: getAuthHeader(token),
      },
      timeout: API_CONFIG.timeout,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Failed to load conversion history records",
      }
    );
  }
};

// import axios from "axios";
// import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

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

// 🟢 ADDED: Directly handles your wallet payouts
export const withdrawWalletFunds = async (amount, transactionPin, token) => {
  const response = await axios.post(
    ENDPOINTS.WALLET.WITHDRAW || ENDPOINTS.PAYMENT.WITHDRAW, // Matches your apiConfig constant
    { amount: Number(amount), transactionPin },
    {
      headers: {
        ...API_CONFIG.headers,
        Authorization: `Bearer ${token}`,
      },
      timeout: API_CONFIG.timeout,
    },
  );
  return response.data;
};
