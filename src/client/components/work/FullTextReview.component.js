import React from 'react';
import {timestampToLongDate} from '../../utils/dateTimeFormat';
import './Review.css';
import Title from '../base/Title';
import Text from '../base/Text';

/**
 * This class displays a single full review item
 */
export default class FullTextReview extends React.Component {
  render() {
    if (this.props.review === false) {
      return '';
    }
    const review = this.props.review;
    const author = this.props.book.creator || '';
    const title = this.props.book.title || '';
    const firstname = (review.reviewer && review.reviewer.firstname) || '';
    const surname = (review.reviewer && review.reviewer.surname) || '';
    const name = (firstname + ' ' + surname).trim(); // Trim the space away in case of missing first- or surname
    const date =
      (review.creationDate && timestampToLongDate(review.creationDate)) || '';
    if (typeof review.review === 'undefined' || review.review === null) {
      return '';
    }
    const reviewKeys = Object.keys(review.review);
    return (
      <div className="Review__container mr-4 mb-5">
        <div className="Review__block--top">
          <Text type="micro" className="mb3">
            Bibliotekernes vurdering af {author}: {title}
          </Text>
          <Text type="small" className="due-txt">
            {date}
          </Text>
        </div>
        {reviewKeys.map(key => {
          return (
            <React.Fragment key={key}>
              <Title Tag="h6" type="title6" className="mb0">
                {key === 'review' ? 'Vurdering' : key}
              </Title>
              <Text type="body">{review.review[key]}</Text>
            </React.Fragment>
          );
        })}
        {review.note ? (
          <React.Fragment>
            <Title Tag="h6" type="title6" className="mb0">
              Note
            </Title>
            <Text type="body">{review.note}</Text>
          </React.Fragment>
        ) : (
          ''
        )}
        <Text type="body" className="mb0">
          Lektørudtalelse
        </Text>
        {name !== false &&
          name.trim() !== '' && (
            <Text type="body" className="mb0">
              {name}
            </Text>
          )}
      </div>
    );
  }
}
