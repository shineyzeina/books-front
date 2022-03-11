import React, { useState, useEffect } from "react";
import authHeader from "../services/auth-header";
import BookService from "../services/book.service";
import EventBus from "../common/EventBus";
import defaultProfile from "../images/profile.png";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { Link} from "react-router-dom";


const currentUser = JSON.parse(localStorage.getItem('user'));
const Books = () => {
  const [error, setError] = useState("");
  const [books, setBooks] = useState([]);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  
  useEffect(() => {
    searchBooks("");
  }, []);
  
  const triggerBookSearch = (keyword) =>{
	setSearchKeyword(keyword);
	searchBooks(keyword);
	  
  }
  const searchBooks = (keyword) => {
	BookService.getBooksList(keyword).then(
      (response) => {
        setBooks(response.data);
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
 
 
  
 
 
	
  return (
    <div className="sub-container">
		<table border="0" width="100%" className="searchContainer">
			<tr>
				<td align="left">
					<Form>
					<div className="form-group">
					   
						<Input
						  type="text"
						  className="form-control half_width"
						  name="searchKeyword"
						  value={searchKeyword}
						  placeholder = "Search"
						  onChange={e => triggerBookSearch(e.target.value)}
						/>
					  </div>
					</Form>
				</td>
				<td align="right">
					<Link to={"/book/new"} className="link-brown">
						Add Book
					</Link>
				</td>
			</tr>
		</table>
		
	  {error ?  <header className="jumbotron"> <h3>{error}</h3>  </header>: null}
	  {!error && books ?
	  <div>
		
			 
		  <h3> Books List </h3>
		  <table className="styled-table">
			<thead>
				<tr>
					
					<th>Name</th> 
					<th>Author</th>
					<th>Medical History</th>
					<th>Medication</th>
					
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{books.map((p) => (
				
					<tr>
						
						<td  valign="top"><a href={"/book/" + p.id}  className="text-dark ">{p.firstName} {p.lastName}</a></td> 
						<td  valign="top">{p.phone}</td>
						
						<td  valign="top"><a href={"/book/" + p.id}  className="text-dark ">View</a>&nbsp;&nbsp;&nbsp;<a href={"/book/edit/" + p.id}  className="text-dark ">Edit</a>&nbsp;&nbsp;&nbsp;<a href="#"   className="text-dark" >Delete</a>
						</td>
					</tr> 
					 
				 ))}
				
				
				
			</tbody>
		</table>
	  </div>
	  : <div> No record found.</div> }
	 
     
    </div>
  );
};

export default Books;
