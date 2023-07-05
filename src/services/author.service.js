import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_SERVER_API;


const getAuthorsList = (searchKey, page, limit) => {
  return axios.get(API_URL + "/authors", {
    headers: authHeader(),
    params: { keyword: searchKey, page: page, limit: limit }
  });
};

const deleteAuthor = (id) => {
  return axios(API_URL + "/author/" + id, { method: 'delete', headers: authHeader() });
};

const putAuthor = (id, firstName, lastName, national, bio, dob, picture, picChanged, picName) => {
  return axios(API_URL + "/author/" + id, { method: 'put', headers: authHeader(), data: { first_name: firstName, last_name: lastName, nationality: national, biography: bio, date_of_birth: dob, authorImage: picName, picChanged: picChanged, picture: picture } });
};

const postAuthor = (firstName, lastName, nationality, bio, dob, picture, picChanged, picName) => {
  return axios(API_URL + "/author", { method: 'post', headers: authHeader(), data: { first_name: firstName, last_name: lastName, nationality: nationality, biography: bio, date_of_birth: dob, authorImage: picName, picChanged: picChanged, picture: picture } });
};


const getAuthorById = (id) => {
  return axios.get(API_URL + "/author/" + id, { headers: authHeader() });
};

const getBooksCounts = () => {
  return axios.get(API_URL + '/counts/get-books', { headers: authHeader() });
};

export default {
  putAuthor,
  postAuthor,
  deleteAuthor,
  getAuthorsList,
  getAuthorById,
  getBooksCounts

};
