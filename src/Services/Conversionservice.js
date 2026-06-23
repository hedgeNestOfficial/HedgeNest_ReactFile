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
