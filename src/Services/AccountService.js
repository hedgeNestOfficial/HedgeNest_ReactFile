import axios from "axios";
import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

export const linkBankAccount = async (payload, token) => {
  const response = await axios.post(
    ENDPOINTS.WALLET.LINK_BANK_ACCOUNT,
    payload,
    {
      headers: {
        ...API_CONFIG.headers,
        Authorization: `Bearer ${token}`,
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
      headers: {
        ...API_CONFIG.headers,
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const getLinkedAccounts = async (token) => {
  const response = await axios.get(ENDPOINTS.WALLET.GET_LINKED_ACCOUNTS, {
    headers: {
      ...API_CONFIG.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
