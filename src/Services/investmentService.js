// import axios from "axios";
// import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

// export const getInvestmentPlans = async (token) => {
//   const response = await axios.get(ENDPOINTS.INVESTMENT.GET_PLANS, {
//     headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
//   });
//   return response.data;
// };

// export const getUserInvestments = async (token) => {
//   const response = await axios.get(ENDPOINTS.INVESTMENT.GET_USER_INVESTMENTS, {
//     headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
//   });
//   return response.data;
// };

// export const initiateInvestment = async (payload, token) => {
//   const response = await axios.post(
//     ENDPOINTS.INVESTMENT.INITIATE_INVESTMENT,
//     payload,
//     {
//       headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
//     },
//   );
//   return response.data;
// };

// export const completeInvestment = async (payload, token) => {
//   const response = await axios.put(
//     ENDPOINTS.INVESTMENT.COMPLETE_INVESTMENT,
//     payload,
//     {
//       headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
//     },
//   );
//   return response.data;
// };

// export const claimInvestment = async (payload, token) => {
//   const response = await axios.put(
//     ENDPOINTS.INVESTMENT.CLAIM_INVESTMENT,
//     payload,
//     {
//       headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
//     },
//   );
//   return response.data;
// };

// /**
//  * Confirms Transaction Authorization PIN
//  */
// export const confirmTransactionPin = async (userId, enteredPin, token) => {
//   const response = await axios.post(
//     `${ENDPOINTS.INVESTMENT.CONFIRM_PIN}/${userId}`,
//     { enteredPin },
//     {
//       headers: { ...API_CONFIG.headers, Authorization: `Bearer ${token}` },
//     },
//   );
//   return response.data;
// };

// /*
// |--------------------------------------------------------------------------
// | Break Investment (Liquidate Active Position Early)
// |--------------------------------------------------------------------------
// */
// export const breakInvestment = async (investmentId, token) => {
//   try {
//     const response = await axios.put(
//       `${ENDPOINTS.INVESTMENT.BREAK_INVESTMENT}/${investmentId}`,
//       {
//         investmentId, // Parameter 2: data/body
//       },
//       {
//         // Parameter 3: config (headers, timeout, etc.)
//         headers: {
//           ...API_CONFIG.headers,
//           Authorization: `Bearer ${token}`, // ✅ Token is here
//         },
//         timeout: API_CONFIG.timeout,
//       },
//     );

//     return response.data;
//   } catch (error) {
//     // console.error("❌ API FAILURE DURING INVESTMENT LIQUIDATION:", error);
//     throw error;
//   }
// };

import axios from "axios";
import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

/**
 * ============================================================================
 * INVESTMENT SERVICE - COMPLETE & PRODUCTION READY
 * ============================================================================
 *
 * All functions include:
 * ✅ Error handling (try-catch)
 * ✅ Parameter validation
 * ✅ Proper headers (spread API_CONFIG.headers)
 * ✅ Timeout specifications
 * ✅ Console logging for debugging
 * ✅ Structured error responses
 */

// ============================================================================
// HELPER FUNCTION
// ============================================================================

const getAuthHeader = (token) => {
  if (!token) return "";
  const cleanToken = token.toString().trim();
  return cleanToken.startsWith("Bearer ") ? cleanToken : `Bearer ${cleanToken}`;
};

// ============================================================================
// GET INVESTMENT PLANS
// ============================================================================

/**
 * Fetch all available investment plans
 *
 * GET /api/v1/investmentPlan
 * Auth: Required
 *
 * Response: { investmentPlan: [...] }
 */
export const getInvestmentPlans = async (token) => {
  try {
    console.log(" Fetching investment plans...");

    if (!token) {
      throw new Error("Authorization token is required");
    }

    const response = await axios.get(ENDPOINTS.INVESTMENT.GET_PLANS, {
      headers: {
        ...API_CONFIG.headers,
        Authorization: getAuthHeader(token),
      },
      timeout: API_CONFIG.timeout,
    });

    console.log(
      "Investment plans loaded:",
      response.data.investmentPlan?.length,
    );
    return response.data;
  } catch (error) {
    console.error("Get Plans Error:", error.message);
    throw {
      message:
        error?.response?.data?.message || "Failed to load investment plans",
      status: error?.response?.status,
      data: error?.response?.data,
    };
  }
};

