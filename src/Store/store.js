// import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from "redux-persist";
// import storage from "redux-persist/es/storage";
// import userReducer from "./UserSlice";

// const getSafeStorage = () => {
//   if (storage && typeof storage.getItem === "function") {
//     return storage;
//   }
//   if (
//     storage &&
//     storage.default &&
//     typeof storage.default.getItem === "function"
//   ) {
//     return storage.default;
//   }
//   return {
//     getItem: (key) => Promise.resolve(localStorage.getItem(key)),
//     setItem: (key, value) => {
//       localStorage.setItem(key, value);
//       return Promise.resolve();
//     },
//     removeItem: (key) => {
//       localStorage.removeItem(key);
//       return Promise.resolve();
//     },
//   };
// };

// const rootReducer = combineReducers({
//   user: userReducer,
// });

// const persistConfig = {
//   key: "root",
//   storage: getSafeStorage(),
//   whitelist: ["user"],
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }),
// });

// export const persistor = persistStore(store);

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/es/storage";
import userReducer from "./UserSlice";

/**
 * ============================================================================
 * STORAGE WRAPPER
 * ============================================================================
 * Handles different redux-persist storage implementations with fallbacks
 */
const getSafeStorage = () => {
  // Primary: Check if storage is available and has getItem method
  if (storage && typeof storage.getItem === "function") {
    return storage;
  }

  // Secondary: Check for storage.default export
  if (
    storage &&
    storage.default &&
    typeof storage.default.getItem === "function"
  ) {
    return storage.default;
  }

  // Fallback: Custom implementation using localStorage
  return {
    getItem: (key) => {
      try {
        const item = localStorage.getItem(key);
        return Promise.resolve(item);
      } catch (error) {
        console.error("❌ Storage getItem error:", error);
        return Promise.resolve(null);
      }
    },
    setItem: (key, value) => {
      try {
        localStorage.setItem(key, value);
        return Promise.resolve();
      } catch (error) {
        console.error("❌ Storage setItem error:", error);
        return Promise.reject(error);
      }
    },
    removeItem: (key) => {
      try {
        localStorage.removeItem(key);
        return Promise.resolve();
      } catch (error) {
        console.error("❌ Storage removeItem error:", error);
        return Promise.reject(error);
      }
    },
  };
};

/**
 * ============================================================================
 * ROOT REDUCER
 * ============================================================================
 * Combine all feature reducers here
 */
const rootReducer = combineReducers({
  user: userReducer,
  // Add other reducers here as needed:
  // example: exampleReducer,
  // settings: settingsReducer,
});

/**
 * ============================================================================
 * PERSIST CONFIGURATION
 * ============================================================================
 * Defines what to persist and how
 */
const persistConfig = {
  key: "hedgenest-root", // Unique key for localStorage
  storage: getSafeStorage(), // Storage engine (localStorage)
  whitelist: ["user"], // Only persist user reducer
  // blacklist: [],  // Can also exclude specific reducers
  throttle: 1000, // Throttle writes to localStorage (1 second)
  version: 1, // For future state migrations
  timeout: 12000, // Persist operation timeout in milliseconds
};

/**
 * ============================================================================
 * PERSISTED REDUCER
 * ============================================================================
 * Wraps rootReducer with persistence logic
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * ============================================================================
 * STORE CONFIGURATION
 * ============================================================================
 * Configure Redux store with persisted reducer and middleware
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        /**
         * Ignore redux-persist actions from serialization check
         * These actions contain non-serializable data (like functions)
         */
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        /**
         * Ignore these state paths from serialization check
         */
        ignoredPaths: ["user"],
      },
    }),
  // Enable Redux DevTools in development environment
  devTools: process.env.NODE_ENV !== "production",
});

/**
 * ============================================================================
 * PERSISTOR
 * ============================================================================
 * Creates persistor instance for rehydration
 * Used with PersistGate in main.jsx
 */
export const persistor = persistStore(store);

/**
 * ============================================================================
 * OPTIONAL: PERSIST LIFECYCLE LISTENERS
 * ============================================================================
 * Subscribe to persistence events for debugging
 */
if (process.env.NODE_ENV === "development") {
  persistor.subscribe(() => {
    const state = store.getState();
    const { rehydrating } = state.user;
    console.log("📊 Redux Persist Status:", {
      rehydrating,
      hasUser: !!state.user.user,
      hasToken: !!state.user.token,
    });
  });
}

/**
 * ============================================================================
 * EXPORT
 * ============================================================================
 * Export store and persistor to be used in main.jsx
 */
// Already exported above: store, persistor
