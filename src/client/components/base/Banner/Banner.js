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
    <div className="banner__wrap" style={bannerStyles} data-cy="banner-title">
      <div className={`banner ${className}`}>
        <div className="banner__children">{children}</div>
        <div className="banner__title--wrap">
          <Title
            className="banner__title"
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
