import React, { useState, useEffect, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import EventBus from "../common/EventBus";
// import CountriesDropDown from "./CountriesDropDown";
import InstitutionService from "../services/institution.service";
import AuthorService from "../services/author.service";
import AuthCategory from "./AuthCategories";
import ImageUploader from "react-images-upload";
import Resizer from "react-image-file-resizer";

const API_URL = process.env.REACT_APP_SERVER_API;
const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const InstitutionForm = (props) => {
  const form = useRef();
  const checkBtn = useRef();
  const [name, setName] = useState("");
  const [dateOfCreation, setDateOfCreation] = useState("");
  const [contactInfo, setContactInfo] = useState({});
  const [authors, setAuthors] = useState([]);
  const [authorsIds, setAuthorsIds] = useState([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState({});
  const institutionId = props.match.params.id;
  const [defaultImage, setDefaultImage] = useState(null);
  const [picChanged, setPicChanged] = useState(false);
  const [picName, setPicName] = useState("");
  const [picture, setPicture] = useState("");

  const savePic = (p, path) => {
    try {
      console.log(p);
      Resizer.imageFileResizer(
        p[0],
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          let newUri =
            uri.substring(0, 16) +
            "name=" +
            p[0].name +
            ";" +
            uri.substring(16, uri.length);
          setPicName(p[0].name);
          setPicture(newUri);
          setDefaultImage(newUri);
          setPicChanged(true);
        },
        "base64",
        200,
        200
      );
    } catch (err) {
      console.log(err);
      setPicture("");
      setPicChanged(true);
      setPicName("");
    }
  };

  const removePic = () => {
    setPicture("");
    setPicChanged(true);
    setPicName("");
  };

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
          let a = response.data;
          setName(a.name);
          setDateOfCreation(a.dateOfCreation);
          setContactInfo(a.contactInfo);
          setAddress(a.address || {});
          setAuthorsIds(a.authors);
          setPicture(a.institutionImage);
          if (a.institutionImage) {
            // setPicture(process.env.REACT_APP_SERVER_API + "/upload/authors/" + a.picture);
            setDefaultImage(
              process.env.REACT_APP_SERVER_API +
                "/uploads/institutions/" +
                a.institutionImage
            );
          }
          const authorPromises = a.authors.map((authorId) =>
            AuthorService.getAuthorById(authorId)
          );

          // Wait for all author promises to resolve
          const authorResponses = await Promise.all(authorPromises);

          // Extract author objects from the responses
          const authors = authorResponses.map((response) => response.data);
          setAuthors(authors);
        },
        (error) => {
          const _content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          alert(_content);
          setMessage(_content);

          if (error.response && error.response.status === 401) {
            EventBus.dispatch("logout");
          }
        }
      );
    }
  };
  const handleSaveInstitution = async (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();
    setLoading(true);

    if (checkBtn.current.context._errors.length === 0) {
      try {
        if (institutionId) {
          console.log("pikachure", picture);
          InstitutionService.putInstitution(
            institutionId,
            name,
            dateOfCreation,
            contactInfo,
            address,
            authorsIds,
            picture,
            picChanged
          ).then(
            (response) => {
              console.log("Picture ", picture);
              console.log(name, " here");
              console.log(address, " here");
              setMessage("Institution Updated.");
              setSuccessful(true);
              props.history.push("/institutions");
            },
            (error) => {
              const resMessage =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();

              setMessage(resMessage);
              setSuccessful(false);
            }
          );
        } else {
          InstitutionService.postInstitution(
            name,
            dateOfCreation,
            contactInfo,
            address,
            authorsIds,
            picture
          ).then(
            (response) => {
              console.log("Picture", picture);
              setMessage("Institution Saved.");
              setSuccessful(true);
              props.history.push("/institutions");
            },
            (error) => {
              console.log("Hon ensa ");
              const resMessage =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();

              setMessage(resMessage);
              setSuccessful(false);
            }
          );
        }
      } catch (error) {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      }
    }
    setLoading(false);
  };

  const handleSaveAddress = (field, value) => {
    setAddress((prevAddress) => ({
      ...prevAddress,
      [field]: value,
    }));
  };

  const handleSaveContactInfo = (field, value) => {
    setContactInfo((prevContactInfo) => ({
      ...prevContactInfo,
      [field]: value,
    }));
  };

  const handleSelectedAuthor = (e) => {
    setSelectedAuthorId(e);
  };

  const handleAddAuthor = async (e) => {
    e.preventDefault();
    console.log("Author Ids", authorsIds);

    if (selectedAuthorId && !authorsIds.includes(selectedAuthorId)) {
      console.log("Testttttttt", selectedAuthorId);
      setAuthorsIds((prevAuthorsIds) => [...prevAuthorsIds, selectedAuthorId]);

      const authorObj = await AuthorService.getAuthorById(selectedAuthorId);
      console.log(authorObj.data);
      setAuthors((prevAuthors) => [...prevAuthors, authorObj.data]);

      console.log("Authors hereeeeeeeeeeee", authors);
      setSelectedAuthorId("");
    } else {
      alert("Select an author which doesn't already belong to the institution");
    }
  };

  const handleRemoveAuthor = (index) => {
    setAuthors((prevAuthors) => {
      const updatedAuthors = [...prevAuthors];
      updatedAuthors.splice(index, 1);
      return updatedAuthors;
    });

    setAuthorsIds((prevAuthorsIds) => {
      const updatedAuthors = [...prevAuthorsIds];
      updatedAuthors.splice(index, 1);
      return updatedAuthors;
    });
  };

  return (
    <div className="wrap-form">
      <div className="form-title authorFormBackground">
        <span className="form-title-1">Institution Form</span>
      </div>
      <Form
        action="/upload"
        method="POST"
        encType="multipart/form-data"
        className="form validate-form"
        onSubmit={handleSaveInstitution}
        ref={form}
      >
        <ImageUploader
          withIcon={false}
          withPreview={true}
          label=""
          buttonText="Upload picture"
          onChange={savePic}
          accept="image/*"
          singleImage={true}
          defaultImages={defaultImage ? [defaultImage] : ""}
          onDelete={removePic}
          buttonClassName="profileUpload"
        />
        <div
          className="wrap-input100 validate-input m-b-18"
          data-validate="Name is required"
        >
          <span className="label-input100">Name</span>
          <Input
            type="text"
            className="input100"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            validations={[required]}
          />
          <span className="focus-input100"></span>
        </div>

        <div
          className="wrap-input100 validate-input m-b-18"
          data-validate="Date of Creation is required"
        >
          <span className="label-input100">Date of creation</span>
          <Input
            type="date"
            className="input100"
            name="date of creation"
            value={dateOfCreation}
            onChange={(e) => setDateOfCreation(e.target.value)}
            validations={[required]}
          />
          <span className="focus-input100"></span>
        </div>

        <div style={{ padding: "30px" }}>
          <h4>Contact Info</h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridColumnGap: "100px",
            }}
          >
            <div
              className="wrap-input100 validate-input m-b-18"
              data-validate="Password is required"
            >
              <span className="label-input100">Email</span>
              <Input
                type="text"
                className="input100"
                name="Email"
                value={contactInfo.email}
                onChange={(e) => handleSaveContactInfo("email", e.target.value)}
                validations={[required]}
              />
              <span className="focus-input100"></span>
            </div>

            <div
              className="wrap-input100 validate-input m-b-18"
              data-validate="Password is required"
            >
              <span className="label-input100">Phone number</span>
              <Input
                type="text"
                className="input100"
                name="phone number"
                value={contactInfo.phoneNumber}
                onChange={(e) =>
                  handleSaveContactInfo("phoneNumber", e.target.value)
                }
                validations={[required]}
              />
              <span className="focus-input100"></span>
            </div>

            <div
              className="wrap-input100 validate-input m-b-18"
              data-validate="Password is required"
            >
              <span className="label-input100">Website</span>
              <Input
                type="text"
                className="input100"
                name="website"
                value={contactInfo.website}
                onChange={(e) =>
                  handleSaveContactInfo("website", e.target.value)
                }
                validations={[required]}
              />
              <span className="focus-input100"></span>
            </div>
          </div>
        </div>

        <div style={{ padding: "30px" }}>
          <h4>Address</h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridColumnGap: "100px",
            }}
          >
            <div
              className="wrap-input100 validate-input m-b-18"
              data-validate="Password is required"
            >
              <span className="label-input100">Country</span>
              <Input
                type="text"
                className="input100"
                name="age"
                value={address.country}
                onChange={(e) => handleSaveAddress("country", e.target.value)}
                validations={[required]}
              />
              <span className="focus-input100"></span>
            </div>

            <div
              className="wrap-input100 validate-input m-b-18"
              data-validate="Password is required"
            >
              <span className="label-input100">City</span>
              <Input
                type="text"
                className="input100"
                name="age"
                value={address.city}
                onChange={(e) => handleSaveAddress("city", e.target.value)}
                validations={[required]}
              />
              <span className="focus-input100"></span>
            </div>

            <div
              className="wrap-input100 validate-input m-b-18"
              data-validate="Password is required"
            >
              <span className="label-input100">Street</span>
              <Input
                type="text"
                className="input100"
                name="age"
                value={address.street}
                onChange={(e) => handleSaveAddress("street", e.target.value)}
                validations={[required]}
              />
              <span className="focus-input100"></span>
            </div>

            <div
              className="wrap-input100 validate-input m-b-18"
              data-validate="Password is required"
            >
              <span className="label-input100">Building</span>
              <Input
                type="text"
                className="input100"
                name="age"
                value={address.building}
                onChange={(e) => handleSaveAddress("building", e.target.value)}
                validations={[required]}
              />
              <span className="focus-input100"></span>
            </div>
          </div>
        </div>

        <div style={{ padding: "30px" }}>
          <h4>Authors</h4>
          <div style={{ display: "flex" }}>
            <div style={{ flex: "1 1 auto" }}>
              <AuthCategory
                category={selectedAuthorId}
                setCategory={(e) => handleSelectedAuthor(e.target.value)}
              />
            </div>
            <div style={{ flex: "0 0 100px", marginLeft: "10px" }}>
              <button
                className="button100"
                onClick={handleAddAuthor}
                disabled={!selectedAuthorId}
                type="button"
              >
                Add
              </button>
            </div>
          </div>
          <div style={{ marginTop: "10px" }}>
            <p style={{ marginTop: "30px" }}>{name} 's authors:</p>
            {authors.map((author, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <span style={{ marginRight: "5px" }}>
                  {author.first_name} {author.last_name}
                </span>
                <button
                  className="button100"
                  style={{ color: "gray", marginRight: "30px" }}
                  onClick={() => handleRemoveAuthor(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Author button
        {/* <div className="wrap-input100 validate-input m-b-18">
          <button
            className="form-btn"
            type="button"
            onClick={() => handleAddAuthor("Selected Author")}
          >
            Add Author
          </button>
        </div> */}

        <div className="container-form-btn">
          <button className="form-btn" disabled={loading}>
            {loading && (
              <span className="spinner-border spinner-border-sm"></span>
            )}
            <span>Save</span>
          </button>
        </div>

        {message && (
          <div className="form-group">
            <div
              className={
                successful ? "alert alert-success" : "alert alert-danger"
              }
              role="alert"
            >
              {message}
            </div>
          </div>
        )}
        <CheckButton style={{ display: "none" }} ref={checkBtn} />
      </Form>
    </div>
  );
};

export default InstitutionForm;
