import React, { useState, useEffect, useCallback } from "react";
import BookService from "../services/book.service";
import EventBus from "../common/EventBus";
import defaultProfile from "../images/profile.png";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { Link } from "react-router-dom";
import modifiedBooks from "../labels/en/Categories";
import AsyncSelect from "react-select/async";
import AuthCategory from "./AuthCategories";
import AuthService from "../services/author.service.js";
import { getAuthorLists } from "./AuthorsList";

const currentUser = JSON.parse(localStorage.getItem("user"));

const Books = () => {
  const [error, setError] = useState("");
  const [books, setBooks] = useState([]);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [author, setAuthor] = useState("");
  const [authors, setAuthors] = useState("");



  const handleChange = (selectedOption) => {
    console.log("Handle Change", selectedOption);
    searchBooksByAuthor(selectedOption.value)
  };

  // const loadOptions = (searchValue,callback) => {
  //   setTimeout(() => {

  //     const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()));
  //     console.log('loadOptions', searchValue, filteredOptions);
  //     callback(filteredOptions);
  //   },2000);
  // };

  const triggerAuthorSearch = (searchValue, callback) => {
    if (searchValue.length >= 3) {
      console.log("Ana hon");
      // searchAuthors(searchValue);
      AuthService.getAuthorsList(searchValue).then(
        (response) => {
          console.log(response.data)
          setAuthors(response.data)
          setTimeout(() => {
            const options = [];
            if (response.data) {
                console.log(authors);
                response.data.forEach((author) => {
                  const option = {
                    value: author.id,
                    label: author.first_name + " " + author.last_name,
                  };
                  options.push(option);
                });
            }
            if (options) {
              callback(options);
              console.log(options);
            }
          }, 2000);
      }
      );
      // setTimeout(() => {
      //   const options = [];
      //   if (authors) {
      //       console.log(authors);
      //       authors.forEach((author) => {
      //         const option = {
      //           value: author.first_name,
      //           label: author.first_name + " " + author.last_name,
      //         };
      //         options.push(option);
      //       });
      //   }
      //   if (options) {
      //     callback(options);
      //     console.log(options);
      //   }
      // }, 2000);
    }
  };

  const searchAuthors = async (keyword) => {
    console.log(keyword);
    AuthService.getAuthorsList(keyword).then(
      (response) => {
        console.log(response.data)
      setAuthors(response.data)
    }
    );
  };

  useEffect(() => {
    searchBooks("");
  }, []);

 

 //Search for Books By auth
 const triggerBookSearchByAuthor = (authorId) => {
 console.log(authorId);
 setAuthor(authorId);
 searchBooksByAuthor(authorId);
 }

  const searchBooksByAuthor = (author) => {
    BookService.getBooksList({ authorId: author }).then((response) => {
      console.log(response.data);
      setBooks(response.data);
    });
  };

  const triggerBookSearch = (keyword) => {
    setSearchKeyword(keyword);
    searchBooks(keyword);
  };
  const searchBooks = (keyword) => {
    BookService.getBooksList({ searchKey: keyword }).then(
      (response) => {
        if (response) {
          setBooks(response.data);
        }
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setError(_content);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  };

  const favoriteBook = async (event, id, action) => {
    var question = "Remove from your favorites?";
    var favorite = false;
    if (action == "add") {
      question = "Add to your favorites?";
      favorite = true;
    }
    if (window.confirm(question)) {
      BookService.favoriteBook(id, action).then(
        (response) => {
          alert("Book " + action + "ed to your favorites!");
          let oldList = books;
          var data = oldList.filter(function (obj) {
            if (obj.id === id) {
              obj.favorite = favorite;
            }
            return obj;
          });
          setBooks(data);
        },
        (error) => {
          const _content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setError(_content);

          if (error.response && error.response.status === 401) {
            EventBus.dispatch("logout");
          }
        }
      );
    }
  };
  const deleteBook = async (event, id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      BookService.deleteBook(id).then(
        (response) => {
          alert("Book deleted!");
          let oldList = books;
          var data = oldList.filter(function (obj) {
            return obj.id !== id;
          });
          setBooks(data);
        },
        (error) => {
          const _content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setError(_content);

          if (error.response && error.response.status === 401) {
            EventBus.dispatch("logout");
          }
        }
      );
    }
  };

  return (
    <div className="sub-container">
      <table border="0" width="100%">
        <tr className="d-flex justify-content-between align-items-center">
          <td>
            <Form>
              <Input
                type="text"
                className="form-control"
                name="searchKeyword"
                value={searchKeyword}
                placeholder="Search"
                onChange={(e) => triggerBookSearch(e.target.value)}
              />
            </Form>
          </td>

          {/* <td className="row align-items-center">
            <span className="col-6">
              <label className="text-end" htmlFor="">
                Filter by Authors
              </label>
            </span>
            <span className="col-6">
              <AuthCategory
                category={author}
                setCategory={(e) => triggerBookSearchByAuthor(e.target.value)}
              />
            </span>
          </td> */}

          <td className="col-6">
            <AsyncSelect
              loadOptions={triggerAuthorSearch}
              onChange={handleChange}
            />
          </td>

          <td align="right">
            <Link to={"/book/new"} className="link-brown">
              Add Book
            </Link>
          </td>
        </tr>
      </table>

      {error ? (
        <header className="jumbotron">
          {" "}
          <h3>{error}</h3>{" "}
        </header>
      ) : null}
      {!error && books ? (
        <>
          <h3> Books List </h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th>ISBN</th>
                <th>Name</th>
                <th>Author</th>
                <th>Category</th>
                <th>Added By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {books &&
                books.map((b) => (
                  <tr>
                    <td valign="top">{b.ISBN} </td>
                    <td valign="top">{b.name}</td>
                    <td valign="top">
                      {b.author
                        ? b.author.first_name + " " + b.author.last_name
                        : ""}
                    </td>
                    <td valign="top">
                      {b.category ? modifiedBooks[b.category] : " "}
                    </td>
                    <td valign="top">
                      {b.createdBy
                        ? b.createdBy.firstName + " " + b.createdBy.lastName
                        : ""}
                    </td>

                    <td valign="top">
                      <a href={"/book/edit/" + b.id} className="text-dark ">
                        Edit
                      </a>
                      &nbsp;&nbsp;&nbsp;
                      <a
                        href="#"
                        className="text-dark"
                        onClick={(e) => deleteBook(e, b.id)}
                      >
                        Delete
                      </a>
                      &nbsp;&nbsp;&nbsp;
                      {b.favorites &&
                      (b.favorites.indexOf(currentUser.id) > -1 ||
                        b.favorite == true) ? (
                        <a
                          href="#"
                          className="text-dark"
                          onClick={(e) => favoriteBook(e, b.id, "remove")}
                        >
                          <i
                            title="Remove from Favorite"
                            alt="Remove from Favorite"
                            className="fa fa-heart red-heart"
                          ></i>
                        </a>
                      ) : (
                        <a
                          href="#"
                          className="text-dark"
                          onClick={(e) => favoriteBook(e, b.id, "add")}
                        >
                          <i
                            title="Add to Favorite"
                            alt="Add to Favorite"
                            className="fa fa-heart red-grey"
                          ></i>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      ) : (
        <div> No record found.</div>
      )}
    </div>
  );
};

export default Books;
