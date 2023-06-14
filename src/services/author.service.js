import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_SERVER_API ;


const getAuthorsList = (searchKey) => {
  return axios.get(API_URL + "/authors?keyword="+searchKey, { headers: authHeader() });
};

const deleteAuthor = (id) => {
  return axios(API_URL + "/author/" + id, {method: 'delete', headers: authHeader()});
};

const putAuthor = (id,firstName,lastName,age, nationality, address, picture) => {
  return axios(API_URL + "/author/" + id, {method: 'put', headers: authHeader(),data: { first_name:firstName, last_name:lastName, age:age, nationality:nationality, address:address, picture:picture}});
};

const postAuthor = (firstName,lastName,age, nationality, address, picture) => {
  if (picture){
    return axios(API_URL + "/author", {method: 'post', headers: authHeader(),data: {  first_name:firstName, last_name:lastName, age:age,nationality:nationality, address:address, picture:picture}});
  }
  else {
    return axios(API_URL + "/author", {method: 'post', headers: authHeader(),data: {  first_name:firstName, last_name:lastName, age:age,nationality:nationality, address:address}});
  }
  
};

// export const getAuthorPicture = (pictureUrl) => {
//   return axios.get(API_URL + "/upload/authors/" + pictureUrl, { headers: authHeader() , responseType: 'blob'});
// }



const getAuthorById = (id) => {
  return axios.get(API_URL + "/author/" + id, { headers: authHeader() });
};

const uploadPicture = (formData) => {

  return axios.post(API_URL + "/author/upload-picture", formData, { headers: authHeader() });
};



export default {
  putAuthor,
  postAuthor,
  deleteAuthor,
  getAuthorsList,
  getAuthorById,
  uploadPicture,
  // getAuthorPicture,
  
};
