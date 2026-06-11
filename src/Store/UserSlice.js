// import { createSlice } from "@reduxjs/toolkit";

// const storedUser = localStorage.getItem("user");
// const storedToken = localStorage.getItem("authToken");

// const initialState = {
//   user: storedUser ? JSON.parse(storedUser) : null,

//   token: storedToken || null,

//   tempUser: {
//     email: "",
//     phoneNumber: "",
//   },
// };

// const userSlice = createSlice({
//   name: "user",

//   initialState,

//   reducers: {
//     // =========================
//     // TEMP SIGNUP DATA
//     // =========================
//     signup: (state, action) => {
//       state.tempUser = action.payload;
//     },

//     // =========================
//     // LOGIN
//     // =========================
//     login: (state, action) => {
//       state.user = action.payload.user;

//       state.token = action.payload.token;

//       localStorage.setItem("user", JSON.stringify(action.payload.user));

//       localStorage.setItem("authToken", action.payload.token);
//     },

//     // =========================
//     // LOGOUT
//     // =========================
//     logout: (state) => {
//       state.user = null;

//       state.token = null;

//       state.tempUser = {
//         email: "",
//         phoneNumber: "",
//       };

//       localStorage.removeItem("user");

//       localStorage.removeItem("authToken");
//     },
//   },
// });

// export const { signup, login, logout } = userSlice.actions;

// export default userSlice.reducer;import { createSlice } from "@reduxjs/toolkit";
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
//     // =========================
//     // TEMP SIGNUP DATA
//     // =========================
//     signup: (state, action) => {
//       state.tempUser = action.payload;
//     },

//     // =========================
//     // LOGIN
//     // =========================
//     login: (state, action) => {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       localStorage.setItem("authToken", action.payload.token);
//     },

//     // =========================
//     // UPDATE PROFILE
//     // =========================
//     updateUser: (state, action) => {
//       state.user = {
//         ...state.user,
//         ...action.payload,
//       };
//     },

//     // =========================
//     // LOGOUT
//     // =========================
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
//     // =========================
//     // TEMP SIGNUP DATA
//     // =========================
//     signup: (state, action) => {
//       state.tempUser = action.payload;
//     },

//     // =========================
//     // LOGIN
//     // =========================
//     login: (state, action) => {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       // Storing token manually ONLY if your Axios interceptors need to read it directly
//       localStorage.setItem("authToken", action.payload.token);
//     },

//     // =========================
//     // UPDATE PROFILE
//     // =========================
//     updateUser: (state, action) => {
//       state.user = action.payload;
//     },

//     // =========================
//     // LOGOUT
//     // =========================
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

      localStorage.setItem("authToken", action.payload.token);
    },

    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },

    logout: (state) => {
      state.user = null;
      state.token = null;

      state.tempUser = {
        email: "",
        phoneNumber: "",
      };

      localStorage.removeItem("authToken");
    },
  },
});

export const { signup, login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
