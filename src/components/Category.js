import React from "react";
import DropdownList from "./Dropdown";
import { bookCategories } from './labels/en/Options';

const Category = ({ value, onChange }) => {
  const categoryOptions = bookCategories.map(category => ({
    value: category.label,
    label: category.label
  }));

  return (
    <DropdownList
      value={value}
      options={categoryOptions}
      onChange={onChange}
    />
  );
}

export default Category;
