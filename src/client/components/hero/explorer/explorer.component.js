import React from 'react';

import T from '../../base/T';
import Title from '../../base/Title';
import Icon from '../../base/Icon';
import scroll from '../../../utils/scroll';

import './explorer.css';

const Explorer = ({scrollDistanceOnClick}) => {
  return (
    <div className="info-callToAction-wrap text-center">
      <div
        className="info-callToAction d-inline-block"
        onClick={() => {
          if (scrollDistanceOnClick) {
            scroll(0, scrollDistanceOnClick);
          }
        }}
      >
        <Title type="title5" variant="color-white">
          <T component="hero" name="exploreText" renderAsHtml={true} />
        </Title>
        <Icon className="md-xlarge" name="expand_more" />
      </div>
    </div>
  );
};

export default Explorer;
