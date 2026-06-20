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
    // console.log("UPLOAD ERROR:", error.response?.data);

    throw error;
  }
};

export const uploadUtilityBill = async (file, token) => {
  const formData = new FormData();

  formData.append("utilityBill", file);

  const response = await axios.post(
    ENDPOINTS.KYC.UPLOAD_UTILITY_BILL,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};
