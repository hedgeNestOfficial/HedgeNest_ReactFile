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
      ...API_CONFIG.headers,
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
      ...API_CONFIG.headers,
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
| Break Investment
|--------------------------------------------------------------------------
*/
export const handleBreakInvestment = async (investmentId, transactionPin) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | The Perfect Payload Matching your Network Logs
    |--------------------------------------------------------------------------
    | 1. URL path appends the ID: ${ENDPOINTS.INVESTMENT.BREAK_INVESTMENT}/${investmentId}
    | 2. Body Payload (Second Argument): Passes the object keys to satisfy the
    |    backend "investment ID is required" verification layer.
    */
    const response = await axios.put(
      `${ENDPOINTS.INVESTMENT.BREAK_INVESTMENT}/${investmentId}`, 
      {
        investmentId: investmentId,   // ⚡ Crucial: Satisfies the backend body validation
        enteredPin: transactionPin     // Passes the verified PIN along for authentication
      }
    );

    return response.data;
  } catch (error) {
    console.error("API Error during investment liquidation:", error);
    throw error;
  }
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
        ...API_CONFIG.headers,
        Authorization: `Bearer ${token}`,
      },
      timeout: API_CONFIG.timeout,
    },
  );

  return response.data;
};
