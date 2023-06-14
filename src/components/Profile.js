import React from "react";
import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();

  return (
    <div className="profile-container">
      <div className="profile-jumbotron">
        <h3 className="profile-heading">
          Welcome, {currentUser.firstName} {currentUser.lastName}!
        </h3>

        <div className="profile-details">
          <p className="profile-email">
            <span className="profile-label">Email:</span>{" "}
            <a href={`mailto:${currentUser.email}`} className="profile-link">
              {currentUser.email}
            </a>
          </p>

          <p className="profile-phone">
            <span className="profile-label">Phone:</span> {currentUser.phone}
          </p>
        </div>

        <div className="profile-actions">
          <Link to={"/user/password"} className="profile-link">
            Change Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
