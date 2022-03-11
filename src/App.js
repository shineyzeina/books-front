import React, { useState, useEffect } from "react";
import { Switch, Route, Link ,Redirect} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./util.css";
import logo from './images/logo.png';
import AuthService from "./services/auth.service";

import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Users from "./components/Users";
import Books from "./components/Books";
import Book from "./components/Book";
import UserForm from "./components/UserForm";
import BookForm from "./components/BookForm";
import AuthorForm from "./components/AuthorForm";
import Authors from "./components/Authors";
import PasswordForm from "./components/PasswordForm";


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
	window.location.href = window.location.protocol + "//"+ window.location.host + "/login";
  };

  return (
    <div  className="limiter">
	
      <nav className="navbar navbar-expand ">
        <Link to={"/"} >
			<img className="logo" src={logo} alt="logo" />
        </Link>
        <div className="navbar-nav mr-auto">
         {currentUser && (
			<>
            <li className="nav-item">
              <Link to={"/books"} className="nav-link text-dark mx-0">
               Books
              </Link>
			</li>
			
			 <li className="nav-item">
              <Link to={"/authors"} className="nav-link text-dark mx-0">
               Authors
              </Link>
			</li>
		
			
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
              <a href="/login" className="nav-link text-dark mx-0" onClick={logOut}>
                LogOut
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link text-dark mx-0">
                Login
              </Link>
            </li>

          
          </div>
        )}
      </nav>
	  <div> 
		
		
	  </div>

     <div className="container">
        <Switch>
          <Route exact path={["/", "/home"]} component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/profile" component={Profile} />
          <Route  path="/book/new" component={BookForm} />
          <Route  path="/book/edit/:id" component={BookForm} />
		  <Route  path="/author/new" component={AuthorForm} />
          <Route  path="/author/edit/:id" component={AuthorForm} />
		  <Route  path="/book/:id" component={Book} />
          <Route path="/books" component={Books} />
          <Route path="/authors" component={Authors} />
          <Route path="/user/password" component={PasswordForm} />
          
        </Switch>
      </div>

      {/* <AuthVerify logOut={logOut}/> */}
    </div>
  );
};

export default App;
