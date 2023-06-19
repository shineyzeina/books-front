import React, { useState, useEffect } from 'react';
import { getAuthorLists } from "./AuthorsList";
import Dropdown from './Dropdown';

const AuthCategory = ({ category, setCategory ,multiple}) => {
  const [authors, setAuthors] = useState([]);

  async function fetchData() {
    const fetchedAuthorsList = await getAuthorLists();
    const authors = fetchedAuthorsList?.map((author,index) => ({
      id : author.id, 
      value : author.first_name + " " + author.last_name
      }));
    setAuthors(authors);
  }

  useEffect(() => {
    fetchData();
  }, []);


  return (
    <Dropdown
      selectedCategory={category}
      onChange={setCategory}
      categories={authors}
      multiple={multiple}
    />
  );
};

export default AuthCategory;
