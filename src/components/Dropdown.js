import React from 'react';


const Dropdown = ({selectedCategory,onChange,categories,multiple}) => {
    return (
            <select
                type="text"
                className="input100"
                name="Category"
                value={selectedCategory}
                onChange={onChange}
                {...multiple}
            >
                <option value="" key="0"></option>
                {categories && categories.map((category, index) => <option key={index} value= {category.id}> {category.value} </option>)}
            </select>
    )
}


export default Dropdown;


