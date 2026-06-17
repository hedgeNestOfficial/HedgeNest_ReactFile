import axios from "axios";
import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

// NOTE: we will NOT use hook here (services must stay pure)
// token will be passed in like your current pattern

export const previewPlan = async (payload, token) => {
  try {
    const response = await axios.post(
      ENDPOINTS.SMART_SAVE.PREVIEW_PLAN,
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
  } catch (error) {
    throw error.response?.data || { message: "Preview failed" };
  }
};

export const createPlan = async (payload, token) => {
  try {
    const response = await axios.post(
      ENDPOINTS.SMART_SAVE.CREATE_PLAN,
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
  } catch (error) {
    throw error.response?.data || { message: "Create plan failed" };
  }
};

export const breakPlan = async (planId, payload, token) => {
  try {
    const response = await axios.post(
      `${ENDPOINTS.SMART_SAVE.BREAK_PLAN}/${planId}`,
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
  } catch (error) {
    throw error.response?.data || { message: "Break plan failed" };
  }
};
export const getOnePlan = async (id, token) => {
  try {
    const response = await axios.get(
      `${ENDPOINTS.SMART_SAVE.GET_ONE_PLAN}/${id}`,
      {
        headers: {
          ...API_CONFIG.headers,
          Authorization: `Bearer ${token}`,
        },
        timeout: API_CONFIG.timeout,
      },
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Get one plan failed" };
  }
};
export const getAllPlan = async (token) => {
  try {
    const response = await axios.get(ENDPOINTS.SMART_SAVE.GET_ALL_PLAN, {
      headers: {
        ...API_CONFIG.headers,
        Authorization: `Bearer ${token}`,
      },
      timeout: API_CONFIG.timeout,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Get all plan failed" };
  }
};

export const topUp = async (payload, savingId, token) => {
  try {
    const response = await axios.post(
      `${ENDPOINTS.SMART_SAVE.TOP_UP}/${savingId}`,
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
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Top up failed",
    );
  }
};
