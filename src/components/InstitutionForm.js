import React, { useState, useEffect, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthorService from "../services/author.service";
import EventBus from "../common/EventBus";
import ImageUploader from "react-images-upload";
import Resizer from "react-image-file-resizer"
import FormData from 'form-data';
import TextInput from "./TextInput";
import AuthCategory from "./AuthCategories";

const required = (value) => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};


const InstitutionForm = (props) => {
    const form = useRef();
    const checkBtn = useRef();

    const [institutionName,setinstitutionName] = useState();
    const [address,setaddress] = useState();
    const [authors,setAuthors] = useState([]);
	const [loading, setLoading] = useState(false);


    return (
        <div className="wrap-form">
            <div className="form-title" >
                <span className="form-title-1">
                    Institution Form
                </span>
            </div>
            <Form className="form validate-form" ref={form}>
                <div className="wrap-input100 validate-input m-b-18" data-validate="Name is required">
                    <span className="label-input100">Institution Name</span>
                    <Input
                        type="text"
                        className="input100"
                        name="instName"
                       
                        validations={[required]}
                    />
                    <span className="focus-input100"></span>
                </div>
                <div className="wrap-input100 validate-input m-b-18" data-validate="Name is required">
                    <span className="label-input100">Address</span>
                    <Input
                        type="text"
                        className="input100"
                        name="address"
                       
                        validations={[required]}
                    />
                    <span className="focus-input100"></span>
                </div>
                <div className="wrap-input100 validate-input m-b-18 mt-1" data-validate="Author is required">
					<span className="label-input100">Authors</span>
					<AuthCategory
					   category={authors}
					   setCategory={(e) => setAuthors(e.target.value)}
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
            </Form>
        </div>
    )
}

export default InstitutionForm;