import React, { useState, useEffect , useRef} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthUser from "../services/user.service";
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


const fieldLimit = (value) => {
  if (value.length < 8 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The field must be between 8 and 20 characters.
      </div>
    );
  }
};



const PasswordForm = (props) => {
  const form = useRef();
  const checkBtn = useRef();
	
  const [newPassword, setNewPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

   
  const handleSavePassword = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthUser.putPassword(newPassword).then(
        (response) => {
          setMessage("Password changed!");
          setSuccessful(true);
		 
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
      
	  
        <Form onSubmit={handleSavePassword} ref={form}>
          {!successful && (
            <div>
              
			  <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <Input
                  type="password"
                  className="form-control"
                  name="newPassword"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  validations={[required, fieldLimit]}
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

export default PasswordForm;
