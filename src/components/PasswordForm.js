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
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

   
  const handleSavePassword = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();
	setLoading(true);
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
	setLoading(false);
  };

  return (
  
	<div className="wrap-form">
			<div className="form-title passwordFormBackground" >
				<span className="form-title-1">
					Change your Password
				</span>
			</div>
      
	  
        <Form className="form validate-form" onSubmit={handleSavePassword} ref={form}>
          {!successful && (
			<>
			<div className="wrap-input100 validate-input m-b-18" data-validate="Password is required">
					<span className="label-input100">New Password</span>
					<Input
						type="password"
						className="input100"
						name="newPassword"
						value={newPassword}
						onChange={e => setNewPassword(e.target.value)}
						validations={[required, fieldLimit]}
					/>
					<span className="focus-input100"></span>
			</div>
            
			  

        <div className="container-form-btn" >
					<button className="form-btn" disabled={loading}>
						{loading && (
							<span className="spinner-border spinner-border-sm"></span>
						)}
						<span>Save</span>
					</button>

				</div>
            </>
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
    
  );
};

export default PasswordForm;
