import React, { useState, useEffect, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthorService from "../services/author.service";
import EventBus from "../common/EventBus";
import CountriesDropDown from "./CountriesDropDown";


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
	const [age, setAge] = useState();
	const [nationality, setNationality] = useState("");
	const [successful, setSuccessful] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [address, setAddress] = useState({});
	const [picture, setPicture] = useState(null)
	const [pictureUrl, setPictureUrl] = useState("");
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
					setAge(a.age);
					setNationality(a.nationality);
					setAddress(a.address || {});
					setPictureUrl(a.pictureUrl);


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
	const handleSaveAuthor = async (e) => {
		e.preventDefault();

		setMessage("");
		setSuccessful(false);

		form.current.validateAll();
		setLoading(true);

		if (checkBtn.current.context._errors.length === 0) {
			
			try {
				let pic_url  = null;
				if (picture) {
					const formData = new FormData();
					formData.append("picture", picture);
					await AuthorService.uploadPicture(formData)
					.then((response) => {
						pic_url = response.data.url;
						setPictureUrl(pic_url);
						console.log("Image URL ", pic_url)
						// Perform actions with the imageUrl (e.g., save to the database)
					  })
					  .catch((error) => {
						console.error("Error uploading picture:", error);
					  });
					
				  }
	

			if (authorId) {
				AuthorService.putAuthor(authorId, firstName, lastName, age, nationality, address, pic_url).then(
					(response) => {
						
						console.log(firstName, " here")
						console.log(lastName, " here")
						console.log(address, " here")
						console.log(pic_url, "here")
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

				AuthorService.postAuthor(firstName, lastName, age, nationality, address, pic_url).then(
					(response) => {
						console.log(pictureUrl, " hgere")
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
		}  catch (error) {
			const resMessage =
			  (error.response &&
				error.response.data &&
				error.response.data.message) ||
			  error.message ||
			  error.toString();
	
			setMessage(resMessage);
			setSuccessful(false);
		  }

		}
		setLoading(false);
	};

	const handleSaveAddress = (field, value) => {
		setAddress(prevAddress => ({
			...prevAddress,
			[field]: value
		  }));
	}

	const handlePictureChange = (e) => {
		setPicture(e);
		}
	
	
	  


	return (

		<div className="wrap-form">
			<div className="form-title authorFormBackground" >
				<span className="form-title-1">
					Author Form
				</span>
			</div>
			<Form className="form validate-form" onSubmit={handleSaveAuthor} ref={form}>


				<div className="wrap-input100 validate-input m-b-18" data-validate="First name is required">
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

				<div className="wrap-input100 validate-input m-b-18" data-validate="Last name is required">
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

				<div className="wrap-input100 validate-input m-b-18" data-validate="Age is required">
					<span className="label-input100">Age</span>
					<Input
						type="text"
						className="input100"
						name="age"
						value={age}
						onChange={e => setAge(e.target.value)}
						validations={[required]}
					/>
					<span className="focus-input100"></span>
				</div>

				<div className="wrap-input100 validate-input m-b-18" data-validate="Nationality is required">
					<span className="label-input100">Nationality</span>
					<CountriesDropDown 
						value = {nationality}
						onChange={e => setNationality(e.target.value)}
					/>
					<span className="focus-input100"></span>
				</div>

				<div style={{ padding: '30px' }}>
  					<h4>Address</h4>
  					<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: '100px' }}>
    					<div className="wrap-input100 validate-input m-b-18" data-validate="Password is required">
      						<span className="label-input100">Country</span>
      						<Input
        						type="text"
        						className="input100"
        						name="age"
        						value={address.country}
        						onChange={e => handleSaveAddress("country", e.target.value)}
        						validations={[required]}
      						/>
      						<span className="focus-input100"></span>
    					</div>

    					<div className="wrap-input100 validate-input m-b-18" data-validate="Password is required">
      						<span className="label-input100">City</span>
      						<Input
       							type="text"
        						className="input100"
        						name="age"
        						value={address.city}
        						onChange={e => handleSaveAddress("city", e.target.value)}
        						validations={[required]}
      						/>
      						<span className="focus-input100"></span>
    					</div>

    					<div className="wrap-input100 validate-input m-b-18" data-validate="Password is required">
      						<span className="label-input100">Street</span>
							<Input
        						type="text"
        						className="input100"
        						name="age"
        						value={address.street}
        						onChange={e => handleSaveAddress("street", e.target.value)}
        						validations={[required]}
      						/>
      						<span className="focus-input100"></span>
    					</div>

    					<div className="wrap-input100 validate-input m-b-18" data-validate="Password is required">
      						<span className="label-input100">Building</span>
      						<Input
        						type="text"
        						className="input100"
        						name="age"
        						value={address.building}
        						onChange={e => handleSaveAddress("building", e.target.value)}
        						validations={[required]}
      						/>
      						<span className="focus-input100"></span>
    					</div>
  				</div>
			</div>

			<div className="wrap-input100 validate-input m-b-18">
           		<span className="label-input100">Image</span>
            	<input type="file" onChange={e => handlePictureChange(e.target.files[0])} />
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
