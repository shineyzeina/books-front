import React from "react";
import DropdownList from "./Dropdown";
import { countryList } from './labels/en/Nationalities';

const Country = ({ value, onChange }) => {
  const countryOptions = countryList.map(country => ({
    value: country.label,
    label: country.label
  }));


  return (
    <DropdownList
      value={value}
      options={countryOptions}
      onChange={onChange}
    />
  );
}

export default Country;
