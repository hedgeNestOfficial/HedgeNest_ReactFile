import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("authToken");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,

  token: storedToken || null,

  tempUser: {
    email: "",
    phoneNumber: "",
  },
};

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    // =========================
    // TEMP SIGNUP DATA
    // =========================
    signup: (state, action) => {
      state.tempUser = action.payload;
    },

    // =========================
    // LOGIN
    // =========================
    login: (state, action) => {
      state.user = action.payload.user;

      state.token = action.payload.token;

      localStorage.setItem("user", JSON.stringify(action.payload.user));

      localStorage.setItem("authToken", action.payload.token);
    },

    // =========================
    // LOGOUT
    // =========================
    logout: (state) => {
      state.user = null;

      state.token = null;

      state.tempUser = {
        email: "",
        phoneNumber: "",
      };

      localStorage.removeItem("user");

      localStorage.removeItem("authToken");
    },
  },
});

export const { signup, login, logout } = userSlice.actions;

export default userSlice.reducer;
