import React from 'react';
import BookCover from '../general/BookCover.component';

export default props => {
  return (
    <div className="work-item-small clearfix">
      <div className="col-xs-3">
        <div className="cover-image-wrapper">
          <BookCover book={props.work.book} />
        </div>
      </div>
      <div className="col-xs-9 info">
        <div className="title">{props.work.book.title}</div>
        <div className="creator">{props.work.book.creator}</div>
      </div>
    </div>
  );
};
