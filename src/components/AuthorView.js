import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BookService from '../services/book.service';
import AuthorService from '../services/author.service';
import profileImage from '../images/profile.png';
// import {getAuthorPicture} from '../services/author.service';

const AuthorView = () => {
  const { authorId } = useParams();
  const [currentAuthor, setCurrentAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [displayedBooks, setDisplayedBooks] = useState([]);
  const [visibleBooksCount, setVisibleBooksCount] = useState(10);
  const [visibleBooksLimit, setVisibleBooksLimit] = useState(10);
  const [article, setArticle] = useState('');
  const [pictureUrl, setPictureUrl] = useState('');

  useEffect(() => {
    console.log(process.env.REACT_APP_SERVER_API + "/upload/authors/default-profile.jpg")
    searchAuthor(authorId);
  }, []);

  const searchAuthor = async (author_id) => {
    const author = await AuthorService.getAuthorById(author_id);
    if (author) {
      console.log(author);
      setCurrentAuthor(author.data);
      // Fetch the profile pictur
      }
  };

  useEffect(() => {
    if (currentAuthor) {
      const firstLetter = currentAuthor.nationality.charAt(0).toLowerCase();
      const article = ['a', 'e', 'i', 'o', 'u'].includes(firstLetter) ? 'an' : 'a';
      let image_path = process.env.REACT_APP_SERVER_API + "/upload/authors/"
      if (currentAuthor.picture){
        image_path +=  currentAuthor.picture;
      }
      else {
        image_path +=  "default_profile.jpg";
      }
      
      setPictureUrl(image_path);
      setArticle(article);
      searchBooks(currentAuthor.id);
    }
  }, [currentAuthor]);

  const searchBooks = (authorId) => {
    console.log('Author id', authorId);
    BookService.getBooksList('', authorId).then(
      (response) => {
        if (response) {
          setBooks(response.data);
          setDisplayedBooks(response.data.slice(0, visibleBooksCount));
        }
      },
      (error) => {
        const errorMessage =
          (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        setError(errorMessage);
      }
    );
  };

  const handleViewMore = () => {
    console.log("testing pic url", pictureUrl);
    const nextBooks = books.slice(visibleBooksCount, visibleBooksCount + 10);
    setDisplayedBooks((prevBooks) => [...prevBooks, ...nextBooks]);
    setVisibleBooksCount((prevCount) => prevCount + 10);

    if (visibleBooksCount > books.length - 10) {
      alert('Added all Books left');
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
      alert('There should be a minimum of 10 books displayed');
    }
  };

  if (!currentAuthor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sub-container">

      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ paddingBottom: '60px', paddingTop: '20px' }}>
               {currentAuthor.first_name} {currentAuthor.last_name}
          </h1>
          <h5 style={{ paddingBottom: '60px', paddingTop: '20px' }}>
              {currentAuthor.first_name} is {article} {currentAuthor.nationality} author aged {currentAuthor.age}
          </h5>
        </div>
      <div style={{ flex: 1 , justifyContent: 'flex-end',  display: 'flex', alignItems: 'center'}}>
          <img src={pictureUrl} alt="Profile" style={{ width: '210px', height: '80%', objectFit: 'cover', borderRadius: '50%', margin: '5%' }} />
      </div>
    </div>

      {!error && books.length > 0 ? (
        <>
          <h3 style={{ paddingBottom: '40px' }}>Books List</h3>
          
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button onClick={handleViewMore} style={{backgroundColor: '#f44336',color: 'white',padding: '10px 20px',border: 'none',borderRadius: '4px',cursor: 'pointer',marginRight: '10px'}}>View More</button>
            <button onClick={handleViewLess} style={{backgroundColor: '#f44336',color: 'white',padding: '10px 20px',border: 'none',borderRadius: '4px',cursor: 'pointer',marginRight: '10px'}}>View Less</button>
      </div>
    </div>
  );
};

export default AuthorView;
