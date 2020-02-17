import React from 'react';
import T from '../../base/T';
import {useSelector} from 'react-redux';
import {get} from 'lodash';
import './Review.css';
import ReviewItem from './ReviewItem.component';

/**
 * This component displays Litteratursiden review items
 */

const calculateTimeStamp = date =>
  !date
    ? null
    : new Date(
        date.split('-')[0],
        parseInt(date.split('-')[1], 10) - 1,
        date.split('-')[2]
      );

const LitteratursidenReview = ({review}) => {
  const isKiosk = useSelector(state => get(state, 'kiosk.enabled', false));
  if (isKiosk || !review) {
    return null;
  }
  return (
    <ReviewItem
      title={T({component: 'work', name: 'litteratursiden'})}
      author={review.creator}
      date={calculateTimeStamp(review.date)}
      buttonText={T({component: 'work', name: 'readReview'})}
      link={review.url}
    />
  );
};

export default LitteratursidenReview;
