import React, { useEffect, useState } from "react";
import EventBus from "../common/EventBus";
import InstitutionService from "../services/institution.service";
import AuthorService from "../services/author.service";
import BookService from "../services/book.service";
// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#FFF",
  padding: "50px",
  zIndex: 1000,
};
const InstitutionView = (props) => {
  const institutionId = props.match.params.id;
  const [institution, setInstitution] = useState(null);
  const [authorsOfInstitution, setAuthorsOfInstitution] = useState(null);
  const [srcImg, setSrcImg] = useState("");
  const [booksByAuthor, setBooksByAuthor] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const API_URL = process.env.REACT_APP_SERVER_API;

  useEffect(() => {
    async function onReady() {
      getInstitutionInfo();
    }

    onReady();
  }, []);

  const getInstitutionInfo = () => {
    if (institutionId) {
      InstitutionService.getInstitutionById(institutionId).then(
        async (response) => {
          let institutionData = response.data;
          setInstitution(institutionData);
          if (institutionData.institutionImage !== "") {
            setSrcImg(
              API_URL +
                "/uploads/institutions/" +
                institutionData.institutionImage
            );
          } else {
            setSrcImg(API_URL + "/uploads/institutions/profile.jpg");
          }

          // Fetch author objects for each author ID
          const authorPromises = institutionData.authors.map((authorId) =>
            AuthorService.getAuthorById(authorId)
          );

          // Wait for all author promises to resolve
          const authorResponses = await Promise.all(authorPromises);

          // Extract author objects from the responses
          const authors = authorResponses.map((response) => response.data);

          setAuthorsOfInstitution(authors);
        },
        (error) => {
          const _content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          if (error.response && error.response.status === 401) {
            EventBus.dispatch("logout");
          }
        }
      );
    }
  };

  const handleAuthorClick = async (author_id) => {
    BookService.getBooksList({ searchKey: "", authorId: author_id }).then(
      async (response) => {
        let b = response.data;
        setBooksByAuthor(b);
        console.log(b);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
    console.log("Author id:", author_id);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="sub-container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-2">
            {/* Add the image component here */}
            {institution && (
              <img
                src={srcImg}
                width="100px"
                height="100px"
                alt="Institution"
                className="authorImg"
              />
            )}
          </div>
          <div className="col-md-10">
            <h3>{institution && institution.name}</h3>
            <h5 className="mt-2">About the Institution:</h5>
            <p>
              Founded in{" "}
              {institution &&
                institution.dateOfCreation &&
                new Date(institution.dateOfCreation).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }
                )}
            </p>
            <p>Phone: {institution && institution.contactInfo.phoneNumber}</p>
            <p>Country: {institution && institution.address.country}</p>
          </div>

          <h3 className="text-center my-3">Authors</h3>
          <table className="table table-hover">
            <thead>
              <th>NAME</th>
              <th>Date of Birth</th>
              <th>NATIONALITY</th>
            </thead>
            <tbody>
              {authorsOfInstitution &&
                authorsOfInstitution.map((author) => (
                  <tr onClick={() => handleAuthorClick(author.id)}>
                    <td>
                      {author.first_name} {author.last_name}
                    </td>
                    <td>{author.date_of_birth}</td>
                    <td>{author.nationality}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* <Modal
            open={modalOpen}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={{ ...MODAL_STYLES }}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Text in a modal
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
            </Box>
          </Modal> */}
        </div>
      </div>
    </div>
  );
};

export default InstitutionView;
