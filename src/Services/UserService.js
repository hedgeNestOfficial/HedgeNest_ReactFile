// Services/userService.js

import axios from "axios";

import { ENDPOINTS } from "../Config/apiConfig";

export const getCurrentUser = async (token) => {
  const response = await axios.get(ENDPOINTS.USER.GET_ONE_USER, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Utils/refreshUserData.js

import { login } from "../Store/UserSlice";
import { getUserById } from "../Services/userService";

export const refreshUserData = async (userId, token, dispatch) => {
  try {
    const response = await getUserById(userId, token);

    dispatch(
      login({
        user: response.user,
        wallet: response.wallet,
        token,
      }),
    );

    return response;
  } catch (error) {
    console.log(error);
  }
};
