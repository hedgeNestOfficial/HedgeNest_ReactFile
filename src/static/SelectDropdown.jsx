import React, { useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import "../Style/SelectDropdown.css";

const SelectDropdown = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="select-dropdown-wrapper">
      <div className="select-dropdown-header" onClick={toggleDropdown}>
        {/* Wrapped with h3 tag to correctly read your CSS rules */}
        <h3>{data.Question}</h3>
        {/* String template literal applies rotation state on click */}
        <LuChevronDown
          className={`select-dropdown-arrow ${isOpen ? "rotate-arrow" : ""}`}
        />
      </div>

      <div
        className="select-dropdown-body"
        style={{ display: isOpen ? "block" : "none" }}
      >
        <p>{data.answer}</p>
      </div>
    </div>
  );
};

export default SelectDropdown;
