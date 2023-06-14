import React, { useEffect, useState } from "react";
import DropdownList from "./Dropdown";
import { getAuthorLists } from "./AuthorsList";

const AuthorDropdown = ({ value, onChange }) => {
  const [authorOptions, setAuthorOptions] = useState([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      const authors = await getAuthorLists();
      setAuthorOptions(authors);
    };

    fetchAuthors();
  }, []);

  // Map authorOptions to an array of {value, label} objects
  const mappedOptions = authorOptions.map((author) => ({
    value: author.id,
    label: author.first_name + " " + author.last_name,
  }));

  return (
    <DropdownList
      value={value}
      options={mappedOptions}
      onChange={onChange}
    />
  );
};

export default AuthorDropdown;
