import axios from "axios";
import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

export const fundWallet = async (amount, token) => {
  if (!token) {
    throw new Error("Authorization token is missing. Please log in again.");
  }

  // Guard: Clean up token in case it already contains "Bearer " or has trailing whitespace
  const cleanToken = token.toString().trim();
  const formattedAuthorization = cleanToken.startsWith("Bearer ")
    ? cleanToken
    : `Bearer ${cleanToken}`;

  const response = await axios.post(
    ENDPOINTS.PAYMENT.FUND_WALLET,
    { amount },
    {
      headers: {
        ...API_CONFIG.headers, // ✅ Includes Content-Type: application/json
        Authorization: formattedAuthorization,
      },
    },
  );

  return response.data;
};

export const verifyPayment = async (reference, token) => {
  const response = await axios.get(
    `${ENDPOINTS.PAYMENT.VERIFY_PAYMENT}?reference=${reference}`,
    {
      headers: {
        ...API_CONFIG.headers, // ✅ Also add here for consistency
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const getLinkedAccounts = async (token) => {
  if (!token) {
    throw new Error("Authorization token is missing.");
  }
  const cleanToken = token.toString().trim();
  const formattedAuthorization = cleanToken.startsWith("Bearer ")
    ? cleanToken
    : `Bearer ${cleanToken}`;

  // Assuming ENDPOINTS.PAYMENT.GET_LINKED_ACCOUNTS exists, or use the direct path string
  const response = await axios.get(
    "https://hedgenest.onrender.com/api/v1/get-linked-account",
    {
      headers: {
        ...API_CONFIG.headers,
        Authorization: formattedAuthorization,
      },
    },
  );
  return response.data;
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

export const withdrawFunds = async (amount, bankId, token) => {
  if (!token) {
    throw new Error("Authorization token is missing.");
  }
  const cleanToken = token.toString().trim();
  const formattedAuthorization = cleanToken.startsWith("Bearer ")
    ? cleanToken
    : `Bearer ${cleanToken}`;

  const response = await axios.post(
    "https://hedgenest.onrender.com/api/v1/withdraw",
    { amount, bankId },
    {
      headers: {
        ...API_CONFIG.headers,
        Authorization: formattedAuthorization,
      },
    },
  );
  return response.data;
};
