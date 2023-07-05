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
import { Alert } from "bootstrap";
import bookService from "../services/book.service";
import SweetPagination from "sweetpagination";
import { PaginationControl } from "react-bootstrap-pagination-control";

const currentUser = JSON.parse(localStorage.getItem("user"));

const Books = () => {
  const [error, setError] = useState("");
  const [books, setBooks] = useState([]);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [author, setAuthor] = useState("");
  const [authors, setAuthors] = useState("");
  const [authVal, setAuthorVal] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState("");
  const [page, setPage] = useState(1);

  const triggerBookPages = (page,items) => {
    bookService
      .getBooksList({
        searchKey: searchKeyword,
        authorId: author,
        page: page,
        items: items || itemsPerPage,
      })
      .then(
        (response) => {
          if (response) {
            console.log(response.data);
            setBooks(response.data.books);
            setTotalPages(response.data.total / itemsPerPage + 1);
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

  const handleChange = (selectedOption) => {
    console.log("Handle Change", selectedOption);
    setAuthorVal(selectedOption);
    setAuthor(selectedOption.value);
  };

  //Button Search
  const triggerBookSearchByAuthor = () => {
    if (author != "") searchBooks(searchKeyword, author);
    else alert("Please Select An Author");
  };

  //Button Reset
  const resetBooks = () => {
    setAuthor("");
    setSearchKeyword("");
    searchBooks("", "");
    setAuthorVal("");
  };

  const triggerAuthorSearch = (searchValue, callback) => {
    if (searchValue.length >= 3) {
      console.log("Ana hon");
      // searchAuthors(searchValue);
      AuthService.getAuthorsList(searchValue).then(
        (response) => {
          console.log(response.data);
          setAuthors(response.data);
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

  useEffect(() => {
    searchBooks("");
  }, []);



  const triggerBookSearch = (keyword) => {
    setSearchKeyword(keyword);
    searchBooks(keyword, author);
  };

  //Search for books by book filter and author filter
  const searchBooks = (keyword, authId) => {
    BookService.getBooksList({
      searchKey: keyword,
      authorId: authId,
      items: itemsPerPage,
    }).then(
      (response) => {
        if (response) {
          setBooks(response.data.books);
          console.log(response.data);
          setTotalPages(response.data.total / itemsPerPage + 1);
          setTotalItems(response.data.total);
          console.log(totalPages);
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
      <span className="row">
        <Link to={"/book/new"} className="align-middle text-end link-brown">
          Add Book
        </Link>
        <p className="text-end link-brown">Total Records: {totalItems}</p>
      </span>

      <table className="table table-borderless" border="0" width="100%">
        <thead className="">
          <th colSpan={4} className="align-items-center">
            <h3 className="text-center text-dark">Books List </h3>
          </th>
        </thead>
        <tbody>
          <tr className="align-items-center">
            <td align="left">
              <Form>
                <label className="form-label">Search Books</label>
                <Input
                  type="text"
                  className="form-control w-75"
                  name="searchKeyword"
                  value={searchKeyword}
                  placeholder="Search"
                  onChange={(e) => triggerBookSearch(e.target.value)}
                />
              </Form>
            </td>

            <td align="left">
              <div style={{ width: "300px" }}>
                <label className="form-label"> Select an author </label>
                <AsyncSelect
                  className=""
                  loadOptions={triggerAuthorSearch}
                  onChange={handleChange}
                  value={authVal}
                  placeholder="Select An Author"
                />
              </div>
            </td>

            <td align="right" className="align-bottom">
              <button
                onClick={triggerBookSearchByAuthor}
                className="btn btn-outline-success"
              >
                Search
              </button>
            </td>

            <td align="right" className="align-bottom">
              <button onClick={resetBooks} className="btn btn-outline-dark">
                Reset
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {error ? (
        <header className="jumbotron">
          {" "}
          <h3>{error}</h3>{" "}
        </header>
      ) : null}
      {!error && books ? (
        <>
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

      <div>
        <PaginationControl
          page={page}
          between={4}
          total={totalItems}
          limit={itemsPerPage}
          changePage={(page) => {
            setPage(page);
            triggerBookPages(page);
            console.log(page);
          }}
          ellipsis={1}
        />

        <label className="form-label">Choose Number of Records per page</label>
        <select 
          className="form-select w-25"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(e.target.value)
            console.log(page)
            triggerBookPages(page,e.target.value)
            console.log(e.target.value)
           }}>
          <option value="5">5</option>
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  );
};

export default Books;
