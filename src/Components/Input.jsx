import React from "react";

const Input = (props) => {
  return (
    <div className={props.className}>
      <label>{props.label}</label>
      <input
        type={props.type}
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
      <span className="input-note">{props.note}</span>
    </div>
  );
};

export default Input;
