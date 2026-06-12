// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: null,
//   token: null,
//   tempUser: {
//     email: "",
//     phoneNumber: "",
//   },
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,

//   reducers: {
//     signup: (state, action) => {
//       state.tempUser = action.payload;
//     },

//     login: (state, action) => {
//       state.user = action.payload.user;
//       state.token = action.payload.token;

//       localStorage.setItem("authToken", action.payload.token);
//     },

//     updateUser: (state, action) => {
//       state.user = {
//         ...state.user,
//         ...action.payload,
//       };
//     },

//     logout: (state) => {
//       state.user = null;
//       state.token = null;

//       state.tempUser = {
//         email: "",
//         phoneNumber: "",
//       };

//       localStorage.removeItem("authToken");
//     },
//   },
// });

// export const { signup, login, logout, updateUser } = userSlice.actions;
// export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  wallet: null,
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
      state.wallet = action.payload.wallet;
      state.token = action.payload.token;

      localStorage.setItem("authToken", action.payload.token);
    },

    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
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
      };

      localStorage.removeItem("authToken");
    },
  },
});

export const { signup, login, logout, updateUser, updateWallet } =
  userSlice.actions;

export default userSlice.reducer;
