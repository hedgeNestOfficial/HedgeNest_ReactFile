import React from "react";

const WalletInput = ({
  label,
  type = "text",
  value,
  placeholder,
  onChange,
  readOnly,
}) => {
  return (
    <div className="wallet-input-group">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        readOnly={readOnly}
      />
    </div>
  );
};

export default WalletInput;
