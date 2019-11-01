import React from 'react';
import Text from '../../base/Text';
import T from '../../base/T';
import BookCover from '../../general/BookCover/BookCover.component';
import TaxDescription from '../../work/TaxDescription.component.js';
import './PrintLayout.css';
import withWork from '../../hoc/Work/withWork.hoc';

export class PrintElement extends React.Component {
  render() {
    const {work} = this.props;
    if (!work || !work.book) {
      return null;
    }
    const book = work.book;
    return (
      <div className="print-element-container">
        <div className="printelement-bookcover-container">
          <BookCover pid={book.pid} />
        </div>
        <div className="print-element-book-info">
          <Text variant="weight-semibold" type="large">
            {book.title}
          </Text>

          <Text type="body">{book.creator}</Text>

          <Text className="mt-3" variant="weight-semibold" type="body">
            <TaxDescription text={book.taxonomy_description} />
          </Text>
          <Text className="mt-3" type="body">
            {book.description}
          </Text>

          <Text className="mt-3" type="body">
            <T component="work" name="pages" />
            {' ' + book.pages}
          </Text>

          <Text type="body">
            <T component="work" name="released" />
            {' ' + book.first_edition_year}
          </Text>
        </div>
      </div>
    );
  }
}

export default withWork(PrintElement);