// ============================================================================
// GET USER INVESTMENTS
// ============================================================================

/**
 * Fetch user's active investments
 *
 * GET /api/v1/investment
 * Auth: Required
 *
 * Response: { data: [...] }
 */
export const getUserInvestments = async (token) => {
  try {
    console.log("📈 Fetching user investments...");

    if (!token) {
      throw new Error("Authorization token is required");
    }

    const response = await axios.get(
      ENDPOINTS.INVESTMENT.GET_USER_INVESTMENTS,
      {
        headers: {
          ...API_CONFIG.headers,
          Authorization: getAuthHeader(token),
        },
        timeout: API_CONFIG.timeout,
      },
    );

    console.log(" investments loaded:", response.data.data?.length);
    return response.data;
  } catch (error) {
    console.error("❌ Get User Investments Error:", error.message);
    throw {
      message:
        error?.response?.data?.message || "Failed to load your investments",
      status: error?.response?.status,
      data: error?.response?.data,
    };
  }
};

// ============================================================================
// INITIATE INVESTMENT
// ============================================================================

/**
 * Start a new investment
 *
 * POST /api/v1/initiateInvestment
 * Auth: Required
 *
 * Payload: { investmentPlanId, amount }
 * Response: { message, data }
 */
export const initiateInvestment = async (payload, token) => {
  try {
    console.log("Initiating investment...");

    if (!token) {
      throw new Error("Authorization token is required");
    }

    if (!payload.investmentPlanId) {
      throw new Error("Investment plan ID is required");
    }

    if (!payload.amount || payload.amount <= 0) {
      throw new Error("Valid amount is required");
    }

    const response = await axios.post(
      ENDPOINTS.INVESTMENT.INITIATE_INVESTMENT,
      payload,
      {
        headers: {
          ...API_CONFIG.headers,
          Authorization: getAuthHeader(token),
        },
        timeout: API_CONFIG.timeout,
      },
    );

    console.log("✅ Investment initiated successfully");
    return response.data;
  } catch (error) {
    console.error("❌ Initiate Investment Error:", error.message);
    throw {
      message:
        error?.response?.data?.message || "Failed to initiate investment",
      status: error?.response?.status,
      data: error?.response?.data,
    };
  }
};

// ============================================================================
// COMPLETE INVESTMENT (For naturally matured investments)
// ============================================================================

/**
 * Mark investment as complete (after maturity)
 *
 * PUT /api/v1/compInvestment
 * Auth: Required
 *
 * Payload: { investmentId, userId }
 * Response: { message }
 */
export const completeInvestment = async (payload, token) => {
  try {
    console.log("✔️ Completing investment...", {
      investmentId: payload.investmentId,
    });

    if (!token) {
      throw new Error("Authorization token is required");
    }

    if (!payload.investmentId) {
      throw new Error("Investment ID is required");
    }

    const response = await axios.put(
      ENDPOINTS.INVESTMENT.COMPLETE_INVESTMENT,
      payload,
      {
        headers: {
          ...API_CONFIG.headers,
          Authorization: getAuthHeader(token),
        },
        timeout: API_CONFIG.timeout,
      },
    );

    console.log("✅ Investment marked as complete");
    return response.data;
  } catch (error) {
    console.error("❌ Complete Investment Error:", error.message);
    throw {
      message:
        error?.response?.data?.message || "Failed to complete investment",
      status: error?.response?.status,
      data: error?.response?.data,
    };
  }
};

// ============================================================================
// CLAIM INVESTMENT (Withdraw funds)
// ============================================================================

/**
 * Claim/withdraw investment funds
 *
 * PUT /api/v1/claimInvestment
 * Auth: Required
 *
 * Payload: { investmentId, userId }
 * Response: { message }
 *
 * Used for:
 * - Claiming naturally matured investments (after completeInvestment)
 * - Claiming broken investments (after 26-hour settlement period)
 */
