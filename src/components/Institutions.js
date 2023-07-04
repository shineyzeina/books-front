import React, { useState, useEffect } from "react";
import InstitutionService from "../services/institution.service";
import EventBus from "../common/EventBus";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import "../css/pagination.css";

const Institutions = () => {
  const [error, setError] = useState("");
  const [institutions, setInstitutions] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const API_URL = process.env.REACT_APP_SERVER_API;

  const [institutionsCount, setInstitutionsCount] = useState({});
  const [pageNumber, setPageNumber] = useState(0);
  const [institutionsPerPage, setInstitutionsPerPage] = useState(2);

  const [pageCount, setPageCount] = useState(0);

  const isOnFirstPage = pageNumber === 0;
  const isOnLastPage = pageNumber === pageCount - 1;

  const displayInstitutions = institutions.map((i) => {
    return (
      <tr key={i.id}>
        <td valign="top">
          <img
            src={
              i.institutionImage
                ? API_URL + "/uploads/institutions/" + i.institutionImage
                : API_URL + "/uploads/institutions/profile.jpg"
            }
            className="authorImg"
            alt=""
          />
          {i.name}
        </td>
        <td valign="top">
          {i.createdBy
            ? i.createdBy.firstName + " " + i.createdBy.lastName
            : ""}
        </td>
        <td valign="top">
          <a href={"/institution/view/" + i.id} className="text-dark">
            View
          </a>
          &nbsp;&nbsp;&nbsp;
          <a href={"/institution/edit/" + i.id} className="text-dark ">
            Edit
          </a>
          &nbsp;&nbsp;&nbsp;
          <a
            href="#"
            className="text-dark"
            onClick={(e) => deleteInstitution(e, i.id)}
          >
            Delete
          </a>
        </td>
      </tr>
    );
  });

  useEffect(() => {
    const fetchInstitutionsCount = async () => {
      try {
        const countResponse = await InstitutionService.getInstitutionsCount({
          searchKey: searchKeyword,
        });
        if (countResponse) {
          setInstitutionsCount(countResponse.data);
        }
      } catch (error) {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setError(_content);
      }
    };

    fetchInstitutionsCount();
  }, [searchKeyword]);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  useEffect(() => {
    // Calculate neededData when data changes
    if (institutionsCount.count) {
      const ans = Math.ceil(institutionsCount.count / institutionsPerPage);
      setPageCount(ans);
      setPageNumber(0);
    }
  }, [institutionsCount, institutionsPerPage]);

  // useEffect(() => {
  //   setPageCount(Math.ceil(institutionsCount.count / institutionsPerPage));
  //   setPageNumber(0);
  // }, [institutionsPerPage]);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await InstitutionService.getSomeInstitutions({
          searchKey: searchKeyword,
          page: pageNumber,
          limit: institutionsPerPage,
        });
        if (response) {
          setInstitutions(response.data);
        }
      } catch (error) {
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
    };

    fetchInstitutions();
  }, [searchKeyword, pageNumber, institutionsPerPage]);

  const triggerInstitutionSearch = (keyword) => {
    setSearchKeyword(keyword);
    setPageNumber(0); // Reset page number when searching
  };

  const deleteInstitution = async (event, id) => {
    event.preventDefault();
    if (window.confirm("Are you sure you want to delete this institution?")) {
      try {
        await InstitutionService.deleteInstitution(id);
        alert("Institution deleted!");
        const updatedInstitutions = institutions.filter((i) => i.id !== id);
        setInstitutions(updatedInstitutions);
      } catch (error) {
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
    }
  };

  const handleDropdownChange = (event) => {
    const selectedValue = parseInt(event.target.value);
    setInstitutionsPerPage(selectedValue);
    setPageNumber(0); // Reset page number when changing institutions per page

    // Calculate the new pageCount based on the updated values
    const newPageCount = Math.ceil(institutionsCount.count / selectedValue);
    setPageCount(newPageCount);
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
                    onChange={(e) => triggerInstitutionSearch(e.target.value)}
                  />
                </div>
              </Form>
            </td>
            <td align="right">
              <Link to={"/institution/new"} className="link-brown">
                Add Institution
              </Link>
            </td>
          </tr>
        </tbody>
      </table>

      {error ? (
        <header className="jumbotron">
          <h3>{error}</h3>
        </header>
      ) : null}

      {institutions.length > 0 ? (
        <>
          <div className="header-container">
            <div className="left">
              <h3>Institutions List</h3>
            </div>
            <div className="right">
              <div className="select-container">
                <label htmlFor="dropdown-select">Institutions per page</label>
                <select
                  className="dropdown-select"
                  onChange={handleDropdownChange}
                  value={institutionsPerPage}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          </div>

          <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Created By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{displayInstitutions}</tbody>
          </table>

          {pageCount ? (
            <div className="pagination-container">
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                onPageChange={changePage}
                containerClassName={"paginationBttns"}
                previousLinkClassName={isOnFirstPage ? "hidden" : ""}
                nextLinkClassName={isOnLastPage ? "hidden" : ""}
                disabledClassName={"paginationDisabled"}
                activeClassName={"paginationActive"}
                forcePage={pageNumber}
              />
            </div>
          ) : (
            <div>loading...</div>
          )}
        </>
      ) : (
        <div>No record found.</div>
      )}
    </div>
  );
};

export default Institutions;
