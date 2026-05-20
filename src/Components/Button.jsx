import React from "react";
import "../Css/Button.css";

const Button = (props) => {
  return <button className={props.className}>{props.children}</button>;
};

export default Button;
