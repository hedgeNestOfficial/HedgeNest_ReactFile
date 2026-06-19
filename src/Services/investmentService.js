// import axios from "axios";
// import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

// /*
// |--------------------------------------------------------------------------
// | Investment Plans
// |--------------------------------------------------------------------------
// */

// export const getInvestmentPlans = async (token) => {
//   const response = await axios.get(ENDPOINTS.INVESTMENT.GET_PLANS, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     timeout: API_CONFIG.timeout,
//   });

//   return response.data;
// };

// /*
// |--------------------------------------------------------------------------
// | User Investments
// |--------------------------------------------------------------------------
// */

// export const getUserInvestments = async (token) => {
//   const response = await axios.get(ENDPOINTS.INVESTMENT.GET_USER_INVESTMENTS, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     timeout: API_CONFIG.timeout,
//   });

//   return response.data;
// };

// /*
// |--------------------------------------------------------------------------
// | Create Investment
// |--------------------------------------------------------------------------
// */

// export const initiateInvestment = async (payload, token) => {
//   const response = await axios.post(
//     ENDPOINTS.INVESTMENT.INITIATE_INVESTMENT,
//     payload,
//     {
//       headers: {
//         ...API_CONFIG.headers,
//         Authorization: `Bearer ${token}`,
//       },
//       timeout: API_CONFIG.timeout,
//     },
//   );

//   return response.data;
// };

// /*
// |--------------------------------------------------------------------------
// | Complete Matured Investment
// |--------------------------------------------------------------------------
// */

// export const completeInvestment = async (payload, token) => {
//   const response = await axios.put(
//     ENDPOINTS.INVESTMENT.COMPLETE_INVESTMENT,
//     payload,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     },
//   );

//   return response.data;
// };

// /*
// |--------------------------------------------------------------------------
// | Claim Investment
// |--------------------------------------------------------------------------
// */

// export const claimInvestment = async (payload, token) => {
//   const response = await axios.put(
//     ENDPOINTS.INVESTMENT.CLAIM_INVESTMENT,
//     payload,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     },
//   );

//   return response.data;
// };

// /*
// |--------------------------------------------------------------------------
// | Break Investment
// |--------------------------------------------------------------------------
// */

// // export const breakInvestment = async (
// //   investmentId,
// //   token
// // ) => {
// //   const response = await axios.put(
// //     `${ENDPOINTS.INVESTMENT.BREAK_INVESTMENT}/${investmentId}`,
// //     {
// //       investmentId,
// //     },
// //     {
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //       },
// //     }
// //   );

// //   return response.data;
// // };

// export const confirmTransactionPin = async (userId, enteredPin, token) => {
//   const response = await axios.post(
//     `${ENDPOINTS.INVESTMENT.CONFIRM_PIN}/${userId}`,
//     {
//       enteredPin,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     },
//   );

//   return response.data;
// };

// export const breakInvestment = async (investmentId, token) => {
//   const response = await axios.put(
//     `${ENDPOINTS.INVESTMENT.BREAK_INVESTMENT}/${investmentId}`,
//     {
//       investmentId,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     },
//   );

//   return response.data;
// };

import axios from "axios";
import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

/*
|--------------------------------------------------------------------------
| Investment Plans
|--------------------------------------------------------------------------
*/
export const getInvestmentPlans = async (token) => {
  const response = await axios.get(ENDPOINTS.INVESTMENT.GET_PLANS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: API_CONFIG.timeout,
  });

  return response.data;
};

/*
|--------------------------------------------------------------------------
| User Investments
|--------------------------------------------------------------------------
*/
export const getUserInvestments = async (token) => {
  const response = await axios.get(ENDPOINTS.INVESTMENT.GET_USER_INVESTMENTS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: API_CONFIG.timeout,
  });

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Create Investment
|--------------------------------------------------------------------------
*/
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

/*
|--------------------------------------------------------------------------
| Complete Investment
|--------------------------------------------------------------------------
*/
export const completeInvestment = async (payload, token) => {
  const response = await axios.put(
    ENDPOINTS.INVESTMENT.COMPLETE_INVESTMENT,
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

/*
|--------------------------------------------------------------------------
| Claim Investment
|--------------------------------------------------------------------------
*/
export const claimInvestment = async (payload, token) => {
  const response = await axios.put(
    ENDPOINTS.INVESTMENT.CLAIM_INVESTMENT,
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

/*
|--------------------------------------------------------------------------
| Confirm Transaction Pin
|--------------------------------------------------------------------------
*/
export const confirmTransactionPin = async (userId, enteredPin, token) => {
  const response = await axios.post(
    `${ENDPOINTS.INVESTMENT.CONFIRM_PIN}/${userId}`,
    {
      enteredPin,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const breakInvestment = async (investmentId, token) => {
  const response = await axios.put(
    `${ENDPOINTS.INVESTMENT.BREAK_INVESTMENT}/${investmentId}`,
    {
      investmentId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
