import React, { useState, useEffect, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import BookService from "../services/book.service";
import EventBus from "../common/EventBus";
import { getAuthorLists } from "./AuthorsList"


const required = (value) => {
	if (!value) {
		return (
			<div className="alert alert-danger" role="alert">
				This field is required!
			</div>
		);
	}
};

	const BookForm = (props) => {
	const form = useRef();
	const checkBtn = useRef();

	const [ISBN, setISBN] = useState("");
	const [name, setName] = useState("");
	const [author, setAuthor] = useState("");
	const [authorsList, setAuthorsList] = useState([]);
	const [successful, setSuccessful] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const bookId = props.match.params.id;


	useEffect(() => {
		async function onReady() {

			setAuthorsList(await getAuthorLists())
			getBookInfo();

		}

		onReady()

	}, []);

	const getBookInfo = () => {
		if (bookId) {
			BookService.getBookById(bookId).then(
				(response) => {
					let b = response.data;
					setISBN(b.ISBN);
					setName(b.name);
					setAuthor(b.author);


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
	const handleSavebook = (e) => {
		e.preventDefault();

		setMessage("");
		setSuccessful(false);

		form.current.validateAll();
		setLoading(true);
		if (checkBtn.current.context._errors.length === 0) {
			if (bookId) {
				BookService.putBook(bookId, ISBN, name, author).then(
					(response) => {
						setMessage("book Updated.");
						setSuccessful(true);
						props.history.push('/books');
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

				BookService.postBook(ISBN, name, author).then(
					(response) => {
						setMessage("book Saved.");
						setSuccessful(true);
						props.history.push('/books');
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
			<div className="form-title bookFormBackground" >
				<span className="form-title-1">
					Book Form
				</span>
			</div>
			<Form className="form validate-form" onSubmit={handleSavebook} ref={form}>
				<div className="wrap-input100 validate-input m-b-18" data-validate="ISBN is required">
					<span className="label-input100">ISBN</span>
					<Input
						type="text"
						className="input100"
						name="ISBN"
						value={ISBN}
						onChange={e => setISBN(e.target.value)}
						validations={[required]}
					/>
					<span className="focus-input100"></span>
				</div>

				<div className="wrap-input100 validate-input m-b-18" data-validate="Name is required">
					<span className="label-input100">Name</span>
					<Input
						type="text"
						className="input100"
						name="name"
						value={name}
						onChange={e => setName(e.target.value)}
						validations={[required]}
					/>
					<span className="focus-input100"></span>
				</div>

				<div className="wrap-input100 validate-input m-b-18" data-validate="Author is required">
					<span className="label-input100">Author</span>
					<select
						type="text"
						className="input100"
						name="author"
						value={author}
						onChange={e => setAuthor(e.target.value)}
						validations={[required]}
					>
						<option value="" key="0"></option>
						{authorsList && authorsList.map((a, index) => <option key={index} value={a.id}>{a.first_name} {a.last_name}</option>)}
					</select>
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

export default BookForm;
