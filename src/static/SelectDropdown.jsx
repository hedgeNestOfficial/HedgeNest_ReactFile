import React, { useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import "../Style/SelectDropdown.css";

const SelectDropdown = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="select-dropdown-wrapper"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="select-dropdown-header">
        <h3>{data.Question}</h3>

        <LuChevronDown
          className={`select-dropdown-arrow ${isOpen ? "rotate-arrow" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="select-dropdown-body">
          <p>{data.answer}</p>
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;
