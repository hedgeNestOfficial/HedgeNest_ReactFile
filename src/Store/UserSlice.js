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

    // NEW: Safely maps the OTP stage token into tempUser memory
    updateTempUserToken: (state, action) => {
      state.tempUser = {
        ...state.tempUser,
        authToken: action.payload,
      };
    },

    login: (state, action) => {
      state.user = action.payload.user;
      state.wallet = action.payload.wallet;
      state.token = action.payload.token;
      localStorage.setItem("authToken", action.payload.token);
    },

    updateUser: (state, action) => {
      const incomingData = action.payload?.data
        ? action.payload.data
        : action.payload;
      state.user = { ...state.user, ...incomingData };
    },

    updateWallet: (state, action) => {
      state.wallet = { ...state.wallet, ...action.payload };
    },

    logout: (state) => {
      state.user = null;
      state.wallet = null;
      state.token = null;
      state.tempUser = { email: "", phoneNumber: "", authToken: null };
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("dashboardSplashShown");
    },
  },
});

// Remember to add your new action to the exports group here
export const {
  signup,
  updateTempUserToken,
  login,
  logout,
  updateUser,
  updateWallet,
} = userSlice.actions;
export default userSlice.reducer;
