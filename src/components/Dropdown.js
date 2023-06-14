import React from "react";

const DropdownList = ({ value, options, onChange }) => {
  if (!Array.isArray(options)) {
    console.error("Invalid options provided to DropdownList");
    return null;
  }

  return (
    <select className="input100" value={value} onChange={onChange}>
      <option value="" disabled hidden>
        Select an option
      </option>
      {options.map((option) => (
        <option key={option.key || option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default DropdownList;
