import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Input = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = props.type === "password";

  return (
    <div className={props.className}>
      <label>{props.label}</label>

      <div className="password-input-wrapper">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : props.type}
          placeholder={props.placeholder}
          {...props.registerProps}
        />

        {isPassword && (
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        )}
      </div>

      {props.error ? (
        <span
          className="input-note"
          style={{ color: "#ef4444", fontWeight: "500" }}
        >
          {props.error.message}
        </span>
      ) : (
        <span className="input-note">{props.note}</span>
      )}
    </div>
  );
};

export default Input;
