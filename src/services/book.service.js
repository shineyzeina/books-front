import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_SERVER_API ;


const getBooksList = (searchKey) => {
  return axios.get(API_URL + "/books?keyword="+ searchKey, { headers: authHeader() });
};

const deleteBook = (id) => {
  return axios(API_URL + "/book/" + id, {method: 'delete', headers: authHeader()});
};

const putBook = (_id, ISBN, name, author, category) => {
  return axios(API_URL + "/book/" + _id, {method: 'put', headers: authHeader(),data: {ISBN, name, author,category}});
};

const favoriteBook = (_id,action) =>{
  return axios(API_URL + "/book/favorite/" + _id, {method: 'put', headers: authHeader(),data: {action}});
}
const postBook = (ISBN, name, author, category) => {
  return axios(API_URL + "/book", {method: 'post', headers: authHeader(),data: {ISBN, name, author, category}});
};



const getBookById = (id) => {
  return axios.get(API_URL + "/books/" + id, { headers: authHeader() });
};
const uploadPic = (file) => {
	const data = new FormData();
    data.append('file', file);
	return 	axios(API_URL +  '/upload/books', {method: 'post', headers: authHeader(),data});
     
	
}
const loadPic  = (pic) => {
  return (API_URL  +"/images/books/" + pic);
};

const loadPdfUrl  = (name) => {
  return (API_URL  +"/pdf/" + name + ".pdf");
};

export default {
  putBook,
  postBook,
  deleteBook,
  getBooksList,
  getBookById,
  uploadPic,
  loadPic,
  favoriteBook,
  loadPdfUrl
};
