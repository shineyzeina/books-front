import React from "react";
import Select from "react-select";


const Dropdown = ({selectedCategory,onChange,categories}) => {
    return (
            <select
                type="text"
                className="form-select"
                name="Category"
                value={selectedCategory}
                onChange={onChange}
            >
                <option value="" key="0"></option>
                {categories && categories.map((category, index) => <option key={index} value= {category.id}> {category.value} </option>)}
            </select>
    )
}



export default Dropdown;
