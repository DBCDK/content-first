import React from 'react';
import {connect} from 'react-redux';
import Paragraph from '../base/Paragraph';

const BookCover = props => {
  const hasNoCover = !props.coverUrl;

  if (!props.coverUrl) {
    return (
      <div
        style={{
          ...props.style,
          display: 'inline-block',
          textAlign: 'center',
          backgroundColor: '#f8f8f8',
          verticalAlign: 'middle'
        }}
        alt={props.title || ''}
        className={props.className || ''}
      >
        {hasNoCover &&
          !props.hideCoverText && <Paragraph>{props.title}</Paragraph>}
        {hasNoCover &&
          !props.hideCoverText && <Paragraph>{props.creator}</Paragraph>}
      </div>
    );
  }
  return (
    <img
      style={props.style}
      alt={props.title || ''}
      className={props.className || ''}
      src={props.coverUrl}
      onLoad={props.onLoad}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const {book, coverHasLoaded} =
    state.booksReducer.books[ownProps.book.pid] || {};
  return {
    coverUrl: book && book.coverUrl,
    coverUrlHasLoaded: coverHasLoaded,
    title: book && book.title
  };
};

export default connect(mapStateToProps)(BookCover);
