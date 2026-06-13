import axios from "axios";
import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

export const convertCurrency = async (payload, token) => {
  try {
    const response = await axios.post(ENDPOINTS.WALLET.CONVERT, payload, {
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
