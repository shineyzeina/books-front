import React from "react";

const Dropdown = ({ value, options, onChange }) => {
  if (!Array.isArray(options)) {
    console.error("Invalid options provided to DropdownList");
    return null;
  }

  console.log("Options", options)

  return (
    <select className="input100" value={value} onChange={onChange}>
      <option value="" disabled hidden>
        Select an option
      </option>
      {options.map((option) => (
        <option
        key={option.id || option.value}
        value={option.id || option.value}
      >
        {option.label || option.value}
      </option>
      ))}
    </select>
  );
};

export default Dropdown;
