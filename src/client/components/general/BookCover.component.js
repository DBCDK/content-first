import React from 'react';

const BookCover = props => (
  <img
    style={props.style}
    alt={props.book.title || ''}
    className={'high-contrast ' + (props.className || '')}
    src={props.book.coverUrl || '/default-book-cover.png'}
    onLoad={props.onLoad}
  />
);

export default BookCover;
