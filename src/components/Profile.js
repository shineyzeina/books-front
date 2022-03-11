import React from "react";
import AuthService from "../services/auth.service";
import { Link} from "react-router-dom";

const Profile = () => {
  const currentUser = AuthService.getCurrentUser();

  return (
    <div className="container">
      <div className="jumbotron">
        <h3>
          {currentUser.username} | {currentUser.firstName} {currentUser.lastName} <Link to={"/user/password"} className="link-brown">
			Change Password
		</Link>
        </h3>
		
		<p>
			<a mailto={currentUser.email}> {currentUser.email}</a>
		</p>
		{currentUser.phone}
		
      </div>
    </div>
  );
};

export default Profile;
