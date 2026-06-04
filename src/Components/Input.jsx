import React from "react";

const Input = (props) => {
  return (
    <div className={props.className}>
      <label>{props.label}</label>
      <input
        type={props.type}
        placeholder={props.placeholder}
        {...props.registerProps}
        onChange={(e) => {
          if (props.registerProps?.onChange) props.registerProps.onChange(e);
          if (props.onChange) props.onChange(e);
        }}
      />

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
