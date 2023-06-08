import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_SERVER_API ;


const getAuthorsList = (searchKey, authorId) => {
  return axios.get(API_URL + "/authors?keyword="+searchKey, { headers: authHeader() });
};

const deleteAuthor = (id) => {
  return axios(API_URL + "/author/" + id, {method: 'delete', headers: authHeader()});
};

const putAuthor = (id,firstName,lastName,age, nationality, address) => {
  return axios(API_URL + "/author/" + id, {method: 'put', headers: authHeader(),data: { first_name:firstName, last_name:lastName, age:age, nationality:nationality, address:address}});
};

const postAuthor = (firstName,lastName,age, nationality, address) => {
  return axios(API_URL + "/author", {method: 'post', headers: authHeader(),data: {  first_name:firstName, last_name:lastName, age:age,nationality:nationality, address:address}});
};



const getAuthorById = (id) => {
  return axios.get(API_URL + "/author/" + id, { headers: authHeader() });
};


export default {
  putAuthor,
  postAuthor,
  deleteAuthor,
  getAuthorsList,
  getAuthorById
  
};
