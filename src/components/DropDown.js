import React from "react";

const DropDown = ({value, onChange, options}) => {
  
  if (!Array.isArray(options)) {
    console.error("Invalid options provided to Dropdown");
    return null;
  
  }
  return (
    
      <select 
      type="text"
      className="input100"
      name="drop-down" 
      value={value} 
      onChange = {onChange}
      >
        <option value="" disabled hidden>
          Select an option
        </option>

        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}

      </select>
    
  );
};

export default DropDown;


