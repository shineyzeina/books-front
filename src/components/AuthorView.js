import React, { useEffect, useState } from 'react';
import EventBus from '../common/EventBus';
import AuthService from "../services/author.service.js";
import BookService from "../services/book.service";
import modifiedBook from '../labels/en/Categories';



const AuthorView = (props) => {
  const authorId = props.match.params.id
  const [author, setAuthor] = useState(null)
  const [booksByAuthor, setBooksByAuthor] = useState(null)
  const [authorName, setAuthorName] = useState('')
  const [imageSource, setImageSource] = useState(null)
  const [authorImage, setAuthorImage] = useState('')
  const [srcImg, setSrcImg] = useState('')
  const API_URL = process.env.REACT_APP_SERVER_API ;


  useEffect(() => {
    async function onReady() {
      getAuthorInfo();
    }

    onReady();
  }, [])



  const getAuthorInfo = () => {
    if (authorId) {
      AuthService.getAuthorById(authorId).then(

        async (response) => {
          let a = response.data;
          setAuthor(a)
          if(a.authorImage != "")
            setSrcImg(API_URL + '/uploads/' + a.authorImage)
          else 
            setSrcImg(API_URL + '/uploads/DefaultAuthor.png')
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
      if (author) {


      }
      BookService.getBooksList({ authorId: authorId }).then(
        async (response) => {
          let b = response.data.books;
          setBooksByAuthor(b);
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
      )
    }
  }


  return (
    <div className="sub-container">
      <div className="jumbotron">

        <div className="row">
          <div className="col-md-2">
            {/* Add the image component here */}
            {author && <img src={srcImg} width="100px" height="100px" alt="Author" className="authorImg" />}
          </div>
          <div className="col-md-10">
            <h3>{author && author.first_name + " " + author.last_name}</h3>
            <h5 className="mt-2">About the Author:</h5>
            <p>Born in {author && author.date_of_birth && new Date(author.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
            <p>Nationality: {author && author.nationality}</p>
            <p>Bio: {author && author.biography}</p>
          </div>

          <h3 className="text-center my-3">Books</h3>
          <table className="table table-hover">
            <thead>
              <th>ISBN</th>
              <th>NAME</th>
              <th>Category</th>
            </thead>
            <tbody>
              {booksByAuthor &&
                booksByAuthor.map((book) => (
                  <tr>
                    <td>{book.ISBN}</td>
                    <td>{book.name}</td>
                    <td>{modifiedBook[book.category]}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  )
}

export default AuthorView;