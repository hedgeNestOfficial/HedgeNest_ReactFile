import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,

  tempUser: {
    email: "",
    phoneNumber: "",
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
      state.token = action.payload.token;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;

      state.tempUser = {
        email: "",
        phoneNumber: "",
      };
    },
  },
});

export const { signup, login, logout } = userSlice.actions;

export default userSlice.reducer;
