import React from "react";
import { LuChevronDown } from "react-icons/lu";
import "../Style/SelectDropdown.css";

const SelectDropdown = ({
  data,
  isOpen,
  isMobile,
  onToggle,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      className={`select-dropdown-wrapper ${isOpen ? "is-open" : ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Header action executes click toggle context conditionally */}
      <div
        className="select-dropdown-header"
        onClick={onToggle}
        style={{ cursor: isMobile ? "pointer" : "default" }} // Keeps design intent clean
      >
        <h3>{data.Question}</h3>

        <LuChevronDown
          className={`select-dropdown-arrow ${isOpen ? "rotate-arrow" : ""}`}
        />
      </div>

      <div className="select-dropdown-body">
        <p>{data.answer}</p>
      </div>
    </div>
  );
};

export default SelectDropdown;
