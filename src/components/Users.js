import React, { useState, useEffect } from "react";
import authHeader from "../services/auth-header";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";


const Users = () => {
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    UserService.getUsersList().then(
      (response) => {
        setUsers(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setError(_content);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
		  
        }
      }
    );
  }, []);
 
 
 
  const deleteUser = async (event, id) => {
   
        if(window.confirm("Are you sure you want to delete this user?")){
            UserService.deleteUser(id).then(data => {
            
                   alert("User deleted!");
                    let oldList = users;
                    var data = oldList.filter(function( obj ) {
                        return obj.id !== id;
                    });
					setUsers(data);		
                  
                
            }).catch(function (error) {

					const _content =
					  (error.response &&
						error.response.data &&
						error.response.data.message) ||
					  error.message ||
					  error.toString();

					setError(_content);

					if (error.response && error.response.status === 401) {
					  EventBus.dispatch("logout");
					}
				 
                   
            })
        }
    }
  return (
    <div className="container">
     
	  {error ?  <header className="jumbotron"> <h3>{error}</h3>  </header>: null}
	  {!error && users ?
	  <div>
		<h3> Users List </h3>
		  <table className="styled-table">
			<thead>
				<tr>
					<th>Username</th>
					<th>First Name</th>
					<th>Last Name</th>
					<th>Email</th>
					<th>Phone</th>
					<th>Type</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{users.map((u) => (
				
					<tr>
						<td>{u.username}</td>
						<td>{u.firstName}</td>
						<td>{u.lastName}</td>
						<td>{u.email}</td>
						<td>{u.phone}</td>
						<td>{u.user_type}</td>
						<td><a href={"/user/" + u.id}  className="text-dark ">Edit</a>&nbsp;&nbsp;&nbsp;<a href="#"  className="text-dark" onClick={(e) => deleteUser(e, u.id)} >Delete</a></td>
					</tr> 
					 
				 ))}
				
				
				
			</tbody>
		</table>
	  </div>
	  : <div> No record found.</div> }
	 
     
    </div>
  );
};

export default Users;
