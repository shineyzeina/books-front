import React, { useState, useEffect, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthorService from "../services/author.service";
import EventBus from "../common/EventBus";


const required = (value) => {
	if (!value) {
		return (
			<div className="alert alert-danger" role="alert">
				This field is required!
			</div>
		);
	}
};





const AuthorForm = (props) => {
	const form = useRef();
	const checkBtn = useRef();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [successful, setSuccessful] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const authorId = props.match.params.id;


	useEffect(() => {
		async function onReady() {
			getAuthorInfo();
		}

		onReady()

	}, []);

	const getAuthorInfo = () => {
		if (authorId) {
			AuthorService.getAuthorById(authorId).then(
				(response) => {
					let a = response.data;
					setFirstName(a.first_name);
					setLastName(a.last_name);


				},
				(error) => {
					const _content =
						(error.response &&
							error.response.data &&
							error.response.data.message) ||
						error.message ||
						error.toString();
					alert(_content);
					setMessage(_content);

					if (error.response && error.response.status === 401) {
						EventBus.dispatch("logout");
					}
				}
			);
		}
	}
	const handleSaveAuthor = (e) => {
		e.preventDefault();

		setMessage("");
		setSuccessful(false);

		form.current.validateAll();
		setLoading(true);
		if (checkBtn.current.context._errors.length === 0) {
			if (authorId) {
				AuthorService.putAuthor(authorId, firstName, lastName).then(
					(response) => {
						setMessage("Author Updated.");
						setSuccessful(true);
						props.history.push('/authors');
					},
					(error) => {
						const resMessage =
							(error.response &&
								error.response.data &&
								error.response.data.message) ||
							error.message ||
							error.toString();

						setMessage(resMessage);
						setSuccessful(false);
					}
				);
			}
			else {

				AuthorService.postAuthor(firstName, lastName).then(
					(response) => {
						setMessage("Author Saved.");
						setSuccessful(true);
						props.history.push('/authors');
					},
					(error) => {
						const resMessage =
							(error.response &&
								error.response.data &&
								error.response.data.message) ||
							error.message ||
							error.toString();

						setMessage(resMessage);
						setSuccessful(false);
					}
				);
			}

		}
		setLoading(false);
	};


	return (

		<div className="wrap-form">
			<div className="form-title authorFormBackground" >
				<span className="form-title-1">
					Author Form
				</span>
			</div>
			<Form className="form validate-form" onSubmit={handleSaveAuthor} ref={form}>


				<div className="wrap-input100 validate-input m-b-18" data-validate="Name is required">
					<span className="label-input100">First Name</span>
					<Input
						type="text"
						className="input100"
						name="firstName"
						value={firstName}
						onChange={e => setFirstName(e.target.value)}
						validations={[required]}
					/>
					<span className="focus-input100"></span>
				</div>

				<div className="wrap-input100 validate-input m-b-18" data-validate="Password is required">
					<span className="label-input100">Last Name</span>
					<Input
						type="text"
						className="input100"
						name="lastName"
						value={lastName}
						onChange={e => setLastName(e.target.value)}
						validations={[required]}
					/>
					<span className="focus-input100"></span>
				</div>


				<div className="container-form-btn">
					<button className="form-btn" disabled={loading}>
						{loading && (
							<span className="spinner-border spinner-border-sm"></span>
						)}
						<span>Save</span>
					</button>

				</div>


				{
					message && (
						<div className="form-group">
							<div
								className={
									successful ? "alert alert-success" : "alert alert-danger"
								}
								role="alert"
							>
								{message}
							</div>
						</div>
					)
				}
				<CheckButton style={{ display: "none" }} ref={checkBtn} />
			</Form >
		</div>

	);
};

export default AuthorForm;
