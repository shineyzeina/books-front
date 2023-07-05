import React from 'react';
import BooksGenres from './BooksGenres';
import AuthorPublishings from './AuthorPublishings';
import BooksRatings from './BooksRatings';
import './BooksAnalytics.css';

const BooksAnalytics = () => {
  return (
    <div className="analytics-container">
      <div className="analytics-item">
        <h3 className="analytics-label">Books Genres</h3>
        <BooksGenres />
      </div>
      <div className="analytics-item">
        <h3 className="analytics-label">Author Publishings</h3>
        <AuthorPublishings />
      </div>
      <div className="analytics-item">
        <h3 className="analytics-label">Books Ratings</h3>
        <BooksRatings />
      </div>
    </div>
  );
};

export default BooksAnalytics;
