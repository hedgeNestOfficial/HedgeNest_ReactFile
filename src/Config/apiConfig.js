const BASE_URL = import.meta.env.HedgeNest_Url;

export const API_CONFIG = {
  baseUrl: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const ENDPOINTS = {
  AUTH: {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
    VERIFY_KYC: `${BASE_URL}/auth/verify-kyc`,
  },
  RATES: {
    LIVE_USDT: `${BASE_URL}/rates/live`,
    CONVERT: `${BASE_URL}/rates/convert`,
  },
  SAVINGS: {
    GET_VAULTS: `${BASE_URL}/savings/vaults`,
    CREATE_GOAL: `${BASE_URL}/savings/create`,
  },
};
