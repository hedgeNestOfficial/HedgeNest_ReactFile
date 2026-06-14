import axios from "axios";
import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

export const getInvestmentPlans = async (token) => {
  const response = await axios.get(
    ENDPOINTS.INVESTMENT.GET_PLANS,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: API_CONFIG.timeout,
    }
  );

  return response.data;
};