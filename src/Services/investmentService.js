// // import axios from "axios";
// // import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

// // /*
// // |--------------------------------------------------------------------------
// // | Fetch Active Investment Plans
// // |--------------------------------------------------------------------------
// // */
// // export const getInvestmentPlans = async (token) => {
// //   const response = await axios.get(ENDPOINTS.INVESTMENT.GET_PLANS, {
// //     headers: {
// //       ...API_CONFIG.headers,
// //       Authorization: `Bearer ${token}`,
// //     },
// //     timeout: API_CONFIG.timeout,
// //   });
// //   return response.data;
// // };

// // /*
// // |--------------------------------------------------------------------------
// // | Fetch Specific Active User Investment Positions
// // |--------------------------------------------------------------------------
// // */
// // export const getUserInvestments = async (token) => {
// //   const response = await axios.get(ENDPOINTS.INVESTMENT.GET_USER_INVESTMENTS, {
// //     headers: {
// //       ...API_CONFIG.headers,
// //       Authorization: `Bearer ${token}`,
// //     },
// //     timeout: API_CONFIG.timeout,
// //   });
// //   return response.data;
// // };

// // /*
// // |--------------------------------------------------------------------------
// // | Initiate Fresh Investment Setup Flow
// // |--------------------------------------------------------------------------
// // */
// // export const initiateInvestment = async (payload, token) => {
// //   const response = await axios.post(
// //     ENDPOINTS.INVESTMENT.INITIATE_INVESTMENT,
// //     payload,
// //     {
// //       headers: {
// //         ...API_CONFIG.headers,
// //         Authorization: `Bearer ${token}`,
// //       },
// //       timeout: API_CONFIG.timeout,
// //     },
// //   );
// //   return response.data;
// // };

// // /*
// // |--------------------------------------------------------------------------
// // | Auto-Complete Mature Positions
// // |--------------------------------------------------------------------------
// // */
// // export const completeInvestment = async (payload, token) => {
// //   const response = await axios.put(
// //     ENDPOINTS.INVESTMENT.COMPLETE_INVESTMENT,
// //     payload,
// //     {
// //       headers: {
// //         ...API_CONFIG.headers,
// //         Authorization: `Bearer ${token}`,
// //       },
// //       timeout: API_CONFIG.timeout,
// //     },
// //   );
// //   return response.data;
// // };

// // /*
// // |--------------------------------------------------------------------------
// // | Claim Accrued Investment Settlement Dividends
// // |--------------------------------------------------------------------------
// // */
// // export const claimInvestment = async (payload, token) => {
// //   const response = await axios.put(
// //     ENDPOINTS.INVESTMENT.CLAIM_INVESTMENT,
// //     payload,
// //     {
// //       headers: {
// //         ...API_CONFIG.headers,
// //         Authorization: `Bearer ${token}`,
// //       },
// //       timeout: API_CONFIG.timeout,
// //     },
// //   );
// //   return response.data;
// // };

// // /*
// // |--------------------------------------------------------------------------
// // | Break Investment (Liquidate Active Position Early)
// // |--------------------------------------------------------------------------
// // */
// // export const breakInvestment = async (investmentId, transactionPin, token) => {
// //   try {
// //     const response = await axios.put(
// //       `${ENDPOINTS.INVESTMENT.BREAK_INVESTMENT}/${investmentId}`,
// //       {
// //         investmentId: investmentId, // Satisfies backend body verification layers
// //         enteredPin: transactionPin, // Transmits security authorization payload
// //       },
// //       {
// //         headers: {
// //           ...API_CONFIG.headers,
// //           Authorization: `Bearer ${token}`, // Authorizes platform operation identity
// //         },
// //         timeout: API_CONFIG.timeout,
// //       },
// //     );
// //     return response.data;
// //   } catch (error) {
// //     console.error("❌ API FAILURE DURING INVESTMENT LIQUIDATION:", error);
// //     throw error;
// //   }
// // };

// // /*
// // |--------------------------------------------------------------------------
// // | Global Transaction PIN Core Validation Engine
// // |--------------------------------------------------------------------------
// // */
// // export const confirmTransactionPin = async (userId, enteredPin, token) => {
// //   const response = await axios.post(
// //     `${ENDPOINTS.INVESTMENT.CONFIRM_PIN}/${userId}`,
// //     { enteredPin },
// //     {
// //       headers: {
// //         ...API_CONFIG.headers,
// //         Authorization: `Bearer ${token}`,
// //       },
// //       timeout: API_CONFIG.timeout,
// //     },
// //   );
// //   return response.data;
// // };

