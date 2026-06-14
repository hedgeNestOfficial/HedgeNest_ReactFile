import axios from "axios";
import { ENDPOINTS } from "../Config/apiConfig";

export const fundWallet = async (amount, token) => {
  const response = await axios.post(
    ENDPOINTS.PAYMENT.FUND_WALLET,
    { amount },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};