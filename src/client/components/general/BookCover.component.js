import React from 'react';
import {connect} from 'react-redux';
import Paragraph from '../base/Paragraph';

const BookCover = props => {
  const hasNoCover = !props.coverUrl && props.coverUrlHasLoaded;
  console.log(props);
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
        className={'book-cover ' + props.className || ''}
      >
        {hasNoCover &&
          !props.hideCoverText && <Paragraph>{props.title}</Paragraph>}
        {hasNoCover &&
          !props.hideCoverText && <Paragraph>{props.creator}</Paragraph>}
      </div>
    );
  }
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
      className={
        'd-inline-flex align-items-end book-cover ' + props.className || ''
      }
    >
      <img
        style={props.style}
        alt={props.title || ''}
        src={props.coverUrl}
        onLoad={props.onLoad}
      />
    </div>
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
