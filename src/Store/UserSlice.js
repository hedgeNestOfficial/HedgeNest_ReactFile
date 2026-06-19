import { createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

const initialState = {
  user: null,
  wallet: null,
  token: null,
  rehydrating: true, // ✅ NEW: Track if redux-persist is still loading
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
    /**
     * Stores temporary user data during the signup flow
     * (before PIN creation and final login)
     */
    signup: (state, action) => {
      state.tempUser = action.payload;
    },

    /**
     * Updates the temporary auth token from the OTP verification step
     * This token is used to create the PIN
     */
    updateTempUserToken: (state, action) => {
      state.tempUser = {
        ...state.tempUser,
        authToken: action.payload,
      };
    },

    /**
     * Sets the user as logged in with full session data
     * Called after successful login or PIN creation
     *
     * Expected payload structure:
     * {
     *   user: { _id, email, phoneNumber, ... },
     *   wallet: { balance, ... } | null,
     *   token: "jwt_token_string"
     * }
     *
     * NOTE: Components (LoginPage, Pin.jsx) handle localStorage persistence.
     * Do not save to localStorage here — keep reducer pure.
     */
    login: (state, action) => {
      state.user = action.payload.user;
      state.wallet = action.payload.wallet || null;
      state.token = action.payload.token;
    },

    /**
     * Clears temporary onboarding data after successful PIN creation
     */
    clearTempUser: (state) => {
      state.tempUser = {
        email: "",
        phoneNumber: "",
        authToken: null,
      };
    },

    /**
     * Updates user profile data without clearing other fields
     * Handles both nested (data.user) and flat (direct user props) payloads
     */
    updateUser: (state, action) => {
      const incomingData = action.payload?.data
        ? action.payload.data
        : action.payload;
      state.user = { ...state.user, ...incomingData };
    },

    /**
     * Updates wallet balance and related financial data
     */
    updateWallet: (state, action) => {
      state.wallet = { ...state.wallet, ...action.payload };
    },

    /**
     * Clears all user session and authentication data
     * Called during logout
     */
    logout: (state) => {
      state.user = null;
      state.wallet = null;
      state.token = null;
      state.tempUser = {
        email: "",
        phoneNumber: "",
        authToken: null,
      };

      // Clear localStorage (this is a side effect but necessary for logout)
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("wallet");
      sessionStorage.removeItem("dashboardSplashShown");
    },

    /**
     * ✅ NEW: Marks rehydration as complete
     * Called automatically by redux-persist after REHYDRATE action
     */
    setRehydrated: (state) => {
      state.rehydrating = false;
    },
  },

  // ✅ NEW: Handle redux-persist REHYDRATE action
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state) => {
      // Rehydration just completed
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
  setRehydrated,
} = userSlice.actions;

export default userSlice.reducer;
