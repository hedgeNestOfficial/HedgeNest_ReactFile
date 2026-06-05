import { FaChevronDown } from "react-icons/fa6";

export const inputTex = [
  {
    label: "First Name",
    type: "text",
    placeholder: "Enter name",
    name: "firstName",
  },
  {
    label: "Last Name",
    type: "text",
    placeholder: "Enter name",
    name: "lastName",
  },
  {
    label: "Phone number",
    type: "tel",
    placeholder: "Enter phone number",
    name: "phoneNumber",
  },
  {
    label: "Email address",
    type: "email",
    placeholder: "Enter email",
    name: "email",
  },
  {
    label: "Password",
    type: "password",
    placeholder: "Enter password",
    name: "password",
    note: "Minimum of 8 characters, must contain numbers and symbols: @, $, _, #",
  },
  {
    label: "Confirm Password",
    type: "password",
    placeholder: "Enter password",
    name: "confirmPassword",
  },
];

export const BvnAuthData = [
  {
    label: "BVN",
    type: "text",
    placeholder: "Enter BVN number ",
    name: "firstName",
  },
  {
    label: "Upload Photo Of NIN ID",
    type: "text",
    placeholder: "Attach File",
    // note: <FaChevronDown />,
  },
  {
    label: "Phone number",
    type: "tel",
    placeholder: "Enter phone number",
    name: "phoneNumber",
  },
];


// export const LoginData = [
//   {
//     label: "Email address",
//     type: "text",
//     placeholder: "Enter email  ",
//     name: "firstName",
//   },
//   {
//     label: "Password",
//     type: "password",
//     placeholder: "Enter password ",
//     // note: <FaChevronDown />,
//   },
// ];



export const LoginData = [
  {
    label: "Email Address",
    type: "email",
    placeholder: "Enter your email",
    name: "email",
  },

  {
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    name: "password",
  },
];