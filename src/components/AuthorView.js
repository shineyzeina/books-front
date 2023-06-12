import React, { useState, useEffect } from 'react';
import AuthorService from "../services/author.service"
import { useParams } from "react-router-dom";
import BookService from "../services/book.service";
import EventBus from "../common/EventBus";
import { getAuthorById } from './AuthorsList';
import {getPicture} from '../services/author.service';

const AuthorView = () => {
  const { authorId } = useParams();
  const [currentAuthor, setCurrentAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [visibleBooksCount, setVisibleBooksCount] = useState(10);
  const [visibleBooksLimit, setVisibleBooksLimit] = useState(10);
  const [relativePath, setRelativePath] = useState("");
  const [picUrl, setPicUrl] = useState("");

  useEffect(() => {
    searchAuthor(authorId);
   
  }, []);

  const searchAuthor = async (author_id) => {
    setCurrentAuthor(await getAuthorById(author_id));
    

    
  }

  useEffect(() => {
    if (currentAuthor) {
      // console.log("Current Author: ", currentAuthor)
      // const fullUrl = currentAuthor.pictureUrl;
      // console.log("Full url", fullUrl)
      // const relativeUrl = fullUrl.replace("D:\\Web Development\\aspire\\books-backend", "");
      // console.log("Rel url", relativeUrl);
      console.log("Current Author image URL ", currentAuthor.pictureUrl)
      AuthorService.getPicture(currentAuthor.pictureUrl)
      .then((response) => {
        console.log("Test");
        console.log(response.data);
        const imgUrl = URL.createObjectURL(response.data);
        console.log("Here is the image url being created: ", imgUrl)
        setPicUrl(imgUrl);
      })
      .catch((error) => {
        console.error("Error in searchAuthor: ", error);
      });
      // const filePath = currentAuthor.pictureUrl;
      // const baseFolder = "D:\\Web Development\\aspire\\books-backend";
      // const relative_path = filePath.replace(baseFolder, "");
      // const test_path = "..\\..\\..\\books-backend" + relative_path
      // setRelativePath(relative_path)

      // console.log(relative_path);


      searchBooks(currentAuthor.id);
    }
  }, [currentAuthor]);

  const searchBooks = (author_id) => {
    BookService.getBooksList("", author_id).then(
      (response) => {
        if (response) {
          setBooks(response.data);
          setDisplayedBooks(response.data.slice(0, visibleBooksCount));
        }
      },
      (error) => {
        console.log("Error here")
        const errorMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setError(errorMessage);
      }
    );
  };

  const handleViewMore = () => {
    const nextBooks = books.slice(visibleBooksCount, visibleBooksCount + 10);
    setDisplayedBooks((prevBooks) => [...prevBooks, ...nextBooks]);
    setVisibleBooksCount((prevCount) => prevCount + 10);

    if (visibleBooksCount  > books.length - 10) {
      alert("Added all Books left");
    }

    const nextBooksCount = visibleBooksCount + 10;
    const nextLimit = Math.min(nextBooksCount, books.length);

    setVisibleBooksCount(nextBooksCount);
    setVisibleBooksLimit(nextLimit);
  };

  const handleViewLess = () => {
    const prevBooksCount = Math.max(visibleBooksCount - 10, 10);
    const prevLimit = Math.min(prevBooksCount, books.length);

    setVisibleBooksCount(prevBooksCount);
    setVisibleBooksLimit(prevLimit);
    setDisplayedBooks(books.slice(0, prevLimit));

    if (visibleBooksCount === 10) {
      alert("There should be a minimum of 10 books displayed");
    }
  };

  if (!currentAuthor) {
    return <div>Loading...</div>;
  }

  const firstLetter = currentAuthor.nationality.charAt(0).toLowerCase();
  const article = ["a", "e", "i", "o", "u"].includes(firstLetter) ? "an" : "a";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <h1 style={{ paddingBottom: '60px', paddingTop: '20px' }}>{currentAuthor.first_name} {currentAuthor.last_name}</h1>
      {currentAuthor.pictureUrl ? (
        <img src={picUrl} alt={`${currentAuthor.first_name} ${currentAuthor.last_name}`} style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '50%', marginBottom: '20px' }} />
      ) : (
        <div>No profile picture available</div>
      )}
      <h5 style={{ paddingBottom: '60px', paddingTop: '20px' }}>{currentAuthor.first_name} is {article} {currentAuthor.nationality} author aged {currentAuthor.age}</h5>

      {!error && books.length > 0 ? (
        <>
          <h3 style={{ paddingBottom: '40px' }}>Books List</h3>

          <button onClick={handleViewMore}>View More</button>
          <button onClick={handleViewLess}>View Less</button>

          <table style={{ width: '100%', borderSpacing: '0', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px' }}>Book ISBN</th>
                <th style={{ padding: '10px' }}>Book Title</th>
                <th style={{ padding: '10px' }}>Book Category</th>
              </tr>
            </thead>
            <tbody>
              {displayedBooks.map((book, index) => (
                <tr key={book.id} style={{ backgroundColor: index % 2 === 0 ? '#FEEBC8' : 'white' }}>
                  <td style={{ padding: '10px' }}>{book.ISBN}</td>
                  <td style={{ padding: '10px' }}>{book.name}</td>
                  <td style={{ padding: '10px' }}>{book.category}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </>
      ) : (
        <div>No record found.</div>
      )}
    </div>
  );
}

export default AuthorView;
