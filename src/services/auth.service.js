import axios from "axios";

const API_URL = process.env.REACT_APP_SERVER_API ;

const register = (username, email, password,firstName,lastName, phone, dob) => {
  return axios.post(API_URL + "/users/register", {
    username,
    email,
    password,
	  firstName,
	  lastName,
	  phone,
	  dob
  });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "/users/authenticate", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
};
