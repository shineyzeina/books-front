import React, { useState, useEffect } from "react";
import { Switch, Route, Link, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "./App.css";
import "./util.css";
import logo from "./images/logo.png";
import AuthService from "./services/auth.service";

import SignUpForm from "./components/SignupForm";
import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Users from "./components/Users";
import Books from "./components/Books";
import BookForm from "./components/BookForm";
import AuthorForm from "./components/AuthorForm";
import Authors from "./components/Authors";
import PasswordForm from "./components/PasswordForm";
import AuthorView from "./components/AuthorView";
import Institutions from "./components/Institutions";
import InstitutionForm from "./components/InstitutionForm";

// import AuthVerify from "./common/AuthVerify";
import EventBus from "./common/EventBus";

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    window.location.href =
      window.location.protocol + "//" + window.location.host + "/login";
  };

  return (
    <div className="limiter">
      <nav className="navbar navbar-expand ">
        <Link to={"/"}>
          <img className="logo" src={logo} alt="logo" />
        </Link>
        <div className="navbar-nav mr-auto">
          {currentUser && (
            <>
              <li className="nav-item">
                <Link to={"/books"} className="nav-link text-dark mx-0">
                  <i className="fa fa-book"> </i>  Books
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/authors"} className="nav-link text-dark mx-0">
                  <i className="fa fa-person"> </i>  Authors
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/institutions"} className="nav-link text-dark mx-0">
                  <i className="fas fa-graduation-cap"></i>  Insitutions
                </Link>
              </li>

              {currentUser.type == "admin" ? (
                <li className="nav-item">
                  <Link to={"/users"} className="nav-link text-dark mx-0">
                    Users
                  </Link>
                </li>
              ) : (
                ""
              )}
            </>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link text-dark mx-0">
                {currentUser.username}
              </Link>
            </li>
            <li className="nav-item ">
              <a
                href="/login"
                className="nav-link text-dark mx-0"
                onClick={logOut}
              >
                LogOut
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/register"} className="nav-link text-dark mx-0">
                SignUp
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/login"} className="nav-link text-dark mx-0">
                Login
              </Link>
            </li>
          </div>
        )}
      </nav>
      <div></div>

      <div className="container">
        <Switch>
          <Route exact path={["/", "/home"]} component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={SignUpForm} />
          <Route exact path="/profile" component={Profile} />
          <Route path="/book/new" component={BookForm} />
          <Route path="/book/edit/:id" component={BookForm} />
          <Route path="/author/new" component={AuthorForm} />
          <Route path="/author/edit/:id" component={AuthorForm} />
          <Route path="/author/view/:id" component={AuthorView} />
          <Route path="/users" component={Users} />
          <Route path="/books" component={Books} />
          <Route path="/authors" component={Authors} />
          <Route path="/user/password" component={PasswordForm} />
          <Route path="/institutions" component={Institutions} />
          <Route path="/institution/new" component={InstitutionForm}></Route>
        </Switch>
      </div>

      {/* <AuthVerify logOut={logOut}/> */}
    </div>
  );
};

export default App;