export const claimInvestment = async (payload, token) => {
  try {
    console.log("💳 Claiming investment funds...", {
      investmentId: payload.investmentId,
    });

    if (!token) {
      throw new Error("Authorization token is required");
    }

    if (!payload.investmentId) {
      throw new Error("Investment ID is required");
    }

    const response = await axios.put(
      ENDPOINTS.INVESTMENT.CLAIM_INVESTMENT,
      payload,
      {
        headers: {
          ...API_CONFIG.headers,
          Authorization: getAuthHeader(token),
        },
        timeout: API_CONFIG.timeout,
      },
    );

    console.log("✅ Investment funds claimed successfully");
    return response.data;
  } catch (error) {
    console.error("❌ Claim Investment Error:", error.message);
    throw {
      message:
        error?.response?.data?.message || "Failed to claim investment funds",
      status: error?.response?.status,
      data: error?.response?.data,
    };
  }
};

// ============================================================================
// CONFIRM TRANSACTION PIN
// ============================================================================

/**
 * Verify transaction PIN before operations
 *
 * POST /api/v1/entered-pin/{userId}
 * Auth: Required
 *
 * Params:
 * - userId: User ID from Redux state
 * - enteredPin: 6-digit PIN
 * - token: JWT token
 *
 * Response: { message: "PIN verified" }
 */
export const confirmTransactionPin = async (userId, enteredPin, token) => {
  try {
    console.log("🔐 Verifying transaction PIN...");

    if (!userId) {
      throw new Error("User ID is required for PIN verification");
    }

    if (!enteredPin || enteredPin.length !== 6) {
      throw new Error("PIN must be 6 digits");
    }

    if (!token) {
      throw new Error("Authorization token is required");
    }

    const response = await axios.post(
      `${ENDPOINTS.INVESTMENT.CONFIRM_PIN}/${userId}`,
      { enteredPin },
      {
        headers: {
          ...API_CONFIG.headers,
          Authorization: getAuthHeader(token),
        },
        timeout: API_CONFIG.timeout,
      },
    );

    console.log("✅ PIN verified successfully");
    return response.data;
  } catch (error) {
    console.error("❌ PIN Verification Error:", error.message);
    throw {
      message: error?.response?.data?.message || "PIN verification failed",
      status: error?.response?.status,
      data: error?.response?.data,
    };
  }
};

// ============================================================================
// BREAK INVESTMENT (Liquidate early)
// ============================================================================

/**
 * Break/terminate an active investment early
 *
 * PUT /api/v1/breakInvestment/{investmentId}
 * Auth: Required
 *
 * Params:
 * - investmentId: Investment ID to break
 * - token: JWT token
 *
 * Response: { message: "Investment terminated", ... }
 *
 * Result: Investment enters 26-hour settlement period before funds can be claimed
 */
export const breakInvestment = async (investmentId, token) => {
  try {
    console.log("⚡ Breaking investment...", { investmentId });

    if (!investmentId) {
      throw new Error("Investment ID is required");
    }

    if (!token) {
      throw new Error("Authorization token is required");
    }

    const response = await axios.put(
      `${ENDPOINTS.INVESTMENT.BREAK_INVESTMENT}/${investmentId}`,
      { investmentId }, // Body parameter
      {
        headers: {
          ...API_CONFIG.headers,
          Authorization: getAuthHeader(token),
        },
        timeout: API_CONFIG.timeout,
      },
    );

    console.log(
      "✅ Investment broken successfully - 26 hour settlement period started",
    );
    return response.data;
  } catch (error) {
    console.error("❌ Break Investment Error:", error.message);
    throw {
      message: error?.response?.data?.message || "Failed to break investment",
      status: error?.response?.status,
      data: error?.response?.data,
    };
  }
};

/**
 * ============================================================================
 * ERROR RESPONSE FORMAT (All functions)
 * ============================================================================
 *
 * All functions throw errors in this consistent format:
 *
 * {
 *   message: "User-friendly error message",
 *   status: HTTP status code,
 *   data: Full backend error response
 * }
 *
 * Usage in components:
 *
 * try {
 *   const result = await someFunction(payload, token);
 * } catch (error) {
 *   toast.error(error.message);  // Show to user
 *   console.error(error.data);    // Log for debugging
 * }
 *
 * ============================================================================
 */
