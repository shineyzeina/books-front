import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_SERVER_API ;


const getBooksList = (searchKey) => {
  return axios.get(API_URL + "/books?searchKey="+searchKey, { headers: authHeader() });
};

const deleteBook = (id) => {
  return axios(API_URL + "/books/" + id, {method: 'delete', headers: authHeader()});
};

const putBook = (id,firstName,lastName, address, phone,phone2,email, description, pic, medicalHistory, medication,payments) => {
  return axios(API_URL + "/books/" + id, {method: 'put', headers: authHeader(),data: { completeName:firstName +" " + lastName, firstName:firstName,lastName:lastName, address:address, phone:phone, phone2:phone2,email:email, description:description, pic:pic, medicalHistory:medicalHistory, medication:medication, payments:payments}});
};

const postBook = (firstName,lastName, address, phone,phone2,email, description, pic, medicalHistory, medication,payments) => {
  return axios(API_URL + "/books", {method: 'post', headers: authHeader(),data: {completeName:firstName +" " + lastName, firstName:firstName,lastName:lastName, address:address, phone:phone, phone2:phone2,email:email, description:description, pic:pic, medicalHistory:medicalHistory, medication:medication, payments:payments}});
};

const createPDF = (id) => {
  return axios(API_URL + "/books/pdf/" + id, {method: 'post', headers: authHeader()});
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
  createPDF,
  loadPdfUrl
};
