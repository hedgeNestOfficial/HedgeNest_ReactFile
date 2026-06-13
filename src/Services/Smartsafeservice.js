import axios from "axios";
import { ENDPOINTS, API_CONFIG } from "../Config/apiConfig";
import { useSelector } from "react-redux";

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

export const breakPlan = async (payload, token) => {
  try {
    const response = await axios.post(
      ENDPOINTS.SMART_SAVE.BREAK_PLAN,
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
