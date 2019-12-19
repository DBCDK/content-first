import React from 'react';
import T from '../../base/T';
import Kiosk from '../../base/Kiosk/Kiosk';
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

const LitteratursidenReview = ({reviews = []}) => (
  <Kiosk
    render={({kiosk}) => {
      if (!kiosk.enabled) {
        return reviews.map((rev, key) => {
          return (
            <ReviewItem
              title={T({component: 'work', name: 'litteratursiden'})}
              author={rev.creator}
              date={calculateTimeStamp(rev.date)}
              buttonText={T({component: 'work', name: 'readReview'})}
              link={rev.url}
              key={key}
            />
          );
        });
      }
      return [];
    }}
  />
);

export default LitteratursidenReview;
