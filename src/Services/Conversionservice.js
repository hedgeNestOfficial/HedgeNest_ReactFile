import axios from "axios";
import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

export const convertCurrency = async (payload, token) => {
  try {
    const response = await axios.post(ENDPOINTS.CONVERSION.CONVERT, payload, {
      headers: {
        ...API_CONFIG.headers,
        Authorization: `Bearer ${token}`,
      },
      timeout: API_CONFIG.timeout,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Conversion failed" };
  }
};

export const GetLiveRate = async () => {
  try {
    const response = await axios.get(ENDPOINTS.CONVERSION.LIVE_RATE);
    console.log(response);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Live rate failed, try again" };
  }
};

export const GetHistory = async (token) => {
  try {
    const response = await axios.get(ENDPOINTS.CONVERSION.HISTORY, {
      headers: {
        ...API_CONFIG.headers,
        Authorization: `Bearer ${token}`,
      },
      timeout: API_CONFIG.timeout,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Live rate failed, try again" };
  }
};
