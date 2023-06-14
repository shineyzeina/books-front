import React, { useState, useEffect } from "react";
import InstitutionService from "../services/institution.service";
import EventBus from "../common/EventBus";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import { Link } from "react-router-dom";

const Institutions = () => {
	const [error, setError] = useState("");
	const [institutions, setInstitutions] = useState([]);
	const [searchKeyword, setSearchKeyword] = useState("");

	useEffect(() => {
		searchInstitutions("");
        
	}, []);

	const triggerInstitutionSearch = (keyword) => {
		setSearchKeyword(keyword);
		searchInstitutions(keyword);

	}
	const searchInstitutions = async (keyword) => {
        InstitutionService.getInstitutionsList(keyword).then(
			(response) => {
				if (response) {
                    console.log("Here is the data", response.data);
                    setInstitutions(response.data);}
			},
			(error) => {
				console.log("Call kello ghalat");
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


	const deleteInstitution = async (event, id) => {

		if (window.confirm("Are you sure you want to delete this institution?")) {
			InstitutionService.deleteInstitution(id).then(
				(response) => {

					alert("Author deleted!");
					let oldList = institutions;
					var data = oldList.filter(function (obj) {
						return obj.id !== id;
					});
					setInstitutions(data);


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
									onChange={e => triggerInstitutionSearch(e.target.value)}
								/>
							</div>
						</Form>
					</td>
					<td align="right">
						<Link to={"/author/new"} className="link-brown">
							Add Institution
						</Link>
					</td>
				</tr>
			</table>

			{error ? <header className="jumbotron"> <h3>{error}</h3>  </header> : null}
			{!error && institutions ?
				<>


					<h3> Institutions List </h3>
					<table className="styled-table">
						<thead>
							<tr>
								<th>Name</th>
								<th>Created By</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{institutions && institutions.map((i) => (

								<tr>

									<td valign="top"> {i.name} </td>
									<td valign="top">{i.createdBy ? i.createdBy.firstName + " " + i.createdBy.lastName : ""}</td>
									<td valign="top">
										<a href={"/author/view/" + i.id} className="text-dark">View</a>&nbsp;&nbsp;&nbsp;
										<a href={"/author/edit/" + i.id} className="text-dark ">Edit</a>&nbsp;&nbsp;&nbsp;<a href="#" className="text-dark" onClick={(e) => deleteInstitution(e, i.id)} >Delete</a>
										
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

export default Institutions;
