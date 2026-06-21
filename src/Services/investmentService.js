import axios from "axios";
import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

export const getInvestmentPlans = async (token) => {
  const response = await axios.get(ENDPOINTS.INVESTMENT.GET_PLANS, {
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserInvestments = async (token) => {
  const response = await axios.get(ENDPOINTS.INVESTMENT.GET_USER_INVESTMENTS, {
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const initiateInvestment = async (payload, token) => {
  const response = await axios.post(
    ENDPOINTS.INVESTMENT.INITIATE_INVESTMENT,
    payload,
    {
      headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

export const completeInvestment = async (payload, token) => {
  const response = await axios.put(
    ENDPOINTS.INVESTMENT.COMPLETE_INVESTMENT,
    payload,
    {
      headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

export const claimInvestment = async (payload, token) => {
  const response = await axios.put(
    ENDPOINTS.INVESTMENT.CLAIM_INVESTMENT,
    payload,
    {
      headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

/**
 * Confirms Transaction Authorization PIN
 */
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

/*
|--------------------------------------------------------------------------
| Break Investment (Liquidate Active Position Early)
|--------------------------------------------------------------------------
*/
export const breakInvestment = async (investmentId, token) => {
  try {
    const response = await axios.put(
      `${ENDPOINTS.INVESTMENT.BREAK_INVESTMENT}/${investmentId}`,
      {
        investmentId, // Parameter 2: data/body
      },
      {
        // Parameter 3: config (headers, timeout, etc.)
        headers: {
          ...API_CONFIG.headers,
          Authorization: `Bearer ${token}`, // ✅ Token is here
        },
        timeout: API_CONFIG.timeout,
      },
    );

    return response.data;
  } catch (error) {
    // console.error("❌ API FAILURE DURING INVESTMENT LIQUIDATION:", error);
    throw error;
  }
};
