import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const submitKyc = async (formData, token) => {
  const response = await axios.post(`${BASE_URL}/kyc/verify`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
