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

/**
 * ============================================================================
 * USER SLICE - REDUX STATE MANAGEMENT
 * ============================================================================
 *
 * Manages:
 * - User authentication (login/logout)
 * - Wallet data
 * - JWT token
 * - Onboarding flow (signup → OTP → PIN)
 * - Redux-persist rehydration
 */

const initialState = {
  // Authenticated user data
  user: null, // { _id, firstName, lastName, email, phoneNumber, ... }
  wallet: null, // { availableBalance, balanceInNaira, balanceInUSDT, ... }
  token: null, // JWT token string

  // Rehydration flag - start as true, redux-persist sets to false
  rehydrating: true,

  // Temporary data during signup flow
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
     * SIGNUP
     * Stores temporary user data during signup
     * Payload: { email, phoneNumber }
     */
    signup: (state, action) => {
      state.tempUser = action.payload;
    },

    /**
     * UPDATE TEMP USER TOKEN
     * Stores auth token from OTP verification
     * Payload: authToken (JWT token)
     */
    updateTempUserToken: (state, action) => {
      state.tempUser = {
        ...state.tempUser,
        authToken: action.payload,
      };
    },

    /**
     * LOGIN
     * Authenticates user after login or PIN creation
     * Payload: { user, wallet, token }
     *
     * This action:
     * ✅ Sets user data (with _id)
     * ✅ Sets wallet data
     * ✅ Sets JWT token
     * ✅ Sets rehydrating to false (marks auth complete)
     * ✅ redux-persist auto-saves to localStorage
     */
    login: (state, action) => {
      state.user = action.payload.user;
      state.wallet = action.payload.wallet || null;
      state.token = action.payload.token;
      state.rehydrating = false; // Mark authentication as complete
    },

    /**
     * CLEAR TEMP USER
     * Clears temporary signup data after PIN creation
     */
    clearTempUser: (state) => {
      state.tempUser = {
        email: "",
        phoneNumber: "",
        authToken: null,
      };
    },

    /**
     * UPDATE USER
     * Updates user profile without clearing other fields
     * Handles: { data: { ... } } or direct { ... }
     */
    updateUser: (state, action) => {
      const incomingData = action.payload?.data
        ? action.payload.data
        : action.payload;
      state.user = { ...state.user, ...incomingData };
    },

    /**
     * UPDATE WALLET
     * Updates wallet balance and financial data
     * Payload: { availableBalance, balanceInNaira, ... }
     */
    updateWallet: (state, action) => {
      state.wallet = { ...state.wallet, ...action.payload };
    },

    /**
     * LOGOUT
     * Clears all authentication data
     * redux-persist auto-removes from localStorage
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
   * ============================================================================
   * EXTRA REDUCERS - HANDLE REDUX-PERSIST REHYDRATION
   * ============================================================================
   *
   * When app loads:
   * 1. Redux state starts with initialState
   * 2. redux-persist reads localStorage
   * 3. Fires REHYDRATE action with persisted state
   * 4. This handler merges persisted data back into Redux
   * 5. Sets rehydrating: false to signal PrivateRoute
   */
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action) => {
      console.log("🔄 [UserSlice] REHYDRATE action received");

      // Check if there's persisted state to restore
      if (action.payload && action.payload.user) {
        console.log("📥 Restoring persisted user state from localStorage");

        // Redux-persist structure: action.payload = { user: { ...userSliceState } }
        // So we access: action.payload.user.user (the actual user object)
        state.user = action.payload.user.user;
        state.wallet = action.payload.user.wallet;
        state.token = action.payload.user.token;

        console.log("✅ Restored:", {
          hasUser: !!state.user,
          hasToken: !!state.token,
          hasWallet: !!state.wallet,
        });
      } else {
        console.log("ℹ️ No persisted user state found");
      }

      // ✅ CRITICAL: Mark rehydration as complete
      // PrivateRoute will now safely check authentication
      state.rehydrating = false;
      console.log("✅ Rehydration complete - PrivateRoute can now check auth");
    });
  },
});

/**
 * ============================================================================
 * EXPORTS
 * ============================================================================
 */

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

/**
 * ============================================================================
 * STATE TRANSITIONS THROUGHOUT ONBOARDING
 * ============================================================================
 *
 * INITIAL STATE (App Loads):
 * {
 *   user: null,
 *   wallet: null,
 *   token: null,
 *   rehydrating: true,        ← Waiting for localStorage
 *   tempUser: { email: "", phoneNumber: "", authToken: null }
 * }
 *
 * AFTER SIGNUP ACTION:
 * {
 *   user: null,
 *   wallet: null,
 *   token: null,
 *   rehydrating: true,
 *   tempUser: {
 *     email: "user@email.com",
 *     phoneNumber: "08123456789",
 *     authToken: null
 *   }
 * }
 *
 * AFTER OTP VERIFICATION:
 * {
 *   user: null,
 *   wallet: null,
 *   token: null,
 *   rehydrating: true,
 *   tempUser: {
 *     email: "user@email.com",
 *     phoneNumber: "08123456789",
 *     authToken: "tempToken123..."    ← Added from OTP
 *   }
 * }
 *
 * AFTER PIN CREATION & LOGIN ACTION:
 * {
 *   user: {
 *     _id: "6a38648e...",             ← Added from JWT decode
 *     firstName: "John",
 *     lastName: "Doe",
 *     email: "user@email.com",
 *     phoneNumber: "08123456789"
 *   },
 *   wallet: {
 *     availableBalance: 0,
 *     balanceInNaira: 0,
 *     balanceInUSDT: 0,
 *     smartVaults: 0,
 *     investments: 0
 *   },
 *   token: "eyJhbGciOiJIUzI1NiIs...",
 *   rehydrating: false,                ← Changed to false (auth complete!)
 *   tempUser: {
 *     email: "",
 *     phoneNumber: "",
 *     authToken: null
 *   }                                   ← Cleared after clearTempUser()
 * }
 * ✅ localStorage persisted by redux-persist
 * ✅ PrivateRoute now allows dashboard access
 * ✅ User can perform all operations
 *
 * AFTER PAGE REFRESH (Redux-persist REHYDRATE):
 * {
 *   user: { _id, firstName, ... },    ← Restored from localStorage
 *   wallet: { ... },                   ← Restored from localStorage
 *   token: "eyJ...",                   ← Restored from localStorage
 *   rehydrating: false,                ← Set to false by REHYDRATE handler
 *   tempUser: { ... }                  ← Reset to initial values
 * }
 * ✅ User still logged in
 * ✅ Can continue performing operations
 *
 * AFTER LOGOUT:
 * {
 *   user: null,
 *   wallet: null,
 *   token: null,
 *   rehydrating: false,
 *   tempUser: { email: "", phoneNumber: "", authToken: null }
 * }
 * ✅ localStorage cleared by redux-persist
 * ✅ PrivateRoute redirects to login
 *
 * ============================================================================
 */
