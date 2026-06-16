import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  wallet: null,
  token: null,

  tempUser: {
    email: "",
    phoneNumber: "",
    authToken: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signup: (state, action) => {
      state.tempUser = action.payload;
    },

    login: (state, action) => {
      state.user = action.payload.user;
      state.wallet = action.payload.wallet;
      state.token = action.payload.token;

      // Note: Redux-persist handles saving user and wallet automatically!
      // But we keep this string check for middleware or axios interceptor configurations if needed.
      localStorage.setItem("authToken", action.payload.token);
    },

    updateUser: (state, action) => {
      const incomingData = action.payload?.data
        ? action.payload.data
        : action.payload;

      // Simply update the state. Redux-persist detects this change and updates storage automatically.
      state.user = {
        ...state.user,
        ...incomingData,
      };
    },

    updateWallet: (state, action) => {
      state.wallet = {
        ...state.wallet,
        ...action.payload,
      };
    },

    logout: (state) => {
      state.user = null;
      state.wallet = null;
      state.token = null;

      state.tempUser = {
        email: "",
        phoneNumber: "",
        authToken: null,
      };

      localStorage.removeItem("authToken");

      sessionStorage.removeItem("dashboardSplashShown");
    },
  },
});

export const { signup, login, logout, updateUser, updateWallet } =
  userSlice.actions;
export default userSlice.reducer;
