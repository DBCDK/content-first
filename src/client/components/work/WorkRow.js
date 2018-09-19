import React from 'react';
import Heading from '../base/Heading';
import BookCover from '../general/BookCover.component';
import Link from '../general/Link.component';
import BookmarkButton from '../general/BookmarkButton';

export default ({work, className, origin}) => {
  const book = work.book;
  return (
    <div className={'d-flex flex-row ' + className}>
      <div style={{position: 'relative'}}>
        <Link href={'/værk/' + book.pid}>
          <BookCover book={book} className="width-70 width-md-120" />
        </Link>
        <BookmarkButton
          origin={origin}
          work={work}
          layout="circle"
          style={{position: 'absolute', right: -8, top: -8}}
        />
      </div>

      <div className="ml-3">
        <Heading tag="h3" type="title">
          {book.title}
        </Heading>
        <Heading tag="h3" type="subtitle">
          {book.creator}
        </Heading>
        {book.taxonomy_description &&
          book.taxonomy_description.split('\n').map(line => (
            <div key={line} style={{fontWeight: 600}}>
              {line}.
            </div>
          ))}
      </div>
    </div>
  );
};
