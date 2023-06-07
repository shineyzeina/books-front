import React from "react";
import Dropdown from "./DropDown";
import { solomon } from "./NationalityList";


const CountriesDropDown = ({ value, onChange }) => {
  return (
    <Dropdown
      value={value}
      onChange={onChange}
      options={solomon.map(nationality => ({
        value: nationality,
        label: nationality
      }))
    }
    />
  );
}

export default CountriesDropDown;