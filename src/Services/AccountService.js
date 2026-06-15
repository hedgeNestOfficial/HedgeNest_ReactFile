import axios from "axios";
import { ENDPOINTS } from "../Config/apiConfig";

export const linkBankAccount = async (payload, token) => {
  const response = await axios.post(
    ENDPOINTS.WALLET.LINK_BANK_ACCOUNT,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};
// export const linkBankAccount = async (payload, token) => {
//   const response = await axios.post(
//     ENDPOINTS.WALLET.LINK_BANK_ACCOUNT,
//     payload,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     },
//   );

//   return response.data;
// };
