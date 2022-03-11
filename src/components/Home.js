import React, { useState, useEffect } from "react";
import AuthService from "../services/auth.service"
import UserService from "../services/user.service";


const Home = () => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(undefined);

  

  useEffect(() => {
   
	const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }

  }, []);
 
 

  return (
    <div className="container">
	{!currentUser ?
		<div >
		 
			<h3>Public Dashboard should be here</h3>
		 
		
		 
		</div> : 
		<div>
			<h3>Private Dashboard should be here</h3>
		</div>
	}
	</div>
  );
};

export default Home;
