import React from 'react';
import {timestampToShortDate} from '../../../utils/dateTimeFormat';
import './Review.css';
import Title from '../../base/Title';
import Text from '../../base/Text';
import T from '../../base/T';

/**
 * This class displays a single full review item
 */
export default class FullTextReview extends React.Component {
  formatInfomedia(htmlInput) {
    const formatMonth = month => month.toLowerCase().substr(0, 3);
    const replacer = (match, div, day, month, year, divEnd) =>
      div + day + formatMonth(month) + year + divEnd;
    return htmlInput
      .replace('Anm: ', '')
      .replace('Anm:', '')
      .replace('infomedia_logo.gif', '/infomedia_logo.gif')
      .replace('"infomedia_ByLine">,', '"infomedia_ByLine">')
      .replace(
        /(<div class="infomedia_DateLine">)(\d+\. )(\w+)( \d+)(<\/div>)/,
        replacer
      );
  }
  showFullPaperReview = rev => {
    if (rev.infomedia[0]) {
      let origtext = rev.infomedia[0].html;
      const text = this.formatInfomedia(origtext);
      return (
        <div className="Review__scroll-container">
          <div className="Review__inner-scroll">
            <div className="Review__container">
              <Text type="micro" className="mb-3">
                <T component="work" name="reviewTitle" />
              </Text>
              <div dangerouslySetInnerHTML={{__html: text}} />
            </div>
          </div>
        </div>
      );
    }
  };

  render() {
    if (this.props.review === false) {
      return '';
    }

    if (this.props.reviewType === 'paperReview') {
      return this.showFullPaperReview(this.props.review);
    }

    const review = this.props.review;
    const author = this.props.book.creator || '';
    const title = this.props.book.title || '';
    const firstname = (review.reviewer && review.reviewer.firstname) || '';
    const surname = (review.reviewer && review.reviewer.surname) || '';
    const name = (firstname + ' ' + surname).trim(); // Trim the space away in case of missing first- or surname
    const date =
      (review.creationDate && timestampToShortDate(review.creationDate)) || '';
    if (typeof review.review === 'undefined' || review.review === null) {
      return '';
    }
    const reviewKeys = Object.keys(review.review);
    return (
      <div className="Review__container">
        <div className="Review__block--top">
          <Text type="micro" className="mb-3">
            <T component="work" name="librariesReview" />
          </Text>
        </div>
        <div className="Review__SubHeadLine">{title}</div>
        <div className="Review__ByLine">{author}</div>
        <div className="Review__DateLine">{date}</div>
        <div className="Review__paper"></div>
        <div className="Review__hedline"></div>
        {reviewKeys.map(key => {
          return (
            <React.Fragment key={key}>
              <Title Tag="h6" type="title6" className="mb0">
                {key === 'review' ? 'Vurdering' : key}
              </Title>
              <Text type="body" className="mb-3">
                {review.review[key]}
              </Text>
            </React.Fragment>
          );
        })}
        {review.note ? (
          <React.Fragment>
            <Title Tag="h6" type="title6" className="mb0">
              <T component="work" name="reviewNote" />
            </Title>
            <Text type="body">{review.note}</Text>
          </React.Fragment>
        ) : (
          ''
        )}
        <Text type="body" className="mb0">
          <T component="work" name="lectorReviewOf" />
          {name !== false && name.trim() !== '' ? ' ' + name : ''}
        </Text>
      </div>
    );
  }
}
