import React, { useState, useEffect , useRef} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import UserService from "../services/user.service";
import AuthService from "../services/user.service";
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

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const fieldLimit = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The field must be between 3 and 20 characters.
      </div>
    );
  }
};



var dateFormat = require("dateformat");

const UserForm = (props) => {
  const form = useRef();
  const checkBtn = useRef();
	
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const userId = props.match.params.id;
 

   useEffect(() => {
    UserService.getUserById(userId).then(
      (response) => {
		let u = response.data;
        setFirstName(u.firstName);
		setLastName(u.lastName);
		setPhone(u.phone);
		setEmail(u.email);
		setDob(dateFormat(u.dob, "yyyy-mm-dd"));
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
  }, []);

  const handleSaveUser = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.putUser(email,firstName,lastName, phone, dob,userId).then(
        (response) => {
          setMessage("User Saved.");
          setSuccessful(true);
		   window.location.href = window.location.protocol + "//"+ window.location.host + "/users";
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
  };

  return (
    <div className="col-md-12">
      <div className="card card-container">
      
	  
        <Form onSubmit={handleSaveUser} ref={form}>
          {!successful && (
            <div>
              
			  <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <Input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  validations={[required, fieldLimit]}
                />
              </div>
			  
			   <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <Input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={lastName}
                   onChange={e => setLastName(e.target.value)}
                  validations={[required, fieldLimit]}
                />
              </div>
			  
			  <div className="form-group">
                <label htmlFor="dob">Date of Birth</label>
                <Input
                  type="date"
                  className="form-control"
                  name="dob"
                  value={dob}
                   onChange={e => setDob(e.target.value)}
                  validations={[required]}
                />
              </div>
			  
			  <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <Input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={phone}
                   onChange={e => setPhone(e.target.value)}
				    validations={[required]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Input
                  type="text"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  validations={[required, validEmail]}
                />
              </div>

            

              <div className="form-group">
                <button className="btn btn-primary btn-block">Save</button>
              </div>
            </div>
          )}

          {message && (
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
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default UserForm;
