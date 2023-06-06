import React from 'react';
import DropDown from './DropDown';
import { bookCategories } from './CategoryList';



const CategoryDropDown = ({value, onChange}) => {

    return (
    <DropDown  value = {value}
     onChange = {onChange}
      options = {bookCategories}  
      />
    )  
}

export default CategoryDropDown;