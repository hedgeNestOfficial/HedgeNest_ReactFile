import React from "react";
import "../Css/Button.css";

const Button = (props) => {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.text}
    </button>
  );
};

export default Button;
