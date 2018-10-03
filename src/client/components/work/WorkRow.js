import React from 'react';
import Title from '../base/Title';
import Text from '../base/Text';
import BookCover from '../general/BookCover.component';
import Link from '../general/Link.component';
import BookmarkButton from '../general/BookmarkButton';
import AddToListButton from '../general/AddToListButton.component';
import TaxDescription from './TaxDescription.component.js';

const Details = ({book, showDetails}) => {
  if (!showDetails) {
    return null;
  }
  return (
    <div className="d-flex">
      <Text type="micro" className="mr-3">
        Sideantal: {book.pages}
      </Text>
      <Text type="micro" className="mr-3">
        Sprog: {book.language}
      </Text>
      <Text type="micro" className="mr-3">
        Udgivet: {book.first_edition_year}
      </Text>
    </div>
  );
};

export default ({
  work,
  className,
  origin,
  showTaxDescription = false,
  showAddToListButton = false,
  showDetails = false
}) => {
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
        <Title Tag="h3" type="title5" className="mb0">
          {book.title}
        </Title>
        <Text type="body">{book.creator}</Text>
        {showTaxDescription && (
          <Text type="body" variant="weight-semibold">
            <TaxDescription text={book.taxonomy_description} />
          </Text>
        )}
        <Details book={book} showDetails={showDetails} />
        {showAddToListButton && <AddToListButton work={work} />}
      </div>
    </div>
  );
};
