// import { createSlice } from "@reduxjs/toolkit";
// import { REHYDRATE } from "redux-persist";

// const initialState = {
//   user: null,
//   wallet: null,
//   token: null,
//   rehydrating: true,

//   tempUser: {
//     email: "",
//     phoneNumber: "",
//     authToken: null,
//   },
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     /**
//      * Stores temporary user data during the signup flow
//      * (before PIN creation and final login)
//      */
//     signup: (state, action) => {
//       state.tempUser = action.payload;
//     },

//     /**
//      * Updates the temporary auth token from the OTP verification step
//      * This token is used to create the PIN
//      */
//     updateTempUserToken: (state, action) => {
//       state.tempUser = {
//         ...state.tempUser,
//         authToken: action.payload,
//       };
//     },

//     /**
//      * Sets the user as logged in with full session data
//      * Called after successful login or PIN creation
//      *
//      * Expected payload structure:
//      * {
//      *   user: { _id, email, phoneNumber, ... },
//      *   wallet: { balance, ... } | null,
//      *   token: "jwt_token_string"
//      * }
//      *
//      * NOTE: Components (LoginPage, Pin.jsx) handle localStorage persistence.
//      * Do not save to localStorage here — keep reducer pure.
//      */
//     login: (state, action) => {
//       state.user = action.payload.user;
//       state.wallet = action.payload.wallet || null;
//       state.token = action.payload.token;
//     },

//     /**
//      * Clears temporary onboarding data after successful PIN creation
//      */
//     clearTempUser: (state) => {
//       state.tempUser = {
//         email: "",
//         phoneNumber: "",
//         authToken: null,
//       };
//     },

//     /**
//      * Updates user profile data without clearing other fields
//      * Handles both nested (data.user) and flat (direct user props) payloads
//      */
//     updateUser: (state, action) => {
//       const incomingData = action.payload?.data
//         ? action.payload.data
//         : action.payload;
//       state.user = { ...state.user, ...incomingData };
//     },

//     /**
//      * Updates wallet balance and related financial data
//      */
//     updateWallet: (state, action) => {
//       state.wallet = { ...state.wallet, ...action.payload };
//     },

//     /**
//      * Clears all user session and authentication data
//      * Called during logout
//      */
//     logout: (state) => {
//       state.user = null;
//       state.wallet = null;
//       state.token = null;
//       state.tempUser = {
//         email: "",
//         phoneNumber: "",
//         authToken: null,
//       };

//       // Clear localStorage (this is a side effect but necessary for logout)
//       localStorage.removeItem("authToken");
//       localStorage.removeItem("user");
//       localStorage.removeItem("wallet");
//       sessionStorage.removeItem("dashboardSplashShown");
//     },

//     /**
//      * ✅ NEW: Marks rehydration as complete
//      * Called automatically by redux-persist after REHYDRATE action
//      */
//     setRehydrated: (state) => {
//       state.rehydrating = false;
//     },
//   },

//   // ✅ NEW: Handle redux-persist REHYDRATE action
//   extraReducers: (builder) => {
//     builder.addCase(REHYDRATE, (state) => {
//       // Rehydration just completed
//       state.rehydrating = false;
//     });
//   },
// });

// export const {
//   signup,
//   updateTempUserToken,
//   login,
//   clearTempUser,
//   updateUser,
//   updateWallet,
//   logout,
//   setRehydrated,
// } = userSlice.actions;

// export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

const initialState = {
  user: null,
  wallet: null,
  token: null,
  rehydrating: true, // Start as true - redux-persist will set to false when done

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
     * NOTE: redux-persist automatically saves this to localStorage.
     * Do NOT manually call localStorage.setItem in components.
     */
    login: (state, action) => {
      state.user = action.payload.user;
      state.wallet = action.payload.wallet || null;
      state.token = action.payload.token;
      state.rehydrating = false; // Clear flag when user logs in
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
     *
     * NOTE: redux-persist automatically removes the persisted data from localStorage
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
      state.rehydrating = false;

      // Clear session-only data (not persisted)
      sessionStorage.removeItem("dashboardSplashShown");
    },
  },

  /**
   * Extra reducers handle redux-persist actions
   * IMPORTANT: This is where rehydration happens
   */
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action) => {
      // redux-persist has loaded state from localStorage

      // Only process if there's a payload
      if (action.payload && action.payload.user) {
        // Merge persisted user state
        state.user = action.payload.user.user;
        state.wallet = action.payload.user.wallet;
        state.token = action.payload.user.token;
      }

      // Mark rehydration as complete
      // This signals to PrivateRoute that it's safe to check auth
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
