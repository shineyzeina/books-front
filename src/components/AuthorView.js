import React, {useState, useEffect} from 'react';
import { getAuthorLists } from "./AuthorsList";
import { useParams } from "react-router-dom";
import BookService from "../services/book.service";
import EventBus from "../common/EventBus";
import { Divider } from '@material-ui/core';

const AuthorView = () => {
    const [authorsList, setAuthorsList] = useState([]);
    const { authorId } = useParams();
    const [currentAuthor, setCurrentAuthor] = useState(null);
    const [books, setBooks] = useState([]);
    const [error, setError] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    
    useEffect(() => {
		searchBooks("");
	}, []);

	const triggerBookSearch = (keyword) => {
		setSearchKeyword(keyword);
		searchBooks(keyword);

	}
    const searchBooks = (keyword) => {
		BookService.getBooksList(keyword).then(
			(response) => {
				if (response) {setBooks(response.data);}
			},
			(error) => {
				const _content =
					(error.response &&
						error.response.data &&
						error.response.data.message) ||
					error.message ||
					error.toString();

				setError(_content);

				if (error.response && error.response.status === 401) {
					EventBus.dispatch("logout");

				}
			}
		);

	}
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
        }
      }
    }, [authorId, authorsList]);
  
  
    if (!currentAuthor) {
      return <div>Author not found</div>;
    }

    const firstLetter = currentAuthor.nationality.charAt(0).toLowerCase();
    let article = "a";

    if (["a", "e", "i", "o", "u"].includes(firstLetter)) {
        article = "an";
    }   
  
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <h1 style={{ paddingBottom: '60px', paddingTop: '20px' }}>{currentAuthor.first_name}  {currentAuthor.last_name}</h1>
      <h5 style={{ paddingBottom: '60px', paddingTop: '20px' }}>{currentAuthor.first_name} is {article} {currentAuthor.nationality} author aged {currentAuthor.age}</h5>
      {/* Display other author details */}
      {error ? <header className="jumbotron"> <h3>{error}</h3> </header> : null}
      {!error && books ? (
        <>
          <h3 style={{ paddingBottom: '20px' }}>Books List</h3>
          {books.map((book) => {
            if (book.author && book.author.id === currentAuthor.id) {
                console.log("Book author id in database: ", book.author.id, " current book Author id ", currentAuthor.id)
                return (<div key={book.id} style={{ paddingBottom: '15px' }}>
                            <div >Title: {book.name} </div>
                            <div >Category: {book.category} </div>
                    </div>
                );
              }
            else {
                return null;
            }
              
            
          })}
        </>
      ) : (
        <div>No record found.</div>
      )}
    </div>
      
    );
  }

export default AuthorView;