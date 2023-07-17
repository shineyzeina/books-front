import React, { useState, useEffect } from "react";
import authHeader from "../services/auth-header";
import AuthorService from "../services/author.service";
import EventBus from "../common/EventBus";
import defaultProfile from "../images/profile.png";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "./Authors.css";

const currentUser = JSON.parse(localStorage.getItem("user"));

const Authors = () => {
  const [error, setError] = useState("");
  const [authors, setAuthors] = useState([]);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [perPage] = useState(2);
  const API_URL = process.env.REACT_APP_SERVER_API;

  useEffect(() => {
    searchAuthors("");
  }, []);

  const triggerAuthorSearch = (keyword) => {
    setSearchKeyword(keyword);
    searchAuthors(keyword);
  };

  const searchAuthors = async (keyword, page) => {
    const response = await AuthorService.getAuthorsList(keyword, page, perPage);
    const { totalAuthors, currentPage, totalPages, authors } = response.data;
    console.log(response.data)
    setAuthors(authors);
    setCurrentPage(currentPage);
    setTotalPages(totalPages);
  };
  

  const deleteAuthor = async (event, id) => {
    if (window.confirm("Are you sure you want to delete this author?")) {
      AuthorService.deleteAuthor(id).then(
        (response) => {
          alert("Author deleted!");
          let oldList = authors;
          var data = oldList.filter(function (obj) {
            return obj.id !== id;
          });
          setAuthors(data);
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

  const handlePageClick = async (data) => {
    const selectedPage = data.selected;
    const response = await AuthorService.getAuthorsList(searchKeyword, selectedPage + 1, perPage);
    const { authors } = response.data;
    setAuthors(authors);
    setCurrentPage(selectedPage);
  };

  // Logic for the dropsdown list of pages
  const handlePageChange = (selectedPage) => {
    const page = selectedPage;
    setCurrentPage(page);
    searchAuthors(searchKeyword, page);
  };

  const renderPageOptions = () => {
    const options = [];
    for (let i = 1; i <= totalPages; i++) {
      options.push(
        <option key={i} value={i}>
          Page {i}
        </option>
      );
    }
    return options;
  };

  return (
    <div className="sub-container">
      <table border="0" width="100%">
        <tbody>
          <tr>
            <td align="left">
              <Form>
                <div className="form-group">
                  <Input
                    type="text"
                    className="form-control half_width"
                    name="searchKeyword"
                    value={searchKeyword}
                    placeholder="Search"
                    onChange={(e) => triggerAuthorSearch(e.target.value)}
                  />
                </div>
              </Form>
            </td>
            <td align="right">
              <Link to={"/author/new"} className="link-brown">
                Add Author
              </Link>
            </td>
          </tr>
        </tbody>
      </table>

      {error ? (
        <header className="jumbotron">
          <h3>{error}</h3>
        </header>
      ) : !error && authors.length ? (
        <>
          <h3>Authors List</h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Created By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author) => (
                <tr key={author.id}>
                  <td valign="top">
                    <Link to={"/author/view/" + author.id}>
                      <img
                        src={author.authorImage ? `${API_URL}/uploads/${author.authorImage}` : `${API_URL}/uploads/DefaultAuthor.png`}
                        className="authorImg"
                        alt=""
                      />
                      {author.first_name} {author.last_name}
                    </Link>
                  </td>
                  <td valign="center">{author.createdBy ? `${author.createdBy.firstName} ${author.createdBy.lastName}` : ""}</td>
                  <td valign="center">
                    <Link to={"/author/edit/" + author.id} className="text-dark">
                      Edit
                    </Link>
                    &nbsp;&nbsp;&nbsp;
                    <a href="#" className="text-dark" onClick={(e) => deleteAuthor(e, author.id)}>
                      Delete
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-container">
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={". . ."}
            breakClassName={"break-me"}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2} // Display two page links at a time (1, 2)
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />

        <div className="page-select">
          <label htmlFor="page-select">Go to page : </label>
          <select
            id="page-select"
            value={currentPage}
            onChange={(e) => handlePageChange(Number(e.target.value))}>
            {renderPageOptions()}
          </select>
        </div>

          </div>
        </>
      ) : (
        <div>No record found.</div>
      )}
    </div>
  );
};

export default Authors;
