import React from 'react';
import {timestampToShortDate} from '../../../utils/dateTimeFormat';
import './Review.css';
import Title from '../../base/Title';
import Text from '../../base/Text';
import TruncateMarkup from 'react-truncate-markup';
import Button from '../../base/Button';
import ReviewRating from './ReviewRating.component';
import T from '../../base/T';

/**
 * This class displays a single resume review item
 */
const ReviewItem = ({
  title,
  date,
  author,
  reviewParagraph,
  onClick,
  link,
  buttonText,
  error,
  rating,
  maxRating,
  ratingType,
  ...props
}) => {
  const buttonProps = {
    type: 'link',
    size: 'medium',
    className: 'Review__block--link'
  };
  if (onClick) {
    buttonProps.onClick = onClick;
  }
  if (link) {
    buttonProps.href = link;
  }
  const formattedDate =
    typeof date === 'string' ? date : timestampToShortDate(date);
  return (
    <div className="Review__container" {...props}>
      <div className="Review__block--top">
        <div className="Review__block--title mb-0 d-flex">
          {title && (
            <Title Tag="h6" type="title6" className="Review__block--title">
              {title}
            </Title>
          )}
          {rating && (
            <ReviewRating
              maxRating={maxRating}
              rating={rating}
              type={ratingType}
            />
          )}
        </div>
        {date && (
          <Text type="small" className="due-txt">
            {formattedDate}
          </Text>
        )}
      </div>
      {author && author.trim() !== '' && (
        <Text type="body" className="Review__block--lector">
          <T component="work" name="ofAuthor" />
          &nbsp;
          {author}
        </Text>
      )}
      {reviewParagraph && (
        <Text type="body" className="Review__block--paragraph">
          <TruncateMarkup lines={3} ellipsis="...">
            <span>{reviewParagraph}</span>
          </TruncateMarkup>
        </Text>
      )}
      {(buttonText || error) && (
        <Text>
          {error && <span>{error}</span>}
          {!error && (
            <Button {...buttonProps}>
              <span>{buttonText}</span>
              {link && <i className="material-icons">launch</i>}
            </Button>
          )}
        </Text>
      )}
    </div>
  );
};

export default ReviewItem;
