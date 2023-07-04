import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_SERVER_API;

const getInstitutionsList = (searchKey) => {
  return axios.get(API_URL + "/institutions?keyword=" + searchKey, {
    headers: authHeader(),
  });
};

const getInstitutionsCount = (data) => {
  return axios.get(API_URL + "/institutions/count?keyword=" + data.searchKey, {
    headers: authHeader(),
  });
};

// const getAuthorsList = (institutionId) => {
//   return axios.get(API_URL + "/institutions?institutionId=" + institutionId, {
//     headers: authHeader(),
//   });
// };

const deleteInstitution = (id) => {
  return axios(API_URL + "/institution/" + id, {
    method: "delete",
    headers: authHeader(),
  });
};

const putInstitution = (
  id,
  name,
  dateOfCreation,
  contactInfo,
  address,
  authors,
  institutionImage,
  picChanged
) => {
  return axios(API_URL + "/institution/" + id, {
    method: "put",
    headers: authHeader(),
    data: {
      name: name,
      dateOfCreation: dateOfCreation,
      contactInfo: contactInfo,
      address: address,
      authors: authors,
      institutionImage: institutionImage,
      picChanged: picChanged,
    },
  });
};

const postInstitution = (
  name,
  dateOfCreation,
  contactInfo,
  address,
  authors,
  institutionImage
) => {
  return axios(API_URL + "/institution", {
    method: "post",
    headers: authHeader(),
    data: {
      name: name,
      dateOfCreation: dateOfCreation,
      contactInfo: contactInfo,
      address: address,
      authors: authors,
      institutionImage: institutionImage,
    },
  });
};

const getSomeInstitutions = (data) => {
  return axios.get(API_URL + "/institutions/partial", {
    headers: authHeader(),
    params: data,
  });
};

// const getSomeInstitutions = (searchKey) => {
//   return axios.get(API_URL + "/institutions/partial", {
//     headers: authHeader(),
//     params: { searchKey: searchKey },
//   });
// };

const getInstitutionById = (id) => {
  return axios.get(API_URL + "/institution/" + id, { headers: authHeader() });
};

export default {
  putInstitution,
  postInstitution,
  getInstitutionsList,
  getSomeInstitutions,
  getInstitutionById,
  deleteInstitution,
  getInstitutionsCount,
  // getAuthorsList,
};
