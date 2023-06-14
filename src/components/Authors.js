import React, { useState, useEffect } from "react";
import authHeader from "../services/auth-header";
import AuthorService from "../services/author.service";
import EventBus from "../common/EventBus";
import defaultProfile from "../images/profile.png";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { Link } from "react-router-dom";
import { getAuthorLists } from "./AuthorsList"
const IMG_URL = process.env.REACT_APP_IMG_API;
console.log("IMAGE URL : " + IMG_URL);

const currentUser = JSON.parse(localStorage.getItem('user'));
const Authors = () => {
	const [error, setError] = useState("");
	const [authors, setAuthors] = useState([]);
	const [successful, setSuccessful] = useState(false);
	const [message, setMessage] = useState("");
	const [searchKeyword, setSearchKeyword] = useState("");

	useEffect(() => {
		searchAuthors("");
	}, []);

	const triggerAuthorSearch = (keyword) => {
		setSearchKeyword(keyword);
		searchAuthors(keyword);

	}
	const searchAuthors = async (keyword) => {
		setAuthors(await getAuthorLists(keyword));

	}


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
	}


	return (
		<div className="sub-container">
			<table border="0" width="100%">
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
									onChange={e => triggerAuthorSearch(e.target.value)}
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
			</table>

			{error ? <header className="jumbotron"> <h3>{error}</h3>  </header> : null}
			{!error && authors ?
				<>


					<h3> Authors List </h3>
					<table className="styled-table">
						<thead>
							<tr>
								<th>Name</th>
								<th>Created By</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{authors && authors.map((a) => (

								<tr>
									<Link to={`/author/view/${a.id}`} className="text-dark" style={{ textDecoration: 'none', color: 'inherit' }}>
										<td valign="top" style={{ borderBottom: '1px solid #ccc' }}><img src={IMG_URL + a.profile_picture_url} alt="Profile Picture" style={{ width: '10%',height: '10%',objectFit : 'cover',borderRadius: '100%' }} />{a.first_name} {a.last_name}</td>
									</Link>

									<td valign="top">{a.createdBy ? a.createdBy.firstName + " " + a.createdBy.lastName : ""}</td>
									<td valign="top"><a href={"/author/edit/" + a.id} className="text-dark ">Edit</a>&nbsp;&nbsp;&nbsp;<a href="#" className="text-dark" onClick={(e) => deleteAuthor(e, a.id)} >Delete</a>
									</td>
								</tr>

							))
							}

						</tbody>
					</table>
				</>
				: <div> No record found.</div>}


		</div>
	);
};

export default Authors;