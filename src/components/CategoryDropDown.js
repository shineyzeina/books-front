import React from "react";
import Dropdown from "./DropDown";
import { bookCategories } from './CategoryList'

const Category = ({ value, onChange, label }) => {
  return (
    <div className="wrap-input100 validate-input m-b-18" style={{ display: 'flex', alignItems: 'center' }}>
					<label className="label-input100" style={{ marginRight: '10px' }}>{label}</label>
					<div style={{ flex: 1 }}>
      <Dropdown
        value={value}
        onChange={onChange}
        options={bookCategories.map(category => ({
          value: category,
          label: category
              }))
            }/>
    	  </div>
			</div>
  );
}

export default Category;

