import axios from "axios";
import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

export const getInvestmentPlans = async (token) => {
  const response = await axios.get(ENDPOINTS.INVESTMENT.GET_PLANS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: API_CONFIG.timeout,
  });

  return response.data;
};

// import axios from "axios";
// import { ENDPOINTS } from "../Config/apiConfig";

// export const getInvestmentPlans = async (token) => {
//   const response = await axios.get(ENDPOINTS.INVESTMENT.GET_PLANS, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return response.data;
// };

export const getUserInvestments = async (token) => {
  const response = await axios.get(ENDPOINTS.INVESTMENT.GET_USER_INVESTMENTS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const initiateInvestment = async (payload, token) => {
  const response = await axios.post(
    ENDPOINTS.INVESTMENT.INITIATE_INVESTMENT,
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
};

export const completeInvestment = async (payload, token) => {
  const response = await axios.put(
    `${BASE_URL}/api/v1/compInvestment`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const claimInvestment = async (payload, token) => {
  const response = await axios.put(
    `${BASE_URL}/api/v1/claimInvestment`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
// Services/investmentService.js

// import axios from "axios";
// import { ENDPOINTS } from "../Config/apiConfig";

// export const getInvestmentPlans = async (token) => {
//   const response = await axios.get(
//     ENDPOINTS.INVESTMENT.GET_PLANS,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   return response.data;
// }
