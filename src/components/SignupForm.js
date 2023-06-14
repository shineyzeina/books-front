import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'

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

const SignUpForm = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneOnly, setPhoneOnly] = useState("");
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

  const handlePhoneChange = (phone, countryData) => {
    setPhone(phone);
    setPhoneOnly(phone.split(countryData.dialCode)[1]);
    setPhoneCode(countryData.dialCode);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    form.current.validateAll();

    if (password !== confirmPassword) {
      setMessage("password does not match");
      setSuccessful(false);
      document.getElementById("msg").scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
      setLoading(false);
      return false;
    }
    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.register(username, email, password,first_name,last_name, phone, "").then(
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
        <div className="form-title loginBackground">
          <span className="form-title-1">
            Sign Up
            <div>
              <h5>It's quick and easy</h5>
            </div>
          </span>
        </div>

        <Form
          className="form validate-form"
          onSubmit={handleRegister}
          ref={form}
        >
          <div
            className="wrap-input100 validate-input m-b-26"
            data-validate="Username is required"
          >
            <span className="label-input100">Username</span>
            <Input
              type="text"
              className="input100"
              name="username"
              placeholder="Choose a Username *"
              value={username}
              onChange={onChangeUsername}
              validations={[required]}
            />
            <span className="focus-input100"></span>
          </div>
          <div
            className="wrap-input100 validate-input m-b-26"
            data-validate="Email is required"
          >
            <span className="label-input100">Email</span>
            <Input
              autoComplete="off"
              placeholder="E-mail *"
              type="text"
              className="input100"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              validations={[required]}
            />
            <span className="focus-input100"></span>
          </div>
          <div
            className="wrap-input100 validate-input m-b-26"
            data-validate="First Name is required"
          >
            <span className="label-input100">First Name</span>
            <Input
              autoComplete="off"
              placeholder="First Name *"
              type="text"
              className="input100"
              name="firstName"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              validations={[required]}
            />
            <span className="focus-input100"></span>
          </div>
          <div
            className="wrap-input100 validate-input m-b-26"
            data-validate="Last Name is required"
          >
            <span className="label-input100">Last Name</span>
            <Input
              autoComplete="off"
              placeholder="Last Name *"
              type="text"
              className="input100"
              name="LastName"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              validations={[required]}
            />
            <span className="focus-input100"></span>
          </div>
          <div
            className="wrap-input100 validate-input m-b-26"
            data-validate="Phone is required"
          >
            <span className="label-input100">Phone</span>
            <PhoneInput
              autoComplete="off"
              type="text"
              country={'lb'}
              name="phone"
              value={phone}
              onChange={(phone, countryData) =>
                handlePhoneChange(phone, countryData)
              }
              validations={[required]}
            />
            
          </div>
          <div
            className="wrap-input100 validate-input m-b-18"
            data-validate="Password is required"
          >
            <span className="label-input100">Password</span>
            <Input
              type="password"
              className="input100"
              placeholder="Password *"
              name="password"
              value={password}
              onChange={onChangePassword}
              validations={[required]}
            />
            <span className="focus-input100"></span>
          </div>
          <div
            className="wrap-input100 validate-input m-b-18"
            data-validate="ConfirmPassword is required"
          >
            <span className="label-input100">Confirm Password</span>
            <Input
              autoComplete="current-password"
              placeholder="Confirm Password *"
              type={showConfirmPassword ? "text" : "password"}
              className="input100"
              name="cpassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              validations={[required]}
            />
            <span className="focus-input100"></span>
          </div>

          <div className="container-form-btn">
            <button className="form-btn">SignUp</button>
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

export default SignUpForm;
