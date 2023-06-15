import React, { useState, useEffect } from 'react';
import Input from "react-validation/build/input";


const TextInput = ({ label, name, value, onChange }) => {
    return (
        <div>
            <span className="label-input100">{label}</span>
            <Input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
            />
        </div>

    )
}

export default TextInput;