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
      <div className="select-dropdown-header">
        <h3>{data.Question}</h3>
        <LuChevronDown
          onMouseEnter={toggleDropdown}
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
