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
// import axios from "axios";
// import { ENDPOINTS } from "../Config/apiConfig";

// Services/paymentService.js

// import axios from "axios";
// import { ENDPOINTS } from "../Config/apiConfig";

export const verifyPayment = async (reference, token) => {
  const response = await axios.get(
    `${ENDPOINTS.PAYMENT.VERIFY_PAYMENT}?reference=${reference}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
