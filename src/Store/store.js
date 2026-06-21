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
 * Safe Storage Wrapper
 * Handles different redux-persist storage implementations
 */
const getSafeStorage = () => {
  // Check if storage is available and valid
  if (storage && typeof storage.getItem === "function") {
    return storage;
  }

  // Fallback: use localStorage directly
  if (
    storage &&
    storage.default &&
    typeof storage.default.getItem === "function"
  ) {
    return storage.default;
  }

  // Last resort: custom implementation
  return {
    getItem: (key) => {
      try {
        const item = localStorage.getItem(key);
        return Promise.resolve(item);
      } catch (error) {
        console.error("Storage getItem error:", error);
        return Promise.resolve(null);
      }
    },
    setItem: (key, value) => {
      try {
        localStorage.setItem(key, value);
        return Promise.resolve();
      } catch (error) {
        console.error("Storage setItem error:", error);
        return Promise.reject(error);
      }
    },
    removeItem: (key) => {
      try {
        localStorage.removeItem(key);
        return Promise.resolve();
      } catch (error) {
        console.error("Storage removeItem error:", error);
        return Promise.reject(error);
      }
    },
  };
};

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
});

// Persist configuration
const persistConfig = {
  key: "hedgenest-root", // Changed to be more descriptive
  storage: getSafeStorage(),
  whitelist: ["user"], // Only persist user state
  throttle: 1000, // Throttle writes to localStorage (1 second)
  version: 1, // For future migrations
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Configure store with persisted reducer
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist action types that aren't serializable
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore these paths in the state
        ignoredPaths: ["user"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in development
});

/**
 * Create persistor to handle rehydration
 */
export const persistor = persistStore(store);

/**
 * Optional: Add listeners for persist lifecycle events
 */
persistor.subscribe(() => {
  const { rehydrating } = store.getState().user;
  console.log("Rehydration status:", rehydrating ? "in progress" : "complete");
});
