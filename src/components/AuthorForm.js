import React, { useState, useEffect, useRef } from 'react';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import ImageUploader from "react-images-upload";
import Resizer from "react-image-file-resizer";
import CheckButton from 'react-validation/build/button';
import AuthorService from '../services/author.service';
import EventBus from '../common/EventBus';
import Country from '../components/Nationality';

const API_URL = "http://localhost:4000/upload";


const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};


const AuthorForm = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [publishingHouse, setPublishingHouse] = useState('');
  const [authorAge, setAuthorAge] = useState('');
  const [authorNationality, setAuthorNationality] = useState('');
  // const [profilePicture, setProfilePicture] = useState(null); // Added state for profile picture
  // const [oldProfilePictureUrl, setProfilePictureUrl] = useState(''); // Store the profile picture URL
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const authorId = props.match.params.id;

  const [picture, setPicture] = useState("");
  const [picChanged, setPicChanged] = useState(false);
  const [defaultImage, setDefaultImage] = useState([]);

  useEffect(() => {
    async function onReady() {
      getAuthorInfo();
    }

    onReady();
  }, []);

  const savePic = (p, path) => {
    try {
        Resizer.imageFileResizer(p[0], 300, 300, "JPEG", 100, 0,
            (uri) => {
                let newUri = uri.substring(0, 16) + "name=" + p[0].name + ";" + uri.substring(16, uri.length);
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
    }
  };
  
  const removePic = () => {
    setPicture("");
    setPicChanged(false);
  };

  const getAuthorInfo = () => {
    if (authorId) {
      AuthorService.getAuthorById(authorId).then(
        (response) => {
          let a = response.data;
          setFirstName(a.first_name);
          setLastName(a.last_name);
          setPublishingHouse(a.publishing_house);
          setAuthorAge(a.author_age);
          setAuthorNationality(a.author_nationality);
          setDefaultImage(API_URL + a.profile_picture_url);
          // setProfilePictureUrl(a.profile_picture_url); // Store the profile picture URL
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
            EventBus.dispatch('logout');
          }
        }
      );
    }
    setLoading(false);
  };

  const handleSaveAuthor = async (e) => {
    e.preventDefault();

    setMessage('');
    setSuccessful(false);

    form.current.validateAll();
    setLoading(true);

    if (checkBtn.current.context._errors.length === 0) {
      let profilePictureUrl = null;
      try {
        if (picture !== "") {
          // Upload the profile picture
          const response = await AuthorService.uploadDeletePicture(picture, picChanged);
          profilePictureUrl = response.data.profilePictureUrl; 

          console.log("PROFILE PICTURE URL RN IS : " + profilePictureUrl);
        } else {
          // Delete the profile picture
          await AuthorService.uploadDeletePicture(picture, picChanged);
        }
      } catch (error) {
        console.error('Error uploading/deleting profile picture:', error);
        // Handle the error as needed (display a message, show an alert, etc.)
      
    }
   
        if (authorId) {
          await AuthorService.putAuthor(
            authorId,
            firstName,
            lastName,
            publishingHouse,
            authorAge,
            authorNationality,
            profilePictureUrl 
            
          );

          setMessage('Author Updated.');
          setSuccessful(true);
          props.history.push('/authors');
        } else {
          await AuthorService.postAuthor(
            firstName,
            lastName,
            publishingHouse,
            authorAge,
            authorNationality,
            profilePictureUrl 
          
          );
          setMessage('Author Saved.');
          setSuccessful(true);
          props.history.push('/authors');
        }
      } 
    }


  return (
    <div className="wrap-form">
      <div className="form-title authorFormBackground">
        <span className="form-title-1">Author Form</span>
      </div>
      <Form className="form validate-form" onSubmit={handleSaveAuthor} ref={form}>
        <div className="wrap-input100 validate-input m-b-18" data-validate="Name is required">
          <span className="label-input100">First Name</span>
          <Input
            type="text"
            className="input100"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            validations={[required]}
          />
          <span className="focus-input100"></span>
        </div>

        <div className="wrap-input100 validate-input m-b-18" data-validate="Password is required">
          <span className="label-input100">Last Name</span>
          <Input
            type="text"
            className="input100"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            validations={[required]}
          />
          <span className="focus-input100"></span>
        </div>

        <div className="wrap-input100 validate-input m-b-18" data-validate="Password is required">
          <span className="label-input100">Publishing House</span>
          <Input
            type="text"
            className="input100"
            name="lastName"
            value={publishingHouse}
            onChange={(e) => setPublishingHouse(e.target.value)}
            validations={[required]}
          />
          <span className="focus-input100"></span>
        </div>

        <div className="wrap-input100 validate-input m-b-18" data-validate="Password is required">
          <span className="label-input100">Author Age</span>
          <Input
            type="text"
            className="input100"
            name="lastName"
            value={authorAge}
            onChange={(e) => setAuthorAge(e.target.value)}
            validations={[required]}
          />
          <span className="focus-input100"></span>
        </div>

        <div className="wrap-input100 validate-input m-b-18" style={{ display: 'flex', alignItems: 'center' }}>
          <label className="label-input100" style={{ marginRight: '10px' }}>
            Nationality
          </label>
          <div style={{ flex: 1 }}>
            <Country value={authorNationality} onChange={(e) => setAuthorNationality(e.target.value)} validations={[required]} />
          </div>
        </div>

        {/* <div className="wrap-input100 validate-input m-b-18" data-validate="Profile picture is required">
          <span className="label-input100">Profile Picture</span>
          <input type="file" name="profilePicture" onChange={handleProfilePictureChange} />
          <span className="focus-input100"></span>
        </div> */}

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

        <div className="container-form-btn">
          <button className="form-btn" disabled={loading}>
            {loading && <span className="spinner-border spinner-border-sm"></span>}
            <span>Save</span>
          </button>
        </div>

        {message && (
          <div className="form-group">
            <div className={successful ? 'alert alert-success' : 'alert alert-danger'} role="alert">
              {message}
            </div>
          </div>
        )}

        <CheckButton style={{ display: 'none' }} ref={checkBtn} />
      </Form>
    </div>
  );
};

export default AuthorForm;
