import axios from "axios";
import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";

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
    console.log("Preview Plan API Error:", error);
    // 🛠️ FIX: Fallback to the original error if response.data is undefined
    throw error.response?.data || error;
  }
};

export const getPreviewPlan = async (planId, token) => {
  try {
    const response = await axios.get(
      `${ENDPOINTS.SMART_SAVE.GET_PREVIEW_PLAN}/${planId}`,
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
    throw error.response?.data || { message: "Get preview plan failed" };
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
    throw {
      message:
        error?.response?.data?.message || error?.message || "Break plan failed",
    };
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

export const confirmPin = async (userId, enteredPin, token) => {
  try {
    const response = await axios.post(
      `${ENDPOINTS.SMART_SAVE.CONFIRM_PIN}/${userId}`,
      { enteredPin },
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
    throw error.response?.data || { message: "Pin verification failed" };
  }
};
