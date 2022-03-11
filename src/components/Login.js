import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../services/auth.service";

const required = (value) => {
	if (!value) {
		return (
			<div className="alert alert-danger" role="alert">
				This field is required!
			</div>
		);
	}
};

const Login = (props) => {
	const form = useRef();
	const checkBtn = useRef();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const onChangeUsername = (e) => {
		const username = e.target.value;
		setUsername(username);
	};

	const onChangePassword = (e) => {
		const password = e.target.value;
		setPassword(password);
	};

	const handleLogin = (e) => {
		e.preventDefault();

		setMessage("");
		setLoading(true);

		form.current.validateAll();

		if (checkBtn.current.context._errors.length === 0) {
			AuthService.login(username, password).then(
				() => {
					props.history.push("/home");
					window.location.reload();
				},
				(error) => {
					const resMessage =
						(error.response &&
							error.response.data &&
							error.response.data.message) ||
						error.message ||
						error.toString();

					setLoading(false);
					setMessage(resMessage);
				}
			);
		} else {
			setLoading(false);
		}
	};

	return (
		<>

			<div className="wrap-form">
				<div className="form-title loginBackground" >
					<span className="form-title-1">
						Sign In
					</span>
				</div>

				<Form className="form validate-form" onSubmit={handleLogin} ref={form}>

					<div className="wrap-input100 validate-input m-b-26" data-validate="Username is required">
						<span className="label-input100">Username</span>
						<Input
							type="text"
							className="input100"
							name="username"
							placeholder="Enter username"
							value={username}
							onChange={onChangeUsername}
							validations={[required]}
						/>
						<span className="focus-input100"></span>
					</div>

					<div className="wrap-input100 validate-input m-b-18" data-validate="Password is required">
						<span className="label-input100">Password</span>
						<Input
							type="password"
							className="input100"
							placeholder="Enter password"
							name="password"
							value={password}
							onChange={onChangePassword}
							validations={[required]}
						/>
						<span className="focus-input100"></span>
					</div>

					<div className="flex-sb-m w-full p-b-30">

						<div>
							<a href="#" className="txt1">
								Forgot Password?
							</a>
						</div>
					</div>

					<div className="container-form-btn">
						<button className="form-btn">
							Login
						</button>
					</div>
					 {message && (
						<div className="form-group">
						  <div className="alert alert-danger" role="alert">
							{message}
						  </div>
						</div>
					  )}
					<CheckButton style={{ display: "none" }} ref={checkBtn} />
				</Form>
			</div>

		</>


	);
};

export default Login;
