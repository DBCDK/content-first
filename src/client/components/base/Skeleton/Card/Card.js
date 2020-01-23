import React from 'react';
import Text from '../Text';
import BookCover from '../../../general/BookCover/BookCover.component';

import './Card.css';
import '../skeleton.css';

const SkeletonCard = ({className = '', cardRef = null}) => {
  const isSmallScreen = window.innerWidth < 768;
  return (
    <div
      ref={cardRef}
      className={`card skeleton ${className}`}
      data-hj-ignore-attributes
    >
      <BookCover />
      <Text className="card__status" lines={1} />
      {!isSmallScreen && <Text className="card__text" />}
      <div className="whiteLine" />
    </div>
  );
};

export default SkeletonCard;
