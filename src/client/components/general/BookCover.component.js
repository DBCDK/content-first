import React from 'react';
import {connect} from 'react-redux';
import Paragraph from '../base/Paragraph';

const BookCover = props => {
  const hasNoCover = !props.book.coverUrl;
  if (!props.book.coverUrl) {
    return (
      <div
        style={{
          ...props.style,
          display: 'inline-block',
          textAlign: 'center'
        }}
        alt={props.book.title || ''}
        className={props.className || ''}
      >
        {hasNoCover && <Paragraph>{props.book.title}</Paragraph>}
        {hasNoCover && <Paragraph>{props.book.creator}</Paragraph>}
      </div>
    );
  }
  return (
    <img
      style={props.style}
      alt={props.book.title || ''}
      className={props.className || ''}
      src={props.book.coverUrl}
      onLoad={props.book.onLoad}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const {book, coverHasLoaded} =
    state.booksReducer.books[ownProps.book.pid] || {};
  return {
    coverUrl: book && book.coverUrl,
    coverUrlHasLoaded: coverHasLoaded
  };
};

export default connect(mapStateToProps)(BookCover);
