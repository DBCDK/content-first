import React from 'react';
import {connect} from 'react-redux';

const BookCover = props => (
  <img
    style={props.style}
    alt={props.book.title || ''}
    className={props.className || ''}
    src={props.coverUrl || '/default-book-cover.png'}
    onLoad={props.onLoad}
  />
);

const mapStateToProps = (state, ownProps) => {
  const {book} = state.booksReducer.books[ownProps.book.pid] || {};
  return {coverUrl: book && book.coverUrl};
};

export default connect(mapStateToProps)(BookCover);
