import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_SERVER_API ;


const getInstitutionsList = (searchKey) => {
  return axios.get(API_URL + "/institutions?keyword="+searchKey, {headers: authHeader() });
};

const deleteInstitution = (id) => {
  return axios(API_URL + "/institution/" + id, {method: 'delete', headers: authHeader()});
};

const putInstitution = (id, name, dateOfCreation, contactInfo, address) => {
  return axios(API_URL + "/institution/" + id, {method: 'put', headers: authHeader(),data: { name:name, dateOfCreation:dateOfCreation, contactInfo:contactInfo, address:address}});
};

const postInstitution = (name, dateOfCreation, contactInfo, address) => {
  return axios(API_URL + "/institution", {method: 'post', headers: authHeader(),data: {  name:name, dateOfCreation:dateOfCreation, contactInfo:contactInfo, address:address}});
};



const getInstitutionById = (id) => {
  return axios.get(API_URL + "/institution/" + id, { headers: authHeader() });
};




export default {
 putInstitution,
 postInstitution,
 getInstitutionsList,
 getInstitutionById,
 deleteInstitution
};
