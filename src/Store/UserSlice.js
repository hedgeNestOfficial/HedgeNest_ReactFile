import { createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

const initialState = {
  user: null, // Authenticated user object
  wallet: null, // Wallet data payload
  token: null, // 🔑 SINGLE UNIFIED JWT TOKEN PATH (Used for OTP, PIN creation, & Active Session)
  rehydrating: true, // Redux-persist state tracking flag

  tempUser: {
    email: "",
    phoneNumber: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /**
     * Stores basic demographic keys during signup initialization
     */
    signup: (state, action) => {
      state.tempUser = action.payload;
    },

    updateTempUserToken: (state, action) => {
      state.token = action.payload; // Writes straight to global token path
    },

    login: (state, action) => {
      state.user = action.payload.user;
      state.wallet = action.payload.wallet || null;
      state.token = action.payload.token; // Overwrites temporary token with final session token
      state.rehydrating = false;
    },

    clearTempUser: (state) => {
      state.tempUser = {
        email: "",
        phoneNumber: "",
      };
    },

    updateUser: (state, action) => {
      const incomingData = action.payload?.data
        ? action.payload.data
        : action.payload;
      state.user = { ...state.user, ...incomingData };
    },

    /**
     * Syncs updated financial and wallet metrics
     */
    updateWallet: (state, action) => {
      state.wallet = { ...state.wallet, ...action.payload };
    },

    /**
     * Flushes complete session and storage profiles on user exit
     */
    logout: (state) => {
      state.user = null;
      state.wallet = null;
      state.token = null;
      state.tempUser = {
        email: "",
        phoneNumber: "",
      };
      state.rehydrating = false;
      sessionStorage.removeItem("dashboardSplashShown");
    },
  },

  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action) => {
      console.log("🔄 [UserSlice] REHYDRATE action received");
      if (action.payload && action.payload.user) {
        state.user = action.payload.user.user;
        state.wallet = action.payload.user.wallet;
        state.token = action.payload.user.token;
      }
      state.rehydrating = false;
    });
  },
});

export const {
  signup,
  updateTempUserToken,
  login,
  clearTempUser,
  updateUser,
  updateWallet,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
