import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_SERVER_API;


const getAuthorsList = (searchKey) => {
  return axios.get(API_URL + "/authors?keyword="+searchKey, { headers: authHeader() });
};

const deleteAuthor = (id) => {
  return axios(API_URL + "/author/" + id, {method: 'delete', headers: authHeader()});
};

const putAuthor = (id,firstName,lastName, publishingHouse, authorAge, authorNationality, profilePictureUrl) => {
  return axios(API_URL + "/author/" + id, {method: 'put', headers: authHeader(),data: { first_name:firstName, last_name:lastName, publishing_house : publishingHouse, author_age:authorAge, author_nationality:authorNationality, profile_picture_url : profilePictureUrl}});
};

const postAuthor = (firstName, lastName , publishingHouse, authorAge, authorNationality, profilePictureUrl) => {
  return axios(API_URL + "/author", {method: 'post', headers: authHeader(),data: {  first_name:firstName, last_name:lastName, publishing_house : publishingHouse, author_age:authorAge, author_nationality:authorNationality, profile_picture_url : profilePictureUrl}});
};



export const getAuthorById = (id) => {
  return axios.get(API_URL + "/author/" + id, { headers: authHeader() });
};


export const uploadDeletePicture = (profilePictureUri, pictureFlag) => {
  if (pictureFlag) {
    return axios.post(API_URL + "/author/upload-profile-picture", { profilePictureUri, pictureFlag }, { headers: authHeader() });
  } else {
    return axios.delete(API_URL + "/author/delete-profile-picture", { data: { profilePictureUri, pictureFlag }, headers: authHeader() });
  }
};


export const getAuthorProfilePicture = (profilePictureUrl) => {
  return axios.get(API_URL + '/upload/'+ profilePictureUrl, { headers: authHeader(), responseType: 'blob' });
};





export default {
  putAuthor,
  postAuthor,
  deleteAuthor,
  getAuthorsList,
  getAuthorById,
  uploadDeletePicture,
  getAuthorProfilePicture
  
  
};
