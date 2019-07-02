import React from 'react';
import Title from '../Title';
import './Banner.css';

const Banner = ({
  className = null,
  title = 'Give your banner a title',
  color = '#00414b',
  textColor = 'white',
  styles = null,
  children = null
}) => {
  const bannerStyles = {
    ...styles,
    backgroundColor: color.includes('#') ? color : `#${color}`
  };

  return (
    <div className="Banner__wrap" style={bannerStyles} data-cy="banner-title">
      <div className={`Banner ${className}`}>
        <div className="align-self-start">{children}</div>
        <div className="Banner__title align-self-stretch d-flex">
          <Title
            className="align-self-center"
            type="title3"
            variant={`color-${textColor}`}
            data-cy="banner-title"
          >
            {title}
          </Title>
        </div>
      </div>
    </div>
  );
};

export default Banner;
