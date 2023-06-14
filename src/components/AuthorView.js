import React, { useState, useEffect } from 'react';
import { getAuthorLists } from "./AuthorsList";
import { useParams } from "react-router-dom";
import BookService from "../services/book.service";
import { getAuthorProfilePicture } from "../services/author.service";
import EventBus from "../common/EventBus";
import './AuthorView.css';

const AuthorView = () => {
  const [authorsList, setAuthorsList] = useState([]);
  const { authorId } = useParams();
  const [currentAuthor, setCurrentAuthor] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [visibleBooksCount, setVisibleBooksCount] = useState(3);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    searchBooks("");
  }, []);

  

  const searchBooks = (keyword) => {
    BookService.getBooksList(keyword)
      .then((response) => {
        if (response) {
          setBooks(response.data);
        }
      })
      .catch((error) => {
        const errorMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setError(errorMessage);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      });
  };

  useEffect(() => {
    async function fetchData() {
      const authors = await getAuthorLists();
      setAuthorsList(authors);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (authorId && authorsList.length > 0) {
      const author = authorsList.find((author) => author.id === authorId);
      if (author) {
        setCurrentAuthor(author);
        // Fetch the profile picture
      getAuthorProfilePicture(author.profile_picture_url)
      .then((response) => {
        const imgUrl = URL.createObjectURL(response.data);
        setProfilePictureUrl(imgUrl);
      })
      .catch((error) => {
        // Handle error
      });
      }
    }
  }, [authorId, authorsList]);

  if (!currentAuthor) {
    return <div>Author not found</div>;
  }

  

  return (
    <div className="author-view-container">
      <div className="author-info-container">
          <div className="author-details">
            <h1 className="author-name">
              {currentAuthor.first_name} {currentAuthor.last_name}
            </h1>
            <h4 className="publishing-house">
              Publishing House: {currentAuthor.publishing_house}
            </h4>
          </div>
          <div className="profile-picture-container">
            {profilePictureUrl ? (
              <img src={profilePictureUrl} alt="Profile Picture" className="profile-picture" />
            ) : (
              <div className="empty-profile-picture"></div>
            )}
            <a href={"/author/edit/" + authorId} className="edit-button">
              <button>Edit</button>
            </a>
          </div>
      </div>

      <div className="books-list-container">
        <h4 className="books-list-heading">Books List</h4>
        {error ? (
          <header className="jumbotron">
            <h3>{error}</h3>
          </header>
        ) : !error && books ? (
          <div>
            {books.map((book, index) => {
              if (book.author && book.author.id === currentAuthor.id) {
                if (index < visibleBooksCount) {
                  return (
                    <div key={book.id} className="book-card">
                      <h4 className="book-title">{book.name}</h4>
                      <p className="book-category">Category: {book.category}</p>
                    </div>
                  );
                } else {
                  return null;
                }
              } else {
                return null;
              }
            })}
            {books.length > visibleBooksCount && (
              <div className="view-more-button">
                <button onClick={() => setVisibleBooksCount(visibleBooksCount + 3)}>
                  View More
                </button>
                {visibleBooksCount > 3 && (
                  <button onClick={() => setVisibleBooksCount(3)}>View Less</button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>No record found.</div>
        )}
      </div>
    </div>

  );
  
};

export default AuthorView;
