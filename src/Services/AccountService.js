import axios from "axios";
import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

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
    console.error(
      "linkBankAccount failed:",
      error?.response?.data || error?.message,
    );

    throw error;
  }
};

export const confirmTransactionPin = async (userId, enteredPin, token) => {
  try {
    const response = await axios.post(
      `${ENDPOINTS.INVESTMENT.CONFIRM_PIN}/${userId}`,
      {
        enteredPin,
      },
      {
        headers: {
          ...API_CONFIG.headers,
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(
      "confirmTransactionPin failed:",
      error?.response?.data || error?.message,
    );

    throw error;
  }
};
