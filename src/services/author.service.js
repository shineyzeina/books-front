import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_SERVER_API ;


const getAuthorsList = (searchKey) => {
  return axios.get(API_URL + "/authors?keyword="+searchKey, { headers: authHeader() });
};

const deleteAuthor = (id) => {
  return axios(API_URL + "/author/" + id, {method: 'delete', headers: authHeader()});
};

const putAuthor = (id,firstName,lastName,age, nationality, address, pictureUrl) => {
  return axios(API_URL + "/author/" + id, {method: 'put', headers: authHeader(),data: { first_name:firstName, last_name:lastName, age:age, nationality:nationality, address:address, pictureUrl:pictureUrl}});
};

const postAuthor = (firstName,lastName,age, nationality, address, pictureUrl) => {
  return axios(API_URL + "/author", {method: 'post', headers: authHeader(),data: {  first_name:firstName, last_name:lastName, age:age,nationality:nationality, address:address, pictureUrl:pictureUrl}});
};



const getAuthorById = (id) => {
  return axios.get(API_URL + "/author/" + id, { headers: authHeader() });
};

const uploadPicture = (formData) => {

  return axios.post(API_URL + "/author/upload-picture", formData, { headers: authHeader() });
};

const getPicture = (pictureUrl) => {
  return axios.get(API_URL + pictureUrl, { headers: authHeader(), responseType: 'blob' })
} 



export default {
  putAuthor,
  postAuthor,
  deleteAuthor,
  getAuthorsList,
  getAuthorById,
  uploadPicture,
  getPicture
  
};
