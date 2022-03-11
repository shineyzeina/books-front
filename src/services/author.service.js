import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_SERVER_API ;


const getAuthorsList = (searchKey) => {
  return axios.get(API_URL + "/authors?keyword="+searchKey, { headers: authHeader() });
};

const deleteAuthor = (id) => {
  return axios(API_URL + "/author/" + id, {method: 'delete', headers: authHeader()});
};

const putAuthor = (id,firstName,lastName) => {
  return axios(API_URL + "/author/" + id, {method: 'put', headers: authHeader(),data: { first_name:firstName, last_name:lastName}});
};

const postAuthor = (firstName,lastName) => {
  return axios(API_URL + "/author", {method: 'post', headers: authHeader(),data: {  first_name:firstName, last_name:lastName}});
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
