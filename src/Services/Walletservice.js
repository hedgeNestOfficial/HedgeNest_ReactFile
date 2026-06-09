import axios from "axios";

import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

/* =========================
   LINK BANK ACCOUNT
========================= */

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
