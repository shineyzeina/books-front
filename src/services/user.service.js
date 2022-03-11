import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_SERVER_API ;


const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};


const getUsersList = () => {
  return axios.get(API_URL + "/users", { headers: authHeader() });
};


const putUser = (email,firstName,lastName, phone,id) => {
  return axios(API_URL + "/users/" + id, {method: 'put', headers: authHeader(),data: { email: email, firstName: firstName, lastName: lastName,phone:phone}});
};

const putPassword = (newPassword) => {
  return axios(API_URL + "/user/current", {method: 'put', headers: authHeader(),data: { password: newPassword}});
};

const getUserById = (id) => {
  return axios.get(API_URL + "/users/" + id, { headers: authHeader() });
};

// This should be overwritten later. The delete should only mark the user as deleted.
const deleteUser = (id) => {
  return axios(API_URL + "/users/" + id, {method: 'delete', headers: authHeader()});
};


export default {
  putUser,
  getUserBoard,
  getUsersList,
  getUserById,
  deleteUser,
  putPassword
};
