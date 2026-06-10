export const submitKyc = async (formData, token) => {
  try {
    const response = await axios.post(ENDPOINTS.AUTH.VERIFY_KYC, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },

      timeout: API_CONFIG.timeout,
    });

    return response.data;
  } catch (error) {
    console.log("UPLOAD ERROR:", error.response?.data);

    throw error;
  }
};
