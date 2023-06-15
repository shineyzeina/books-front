import React, { useState } from 'react';
import {BOOKSS} from '../labels/en/Categories';
import Dropdown from './Dropdown';




const BookCategory =({category,setCategory}) => {
    return (
        <Dropdown
            selectedCategory = {category} 
            onChange={ setCategory}
            categories = {BOOKSS}
        />
    )
}

export default BookCategory;