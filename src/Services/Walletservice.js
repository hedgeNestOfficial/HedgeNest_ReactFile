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

export const getMyWallet = async (token) => {
  const response = await axios.get(ENDPOINTS.WALLET.GET_MY_WALLET, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