// import axios from "axios";
// import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

// export const getInvestmentPlans = async (token) => {
//   const response = await axios.get(ENDPOINTS.INVESTMENT.GET_PLANS, {
//     headers: {
//       ...API_CONFIG.headers,
//       Authorization: `Bearer ${token}`,
//     },
//     timeout: API_CONFIG.timeout,
//   });
//   return response.data;
// };

// export const getUserInvestments = async (token) => {
//   const response = await axios.get(ENDPOINTS.INVESTMENT.GET_USER_INVESTMENTS, {
//     headers: {
//       ...API_CONFIG.headers,
//       Authorization: `Bearer ${token}`,
//     },
//     timeout: API_CONFIG.timeout,
//   });
//   return response.data;
// };

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

// export const completeInvestment = async (payload, token) => {
//   const response = await axios.put(
//     ENDPOINTS.INVESTMENT.COMPLETE_INVESTMENT,
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

// export const claimInvestment = async (payload, token) => {
//   const response = await axios.put(
//     ENDPOINTS.INVESTMENT.CLAIM_INVESTMENT,
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

// /**
//  * Liquidates an active investment position early
//  * @param {string} investmentId - Target document identifier
//  * @param {string} transactionPin - The confirmed 6-digit user PIN
//  * @param {string} token - User Authentication Bearer Token
//  */
// export const confirmTransactionPin = async (userId, enteredPin, token) => {
//   const response = await axios.post(
//     `${ENDPOINTS.INVESTMENT.CONFIRM_PIN}/${userId}`,
//     { enteredPin },
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

// /**
//  * 2. Break Investment (Expects only ID in params and Bearer Token)
//  */
// export const breakInvestment = async (investmentId, token) => {
//   try {
//     const response = await axios.put(
//       `${ENDPOINTS.INVESTMENT.BREAK_INVESTMENT}/${investmentId}`,
//       // Empty body payload because backend reads ID directly from the URL parameters
//       {
//         headers: {
//           ...API_CONFIG.headers,
//           Authorization: `Bearer ${token}`,
//         },
//         timeout: API_CONFIG.timeout,
//       },
//     );
//     return response.data;
//   } catch (error) {
//     console.error("❌ API FAILURE DURING INVESTMENT LIQUIDATION:", error);
//     throw error;
//   }
// };

import axios from "axios";
import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

export const getInvestmentPlans = async (token) => {
  const response = await axios.get(ENDPOINTS.INVESTMENT.GET_PLANS, {
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserInvestments = async (token) => {
  const response = await axios.get(ENDPOINTS.INVESTMENT.GET_USER_INVESTMENTS, {
    headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const initiateInvestment = async (payload, token) => {
  const response = await axios.post(
    ENDPOINTS.INVESTMENT.INITIATE_INVESTMENT,
    payload,
    {
      headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

export const completeInvestment = async (payload, token) => {
  const response = await axios.put(
    ENDPOINTS.INVESTMENT.COMPLETE_INVESTMENT,
    payload,
    {
      headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

export const claimInvestment = async (payload, token) => {
  const response = await axios.put(
    ENDPOINTS.INVESTMENT.CLAIM_INVESTMENT,
    payload,
    {
      headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

/**
 * Confirms Transaction Authorization PIN
 */
export const confirmTransactionPin = async (userId, enteredPin, token) => {
  const response = await axios.post(
    `${ENDPOINTS.INVESTMENT.CONFIRM_PIN}/${userId}`,
    { enteredPin },
    {
      headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

/*
|--------------------------------------------------------------------------
| Break Investment (Liquidate Active Position Early)
|--------------------------------------------------------------------------
*/
export const breakInvestment = async (investmentId, token) => {
  try {
    const response = await axios.put(
      `${ENDPOINTS.INVESTMENT.BREAK_INVESTMENT}/${investmentId}`,
      {
        investmentId, // Parameter 2: data/body
      },
      {
        // Parameter 3: config (headers, timeout, etc.)
        headers: {
          ...API_CONFIG.headers,
          Authorization: `Bearer ${token}`, // ✅ Token is here
        },
        timeout: API_CONFIG.timeout,
      },
    );

    return response.data;
  } catch (error) {
    // console.error("❌ API FAILURE DURING INVESTMENT LIQUIDATION:", error);
    throw error;
  }
};
